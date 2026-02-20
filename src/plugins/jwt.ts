import {jwt} from "@elysiajs/jwt";
import {env} from "../config";

export const jwtPlugin = jwt({name: "jwt", secret: env.JWT_SECRET});
