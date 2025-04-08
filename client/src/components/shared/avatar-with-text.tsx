import tw          from "@/utils/tw"
import Image       from "next/image"
import Link        from "next/link"
import { LuLock }  from "react-icons/lu"
import { twMerge } from "tailwind-merge"

interface AvatarWithTextProps {
    name: string
    size: 32 | 36 | 48 | 64 | 72 | 96
    src: string | null
    type?: "dashboard" | "profile"
    isPrivate?: boolean
}

export default function AvatarWithText({
                                           name,
                                           size,
                                           src,
                                           type = "dashboard",
                                           isPrivate = false,
                                       }: Readonly<AvatarWithTextProps>) {
    let styleSize, textSize
    
    switch (size) {
        case 32:
            styleSize = "size-8"
            textSize = "text-base"
            break
        case 36:
            styleSize = "size-9"
            textSize = "text-xl"
            break
        case 48:
            styleSize = "size-12"
            textSize = "text-2xl"
            break
        case 64:
            styleSize = "size-16"
            textSize = "text-3xl"
            break
        case 72:
            styleSize = "size-18"
            textSize = "text-4xl"
            break
        default:
            styleSize = "size-24"
            textSize = "text-6xl"
    }
    
    const placeHolderBaseStyles = tw`flex shrink-0 items-center justify-center rounded-full bg-stone-200 shadow-xs ring-2 ring-white select-none`
    
    const placeHolderMergedStyles = twMerge(placeHolderBaseStyles, styleSize)
    const spanStyles = twMerge("font-heading capitalize text-stone-500", textSize)
    
    const avatarLink = type === "dashboard" ? `/dashboard/${ name }` : `/profile/${ name }`
    
    const profileNameDesc = `Profile for ${ name }`
    
    return (
        <Link
            href={ avatarLink }
            className="group block shrink-0"
            aria-label={ `Go to ${ type === "dashboard" ? "your Dashboard" : profileNameDesc }` }
            title={ `Go to ${ type === "dashboard" ? "your Dashboard" : profileNameDesc }` }>
            <div className="flex items-center">
                <div>
                    { src ? (
                        <Image
                            src={ src }
                            alt={ `Avatar for ${ name }` }
                            title={ `Avatar for ${ name }` }
                            aria-label={ `Avatar for ${ name }` }
                            className="aspect-square shrink-0 rounded-full bg-stone-200 object-cover shadow-xs ring-2 ring-white transition-all duration-200 ease-in-out group-hover:scale-105"
                            width={ size }
                            height={ size }
                            sizes={ `${ size }px` }
                        />
                    ) : (
                          <div
                              className={ placeHolderMergedStyles }
                              aria-label={ `Placeholder avatar for ${ name }` }
                              title={ `Placeholder avatar for ${ name }` }>
                            <span className={ spanStyles }>{ name.charAt(0) }</span>
                        </div>
                      ) }
                </div>
                <div className="ml-3">
                    <p className="text-shadow-800 group-hover:text-shadow-900 text-sm font-semibold">{ name }</p>
                    { type === "profile" && (
                        <p className="text-shadow-700 group-hover:text-shadow-800 inline-flex items-center gap-x-1 text-xs font-medium">
                            View profile { isPrivate && <LuLock aria-hidden="true" /> }
                        </p>
                    ) }
                </div>
            </div>
        </Link>
    )
}
