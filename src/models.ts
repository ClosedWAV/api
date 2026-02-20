import {t} from "elysia";

export const APIError = t.Object({message: t.String({description: "Full error message"}), code: t.String({description: "Short description for applications"})})

export const StatsResponse = t.Object({
    uptime: t.Number({description: "Server uptime in seconds"}),
    users: t.Number({description: "Total registered users"}),
    apiKeys: t.Number({description: "Total API keys"}),
})