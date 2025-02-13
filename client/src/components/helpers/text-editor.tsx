import ToolbarEditor                            from "@/components/helpers/toolbar-editor"
import tw                                       from "@/utils/tw"
import Image                                    from "@tiptap/extension-image"
import { Link }                                 from "@tiptap/extension-link"
import { Placeholder }                          from "@tiptap/extension-placeholder"
import { TextAlign }                            from "@tiptap/extension-text-align"
import { Typography }                           from "@tiptap/extension-typography"
import { Underline }                            from "@tiptap/extension-underline"
import { Youtube }                              from "@tiptap/extension-youtube"
import { EditorContent, Extensions, useEditor } from "@tiptap/react"
import { StarterKit }                           from "@tiptap/starter-kit"
import { Dispatch, SetStateAction }             from "react"
import ImageResize                              from "tiptap-extension-resize-image"

export interface TextEditorProps {
    onUpdate: Dispatch<SetStateAction<string>>
}

export const configuredExtensions: Extensions = [
    StarterKit.configure({
                             heading: {
                                 levels: [ 2, 3, 4 ],
                             },
                             orderedList: {
                                 HTMLAttributes: {
                                     class: "list-decimal ml-3",
                                 },
                             },
                             bulletList: {
                                 HTMLAttributes: {
                                     class: "list-disc ml-3",
                                 },
                             },
                         }),
    Typography,
    Link.configure({
                       protocols: [ "mailto", "https" ],
                       HTMLAttributes: {
                           class: tw`text-marigold-500 hover:text-marigold-600 active:text-marigold-700 font-heading cursor-pointer underline`,
                       },
                       autolink: false,
                       shouldAutoLink: url => url.startsWith("https://"),
                   }),
    Placeholder.configure({
                              placeholder: "Start writing your article...",
                              emptyEditorClass: tw`before:text-shadow-400 relative before:pointer-events-none before:float-left before:h-0 before:content-[attr(data-placeholder)]`,
                          }),
    TextAlign.configure({
                            types: [ "heading", "paragraph" ],
                            defaultAlignment: "left",
                        }),
    Underline,
    Image,
    ImageResize,
    Youtube.configure({
                          inline: true,
                          controls: false,
                          nocookie: true,
                          width: 470,
                          height: 320,
                      }),
]

export default function TextEditor({ onUpdate }: Readonly<TextEditorProps>) {
    const editor = useEditor({
                                 extensions: [ ...configuredExtensions ],
                                 editorProps: {
                                     attributes: {
                                         spellcheck: "false",
                                         class: tw`prose prose-sm sm:prose-base block max-h-96 min-h-96 !max-w-none overflow-auto focus:outline-none`,
                                     },
                                 },
                                 onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
                                 enableContentCheck: true,
                                 onContentError({ error }) {
                                     console.error(error)
                                 },
                                 immediatelyRender: false,
                             })
    
    return (
        <div className="grid w-full gap-4 divide-y divide-stone-200 rounded-md border border-stone-200 p-4 shadow-xs">
            <ToolbarEditor editor={ editor } />
            <EditorContent style={ { whiteSpace: "pre-line" } } editor={ editor } />
        </div>
    )
}
