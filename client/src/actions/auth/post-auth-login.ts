"use server"

import "server-only"
import { State }                 from "@/@types/application"
import ResponseError             from "@/actions/application/response-error"
import { signIn }                from "@/auth"
import { authLoginSchema }       from "@/helpers/zod-schemas"
import { problemDetailsFactory } from "@/utils/functions"
import { permanentRedirect }     from "next/navigation"

export default async function postAuthLogin(state: State, formData: unknown) {
    if (!(formData instanceof FormData)) {
        return ResponseError(
            problemDetailsFactory({
                                      type: "https://httpstatuses.com/400",
                                      title: "Invalid Form Data",
                                      status: 400,
                                      detail: "Invalid form data was submitted. Please try again.",
                                      instance: "/auth/login",
                                  }),
        )
    }
    
    try {
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = authLoginSchema.safeParse(rawFormData)
        
        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }
        
        await signIn("credentials", {
            username: parsedFormData.data.username,
            password: parsedFormData.data.password,
            rememberMe: parsedFormData.data.rememberMe,
            redirect: false,
        })
    } catch (error) {
        console.log("CALLBACK ERROR: ", error)
        return ResponseError(error)
    }
    
    permanentRedirect(`/dashboard/${ formData.get("username")?.toString() }`)
}
