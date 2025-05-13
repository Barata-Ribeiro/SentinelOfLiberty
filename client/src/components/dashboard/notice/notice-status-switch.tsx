"use client"

import { Notice } from "@/@types/notices"
import patchStatusNotice from "@/actions/notices/patch-status-notice"
import { Switch } from "@headlessui/react"
import { useState, useTransition } from "react"
import { LuCheck, LuX } from "react-icons/lu"

interface NoticeStatusSwitchProps {
    isActive: boolean
}

function SwitchSpinner() {
    return (
        <svg className="size-3 animate-spin text-stone-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    )
}

export default function NoticeStatusSwitch({ isActive }: Readonly<NoticeStatusSwitchProps>) {
    const [enabled, setEnabled] = useState(isActive)
    const [isPending, startTransition] = useTransition()

    function handleStatusToggle() {
        startTransition(async () => {
            const noticeState = await patchStatusNotice({ id: 1, isActive: !enabled })

            if (!noticeState.ok) {
                window.alert("Failed to update notice status.")
            }

            startTransition(() => {
                const notice = noticeState.response?.data as Notice
                setEnabled(notice.isActive)
            })
        })
    }

    return (
        <Switch
            disabled={isPending}
            checked={enabled}
            onChange={handleStatusToggle}
            title={enabled ? "Deactivate notice" : "Activate notice"}
            className="group focus:ring-marigold-600 data-checked:bg-marigold-600 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-stone-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
            <span className="sr-only">{isPending ? "Loading" : "Use setting"}</span>
            <span className="pointer-events-none relative inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5">
                {isPending ? (
                    <span className="absolute inset-0 flex size-full items-center justify-center">
                        <SwitchSpinner />
                    </span>
                ) : (
                    <>
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 flex size-full items-center justify-center transition-opacity duration-200 ease-in group-data-checked:opacity-0 group-data-checked:duration-100 group-data-checked:ease-out">
                            <LuX className="size-3 text-stone-400" />
                        </span>
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 flex size-full items-center justify-center opacity-0 transition-opacity duration-100 ease-out group-data-checked:opacity-100 group-data-checked:duration-200 group-data-checked:ease-in">
                            <LuCheck className="text-marigold-600 size-3" />
                        </span>
                    </>
                )}
            </span>
        </Switch>
    )
}
