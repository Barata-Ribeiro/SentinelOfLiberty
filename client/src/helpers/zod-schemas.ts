import { JSDOM } from "jsdom"
import { z }     from "zod"

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
    })
    .transform(data => {
        if (data.username === "") delete data.username
        if (data.displayName === "") delete data.displayName
        if (data.email === "") delete data.email
        if (data.biography === "") delete data.biography
        if (data.newPassword === "") delete data.newPassword
        if (data.confirmNewPassword) delete data.confirmNewPassword
        
        return data
    })

const userAccountDetailsSchema = z
    .object({
                firstName: z.string().trim().nullish().or(z.literal("")),
                lastName: z.string().trim().nullish().or(z.literal("")),
                birthDate: z
                    .preprocess(
                        val => {
                            if (typeof val === "string" && val.trim() !== "") return new Date(val)
                            return undefined
                        },
                        
                        z.date({ required_error: "Birth date is required." }).refine(
                            date => {
                                const today = new Date()
                                let age = today.getFullYear() - date.getFullYear()
                                const monthDiff = today.getMonth() - date.getMonth()
                                
                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age--
                                
                                return age >= 18
                            },
                            { message: "User must be over 18 years old." },
                        ),
                    )
                    .nullish()
                    .or(z.literal("")),
                location: z.string().trim().nullish().or(z.literal("")),
                website: z
                    .string()
                    .url("Invalid URL format.")
                    .regex(/^(https?):\/\/[^\s/$.?#].\S*$/, "Url must be a valid URL.")
                    .nullish()
                    .or(z.literal("")),
                socialMedia: z.string().url().nullish().or(z.literal("")),
                videoChannel: z.string().trim().nullish().or(z.literal("")),
                streamingChannel: z.string().trim().nullish().or(z.literal("")),
                isPrivate: z.string().optional().transform(Boolean),
                currentPassword: z.string({ message: "Current password is required" }),
                fullName: z.string().optional(),
            })
    .transform((data, ctx) => {
        if (data.firstName || data.lastName) {
            const fullName = [ data.firstName, data.lastName ].filter(Boolean).join(" ").trim()
            
            if (!/^[a-zA-Z ]*$/.test(fullName)) {
                ctx.addIssue({
                                 code: "custom",
                                 message: "Invalid name format.",
                             })
                
                return z.NEVER
            }
            
            data.fullName = fullName
        }
        
        delete data.firstName
        delete data.lastName
        
        if (data.birthDate === "") delete data.birthDate
        if (data.location === "") delete data.location
        if (data.website === "") delete data.website
        if (data.socialMedia === "") delete data.socialMedia
        if (data.videoChannel === "") delete data.videoChannel
        if (data.streamingChannel === "") delete data.streamingChannel
        return data
    })

const adminAccountUpdateSchema = z
    .object({
                currentUsername: z.string({ message: "Current username is required" }).trim().optional(),
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
                firstName: z.string().trim().nullish().or(z.literal("")),
                lastName: z.string().trim().nullish().or(z.literal("")),
                birthDate: z
                    .preprocess(
                        val => {
                            if (typeof val === "string" && val.trim() !== "") return new Date(val)
                            return undefined
                        },
                        
                        z.date({ required_error: "Birth date is required." }).refine(
                            date => {
                                const today = new Date()
                                let age = today.getFullYear() - date.getFullYear()
                                const monthDiff = today.getMonth() - date.getMonth()
                                
                                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) age--
                                
                                return age >= 18
                            },
                            { message: "User must be over 18 years old." },
                        ),
                    )
                    .nullish()
                    .or(z.literal("")),
                location: z.string().trim().nullish().or(z.literal("")),
                website: z
                    .string()
                    .url("Invalid URL format.")
                    .regex(/^(https?):\/\/[^\s/$.?#].\S*$/, "Url must be a valid URL.")
                    .nullish()
                    .or(z.literal("")),
                socialMedia: z.string().url().nullish().or(z.literal("")),
                videoChannel: z.string().trim().nullish().or(z.literal("")),
                streamingChannel: z.string().trim().nullish().or(z.literal("")),
                isPrivate: z.string().optional().transform(Boolean),
                fullName: z.string().optional(),
                currentPassword: z.string({ message: "Current password is required" }),
            })
    .transform((data, ctx) => {
        if (data.username === "") delete data.username
        if (data.username === data.currentUsername) {
            ctx.addIssue({
                             code: "custom",
                             message: "Username must be different from current username.",
                         })
            
            return z.NEVER
        }
        
        if (data.displayName === "") delete data.displayName
        if (data.email === "") delete data.email
        if (data.biography === "") delete data.biography
        if (data.firstName || data.lastName) {
            const fullName = [ data.firstName, data.lastName ].filter(Boolean).join(" ").trim()
            
            if (!/^[a-zA-Z ]*$/.test(fullName)) {
                ctx.addIssue({
                                 code: "custom",
                                 message: "Invalid name format.",
                             })
                
                return z.NEVER
            }
            
            data.fullName = fullName
        }
        
        delete data.firstName
        delete data.lastName
        delete data.currentUsername
        
        if (data.birthDate === "") delete data.birthDate
        if (data.location === "") delete data.location
        if (data.website === "") delete data.website
        if (data.socialMedia === "") delete data.socialMedia
        if (data.videoChannel === "") delete data.videoChannel
        if (data.streamingChannel === "") delete data.streamingChannel
        
        return data
    })

// NOTICES
const noticeRequestSchema = z
    .object({
                id: z.coerce.number().int().optional(),
                title: z
                    .string()
                    .min(3, "Title must be at least 3 characters.")
                    .max(100, "Title must be at most 100 characters.")
                    .trim()
                    .nullish()
                    .or(z.literal("")),
                message: z
                    .string()
                    .min(10, "Message must be at least 10 characters.")
                    .max(100, "Message must be at most 100 characters.")
                    .trim(),
            })
    .transform(data => {
        if (data.title === "") delete data.title
        if (data.id === 0 || data.id === undefined || data.id === null) delete data.id
        return data
    })

// SUGGESTIONS
const suggestionRequestSchema = z.object({
                                             title: z
                                                 .string()
                                                 .min(3, "Title must be between 3 and 100 characters.")
                                                 .max(100, "Title must be between 3 and 100 characters."),
                                             sourceUrl: z
                                                 .string()
                                                 .url("Invalid URL format.")
                                                 .regex(/^(https?):\/\/[^\s/$.?#].\S*$/, "Url must be a valid URL."),
                                             content: z
                                                 .string()
                                                 .min(10, "Content must be at least 10 characters.")
                                                 .max(500, "Content must be at most 500 characters."),
                                             mediaUrl: z
                                                 .string()
                                                 .url("Invalid URL format.")
                                                 .regex(/^(https?):\/\/[^\s/$.?#].\S*$/, "Url must be a valid URL."),
                                         })

// ARTICLES
const articleRequestSchema = z.object({
                                          suggestionId: z.coerce.number().int().optional(),
                                          title: z
                                              .string()
                                              .min(3, "Title must be between 3 and 100 characters.")
                                              .max(100, "Title must be between 3 and 100 characters."),
                                          subTitle: z
                                              .string()
                                              .min(3, "Subtitle must be between 3 and 100 characters.")
                                              .max(100, "Subtitle must be between 3 and 100 characters."),
                                          summary: z
                                              .string()
                                              .min(50, "Summary must be at least 100 characters.")
                                              .max(250, "Summary must be at most 250 characters."),
                                          content: z.string().transform((data, ctx) => {
                                              const parsedDom = new JSDOM(data)
                                              if (!parsedDom?.window.document.body.textContent) {
                                                  ctx.addIssue({
                                                                   code: z.ZodIssueCode.custom,
                                                                   message: "Invalid content format.",
                                                               })
                                                  
                                                  return z.NEVER
                                              }
                                              
                                              if (parsedDom?.window.document.body.textContent.length < 100) {
                                                  ctx.addIssue({
                                                                   code: z.ZodIssueCode.too_small,
                                                                   message: "Content must be at least 100 characters.",
                                                                   minimum: 100,
                                                                   inclusive: true,
                                                                   type: "string",
                                                               })
                                                  
                                                  return z.NEVER
                                              }
                                              
                                              return data
                                          }),
                                          mediaUrl: z
                                              .string()
                                              .url("Invalid URL format.")
                                              .regex(/^(https?):\/\/[^\s/$.?#].\S*$/, "Invalid URL format."),
                                          references: z
                                              .string()
                                              .transform(val =>
                                                             val
                                                                 .split(",")
                                                                 .map(ref => ref.trim())
                                                                 .filter(ref => ref.length > 0),
                                              )
                                              .refine(refs => refs.length > 0,
                                                      "At least one reference must be provided.")
                                              .refine(
                                                  refs => refs.every(ref => /^(https?):\/\/[^\s/$.?#].\S*$/.test(ref)),
                                                  "Invalid URL format in references.",
                                              ),
                                          categories: z
                                              .string()
                                              .transform(val =>
                                                             val
                                                                 .split(",")
                                                                 .map(cat => cat.trim())
                                                                 .filter(cat => cat.length > 0)
                                                                 .map(cat => cat.toLowerCase()),
                                              )
                                              .refine(cats => cats.length > 0,
                                                      "At least one category must be provided."),
                                      })

// COMMENTS
const commentSchema = z
    .object({
                articleId: z.coerce.number().int(),
                parentId: z.coerce.number().nullish().or(z.literal(0)),
                body: z
                    .string()
                    .min(5, "Comment must be at least 5 characters.")
                    .max(400, "Comment must be at most 400 characters."),
            })
    .transform(data => {
        if (data.parentId === 0) delete data.parentId
        return data
    })

export {
    authLoginSchema,
    authRegisterSchema,
    userProfileUpdateSchema,
    userAccountDetailsSchema,
    adminAccountUpdateSchema,
    noticeRequestSchema,
    suggestionRequestSchema,
    articleRequestSchema,
    commentSchema,
}
