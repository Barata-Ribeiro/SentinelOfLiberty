"use server"

import { ProblemDetails }   from "@/@types/application"
import ResponseError        from "@/actions/application/response-error"
import { deleteArticleUrl } from "@/utils/routes"
import { auth }             from "auth"
import { revalidateTag }    from "next/cache"

interface DeleteOwnArticle {
    id: number
}

export default async function deleteOwnArticle({ id }: DeleteOwnArticle) {
    const session = await auth()
    try {
        const URL = deleteArticleUrl(id)
        
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
        
        revalidateTag("articles")
        revalidateTag("categories")
        revalidateTag("dashboard")
        revalidateTag("profile")
        
        return {
            ok: response.status === 204,
            error: null,
            response: "You have successfully deleted the article",
        }
    } catch (error) {
        return ResponseError(error)
    }
}