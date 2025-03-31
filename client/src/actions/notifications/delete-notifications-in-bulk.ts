"use server"

import { ProblemDetails }               from "@/@types/application"
import ResponseError                    from "@/actions/application/response-error"
import { deleteNotificationsInBulkUrl } from "@/utils/routes"
import { auth }                         from "auth"

interface DeleteNotificationsInBulk {
    idList: number[]
}

export default async function deleteNotificationsInBulk({ idList }: DeleteNotificationsInBulk) {
    const session = await auth()
    
    try {
        const URL = deleteNotificationsInBulkUrl(idList)
        
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
            response: "You have successfully deleted the selected notifications",
        }
    } catch (error) {
        return ResponseError(error)
    }
}