"use server"

import { ProblemDetails, RestResponse } from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { setNoticeStatusUrl }           from "@/utils/routes"
import { auth }                         from "auth"
import { revalidateTag }                from "next/cache"

interface PatchStatusNotice {
    id: number
    isActive: boolean
}

export default async function patchStatusNotice({ id, isActive }: PatchStatusNotice) {
    const session = await auth()
    try {
        const URL = setNoticeStatusUrl(id, isActive)
        
        const response = await fetch(URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ session?.accessToken }`,
            },
        })
        
        const json = await response.json()
        
        if (!response.ok) {
            const problemDetails = json as ProblemDetails
            return ResponseError(problemDetails)
        }
        
        revalidateTag("notices")
        revalidateTag("notice")
        
        return {
            ok: true,
            error: null,
            response: json as RestResponse,
        }
    } catch (error) {
        return ResponseError(error)
    }
}