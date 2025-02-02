"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { getAllSuggestionsUrl }         from "@/utils/routes"

interface GetAllSuggestionsPaginated {
    page: number
    perPage: number
    direction: string
    orderBy: string
}

export default async function getAllSuggestionsPaginated({
                                                             page,
                                                             perPage,
                                                             direction,
                                                             orderBy,
                                                         }: GetAllSuggestionsPaginated) {
    
    try {
        const URL = getAllSuggestionsUrl(page, perPage, direction, orderBy)
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60, tags: [ "suggestions" ] },
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