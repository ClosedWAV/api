import {Elysia, t, status} from "elysia";
import openapi, {fromTypes} from "@elysiajs/openapi";
import {user} from "./user";

const app = new Elysia()
    .use(openapi({
        provider: "scalar",
        path: "/docs",
        references: fromTypes("src/index.ts"),
        documentation: {
            info: {
                title: "HotAPI",
                description: "Hot Dodster API",
                version: "1.0.0"
            }
        }
    }))
    .get("/", () => "Hello!", { response: t.Const("Hello!")})
    .get("/secret", () => status(418, "Im teapot"))
    .use(user)
    .listen(9000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
