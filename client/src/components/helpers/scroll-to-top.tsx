"use client"

import { Button } from "@headlessui/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { FaAnglesUp } from "react-icons/fa6"

export function useDebounceCallback<T extends (...args: unknown[]) => void>(callback: T, delay: number) {
    const callbackRef = useRef(callback)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    return useCallback(
        (...args: Parameters<T>) => {
            if (timerRef.current) clearTimeout(timerRef.current)

            timerRef.current = setTimeout(() => callbackRef.current(...args), delay)
        },
        [delay],
    )
}

export default function ScrollToTop() {
    const [showScroll, setShowScroll] = useState(false)

    const handleScroll = useDebounceCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        setShowScroll(scrollTop > 20)
    }, 100)

    function scrollToTop() {
        document.documentElement.style.scrollBehavior = "smooth"
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [handleScroll])

    return (
        showScroll && (
            <Button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="bg-marigold-500 hover:bg-marigold-600 focus:bg-marigold-700 active:bg-marigold-700 fixed right-[40px] bottom-[40px] inline-block cursor-pointer rounded-full p-3 text-xs leading-tight font-medium text-white uppercase shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:ring-0 focus:outline-none active:shadow-lg">
                <FaAnglesUp aria-hidden="true" className="text-shadow-50 size-4" />
            </Button>
        )
    )
}
