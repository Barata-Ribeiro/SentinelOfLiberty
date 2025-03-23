"use server"

import ResponseError       from "@/actions/application/response-error"
import { deleteNoticeUrl } from "@/utils/routes"
import { auth }            from "auth"
import { revalidateTag }   from "next/cache"

interface DeleteCurrentNotice {
    id: number
}

export default async function deleteCurrentNotice({ id }: DeleteCurrentNotice) {
    const session = await auth()
    
    try {
        const URL = deleteNoticeUrl(id)
        
        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ session?.accessToken }`,
            },
        })
        
        revalidateTag("notices")
        revalidateTag("notice")
        
        return {
            ok: response.status === 204,
            error: null,
            response: "You have successfully deleted the notice",
        }
    } catch (error) {
        return ResponseError(error)
    }
}