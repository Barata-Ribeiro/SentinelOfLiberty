"use client"

import { ProblemDetails }                               from "@/@types/application"
import { Notification }                                 from "@/@types/user"
import deleteNotificationsInBulk                        from "@/actions/notifications/delete-notifications-in-bulk"
import patchChangeNotifStatusById                       from "@/actions/notifications/patch-change-notif-status-by-id"
import patchChangeNotifStatusInBulk                     from "@/actions/notifications/patch-change-notif-status-in-bulk"
import RegularButton                                    from "@/components/shared/regular-button"
import { formatDisplayDate }                            from "@/utils/functions"
import { Button, Input, Transition }                    from "@headlessui/react"
import { RefObject, useLayoutEffect, useRef, useState } from "react"
import { FaCircleExclamation, FaX }                     from "react-icons/fa6"
import { LuMail, LuMailOpen }                           from "react-icons/lu"

interface DashboardNotificationTableProps {
    notifications: Notification[]
}

function TableHeader(
    props: Readonly<{
        ref: RefObject<HTMLInputElement | null>
        checked: boolean
        onChange: () => void
    }>,
) {
    return (
        <thead>
            <tr>
                <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                    <Input
                        type="checkbox"
                        className="text-marigold-600 focus:ring-marigold-600 absolute top-1/2 left-4 -mt-2 h-4 w-4 rounded border-stone-300"
                        ref={ props.ref }
                        checked={ props.checked }
                        onChange={ props.onChange }
                    />
                </th>
                <th scope="col" className="text-shadow-900 min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold">
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
    )
}

