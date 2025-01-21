import { z } from "zod"

const authLoginSchema = z.object({
    username: z.string({ message: "Username is required" }).trim().min(3, "Username cannot be empty"),
    password: z.string({ message: "Password is required" }).min(8, "Password cannot be empty"),
    rememberMe: z.preprocess(val => val === "on", z.boolean().optional()),
})

export { authLoginSchema }
