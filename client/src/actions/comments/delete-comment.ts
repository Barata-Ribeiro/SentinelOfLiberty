"use server"

import { ProblemDetails }   from "@/@types/application"
import ResponseError        from "@/actions/application/response-error"
import { deleteCommentUrl } from "@/utils/routes"
import { auth }             from "auth"

interface DeleteComment {
    articleId: number
    commentId: number
}

export default async function deleteComment({ articleId, commentId }: DeleteComment) {
    const session = await auth()
    try {
        const URL = deleteCommentUrl(articleId, commentId)
        
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ session?.accessToken }`,
            },
        })
        
        if (!response.ok) {
            const json = await response.json()
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }
        
        return {
            ok: response.status === 204,
            error: null,
            response: "You have successfully deleted the comment",
        }
    } catch (error) {
        return ResponseError(error)
    }
}