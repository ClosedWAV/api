import {Elysia} from "elysia";
import {UserPlainInputCreate, UserPlain} from "./models";
import {prisma} from "../config";
import {APIError} from "../models";

export const user = new Elysia({prefix: "/user", detail: {tags: ["User"]}})
    .post("/create", async ({body}) => prisma.user.create({
        data: {
            username: body.username,
            passwordHash: await Bun.password.hash(body.password)
        }
    }), {
        body: UserPlainInputCreate,
        detail: {
            summary: "Create user",
            description: "Creates a new user."
        },
        response: {
            200: UserPlain,
            400: APIError
        }
    })
    .post("/login", () => "")