"use server"


import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { getLatestNotificationUrl }     from "@/utils/routes"
import { auth }                         from "auth"

export default async function getLatestNotifications() {
    const session = await auth()
    
    try {
        const URL = getLatestNotificationUrl()
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ session?.accessToken }`,
            },
            next: { revalidate: 30, tags: [ "notification" ] },
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