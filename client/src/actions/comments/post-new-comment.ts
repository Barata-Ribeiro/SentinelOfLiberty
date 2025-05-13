"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { commentSchema } from "@/helpers/zod-schemas"
import { problemDetailsFactory } from "@/utils/functions"
import { createCommentUrl } from "@/utils/routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

export default async function postNewComment(state: State, formData: unknown) {
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

    const session = await auth()

    try {
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = commentSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

        const URL = createCommentUrl(parsedFormData.data.articleId)

        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(parsedFormData.data),
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        revalidateTag("articles")
        revalidateTag("comments")

        return {
            ok: true,
            error: null,
            response: json as RestResponse,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
