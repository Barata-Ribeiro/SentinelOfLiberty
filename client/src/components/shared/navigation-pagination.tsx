"use client"

import { Button } from "@headlessui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6"

interface NavigationPaginationProps {
    pageInfo: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export default function NavigationPagination({ pageInfo }: Readonly<NavigationPaginationProps>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const page = pageInfo.number ?? parseInt(searchParams.get("page") as string, 10)

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            if (value === "0") params.delete(name)
            return params.toString()
        },
        [searchParams],
    )

    return (
        <nav className="mt-4 mb-2 flex items-center justify-between border-t border-stone-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
                <Button
                    onClick={() => router.push(`${pathname}?${createQueryString("page", String(page - 1))}`)}
                    disabled={page < 1}
                    className="text-shadow-500 hover:text-shadow-700 inline-flex cursor-pointer items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium hover:border-stone-300 disabled:pointer-events-none disabled:opacity-50">
                    <FaArrowLeftLong aria-hidden="true" className="text-shadow-400 mr-3 size-5" />
                    Previous
                </Button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                {pageInfo.totalPages > 1 &&
                    [...Array(pageInfo.totalPages)].map((_, index) => {
                        if (
                            pageInfo.totalPages <= 4 ||
                            index === 0 ||
                            index === pageInfo.totalPages - 1 ||
                            Math.abs(page - index) <= 1
                        ) {
                            return (
                                <Button
                                    key={"Button-" + (index + 1)}
                                    type="button"
                                    data-current={index === page}
                                    onClick={() =>
                                        router.push(`${pathname}?${createQueryString("page", String(index))}`)
                                    }
                                    className="text-shadow-500 data-[current=true]:border-marigold-500 data-[current=true]:text-marigold-500 hover:text-shadow-700 inline-flex cursor-pointer items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium hover:border-stone-300">
                                    {index + 1}
                                </Button>
                            )
                        } else if (index === page - 2 || index === page + 2) {
                            return (
                                <span
                                    key={"Button-" + index}
                                    className="text-shadow-500 inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium">
                                    ...
                                </span>
                            )
                        }
                        return null
                    })}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <Button
                    onClick={() => router.push(`${pathname}?${createQueryString("page", String(page + 1))}`)}
                    disabled={page >= pageInfo.totalPages - 1}
                    className="text-shadow-500 hover:text-shadow-700 inline-flex cursor-pointer items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium hover:border-stone-300 disabled:pointer-events-none disabled:opacity-50">
                    Next
                    <FaArrowRightLong aria-hidden="true" className="text-shadow-400 ml-3 size-5" />
                </Button>
            </div>
        </nav>
    )
}
