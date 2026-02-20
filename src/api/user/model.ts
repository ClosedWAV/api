import {t} from "elysia";
import {APIError} from "../../models";

export const UserModel = {
    registerBody: t.Object({
        username: t.String({minLength: 5, maxLength: 32}),
        password: t.String({minLength: 8, maxLength: 128}),
    }),
    userResponse: t.Object({
        id: t.String({description: "User ID in UUID format"}),
        username: t.String(),
        createdAt: t.Date({description: "Created At"}),
    }),
    loginBody: t.Object({
        username: t.String({minLength: 5, maxLength: 32}),
        password: t.String({minLength: 8, maxLength: 128}),
    }),
    registerResponse: {
        200: t.Object({
            id: t.String({description: "User ID in UUID format"}),
            username: t.String(),
            createdAt: t.Date({description: "Created At"}),
        }),
        400: APIError,
    },
    loginResponse: {
        200: t.Object({
            id: t.String({description: "User ID in UUID format"}),
            username: t.String(),
            createdAt: t.Date({description: "Created At"}),
        }),
        401: APIError,
        404: APIError,
        400: APIError,
    },
}