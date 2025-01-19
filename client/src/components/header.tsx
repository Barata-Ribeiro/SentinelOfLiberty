"use client"

import { Button, Dialog, DialogPanel }           from "@headlessui/react"
import Image, { getImageProps }                  from "next/image"
import Link                                      from "next/link"
import { useState }                              from "react"
import { HiMiniXMark, HiOutlineBars3CenterLeft } from "react-icons/hi2"
// import SessionVerifier from "@/helpers/session-verifier"
import headerImage                               from "../../public/city-of-liberty.png"
import solLogo                                   from "../../public/sentinel-of-liberty-final.svg"

function getBackgroundImage(srcSet = "") {
    const imageSet = srcSet
        .split(", ")
        .map(str => {
            const [ url, dpi ] = str.split(" ")
            return `url("${ url }") ${ dpi }`
        })
        .join(", ")
    return `image-set(${ imageSet })`
}

const navigation = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#" },
    { name: "Marketplace", href: "#" },
    { name: "Company", href: "#" },
]

export default function Header() {
    const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)
    const {
        props: { srcSet },
    } = getImageProps({ alt: "", width: 1700, height: 280, src: headerImage })
    const backgroundImage = getBackgroundImage(srcSet)
    
    return (
        <header>
            {/*<SessionVerifier />*/ }
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
                <Image src={ solLogo } alt="Sentinel of Liberty Logo" priority className="h-1/2 w-max" />
            </div>

            <div className="bg-marigold-600">
                <nav aria-label="Global" className="container flex items-center justify-between p-6 lg:px-8">
                    <div className="flex flex-1">
                        <div className="hidden lg:flex lg:gap-x-12">
                            { navigation.map(item => (
                                <a
                                    key={ item.name }
                                    href={ item.href }
                                    className="text-sm font-semibold leading-6 text-stone-900">
                                    { item.name }
                                </a>
                            )) }
                        </div>
                        <div className="flex lg:hidden">
                            <Button
                                type="button"
                                onClick={ () => setMobileMenuOpen(true) }
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-700 hover:bg-marigold-400">
                                <span className="sr-only">Open main menu</span>
                                <HiOutlineBars3CenterLeft aria-hidden="true" className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-1 justify-end">
                        <Link href="/auth/login"
                              className="text-sm font-semibold leading-6 text-stone-900 hover:bg-marigold-400 rounded-md px-1.5">
                            Log in <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </nav>
                <Dialog open={ mobileMenuOpen } onClose={ setMobileMenuOpen } className="lg:hidden">
                    <div className="fixed inset-0 z-10" />
                    <DialogPanel className="fixed inset-y-[280px] left-0 z-10 w-full h-full overflow-y-auto bg-stone-50 px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-1">
                                <Button
                                    type="button"
                                    onClick={ () => setMobileMenuOpen(false) }
                                    className="-m-2.5 rounded-md p-2.5 text-stone-700">
                                    <span className="sr-only">Close menu</span>
                                    <HiMiniXMark aria-hidden="true" className="h-6 w-6" />
                                </Button>
                            </div>

                            <div className="flex flex-1 justify-end">
                                <Link href="/auth/login" className="text-sm font-semibold leading-6 text-stone-900">
                                    Log in <span aria-hidden="true">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            { navigation.map(item => (
                                <Link
                                    key={ item.name }
                                    href={ item.href }
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-stone-900 hover:bg-stone-50">
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
