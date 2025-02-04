"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { getAllNotificationsUrl } from "@/utils/routes"
import { auth } from "auth"

interface GetAllNotificationsPaginated {
    page: number
    perPage: number
    direction: string
    orderBy: string
}

export default async function getAllNotificationsPaginated({
    page,
    perPage,
    direction,
    orderBy,
}: GetAllNotificationsPaginated) {
    const session = await auth()

    try {
        const URL = getAllNotificationsUrl(page, perPage, direction, orderBy)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
            next: { revalidate: 30, tags: ["notification"] },
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
