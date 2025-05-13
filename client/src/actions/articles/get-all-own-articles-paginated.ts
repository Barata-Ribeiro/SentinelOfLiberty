"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { auth } from "@/auth"
import { getAllOwnArticlesUrl } from "@/utils/routes"

interface GetAllOwnArticlesPaginated {
    page: number
    perPage: number
    direction: string
    orderBy: string
    search: string
}

export default async function getAllOwnArticlesPaginated({
    page,
    perPage,
    direction,
    orderBy,
    search,
}: GetAllOwnArticlesPaginated) {
    const session = await auth()

    try {
        const URL = getAllOwnArticlesUrl(search, page, perPage, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
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
