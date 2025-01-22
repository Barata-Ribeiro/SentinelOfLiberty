"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import ResponseError from "@/actions/application/response-error"
import { getLatestSuggestionsUrl } from "@/utils/routes"

export default async function getLatestPublicSuggestions(): Promise<State> {
    try {
        const URL = getLatestSuggestionsUrl()

        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 120, tags: ["suggestions"] },
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
