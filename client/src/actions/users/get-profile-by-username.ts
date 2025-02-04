"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { getUserProfileUrl }            from "@/utils/routes"

interface GetProfileByUsername {
    username: string
}

export default async function getProfileByUsername({ username }: GetProfileByUsername) {
    try {
        const URL = getUserProfileUrl(username)
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: [ "profile" ] },
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