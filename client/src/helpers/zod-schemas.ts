import { z } from "zod"

const authLoginSchema = z.object({
                                     username: z.string({ message: "Username is required" }).trim().min(3,
                                                                                                        "Username must be at least 3 characters"),
                                     password: z.string({ message: "Password is required" }).min(8,
                                                                                                 "Password must be at least 8 characters"),
                                     rememberMe: z.preprocess(val => val === "on", z.boolean().optional()),
                                 })

const authRegisterSchema = z
    .object({
                username: z
                    .string()
                    .trim()
                    .min(3, "Username must be at least 3 characters")
                    .max(50, "Username must be at most 50 characters")
                    .regex(/^[a-z]+$/, "Username must contain only lowercase letters"),
                email: z.string().trim().email(),
                displayName: z
                    .string()
                    .trim()
                    .min(3, "Display name must be at least 3 characters")
                    .max(50, "Display name must be at most 50 characters")
                    .regex(/^[a-zA-Z\s]+$/, "Display name must contain only letters and spaces"),
                password: z
                    .string()
                    .trim()
                    .min(8, "Password must be at least 8 characters")
                    .max(100, "Password must be at most 100 characters")
                    .regex(
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%¨^&*()\-_=+])(?=\S+$).{8,}$/,
                        "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character and no whitespace.",
                    ),
                confirmPassword: z.string({ message: "Password confirmation is required" }).trim(),
            })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                             code: "custom",
                             message: "Passwords do not match",
                             path: [ "confirmPassword" ],
                         })
        }
    })

export { authLoginSchema, authRegisterSchema }
