"use client"

import { Notification }                      from "@/@types/user"
import RegularButton                         from "@/components/shared/regular-button"
import Link                                  from "next/link"
import { useLayoutEffect, useRef, useState } from "react"
import { LuMail, LuMailOpen }                from "react-icons/lu"

interface DashboardNotificationTableProps {
    notifications: Notification[]
}

export default function DashboardNotificationTable({ notifications }: Readonly<DashboardNotificationTableProps>) {
    const checkbox = useRef<HTMLInputElement>(null)
    const [ checked, setChecked ] = useState(false)
    const [ indeterminate, setIndeterminate ] = useState(false)
    const [ selectedNotifications, setSelectedNotifications ] = useState<Notification[]>([])
    
    useLayoutEffect(() => {
        const isIndeterminate = selectedNotifications.length > 0 && selectedNotifications.length < notifications.length
        setChecked(selectedNotifications.length === notifications.length)
        setIndeterminate(isIndeterminate)
        if (checkbox.current) checkbox.current.indeterminate = isIndeterminate
    }, [ notifications.length, selectedNotifications ])
    
    function toggleAll() {
        setSelectedNotifications(checked || indeterminate ? [] : notifications)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }
    
    // TODO: IMPLEMENT DELETE FUNCTIONALITY
    
    // TODO: IMPLEMENT BULK STATUS FUNCTIONALITY
    
    // TODO: IMPLEMENT READ/UNREAD FUNCTIONALITY FOR SINGLE NOTIFICATION
    
    
    return (
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="relative">
                    { selectedNotifications.length > 0 && (
                        <div className="absolute top-0 left-14 flex h-12 items-center space-x-3 bg-white sm:left-12">
                            <RegularButton className="text-shadow-900 border border-stone-300 bg-white px-2 py-1 text-sm hover:bg-stone-100 active:bg-stone-200 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-white">
                                Bulk status
                            </RegularButton>
                            <RegularButton className="text-shadow-900 border border-stone-300 bg-white px-2 py-1 text-sm hover:bg-stone-100 active:bg-stone-200 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-white">
                                Delete selected
                            </RegularButton>
                        </div>
                    ) }
                    <table className="min-w-full table-fixed divide-y divide-stone-300">
                        <thead>
                            <tr>
                                <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                    <input
                                        type="checkbox"
                                        className="text-marigold-600 focus:ring-marigold-600 absolute top-1/2 left-4 -mt-2 h-4 w-4 rounded border-stone-300"
                                        ref={ checkbox }
                                        checked={ checked }
                                        onChange={ toggleAll }
                                    />
                                </th>
                                <th
                                    scope="col"
                                    className="text-shadow-900 min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold">
                                    Title
                                </th>
                                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                                    Message
                                </th>
                                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                                    Type
                                </th>
                                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                                    Sent Date
                                </th>
                                <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-3">
                                    <span className="sr-only">Status</span>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-stone-200 bg-white">
                            { notifications.map(notification => (
                                <tr
                                    key={ notification.id }
                                    data-selected={ selectedNotifications.includes(notification) }
                                    className="data-[selected=true]:bg-stone-100">
                                    <td className="relative px-7 sm:w-12 sm:px-6">
                                        { selectedNotifications.includes(notification) && (
                                            <div className="bg-marigold-600 absolute inset-y-0 left-0 w-0.5" />
                                        ) }
                                        <input
                                            type="checkbox"
                                            className="text-marigold-600 focus:ring-marigold-600 absolute top-1/2 left-4 -mt-2 h-4 w-4 rounded border-stone-300"
                                            value={ notification.id }
                                            checked={ selectedNotifications.includes(notification) }
                                            onChange={ e =>
                                                setSelectedNotifications(
                                                    e.target.checked
                                                    ? [ ...selectedNotifications, notification ]
                                                    : selectedNotifications.filter(p => p !== notification),
                                                )
                                            }
                                        />
                                    </td>
                                    <td
                                        data-selected={ selectedNotifications.includes(notification) }
                                        data-read={ notification.isRead }
                                        className="data-[selected=true]:text-marigold-600 text-shadow-900 py-4 pr-3 text-sm whitespace-nowrap data-[read=false]:font-medium">
                                        <div className="inline-flex items-center gap-x-2">
                                            { notification.isRead ? (
                                                <LuMailOpen aria-hidden="true" className="size-4" />
                                            ) : (
                                                  <LuMail aria-hidden="true" className="size-4" />
                                              ) }{ " " }
                                            { notification.title }
                                        </div>
                                    </td>
                                    <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                        { notification.message }
                                    </td>
                                    <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap capitalize">
                                        { notification.type.toLowerCase() }
                                    </td>
                                    <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                        { new Date(notification.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }) }
                                    </td>
                                    <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                                        <Link href="#" className="text-marigold-600 hover:text-marigold-900">
                                            { notification.isRead ? "Unread" : "Read" }
                                            <span className="sr-only">, { notification.title }</span>
                                        </Link>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
