"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { getArticleCommentsTreeUrl }    from "@/utils/routes"

interface GetCommentTree {
    articleId: number
}

export default async function getCommentTree({ articleId }: GetCommentTree) {
    try {
        const URL = getArticleCommentsTreeUrl(articleId)
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60, tags: [ "articles", "comments" ] },
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
