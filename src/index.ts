import {Elysia, status} from "elysia";
import openapi, {fromTypes} from "@elysiajs/openapi";
import {user} from "./api/user";
import {key} from "./api/key";
import {env, prisma} from "./config";
import {APIError, StatsResponse} from "./models";

const app = new Elysia()
    .use(openapi({
        provider: "scalar",
        path: "/docs",
        references: fromTypes("src/index.ts"),
        documentation: {
            info: {
                title: "ClosedAPI",
                description: "ClosedWAV API",
                version: "1.0.0"
            }
        }
    }))
    .onError(({code, error}) => {
        console.error(code, error);
        if (code === "VALIDATION") return status(400, {
            message: error.message,
            code: "VALIDATION_ERROR"
        });
    })
    .get("/stats", async () =>
            ({
                uptime: process.uptime(),
                users: await prisma.user.count(),
                apiKeys: await prisma.apiKey.count()
            }),
        {
            response: {200: StatsResponse},
            detail: {
                summary: "Server stats",
                description: "Returns server uptime and entity counts"
            }
        }
    )
    .use(user)
    .use(key)
    .model({APIError: APIError})
    .listen(env.PORT)


console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
