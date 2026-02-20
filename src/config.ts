import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import {z} from "zod";

export const env = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string()
}).parse(process.env)

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });