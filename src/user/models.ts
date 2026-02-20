import {t} from "elysia";

export const UserPlainInputCreate = t.Object({
    username: t.String({minLength: 5, maxLength: 32}),
    password: t.String({minLength: 8, maxLength: 128}),
})

export const UserPlain = t.Object({
    id: t.String({description: "User ID in UUID format"}),
    username: t.String(),
    createdAt: t.Date({description: "Created At"}),
})