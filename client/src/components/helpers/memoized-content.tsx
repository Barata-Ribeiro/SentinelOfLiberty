"use client"

import { configuredExtensions }     from "@/components/helpers/text-editor"
import { generateJSON }             from "@tiptap/html"
import { EditorContent, useEditor } from "@tiptap/react"
import { useMemo }                  from "react"

interface MemoizedContentProps {
    html: string
}

export default function MemoizedContent({ html }: MemoizedContentProps) {
    const memoized = useMemo(() => generateJSON(html, [ ...configuredExtensions ]), [ html ])
    const editor = useEditor({
                                 editable: false,
                                 content: memoized,
                                 extensions: [ ...configuredExtensions ],
                                 immediatelyRender: false,
                             })
    
    if (!editor) return null
    
    return <EditorContent style={ { whiteSpace: "pre-line" } } editor={ editor } />
}
