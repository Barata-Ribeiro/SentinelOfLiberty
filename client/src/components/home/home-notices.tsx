"use client"

import { Notice }                        from "@/@types/notices"
import { Button }                        from "@headlessui/react"
import { useEffect, useState }           from "react"
import { FaExclamationTriangle }         from "react-icons/fa"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

interface HomeNoticesProps {
    notices: Set<Notice>
}

export default function HomeNotices({ notices }: Readonly<HomeNoticesProps>) {
    const noticesArray = Array.from(notices)
    const [ currentNoticeIndex, setCurrentNoticeIndex ] = useState(0)
    const totalNotices = noticesArray.length
    
    function handlePrevNotice() {
        setCurrentNoticeIndex(prevIndex => (prevIndex === 0 ? totalNotices - 1 : prevIndex - 1))
    }
    
    function handleNextNotice() {
        setCurrentNoticeIndex(prevIndex => (prevIndex === totalNotices - 1 ? 0 : prevIndex + 1))
    }
    
    useEffect(() => {
        if (totalNotices > 1) {
            const interval = setInterval(() => {
                setCurrentNoticeIndex(prevIndex => (prevIndex === totalNotices - 1 ? 0 : prevIndex + 1))
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [ totalNotices ])
    
    const currentNotice = noticesArray[currentNoticeIndex]
    
    // Se não houver notices
    if (!noticesArray || noticesArray.length === 0) {
        return (
            <div className="relative my-6 rounded-md border-2 border-yellow-400 bg-yellow-50 px-6 py-2.5 opacity-50 select-none sm:px-3.5">
                <div className="mx-auto flex max-w-max">
                    <div className="flex-shrink-0">
                        <FaExclamationTriangle aria-hidden="true" className="size-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">There are no notices to display</p>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div
            aria-live="polite"
            aria-label="Important notices"
            aria-describedby="notice-description"
            className="relative my-6 rounded-md border-2 border-yellow-400 bg-yellow-50 px-6 py-2.5 sm:px-3.5">
            <div className="mx-auto flex max-w-max items-center justify-center">
                { totalNotices > 1 && (
                    <Button
                        type="button"
                        onClick={ handlePrevNotice }
                        aria-label="Show previous notice"
                        className="mr-4 text-yellow-600 hover:text-yellow-800">
                        <FaChevronLeft className="size-5" aria-hidden="true" />
                    </Button>
                ) }
                
                <details
                    aria-roledescription="slide"
                    aria-label={ `Notice ${ currentNoticeIndex + 1 } of ${ totalNotices }` }
                    className="flex flex-shrink-0">
                    {/* Ícone de aviso */ }
                    <FaExclamationTriangle aria-hidden="true" className="size-5 text-yellow-400" />
                    <div className="ml-3">
                        <p id="notice-description" className="text-sm text-yellow-700">
                            { currentNotice.message }
                        </p>
                    </div>
                </details>
                
                { totalNotices > 1 && (
                    <Button
                        type="button"
                        onClick={ handleNextNotice }
                        aria-label="Show next notice"
                        className="ml-4 text-yellow-600 hover:text-yellow-800">
                        <FaChevronRight className="size-5" aria-hidden="true" />
                    </Button>
                ) }
            </div>
        </div>
    )
}
