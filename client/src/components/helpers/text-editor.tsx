import ToolbarEditor                            from "@/components/helpers/toolbar-editor"
import tw                                       from "@/utils/tw"
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
    content?: string
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
                              emptyEditorClass: tw`before:text-shadow-300 relative before:pointer-events-none before:float-left before:h-0 before:content-[attr(data-placeholder)]`,
                          }),
    TextAlign.configure({
                            types: [ "heading", "paragraph" ],
                            defaultAlignment: "left",
                        }),
    Underline,
    ImageResize.configure({
                              allowBase64: true,
                              HTMLAttributes: {
                                  class: "object-cover w-full h-auto",
                              },
                          }),
    Youtube.configure({
                          inline: true,
                          controls: false,
                          nocookie: true,
                          width: 470,
                          height: 320,
                      }),
]

export default function TextEditor({ content, onUpdate }: Readonly<TextEditorProps>) {
    const editor = useEditor({
                                 extensions: [ ...configuredExtensions ],
                                 editorProps: {
                                     attributes: {
                                         spellcheck: "false",
                                         class: tw`prose prose-sm sm:prose-base text-shadow-900 dark:text-shadow-50 block max-h-96 min-h-96 !max-w-none overflow-auto focus:outline-none`,
                                     },
                                 },
                                 content,
                                 onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
                                 enableContentCheck: true,
                                 onContentError({ error }) {
                                     console.error(error)
                                 },
                                 immediatelyRender: false,
                             })
    
    return (
        <div className="grid w-full gap-4 divide-y divide-stone-200 rounded-md border border-stone-200 bg-transparent p-4 ring shadow-sm ring-transparent transition-all duration-300 ease-in outline-none hover:border-stone-800 hover:ring-stone-300 focus:border-stone-800 focus:ring-stone-300 focus:outline-none">
            <ToolbarEditor editor={ editor } />
            <EditorContent style={ { whiteSpace: "pre-line" } } editor={ editor } />
        </div>
    )
}
