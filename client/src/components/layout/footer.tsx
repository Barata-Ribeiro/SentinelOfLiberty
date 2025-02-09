import Image                 from "next/image"
import Link                  from "next/link"
import { FaGithub, FaGlobe } from "react-icons/fa6"
import miniLogo              from "../../../public/sentinel-of-liberty-S-final.svg"

const navigation = [
    {
        name: "GitHub",
        href: "https://github.com/Barata-Ribeiro/SentinelOfLiberty",
        icon: FaGithub,
    },
    {
        name: "Portfolio",
        href: "https://barataribeiro.com/",
        icon: FaGlobe,
    },
]

export default function Footer() {
    return (
        <footer className="mt-auto bg-stone-50">
            <div className="container px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    { navigation.map(item => (
                        <Link
                            key={ item.name }
                            href={ item.href }
                            title={ item.name }
                            rel="noopener noreferrer external"
                            target="_blank"
                            className="text-shadow-400 hover:text-shadow-500">
                            <span className="sr-only">{ item.name }</span>
                            <item.icon aria-hidden="true" className="h-6 w-6" />
                        </Link>
                    )) }
                </div>
                <div className="mt-8 flex items-center gap-x-3 divide-stone-200 md:order-1 md:mt-0">
                    <Image src={ miniLogo } alt="" className="size-8" />
                    <span aria-hidden="true" className="h-6 w-px bg-stone-200"></span>
                    <p className="text-shadow-500 text-center text-xs leading-5">
                        &copy; 2023 ~ { new Date().getFullYear() } Sentinel of Liberty. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
