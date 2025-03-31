"use server"

import { ProblemDetails, RestResponse }   from "@/@types/application"
import ResponseError                      from "@/actions/application/response-error"
import { adminToggleUserVerificationUrl } from "@/utils/routes"
import { auth }                           from "auth"
import { revalidateTag }                  from "next/cache"

interface PatchToggleUserVerification {
    username: string
}

export default async function patchToggleUserVerification({ username }: PatchToggleUserVerification) {
    const session = await auth()
    
    try {
        const URL = adminToggleUserVerificationUrl(username)
        
        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ session?.accessToken }`,
            },
            body: JSON.stringify({}),
        })
        
        const json = await response.json()
        
        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }
        
        revalidateTag("profile")
        revalidateTag("user-settings")
        revalidateTag("dashboard")
        
        return {
            ok: true,
            error: null,
            response: json as RestResponse,
        }
    } catch (error) {
        return ResponseError(error)
    }
}
