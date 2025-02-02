"use server"

import { ProblemDetails, State }   from "@/@types/application"
import ResponseError               from "@/actions/application/response-error"
import { suggestionRequestSchema } from "@/helpers/zod-schemas"
import { problemDetailsFactory }   from "@/utils/functions"
import { createSuggestionUrl }     from "@/utils/routes"
import { auth }                    from "auth"
import { revalidateTag }           from "next/cache"
import { redirect }                from "next/navigation"

export default async function postNewSuggestion(state: State, formData: unknown) {
    if (!(formData instanceof FormData)) {
        return ResponseError(
            problemDetailsFactory({
                                      type: "https://httpstatuses.com/400",
                                      title: "Invalid Form Data",
                                      status: 400,
                                      detail: "Invalid form data was submitted. Please try again.",
                                      instance: "/auth/login",
                                  }),
        )
    }
    
    const session = await auth()
    
    try {
        const URL = createSuggestionUrl()
        
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = suggestionRequestSchema.safeParse(rawFormData)
        
        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }
        
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ session?.accessToken }`,
            },
            body: JSON.stringify(parsedFormData.data),
        })
        
        const json = await response.json()
        
        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }
        
        revalidateTag("suggestions")
    } catch (error) {
        return ResponseError(error)
    }
    
    redirect("/suggestions")
}
