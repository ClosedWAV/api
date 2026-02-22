import {t} from "elysia";
import {APIError} from "../../models";

export const KeyModel = {
    apiKeyResponse: t.Object({
        id: t.String({description: "API key ID in UUID format"}),
        address: t.String({description: "Key address"}),
        balance: t.Number({description: "Key balance"}),
        userId: t.String({description: "Owner user ID"}),
    }),
    createResponse: {
        200: t.Object({
            id: t.String({description: "API key ID in UUID format"}),
            key: t.String({description: "Plain API key (shown only once)"}),
            address: t.String({description: "Key address"}),
            balance: t.Number({description: "Key balance"}),
        }),
        401: APIError,
    },
    getByIdParams: t.Object({
        id: t.String({description: "API key ID"}),
    }),
    getByIdResponse: {
        200: t.Object({
            id: t.String({description: "API key ID in UUID format"}),
            address: t.String({description: "Key address"}),
            balance: t.Number({description: "Key balance"}),
            userId: t.String({description: "Owner user ID"}),
        }),
        401: APIError,
        404: APIError,
    },
}