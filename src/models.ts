import {t} from "elysia";

export const APIError = t.Object({message: t.String({description: "Full error message"}), code: t.String({description: "Short description for applications"})})