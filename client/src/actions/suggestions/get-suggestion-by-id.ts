"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { getSuggestionByIdUrl } from "@/utils/routes"

interface GetSuggestionById {
    id: number
}

export default async function getSuggestionById({ id }: GetSuggestionById) {
    try {
        const URL = getSuggestionByIdUrl(id)

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: ["suggestions", "suggestion"] },
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
