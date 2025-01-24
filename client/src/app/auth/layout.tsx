import { getBackgroundImage } from "@/utils/functions"
import { getImageProps }      from "next/image"
import Link                   from "next/link"
import { ReactNode }          from "react"
import authPhoto              from "../../../public/auth-photo.jpg"

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
    const {
        props: { srcSet },
    } = getImageProps({ alt: "", width: 1700, height: 280, src: authPhoto })
    const backgroundImage = getBackgroundImage(srcSet)
    
    return (
        <main
            className="flex min-h-screen w-auto flex-col items-center justify-center bg-stone-600"
            style={ {
                backgroundImage,
                backgroundBlendMode: "multiply",
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            } }>
            { children }
            <p className="text-center text-xs text-shadow-50/50">
                Photo from Unsplash by{ " " }
                <Link
                    href="https://unsplash.com/@chesterfordhouse"
                    rel="noreferrer noopener external"
                    target="_blank"
                    className="font-medium tracking-wide hover:text-shadow-200 hover:underline">
                    Peter Lawrence
                </Link>
            </p>
        </main>
    )
}
