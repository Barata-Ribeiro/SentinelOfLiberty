"use client"

import { configuredExtensions } from "@/components/helpers/text-editor"
import tw from "@/utils/tw"
import { EditorContent, useEditor } from "@tiptap/react"
import { useMemo } from "react"

interface MemoizedContentProps {
    html: string
}

export default function MemoizedContent({ html }: Readonly<MemoizedContentProps>) {
    const editor = useEditor({
        editable: false,
        content: useMemo(() => html, [html]),
        extensions: [...configuredExtensions],
        editorProps: {
            attributes: {
                class: tw`prose prose-sm sm:prose-base prose-stone text-shadow-900 dark:prose-invert block !max-w-none`,
            },
        },
        immediatelyRender: false,
    })

    if (!editor) return null

    return <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
}
