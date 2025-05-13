"use client"

import { Button } from "@headlessui/react"
import { Editor } from "@tiptap/react"
import { useCallback } from "react"
import {
    LuAlignCenter,
    LuAlignLeft,
    LuAlignRight,
    LuBold,
    LuHeading2,
    LuHeading3,
    LuHeading4,
    LuImage,
    LuItalic,
    LuLink,
    LuRedo,
    LuStrikethrough,
    LuUnderline,
    LuUndo,
    LuVideo,
} from "react-icons/lu"

export default function ToolbarEditor({ editor }: Readonly<{ editor: Editor | null }>) {
    const addImage = useCallback(() => {
        const url = window.prompt("Enter the URL of the image:")
        if (!url) return

        const altTitle = window.prompt("Enter the description of the image:") ?? ""

        editor?.chain().focus().setImage({ src: url, alt: altTitle, title: altTitle }).run()
    }, [editor])

    const toggleLink = useCallback(() => {
        if (editor?.isActive("link")) {
            editor.commands.unsetLink()
        } else {
            const url = window.prompt("Enter the URL of the link:")
            const rel = "noopener noreferrer nofollow"

            if (url) {
                editor?.chain().focus().toggleLink({ href: url, rel, target: "_blank" }).run()
            }
        }
    }, [editor])

    const addYoutube = useCallback(() => {
        const url = window.prompt("Enter the URL of the YouTube video")

        if (url) {
            editor?.commands.setYoutubeVideo({ src: url, width: 470, height: 320 })
        }
    }, [editor])

    if (!editor) return null

    const editorOptions = [
        {
            name: "Heading Level 2",
            icon: LuHeading2,
            action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor?.isActive("heading", { level: 2 }),
        },
        {
            name: "Heading Level 3",
            icon: LuHeading3,
            action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor?.isActive("heading", { level: 3 }),
        },
        {
            name: "Heading Level 4",
            icon: LuHeading4,
            action: () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: editor?.isActive("heading", { level: 4 }),
        },
        {
            name: "Bold",
            icon: LuBold,
            action: () => editor?.chain().focus().toggleBold().run(),
            isActive: editor?.isActive("bold"),
        },
        {
            name: "Italic",
            icon: LuItalic,
            action: () => editor?.chain().focus().toggleItalic().run(),
            isActive: editor?.isActive("italic"),
        },
        {
            name: "Underline",
            icon: LuUnderline,
            action: () => editor?.chain().focus().toggleUnderline().run(),
            isActive: editor?.isActive("underline"),
        },
        {
            name: "Strike",
            icon: LuStrikethrough,
            action: () => editor?.chain().focus().toggleStrike().run(),
            isActive: editor?.isActive("strike"),
        },
        {
            name: "Align Left",
            icon: LuAlignLeft,
            action: () => editor?.chain().focus().setTextAlign("left").run(),
            isActive: editor?.isActive({ textAlign: "left" }),
        },
        {
            name: "Align Center",
            icon: LuAlignCenter,
            action: () => editor?.chain().focus().setTextAlign("center").run(),
            isActive: editor?.isActive({ textAlign: "center" }),
        },
        {
            name: "Align Right",
            icon: LuAlignRight,
            action: () => editor?.chain().focus().setTextAlign("right").run(),
            isActive: editor?.isActive({ textAlign: "right" }),
        },
        {
            name: "Image",
            icon: LuImage,
            action: addImage,
            isActive: null,
        },
        {
            name: "Video",
            icon: LuVideo,
            action: addYoutube,
            isActive: null,
        },
        {
            name: "Link",
            icon: LuLink,
            action: toggleLink,
            isActive: null,
        },
        {
            name: "Undo",
            icon: LuUndo,
            action: () => editor?.chain().focus().undo().run(),
            isActive: editor.isActive("undo"),
        },
        {
            name: "Redo",
            icon: LuRedo,
            action: () => editor?.chain().focus().redo().run(),
            isActive: editor.isActive("redo"),
        },
    ]

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
            {editorOptions.map(({ name, icon: Icon, action, isActive }, index) => (
                <Button
                    key={String(Icon) + index}
                    data-active={isActive}
                    title={`Activate ${name}`}
                    aria-label={`Activate ${name}`}
                    className="from-marigold-500 to-marigold-600 border-marigold-500 text-shadow-50 inline-grid cursor-pointer place-items-center rounded-md border bg-gradient-to-tr p-2 text-center align-middle font-sans text-sm leading-none font-medium transition-all duration-300 ease-in select-none hover:brightness-110 focus:shadow-none"
                    onClick={action}>
                    <Icon aria-hidden="true" className="size-4 stroke-2" />
                </Button>
            ))}
        </div>
    )
}
