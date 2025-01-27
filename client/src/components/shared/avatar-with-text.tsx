import tw          from "@/utils/tw"
import Image       from "next/image"
import Link        from "next/link"
import { twMerge } from "tailwind-merge"

interface AvatarWithTextProps {
    name: string
    size: 32 | 36 | 48
    src: string | null
}

export default function AvatarWithText({ name, size, src }: Readonly<AvatarWithTextProps>) {
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
        default:
            styleSize = "size-12"
            textSize = "text-2xl"
    }
    
    const placeHolderBaseStyles = tw`flex shrink-0 select-none items-center justify-center rounded-full bg-stone-200 shadow-xs ring-2 ring-white`
    
    const placeHolderMergedStyles = twMerge(placeHolderBaseStyles, styleSize)
    const spanStyles = twMerge("font-heading capitalize text-stone-500", textSize)
    
    return (
        <Link href={ `/dashboard/${ name }` } className="group block shrink-0">
            <div className="flex items-center">
                <div>
                    { src ? (
                        <Image
                            src={ src }
                            alt={ `Avatar for ${ name }` }
                            title={ `Avatar for ${ name }` }
                            aria-label={ `Avatar for ${ name }` }
                            className="shrink-0 rounded-full bg-stone-200 shadow-xs ring-2 ring-white"
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
                    <p className="text-sm font-semibold text-shadow-800 group-hover:text-shadow-900">
                        { name }
                    </p>
                    <p className="text-xs font-medium text-shadow-700 group-hover:text-shadow-800">View profile</p>
                </div>
            </div>
        </Link>
    )
}
