"use server"

import "server-only"
import { RestResponse }          from "@/@types/application"
import { LoginResponse }         from "@/@types/auth"
import { refreshTokenAuthUrl }   from "@/utils/routes"
import { getTokenAndExpiration } from "@/utils/utilities"
import { JWT }                   from "next-auth/jwt"

export default async function refreshAccessToken(token: JWT) {
    const URL = refreshTokenAuthUrl()
    
    const { token: refreshToken } = await getTokenAndExpiration()
    if (!refreshToken) {
        console.error("No refresh token found.")
        return { ...token, error: "RefreshAccessTokenError" }
    }
    
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Refresh-Token": refreshToken,
        },
        body: JSON.stringify({}),
    })
    
    const json = await response.json()
    
    if (!response.ok) {
        console.error("Refresh token error: ", json)
        return { ...token, error: "RefreshAccessTokenError" }
    }
    
    const responsePayload = json as RestResponse
    const loginResponse = responsePayload.data as LoginResponse
    
    return {
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        accessTokenExpiresAt: loginResponse.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        error: null,
    }
}