export default function DashboardNotificationTable({ notifications }: Readonly<DashboardNotificationTableProps>) {
    const [ originalNotifications, setOriginalNotifications ] = useState<Notification[]>(notifications)
    const checkbox = useRef<HTMLInputElement>(null)
    const [ checked, setChecked ] = useState(false)
    const [ indeterminate, setIndeterminate ] = useState(false)
    const [ selectedNotifications, setSelectedNotifications ] = useState<Notification[]>([])
    const [ show, setShow ] = useState(false)
    const [ error, setError ] = useState<string | null>(null)
    
    useLayoutEffect(() => {
        setOriginalNotifications(notifications)
        const isIndeterminate = selectedNotifications.length > 0 && selectedNotifications.length < notifications.length
        setChecked(selectedNotifications.length === notifications.length)
        setIndeterminate(isIndeterminate)
        if (checkbox.current) checkbox.current.indeterminate = isIndeterminate
    }, [ notifications, selectedNotifications ])
    
    function toggleAll() {
        setSelectedNotifications(checked || indeterminate ? [] : notifications)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }
    
    async function deleteSelected() {
        if (selectedNotifications.length <= 0) return
        const state = await deleteNotificationsInBulk({ idList: selectedNotifications.map(n => n.id) })
        if (!state.ok) {
            setError((state.error as ProblemDetails).detail)
            setShow(true)
        }
        
        setOriginalNotifications(originalNotifications.filter(n => !selectedNotifications.includes(n)))
    }
    
    async function toggleBulkRead() {
        if (selectedNotifications.length <= 0) return
        const state = await patchChangeNotifStatusInBulk({ idList: selectedNotifications.map(n => n.id), status: true })
        if (!state.ok) {
            setError((state.error as ProblemDetails).detail)
            setShow(true)
        }
        
        const updatedNotifications = state.response?.data as Notification[]
        setOriginalNotifications(originalNotifications.map(o => updatedNotifications.find(n => n.id === o.id) ?? o))
    }
    
    async function toggleRead(notification: Notification) {
        const state = await patchChangeNotifStatusById({ id: notification.id, status: !notification.isRead })
        if (!state.ok) {
            setError((state.error as ProblemDetails).detail)
            setShow(true)
        }
        
        const updatedNotification = state.response?.data as Notification
        setOriginalNotifications(
            originalNotifications.map(n => (n.id === updatedNotification.id ? updatedNotification : n)),
        )
    }
    
    return (
        <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="relative">
                    { selectedNotifications.length > 0 && (
                        <div className="absolute top-0 left-14 flex h-12 items-center space-x-3 bg-white sm:left-12">
                            <RegularButton
                                buttonStyle="ghost"
                                aria-label="Set notifications as read"
                                title="Set notifications as read"
                                onClick={ toggleBulkRead }
                                className="px-2 py-1">
                                Bulk status
                            </RegularButton>

                            <RegularButton
                                buttonStyle="ghost"
                                aria-label="Delete selected"
                                title="Delete selected"
                                className="px-2 py-1"
                                onClick={ deleteSelected }>
                                Delete selected
                            </RegularButton>
                        </div>
                    ) }
                    
                    { notifications.length > 0 && (
                        <table className="min-w-full table-fixed divide-y divide-stone-300">
                            <TableHeader ref={ checkbox } checked={ checked } onChange={ toggleAll } />

                            <tbody className="divide-y divide-stone-200 bg-white">
                                { originalNotifications.map(notification => (
                                    <tr
                                        key={ notification.id }
                                        data-selected={ selectedNotifications.includes(notification) }
                                        data-read={ notification.isRead }
                                        className="data-[read=true]:bg-stone-100 data-[selected=true]:bg-stone-200">
                                        <td className="relative px-7 sm:w-12 sm:px-6">
                                            { selectedNotifications.includes(notification) && (
                                                <div className="bg-marigold-600 absolute inset-y-0 left-0 w-0.5" />
                                            ) }
                                            <Input
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
                                        <td
                                            style={ {
                                                scrollbarWidth: "thin",
                                            } }
                                            className="text-shadow-500 max-w-2xl overflow-x-auto px-3 py-4 text-sm whitespace-nowrap">
                                            { notification.message }
                                        </td>
                                        <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap capitalize">
                                            { notification.type.toLowerCase() }
                                        </td>
                                        <td className="text-shadow-500 px-3 py-4 text-sm whitespace-nowrap">
                                            <time
                                                dateTime={ new Date(notification.createdAt).toISOString() }
                                                aria-label={ `Notification sent on ${ formatDisplayDate(
                                                    String(notification.createdAt)) }` }
                                                title={ `Notification sent on ${ formatDisplayDate(
                                                    String(notification.createdAt)) }` }>
                                                { formatDisplayDate(String(notification.createdAt)) }
                                            </time>
                                        </td>
                                        <td className="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                                            <Button
                                                type="button"
                                                className="text-marigold-600 hover:text-marigold-700 active:text-marigold-800 focus:ring-marigold-500 cursor-pointer focus:ring-offset-2 focus:outline-none"
                                                onClick={ () => toggleRead(notification) }>
                                                { notification.isRead ? "Unread" : "Read" }
                                                <span className="sr-only">, { notification.title }</span>
                                            </Button>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>
                        </table>
                    ) }
                    
                    { notifications.length <= 0 && (
                        <div className="flex h-96 items-center justify-center">
                            <p className="text-shadow-500 text-lg">No notifications available.</p>
                        </div>
                    ) }
                </div>
            </div>
            
            { error && (
                <div
                    aria-live="assertive"
                    className="pointer-events-none fixed right-0 bottom-4 z-50 flex w-full items-end px-4 py-6 sm:items-start sm:p-6">
                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <Transition show={ show }>
                            <div className="ring-opacity-5 pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-red-50 shadow-lg ring-1 ring-red-200 transition data-[closed]:opacity-0 data-[enter]:transform data-[enter]:duration-300 data-[enter]:ease-out data-[closed]:data-[enter]:translate-y-2 data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                                <div className="p-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <FaCircleExclamation aria-hidden="true" className="size-6 text-red-400" />
                                        </div>
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <p className="text-sm font-medium text-red-600">An Error Occurred!</p>
                                            <p className="mt-1 text-sm text-red-950">{ error }</p>
                                        </div>
                                        <div className="ml-4 flex flex-shrink-0">
                                            <Button
                                                type="button"
                                                onClick={ () => setShow(false) }
                                                className="text-shadow-900 hover:text-shadow-700 focus:ring-marigold-500 inline-flex cursor-pointer rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none">
                                                <span className="sr-only">Close</span>
                                                <FaX aria-hidden="true" className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            ) }
        </div>
    )
}
