import tw          from "@/utils/tw"
import Image       from "next/image"
import Link        from "next/link"
import { twMerge } from "tailwind-merge"

interface AvatarProps {
    name: string
    size: 32 | 36 | 48 | 64 | 72 | 96
    src: string | null
    animate?: boolean
}

export default function Avatar({ name, size, src, animate = true }: Readonly<AvatarProps>) {
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
    
    const baseStyles = tw`aspect-square shrink-0 rounded-full bg-stone-200 object-cover shadow-xl ring-2 ring-white select-none`
    const placeHolderBaseStyles = twMerge(baseStyles, "flex items-center justify-center")
    
    const placeHolderMergedStyles = twMerge(placeHolderBaseStyles, styleSize)
    const spanStyles = twMerge(tw`font-heading text-stone-500 capitalize`, textSize)
    
    return (
        <Link
            href={ `/profile/${ name }` }
            data-animated={ animate }
            aria-label="Go to your public profile page"
            className="block w-max shrink-0 data-[animated=true]:transition-transform data-[animated=true]:hover:-translate-y-2.5 data-[animated=true]:hover:transform">
            { src ? (
                <Image
                    src={ src }
                    alt={ `Avatar for ${ name }` }
                    title={ `Avatar for ${ name }` }
                    aria-label={ `Avatar for ${ name }` }
                    className={ baseStyles }
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
        </Link>
    )
}
