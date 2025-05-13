"use server"

import ResponseError from "@/actions/application/response-error"
import { logoutAuthUrl } from "@/utils/routes"
import { getTokenAndExpiration } from "@/utils/server-utilities"
import { signOut } from "auth"
import { cookies } from "next/headers"

export default async function deleteAuthLogout() {
    const cookieStore = await cookies()
    const tokenAndExpiration = await getTokenAndExpiration()

    try {
        if (!tokenAndExpiration) return ResponseError("Something went wrong...")

        const URL = logoutAuthUrl()

        const response = await fetch(URL, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-Refresh-Token": tokenAndExpiration.token,
            },
        })

        await signOut({ redirect: false })

        if (cookieStore) {
            cookieStore.getAll().forEach(cookie => cookieStore.delete(cookie.name))
        }

        return {
            ok: response.status === 204,
            error: null,
            response: "You have successfully logged out.",
        }
    } catch (error) {
        return ResponseError(error)
    }
}
