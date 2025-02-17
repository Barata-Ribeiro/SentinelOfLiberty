"use server"

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
        
        return {
            ok: response.status === 204,
            error: null,
            response: "You have successfully deleted the selected notifications",
        }
    } catch (error) {
        return ResponseError(error)
    }
}