import {Elysia, status} from "elysia";
import {KeyModel} from "./model";
import {prisma} from "../../config";
import {jwtPlugin} from "../../plugins/jwt";
import {encryption} from "../../services";

const generateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    const bytes = crypto.getRandomValues(new Uint8Array(48))
    for (const byte of bytes) result += chars[byte % chars.length]
    return result
}

const generateAddress = () => crypto.randomUUID().replace(/-/g, "").slice(0, 16)

export const key = new Elysia({prefix: "/key", detail: {tags: ["API Key"]}})
    .use(jwtPlugin)
    .model({APIKey: KeyModel.apiKeyResponse})
    .post("/create", async ({jwt, cookie: {auth}}) => {
        const token = auth.value
        if (!token) return status(401, {message: "Not authorized", code: "UNAUTHORIZED"})

        const payload = await jwt.verify(token as string)
        if (!payload || typeof payload.username !== "string") return status(401, {
            message: "Not authorized",
            code: "UNAUTHORIZED"
        })

        const user = await prisma.user.findUnique({where: {username: payload.username}})
        if (!user) return status(401, {message: "Not authorized", code: "UNAUTHORIZED"})

        const plainKey = generateKey()
        const keyHash = await encryption.encrypt(plainKey)
        const address = generateAddress()

        const apiKey = await prisma.apiKey.create({
            data: {
                keyHash,
                address,
                balance: 0,
                userId: user.id,
            }
        })

        return {id: apiKey.id, key: plainKey, address: apiKey.address, balance: apiKey.balance}
    }, {
        response: KeyModel.createResponse,
        detail: {summary: "Create API key", description: "Creates a new API key for the authenticated user."},
    })
    .get("/:id", async ({jwt, cookie: {auth}, params}) => {
        const token = auth.value
        if (!token) return status(401, {message: "Not authorized", code: "UNAUTHORIZED"})

        const payload = await jwt.verify(token as string)
        if (!payload || typeof payload.username !== "string") return status(401, {
            message: "Not authorized",
            code: "UNAUTHORIZED"
        })

        const user = await prisma.user.findUnique({where: {username: payload.username}})
        if (!user) return status(401, {message: "Not authorized", code: "UNAUTHORIZED"})

        const apiKey = await prisma.apiKey.findUnique({where: {id: params.id}})
        if (!apiKey) return status(404, {message: "API key not found", code: "NOT_FOUND"})

        if (apiKey.userId !== user.id) return status(401, {message: "Not authorized", code: "UNAUTHORIZED"})

        return {id: apiKey.id, address: apiKey.address, balance: apiKey.balance, userId: apiKey.userId}
    }, {
        params: KeyModel.getByIdParams,
        response: KeyModel.getByIdResponse,
        detail: {summary: "Get API key by ID", description: "Returns API key info by its ID."},
    })