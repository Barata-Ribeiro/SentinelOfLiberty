import { RestResponse } from "@/@types/application"
import { LoginResponse } from "@/@types/auth"
import createCookie from "@/actions/application/create-cookie"
import refreshAccessToken from "@/actions/application/token-refresh"
import { loginAuthUrl } from "@/utils/routes"
import { getTokenAndExpiration } from "@/utils/server-utilities"
import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async authorize(credentials, _req) {
                const payload = {
                    username: credentials.username,
                    password: credentials.password,
                    rememberMe: credentials.rememberMe,
                }

                const URL = loginAuthUrl()

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
