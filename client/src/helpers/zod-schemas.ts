import { z } from "zod"

// AUTH
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

// USER
const userProfileUpdateSchema = z
    .object({
                username: z
                    .string({ message: "Username is required" })
                    .trim()
                    .min(3, "Username must be at least 3 characters")
                    .max(50, "Username must be at most 50 characters")
                    .regex(/^[a-z]*$/, "Username must contain only lowercase letters")
                    .nullish()
                    .or(z.literal("")),
                displayName: z
                    .string({ message: "Display Name is required" })
                    .trim()
                    .min(3, "Display Name must be at least 3" + " characters")
                    .max(50, "Display Name must be at most 50 characters")
                    .regex(/^[a-zA-Z\s]*$/, "Display Name must contain only letters and spaces")
                    .nullish()
                    .or(z.literal("")),
                email: z.string({ message: "Email is required" }).trim().email().nullish().or(z.literal("")),
                biography: z.string().max(160, "Biography must be at most 160 characters").nullish().or(z.literal("")),
                currentPassword: z.string({ message: "Current password is required" }),
                newPassword: z
                    .string()
                    .min(8, "Password must be at least 8 characters")
                    .max(100, "Password must be at most 100 characters")
                    .regex(
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
                        "Password must contain at least one digit, one lowercase letter, " +
                            "one uppercase letter, one special character and no whitespace.",
                    )
                    .nullish()
                    .or(z.literal("")),
                confirmNewPassword: z.string().optional().or(z.literal("")),
            })
    .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
        if (newPassword && newPassword !== confirmNewPassword) {
            ctx.addIssue({
                             code: "custom",
                             message: "Passwords do not match",
                             path: [ "confirmNewPassword" ],
                         })
        }
    }).transform(data => {
        if (data.username === "") delete data.username
        if (data.displayName === "") delete data.displayName
        if (data.email === "") delete data.email
        if (data.biography === "") delete data.biography
        if (data.newPassword === "") delete data.newPassword
        if (data.confirmNewPassword) delete data.confirmNewPassword
        
        return data
    })

export { authLoginSchema, authRegisterSchema, userProfileUpdateSchema }
