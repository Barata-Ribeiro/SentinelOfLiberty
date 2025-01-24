"use server"


import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { getLatestNoticeUrl }           from "@/utils/routes"

export default async function getLatestNotices() {
    try {
        const URL = getLatestNoticeUrl()
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: [ "notices" ] },
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
