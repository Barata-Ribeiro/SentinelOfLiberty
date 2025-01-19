import { RestResponse } from "@/@types/application"
import { LoginResponse } from "@/@types/auth"
import createCookie from "@/actions/application/create-cookie"
import refreshAccessToken from "@/actions/application/token-refresh"
import { getTokenAndExpiration } from "@/utils/utilities"
import Credentials from "@auth/core/providers/credentials"
import NextAuth, { NextAuthConfig } from "next-auth"

export const config = {
    pages: {
        newUser: "/auth/register",
        signIn: "/auth/login",
    },
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text", placeholder: "johndoe/janedoe" },
                password: { label: "Password", type: "password" },
                rememberMe: { label: "Remember Me", type: "checkbox", defaultValue: "false" },
            },
            async authorize(credentials, _req) {
                const payload = {
                    username: credentials.username,
                    password: credentials.password,
                    rememberMe: credentials.rememberMe,
                }

                const URL = `` // TODO: Add API URL

                const response = await fetch(URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                })

                const json = await response.json()
                if (!response.ok) throw JSON.stringify(json)

                const responsePayload = json as RestResponse
                const loginResponse = responsePayload.data as LoginResponse

                if (!responsePayload || !loginResponse) return null

                await createCookie(loginResponse.refreshToken, loginResponse.refreshTokenExpiresAt)

                return loginResponse
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user: context, account, trigger, session }) {
            if (account && context) {
                token.user = context.user
                token.accessToken = context.accessToken
                token.accessTokenExpiresAt = context.accessTokenExpiresAt
                token.refreshToken = context.refreshToken
                token.refreshTokenExpiresAt = context.refreshTokenExpiresAt
                token.error = null

                return token
            }

            if (trigger === "update") {
                if (session) {
                    const refreshToken: { token: string; expiresAt: number } = await getTokenAndExpiration()

                    token.user = session.user
                    token.accessToken = session.accessToken
                    token.accessTokenExpiresAt = session.accessTokenExpiresAt
                    token.refreshToken = refreshToken.token
                    token.refreshTokenExpiresAt = new Date(Number(refreshToken.expiresAt)).toISOString()
                    token.error = null
                }
            }

            if (
                (token.accessTokenExpiresAt && Date.now() < new Date(token.accessTokenExpiresAt).getTime()) ||
                token.error === "RefreshAccessTokenError"
            ) {
                const { refreshToken, refreshTokenExpiresAt, ...rest } = token

                return rest
            }

            return refreshAccessToken(token)
        },
        async session({ session, token }) {
            session.user = { ...session.user, ...token.user }
            session.accessToken = token.accessToken
            session.accessTokenExpiresAt = token.accessTokenExpiresAt
            session.error = token.error

            return session
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl
        },
    },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(config)
