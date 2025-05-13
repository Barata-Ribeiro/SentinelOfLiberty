"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { Article } from "@/@types/articles"
import ResponseError from "@/actions/application/response-error"
import { articleRequestSchema } from "@/helpers/zod-schemas"
import { problemDetailsFactory } from "@/utils/functions"
import { createArticleUrl } from "@/utils/routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

export default async function postNewArticle(state: State, formData: unknown) {
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

    let articleResponse: Article

    try {
        const URL = createArticleUrl()

        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = articleRequestSchema.safeParse(rawFormData)

        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }

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

        articleResponse = (json as RestResponse).data as Article

        revalidateTag("articles")
        revalidateTag("categories")
        revalidateTag("dashboard")
        revalidateTag("profile")
    } catch (error) {
        return ResponseError(error)
    }

    redirect(`/articles/${articleResponse.id}/${articleResponse.slug}`)
}
