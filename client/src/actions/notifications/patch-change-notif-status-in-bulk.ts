"use server"

import { ProblemDetails, RestResponse }      from "@/@types/application"
import ResponseError                         from "@/actions/application/response-error"
import { changeNotificationStatusInBulkUrl } from "@/utils/routes"
import { auth }                              from "auth"

interface PatchChangeNotifStatusInBulk {
    idList: number[]
    status: boolean
}

export default async function patchChangeNotifStatusInBulk({ idList, status }: PatchChangeNotifStatusInBulk) {
    const session = await auth()
    
    try {
        const URL = changeNotificationStatusInBulkUrl(status)
        
        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ session?.accessToken }`,
            },
            body: JSON.stringify({ notificationsId: idList }),
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