"use client"

import { Button }                            from "@headlessui/react"
import { useRouter, useSearchParams }        from "next/navigation"
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6"

interface NavigationPaginationProps {
    pageInfo: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export default function NavigationPagination({ pageInfo }: NavigationPaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const page = pageInfo.number ?? parseInt(searchParams.get("page") as string, 10)
    
    function handlePageChange(page: number) {
        const params = new URLSearchParams(searchParams.toString())
        if (page) params.set("page", page.toString())
        else params.delete("page")
        
        router.push(`?${ params.toString() }`)
    }
    
    return (
        <nav className="flex items-center justify-between border-t border-stone-200 px-4 sm:px-0 mb-2 mt-4">
            <div className="-mt-px flex w-0 flex-1">
                <Button
                    onClick={ () => handlePageChange(page - 1) }
                    disabled={ page <= 1 }
                    className="text-shadow-500 hover:text-shadow-700 inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium hover:border-stone-300 disabled:pointer-events-none disabled:opacity-50">
                    <FaArrowLeftLong aria-hidden="true" className="text-shadow-400 mr-3 size-5" />
                    Previous
                </Button>
            </div>
            <div className="hidden md:-mt-px md:flex">
                { pageInfo.totalPages > 1 &&
                    [ ...Array(pageInfo.totalPages) ].map((_, index) => {
                        if (
                            pageInfo.totalPages <= 4 ||
                            index === 0 ||
                            index === pageInfo.totalPages - 1 ||
                            Math.abs(page - index) <= 1
                        ) {
                            return (
                                <Button
                                    key={ "Button-" + (index + 1) }
                                    type="button"
                                    onClick={ () => handlePageChange(index) }
                                    className="text-shadow-500 hover:text-shadow-700 inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium hover:border-stone-300">
                                    { index + 1 }
                                </Button>
                            )
                        } else if (index === page - 2 || index === page + 2) {
                            return (
                                <span
                                    key={ "Button-" + index }
                                    className="text-shadow-500 inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium">
                                    ...
                                </span>
                            )
                        }
                        return null
                    }) }
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
                <Button
                    onClick={ () => handlePageChange(page + 1) }
                    disabled={ page >= pageInfo.totalPages - 1 }
                    className="text-shadow-500 hover:text-shadow-700 inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium hover:border-stone-300 disabled:pointer-events-none disabled:opacity-50">
                    Next
                    <FaArrowRightLong aria-hidden="true" className="text-shadow-400 ml-3 size-5" />
                </Button>
            </div>
        </nav>
    )
}
