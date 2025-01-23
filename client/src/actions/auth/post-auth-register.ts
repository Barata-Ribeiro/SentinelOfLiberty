"use server"

import { ProblemDetails, State } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { authRegisterSchema } from "@/helpers/zod-schemas"
import { problemDetailsFactory } from "@/utils/functions"
import { registerAuthUrl } from "@/utils/routes"
import { redirect } from "next/navigation"

export default async function postAuthRegister(state: State, formData: unknown) {
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
        const URL = registerAuthUrl()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = authRegisterSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }
    } catch (error) {
        return ResponseError(error)
    }

    redirect("/auth/login")
}
