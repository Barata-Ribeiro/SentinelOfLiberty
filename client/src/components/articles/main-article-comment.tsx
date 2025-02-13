"use client"

import { Comment }             from "@/@types/comments"
import { formatCommentDate }   from "@/utils/functions"
import { Button }              from "@headlessui/react"
import { useEffect, useState } from "react"

interface MainArticleCommentProps {
    comment: Comment
    depth?: number
}

const MAX_VISIBLE_DEPTH = 2 as const

export default function MainArticleComment({ comment, depth = 0 }: Readonly<MainArticleCommentProps>) {
    const [ isExpanded, setIsExpanded ] = useState(true)
    const hasChildren = comment.children?.length > 0
    
    useEffect(() => setIsExpanded(depth < MAX_VISIBLE_DEPTH), [ depth ])
    
    return (
        <div
            data-hasdepth={ depth > 0 }
            className="group data-[hasdepth=true]:ml-6 data-[hasdepth=true]:border-l-2 data-[hasdepth=true]:pl-4">
            <div className="flex items-start max-w-3xl gap-2 rounded-md border border-stone-200 p-4">
                <div className="flex-1">
                    <div className="flex flex-col gap-2 text-sm sm:flex-row">
                        <span className="font-medium">{ comment.user.username }</span>
                        <div className="flex flex-col gap-2 divide-stone-200 max-sm:divide-y sm:flex-row sm:divide-x">
                            <time
                                dateTime={ String(comment.createdAt) }
                                className="text-shadow-500 block pr-0 pb-2 text-xs sm:pr-2 sm:pb-0">
                                { new Date(comment.createdAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }) }
                            </time>

                            <p className="text-shadow-300 block text-xs">
                                { formatCommentDate(new Date(comment.createdAt).toISOString()) }
                            </p>
                        </div>
                    </div>

                    <p className="text-shadow-900 prose prose-sm mt-2">{ comment.content }</p>
                </div>
                
                { hasChildren && depth > 0 && (
                    <Button
                        type="button"
                        onClick={ () => setIsExpanded(!isExpanded) }
                        className="text-marigold-600 hover:text-marigold-800 rounded px-2 py-1 text-sm">
                        { isExpanded ? "Collapse" : `Expand (${ comment.childrenCount })` }
                    </Button>
                ) }
            </div>
            
            { isExpanded && hasChildren && (
                <div className="mt-2 space-y-4">
                    { comment.children.map(child => (
                        <MainArticleComment key={ child.id } comment={ child } depth={ depth + 1 } />
                    )) }
                </div>
            ) }
        </div>
    )
}
