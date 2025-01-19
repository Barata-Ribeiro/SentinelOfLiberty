"use client"

import deleteSession           from "@/actions/application/delete-session"
import { Route }               from "next"
import { getSession, signOut } from "next-auth/react"
import { useRouter }           from "next/navigation"
import { use }                 from "react"

async function fetchAndVerifySession() {
    const session = await getSession()
    
    if (session?.error === "RefreshAccessTokenError") {
        console.error("There was an error with the session, logging out...")
        
        try {
            await deleteSession()
        } catch (err) {
            console.error(err)
        } finally {
            await signOut({ redirect: false })
        }
    }
    
    return session
}

export default function SessionVerifier() {
    const router = useRouter()
    const session = use(fetchAndVerifySession())
    
    if (!session) {
        router.push(`${ window.location.origin }/auth/login` as Route<string>)
        return null
    }
    
    return null
}
