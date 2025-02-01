"use client"

import { configuredExtensions } from "@/components/helpers/text-editor"
import { generateHTML }         from "@tiptap/core"
import { useMemo }              from "react"

interface MemoizedContentProps {
    json: JSON
}

export default function MemoizedContent({ json }: MemoizedContentProps) {
    return useMemo(() => generateHTML(json, configuredExtensions), [ json ])
}