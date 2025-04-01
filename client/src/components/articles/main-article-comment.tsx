"use client"

import { Comment }                                               from "@/@types/comments"
import CommentDeleteButton
                                                                 from "@/components/articles/comment/comment-delete-button"
import CommentReplyButton
                                                                 from "@/components/articles/comment/comment-reply-button"
import { formatCommentDate, formatDisplayDate }                  from "@/utils/functions"
import { Button, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react"
import { useSession }                                            from "next-auth/react"
import { useEffect, useState }                                   from "react"
import { FaChevronDown, FaCircleCheck }                          from "react-icons/fa6"

interface MainArticleCommentProps {
    comment: Comment
    depth?: number
}

const MAX_VISIBLE_DEPTH = 2

export default function MainArticleComment({ comment, depth = 0 }: Readonly<MainArticleCommentProps>) {
    const [ isExpanded, setIsExpanded ] = useState(true)
    const hasChildren = comment.children?.length > 0
    const { data: session } = useSession()
    
    useEffect(() => setIsExpanded(depth < MAX_VISIBLE_DEPTH), [ depth ])
    
    return (
        <div
            id={ `comment-${ comment.id }` }
            data-hasdepth={ depth > 0 }
            className="group data-[hasdepth=true]:ml-6 data-[hasdepth=true]:border-l-2 data-[hasdepth=true]:pl-4">
            <div className="flex w-full items-start gap-2 rounded-md border border-stone-200 p-4">
                <Disclosure as="details" className="flex-1" open defaultOpen>
                    <DisclosureButton
                        as="summary"
                        className="group flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
                        <div className="inline-flex gap-x-2">
                            <FaChevronDown
                                aria-label="Open/Colapse the comment"
                                className="w-5 cursor-pointer text-stone-400 transition duration-200 ease-out group-data-[open]:rotate-180"
                            />
                            <div className="inline-flex items-center gap-x-1">
                                <span className="font-medium">{ comment.user.username }</span>
                                { comment.user.isVerified && (
                                    <span className="text-marigold-500" title="Verified author">
                                        <FaCircleCheck aria-hidden="true" className="size-4" />
                                    </span>
                                ) }
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 divide-stone-200 max-sm:divide-y sm:flex-row sm:divide-x">
                            <time
                                dateTime={ new Date(comment.createdAt).toISOString() }
                                aria-label={ `Comment created at ${ formatDisplayDate(String(comment.createdAt),
                                                                                      "date") }` }
                                title={ `Comment created at ${ formatDisplayDate(String(comment.createdAt), "date") }` }
                                className="text-shadow-500 block pr-0 pb-2 text-xs sm:pr-2 sm:pb-0">
                                { formatDisplayDate(String(comment.createdAt), "date") }
                            </time>

                            <p className="text-shadow-300 block text-xs">
                                { formatCommentDate(new Date(comment.createdAt).toISOString()) }
                            </p>
                        </div>
                    </DisclosureButton>

                    <DisclosurePanel
                        transition
                        className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0">
                        <p className="text-shadow-900 prose prose-sm mt-2">{ comment.content }</p>
                        
                        { session && (
                            <div className="mt-2 inline-flex items-center gap-x-2">
                                <CommentReplyButton session={ session } comment={ comment } />

                                <CommentDeleteButton session={ session } comment={ comment } />
                            </div>
                        ) }
                    </DisclosurePanel>
                </Disclosure>
                
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
