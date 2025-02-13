"use client"

import { State }                            from "@/@types/application"
import { Comment }                          from "@/@types/comments"
import MainArticleComment                   from "@/components/articles/main-article-comment"
import { use, useEffect, useRef, useState } from "react"

interface MainArticleCommentTreeProps {
    commentTreePromise: Promise<State>
}

export default function MainArticleCommentTree({ commentTreePromise }: MainArticleCommentTreeProps) {
    const [ shouldLoad, setShouldLoad ] = useState(false)
    const regionRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([ entry ]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true)
                    observer.disconnect()
                }
            },
            { rootMargin: "100px" },
        )
        if (regionRef.current) observer.observe(regionRef.current)
        return () => observer.disconnect()
    }, [])
    
    let comments: Comment[] = []
    
    if (shouldLoad) {
        const state = use(commentTreePromise)
        if (state && state.ok && state.response?.data) {
            comments = (state.response.data as Comment[])
                .toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
    }
    
    return (
        <div id="comments" className="space-y-4 align-middle mb-8">
            { comments.map(comment => (
                <MainArticleComment key={ comment.id } comment={ comment } depth={ 0 } />
            )) }
            
            { comments.length <= 0 && <p className="text-center text-shadow-500">No comments yet.</p> }
            { comments.length === 0 && <div ref={ regionRef } className="h-1" /> }
        </div>
    )
}
