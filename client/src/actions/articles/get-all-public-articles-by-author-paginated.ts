"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { getAllArticlesByAuthorUsernameUrl } from "@/utils/routes"

interface GetAllPublicArticlesByAuthorPaginated {
    username: string
    page: number
    perPage: number
    direction: string
    orderBy: string
}

export default async function getAllPublicArticlesByAuthorPaginated({
    username,
    page,
    perPage,
    direction,
    orderBy,
}: GetAllPublicArticlesByAuthorPaginated) {
    try {
        const URL = getAllArticlesByAuthorUsernameUrl(username, page, perPage, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: ["articles"] },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        return {
            ok: true,
            error: null,
            response: json as RestResponse,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
