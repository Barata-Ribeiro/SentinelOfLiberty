"use server"

import { ProblemDetails }     from "@/@types/application"
import ResponseError          from "@/actions/application/response-error"
import { adminDeleteUserUrl } from "@/utils/routes"
import { auth }               from "auth"

interface DeleteUser {
    username: string
}

export default async function deleteUser({ username }: DeleteUser) {
    const session = await auth()
    
    try {
        const URL = adminDeleteUserUrl(username)
        
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
            response: "You have successfully deleted the user",
        }
    } catch (error) {
        return ResponseError(error)
    }
}