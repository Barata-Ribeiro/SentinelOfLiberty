"use client"

import { Comment }             from "@/@types/comments"
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
        <div data-hasDepth={ depth > 0 }
             className="group data-hasDepth:ml-6 data-hasDepth:border-l-2 data-hasDepth:pl-4">
            <div className="flex items-start gap-2">
                <div className="flex-1">
                    <div className="flex items-center gap-x-2 text-sm">
                        <span className="font-medium">{ comment.user.username }</span>
                        <time dateTime={ String(comment.createdAt) } className="text-shadow-500">
                            { new Date(comment.createdAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            }) }
                        </time>
                    </div>
                    <p className="text-shadow-900 mt-1">{ comment.content }</p>
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
