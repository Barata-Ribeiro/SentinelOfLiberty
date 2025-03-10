"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import ResponseError                           from "@/actions/application/response-error"
import { getPopularPublicArticlesUrl }         from "@/utils/routes"

export default async function getPopularPublicArticles(): Promise<State> {
    try {
        const URL = getPopularPublicArticlesUrl()
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: [ "articles" ] },
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
