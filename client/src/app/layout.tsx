import ScrollToTop from "@/components/helpers/scroll-to-top"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import { WebsocketProvider } from "@/providers/websocket-provider"
import tw from "@/utils/tw"
import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Lora, Merriweather } from "next/font/google"
import "./globals.css"
import { ReactNode } from "react"

const lora = Lora({
    variable: "--font-lora",
    subsets: ["latin"],
    display: "swap",
    preload: true,
})

const merriWeather = Merriweather({
    weight: ["300", "400", "700", "900"],
    display: "swap",
    style: ["normal", "italic"],
    variable: "--font-merriWeather",
    subsets: ["latin"],
    preload: true,
})

export const metadata: Metadata = {
    title: {
        default: "Sentinel of Liberty",
        template: "%s | Sentinel of Liberty",
    },
    description:
        "Sentinel of Liberty is a web application that allows people to suggest news or third-party" +
        " articles for our authors to write and comment about it.",
    keywords: ["news", "articles", "suggestions", "comments", "authors"],
    authors: {
        name: "João Mendes J. B. Ribeiro",
        url: "https://barataribeiro.com/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    const bodyStyles = tw`${lora.variable} ${merriWeather.variable} flex min-h-screen flex-col justify-between antialiased`

    return (
        <SessionProvider>
            <WebsocketProvider>
                <html lang="en" suppressHydrationWarning>
                    <body className={bodyStyles}>
                        <Header />
                        {children}
                        <Footer />
                        <ScrollToTop />
                    </body>
                </html>
            </WebsocketProvider>
        </SessionProvider>
    )
}
