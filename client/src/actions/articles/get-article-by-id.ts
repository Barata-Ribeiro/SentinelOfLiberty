"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { getArticleUrl }                from "@/utils/routes"

interface GetArticleById {
    id: number
}

export default async function getArticleById({ id }: GetArticleById) {
    try {
        const URL = getArticleUrl(id)
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: [ "articles", "article" ] },
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