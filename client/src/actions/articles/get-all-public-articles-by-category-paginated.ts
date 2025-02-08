"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { getAllArticlesByCategoryUrl }  from "@/utils/routes"

interface GetAllPublicArticlesByCategoryPaginated {
    category: string
    page: number
    perPage: number
    direction: string
    orderBy: string
}

export default async function getAllPublicArticlesByCategoryPaginated({
                                                                          category,
                                                                          page,
                                                                          perPage,
                                                                          direction,
                                                                          orderBy,
                                                                      }: GetAllPublicArticlesByCategoryPaginated) {
    try {
        const URL = getAllArticlesByCategoryUrl(category, page, perPage, direction, orderBy)
        
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: [ "articles", "categories" ] },
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
