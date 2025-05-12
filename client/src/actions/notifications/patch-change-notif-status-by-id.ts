"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { changeNotificationStatusUrl } from "@/utils/routes"
import { auth } from "auth"
import { revalidateTag } from "next/cache"

interface PatchChangeNotifStatusById {
    id: number
    status: boolean
}

export default async function patchChangeNotifStatusById({ id, status }: PatchChangeNotifStatusById) {
    const session = await auth()

    try {
        const URL = changeNotificationStatusUrl(id, status)

        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken}`,
            },
        })

        const json = await response.json()

        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }

        revalidateTag("notifications")

        return {
            ok: true,
            error: null,
            response: json as RestResponse,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
