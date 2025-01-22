import tw          from "@/utils/tw"
import Image       from "next/image"
import Link        from "next/link"
import { twMerge } from "tailwind-merge"

interface AvatarWithTextProps {
    name: string
    size: 32 | 36 | 48
    src: string | null
}

export default function AvatarWithText({ name, size, src }: AvatarWithTextProps) {
    const styleSize = size === 32 ? "size-8" : size === 36 ? "size-9" : "size-12"
    const textSize = size === 32 ? "text-base" : size === 36 ? "text-xl" : "text-2xl"
    
    const placeHolderBaseStyles = tw`bg-gray-200 flex flex-shrink-0 select-none items-center justify-center rounded-full shadow-sm ring-2 ring-white`
    
    const placeHolderMergedStyles = twMerge(placeHolderBaseStyles, styleSize)
    const spanStyles = twMerge("font-heading text-gray-500", textSize)
    
    return (
        <Link href={ `/dashboard/${ name }` } className="group block flex-shrink-0">
            <div className="flex items-center">
                <div>
                    { src ? (
                        <Image
                            src={ src }
                            alt={ `Avatar for ${ name }` }
                            title={ `Avatar for ${ name }` }
                            aria-label={ `Avatar for ${ name }` }
                            className="flex-shrink-0 rounded-full bg-stone-200 shadow-sm ring-2 ring-white"
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
                    <p className="text-sm font-medium text-shadow-700 group-hover:text-shadow-900">{ name }</p>
                    <p className="text-xs font-medium text-shadow-500 group-hover:text-shadow-700">View profile</p>
                </div>
            </div>
        </Link>
    )
}
