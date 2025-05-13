"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { getAllOwnNoticesUrl } from "@/utils/routes"
import { auth } from "auth"

interface GetAllOwnIssuedNoticesPaginated {
    search?: string
    page: number
    perPage: number
    direction: string
    orderBy: string
}

export default async function getAllOwnIssuedNoticesPaginated({
    search,
    page,
    perPage,
    direction,
    orderBy,
}: GetAllOwnIssuedNoticesPaginated) {
    const session = await auth()

    try {
        const URL = getAllOwnNoticesUrl(search, page, perPage, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
            next: { revalidate: 30, tags: ["notices", "notice"] },
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
