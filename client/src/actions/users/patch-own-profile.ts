"use server"

import { ProblemDetails, RestResponse, State } from "@/@types/application"
import { Profile }                             from "@/@types/user"
import ResponseError                           from "@/actions/application/response-error"
import { userProfileUpdateSchema }             from "@/helpers/zod-schemas"
import { problemDetailsFactory }               from "@/utils/functions"
import { updateOwnProfileUrl }                 from "@/utils/routes"
import { auth, unstable_update }               from "auth"
import { revalidateTag }                       from "next/cache"
import { redirect }                            from "next/navigation"

export default async function patchOwnProfile(state: State, formData: unknown) {
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
    
    let updatedResponse: Profile
    
    try {
        const URL = updateOwnProfileUrl()
        
        const rawFormData = Object.fromEntries(formData.entries())
        const parsedFormData = userProfileUpdateSchema.safeParse(rawFormData)
        
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
        
        updatedResponse = (json as RestResponse).data as Profile
        
        revalidateTag("profile")
        revalidateTag("user-settings")
        revalidateTag("dashboard")
        await unstable_update({
                                  ...session,
                                  user: {
                                      ...session?.user,
                                      ...updatedResponse,
                                  },
                              })
        
    } catch (error) {
        return ResponseError(error)
    }
    
    redirect(`/dashboard/${ updatedResponse.username }`)
}
