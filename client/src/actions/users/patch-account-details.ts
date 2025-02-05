"use server"

import { ProblemDetails, State }    from "@/@types/application"
import ResponseError                from "@/actions/application/response-error"
import { userAccountDetailsSchema } from "@/helpers/zod-schemas"
import { problemDetailsFactory }    from "@/utils/functions"
import { updateOwnProfileUrl }      from "@/utils/routes"
import { auth }                     from "auth"
import { revalidateTag }            from "next/cache"
import { permanentRedirect }        from "next/navigation"

export default async function patchAccountDetails(state: State, formData: unknown) {
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
        const URL = updateOwnProfileUrl()
        
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = userAccountDetailsSchema.safeParse(rawFormData)
        
        if (!parsedFormData.success) {
            return ResponseError(parsedFormData.error)
        }
        
        const response = await fetch(URL, {
            method: "PATCH",
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
        
        revalidateTag("profile")
        revalidateTag("user-settings")
        revalidateTag("dashboard")
    } catch (error) {
        return ResponseError(error)
    }
    
    permanentRedirect(`/dashboard/${ session?.user?.username }`)
}
