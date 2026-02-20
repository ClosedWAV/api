import {Elysia, status} from "elysia";
import {UserModel} from './model'
import {prisma} from "../../config";
import {encryption} from "../../services";
import {createJwt} from "../../utills";
import {jwtPlugin} from "../../plugins/jwt";


export const user = new Elysia({prefix: "/user", detail: {tags: ["User"]}})
    .use(jwtPlugin)
    .model({User: UserModel.userResponse})
    .post("/register", async ({body, jwt, cookie: {auth}}) => {
            const user = await prisma.user.create({
                data: {
                    username: body.username,
                    passwordHash: await encryption.encrypt(body.password)
                }
            })
            await createJwt(user.username, jwt.sign, auth)
            return user
        }, {
            body: UserModel.registerBody,
            response: UserModel.registerResponse,
            detail: {summary: "Create user", description: "Creates a new user."},
        }
    )
    .post("/login", async ({jwt, body, cookie: {auth}}) => {
        const user = await prisma.user.findUnique({where: {username: body.username}})
        if (!user || !user.id || !user.createdAt || !user.username) return status(404, {
            message: "User not found",
            code: "NOT_FOUND"
        });
        if (!await encryption.verify(body.password, user.passwordHash)) return status(401, {
            message: "Password is wrong",
            code: "WRONG_PASSWORD"
        });

        await createJwt(user.username, jwt.sign, auth)
        return {username: user.username, id: user.id, createdAt: user.createdAt}
    }, {
        body: UserModel.loginBody,
        response: UserModel.loginResponse,
        detail: {summary: "Login user", description: "Login user"}
    })
