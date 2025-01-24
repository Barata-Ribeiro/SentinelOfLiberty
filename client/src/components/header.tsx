"use client"

import AvatarWithText                            from "@/components/avatar-with-text"
import SessionVerifier                           from "@/helpers/session-verifier"
import { getBackgroundImage }                    from "@/utils/functions"
import { Button, Dialog, DialogPanel }           from "@headlessui/react"
import { useSession }                            from "next-auth/react"
import Image, { getImageProps }                  from "next/image"
import Link                                      from "next/link"
import { usePathname }                           from "next/navigation"
import { useState }                              from "react"
import { FaRegBell }                             from "react-icons/fa6"
import { HiMiniXMark, HiOutlineBars3CenterLeft } from "react-icons/hi2"
import headerImage                               from "../../public/city-of-liberty.png"
import solLogo                                   from "../../public/sentinel-of-liberty-final.svg"

const navigation = [
    { name: "Home", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: "Suggestions", href: "/suggestions" },
]

export default function Header() {
    const { data: session } = useSession()
    const pathname = usePathname()
    
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)
    const {
        props: { srcSet },
    } = getImageProps({ alt: "", width: 1700, height: 280, src: headerImage })
    const backgroundImage = getBackgroundImage(srcSet)
    
    return (
        <header className="z-10 shadow-sm">
            <SessionVerifier />
            <div
                className="flex items-center justify-center"
                style={ {
                    height: "280px",
                    width: "100%",
                    backgroundImage,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                } }>
                <Image
                    src={ solLogo }
                    alt="Sentinel of Liberty Logo"
                    priority
                    sizes="(min-width: 808px) 50vw, 100vw"
                    className="h-1/2 w-max"
                />
            </div>

            <div className="bg-marigold-600">
                <nav aria-label="Global" className="container flex items-center justify-between p-6 lg:px-8">
                    <div className="flex flex-1">
                        <div className="hidden lg:flex lg:gap-x-12">
                            { navigation.map(item => (
                                <Link
                                    key={ item.name }
                                    href={ item.href }
                                    data-current={ pathname === item.href ? "page" : undefined }
                                    aria-current={ pathname === item.href ? "page" : undefined }
                                    className="text-shadow-900 hover:bg-marigold-400 focus:outline-marigold-900 active:bg-marigold-700 data-[current=page]:bg-marigold-400 data-[current=page]:text-marigold-900 rounded-md px-3 py-2 text-sm leading-6 font-semibold focus:outline-2 focus:outline-offset-2">
                                    { item.name }
                                </Link>
                            )) }
                        </div>
                        <div className="flex lg:hidden">
                            <Button
                                type="button"
                                onClick={ () => setMobileMenuOpen(true) }
                                className="text-shadow-700 hover:bg-marigold-400 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
                                <span className="sr-only">Open main menu</span>
                                <HiOutlineBars3CenterLeft aria-hidden="true" className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-1 justify-end">
                        { !session ? (
                            <Link
                                href="/auth/login"
                                className="text-shadow-900 hover:bg-marigold-400 focus:outline-marigold-900 active:bg-marigold-700 rounded-md px-3 py-2 text-sm leading-6 font-semibold focus:outline-2 focus:outline-offset-2">
                                Log in <span aria-hidden="true">&rarr;</span>
                            </Link>
                        ) : (
                              <>
                                <Button
                                    type="button"
                                    className="bg-shadow-50 text-shadow-400 hover:text-shadow-600 focus:outline-marigold-900 active:text-shadow-700 relative mr-4 shrink-0 rounded-full p-1 focus:outline-2 focus:outline-offset-2">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">View notifications</span>
                                    <FaRegBell aria-hidden="true" className="h-6 w-7" />
                                </Button>
                                <AvatarWithText name={ session.user.username }
                                                size={ 36 }
                                                src={ session.user?.avatarUrl } />
                            </>
                          ) }
                    </div>
                </nav>
                <Dialog open={ mobileMenuOpen } onClose={ setMobileMenuOpen } className="lg:hidden">
                    <div className="fixed inset-0 z-20" />
                    <DialogPanel className="fixed inset-y-0 left-0 z-20 h-full w-full overflow-y-auto bg-stone-50 px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-1">
                                <Button
                                    type="button"
                                    onClick={ () => setMobileMenuOpen(false) }
                                    className="text-shadow-700 -m-2.5 rounded-md p-2.5 hover:bg-stone-300">
                                    <span className="sr-only">Close menu</span>
                                    <HiMiniXMark aria-hidden="true" className="h-6 w-6" />
                                </Button>
                            </div>

                            <div className="flex flex-1 justify-end">
                                { !session ? (
                                    <Link
                                        href="/auth/login"
                                        className="text-shadow-900 focus:outline-shadow-900 active:bg-shadow-700 rounded-md px-3 py-2 text-sm leading-6 font-semibold hover:bg-stone-300 focus:outline-2 focus:outline-offset-2">
                                        Log in <span aria-hidden="true">&rarr;</span>
                                    </Link>
                                ) : (
                                      <>
                                        <Button
                                            type="button"
                                            className="text-shadow-400 hover:text-shadow-500 focus:outline-marigold-900 relative mr-4 shrink-0 rounded-full bg-stone-50 p-1 focus:outline-2 focus:outline-offset-2">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">View notifications</span>
                                            <FaRegBell aria-hidden="true" className="h-6 w-7" />
                                        </Button>
                                        <AvatarWithText
                                            name={ session.user.username }
                                            size={ 36 }
                                            src={ session.user?.avatarUrl }
                                        />
                                    </>
                                  ) }
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            { navigation.map(item => (
                                <Link
                                    key={ item.name }
                                    href={ item.href }
                                    data-current={ pathname === item.href ? "page" : undefined }
                                    aria-current={ pathname === item.href ? "page" : undefined }
                                    className="text-shadow-900 data-[current=page]:text-shadow-800 -mx-3 block rounded-lg px-3 py-2 text-base leading-7 font-semibold hover:bg-stone-300 data-[current=page]:bg-stone-400">
                                    { item.name }
                                </Link>
                            )) }
                        </div>
                    </DialogPanel>
                </Dialog>
            </div>
        </header>
    )
}
