"use server"

import "server-only"
import { RestResponse, State } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { signIn } from "@/auth"
import { authLoginSchema } from "@/helpers/zod-schemas"
import { problemDetailsFactory } from "@/utils/functions"

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

        return {
            ok: true,
            error: null,
            response: {
                status: "Ok",
                code: 200,
                message: "You have successfully logged in",
                data: formData.get("username"),
            } satisfies RestResponse,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
