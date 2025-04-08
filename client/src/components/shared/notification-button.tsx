import { LatestNotifications }                                   from "@/@types/user"
import getLatestNotifications                                    from "@/actions/notifications/get-latest-notifications"
import { useWebsocket }                                          from "@/providers/websocket-provider"
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useSession }                                            from "next-auth/react"
import Link                                                      from "next/link"
import { useEffect, useRef, useState }                           from "react"
import { FaRegBell, FaX }                                        from "react-icons/fa6"
import { HiBellAlert }                                           from "react-icons/hi2"

function NotificationPingIcon({ total }: Readonly<{ total: number }>) {
    if (total === 0) return null
    
    return (
        <>
            <span
                aria-hidden="true"
                className="absolute top-[14%] right-[14%] z-[1] grid min-h-[12px] min-w-[12px] translate-x-2/4 -translate-y-2/4 place-items-center rounded-full bg-red-500 px-1 py-0.5 text-xs leading-none font-medium text-red-50 content-['']">
                { total }
            </span>
            <span
                aria-hidden="true"
                className="absolute top-[14%] right-[14%] z-0 grid min-h-[12px] min-w-[12px] translate-x-2/4 -translate-y-2/4 animate-ping place-items-center rounded-full bg-red-500 px-1 py-0.5 text-xs leading-none font-medium content-['']">
                { total }
            </span>
        </>
    )
}

export default function NotificationButton() {
    const [ isOpen, setIsOpen ] = useState(false)
    const [ unreadNotifications, setUnreadNotifications ] = useState(0)
    const { notifications: websocketNotifications } = useWebsocket()
    const { data: session, status } = useSession()
    
    const prevNotificationsLength = useRef(websocketNotifications.length)
    const hasMounted = useRef(false)
    
    useEffect(() => {
        getLatestNotifications()
            .then(result => {
                if (!result.ok || !result.response) {
                    console.error("Error fetching notifications:", result.error)
                    return
                }
                
                const latestNotifications = result.response.data as LatestNotifications
                const unreadCount = latestNotifications.totalUnread
                setUnreadNotifications(unreadCount)
            })
            .catch(error => console.error("Error fetching notifications:", error))
    }, [])
    
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true
            prevNotificationsLength.current = websocketNotifications.length
            return
        }
        
        if (websocketNotifications.length > prevNotificationsLength.current) {
            setIsOpen(true)
        }
        
        prevNotificationsLength.current = websocketNotifications.length
    }, [ websocketNotifications.length ])
    
    const totalUnreadNotifications =
        unreadNotifications + websocketNotifications.filter(notification => !notification.isRead).length
    
    const notificationsLabel = `Notifications${
        totalUnreadNotifications > 0 ? `, ${ totalUnreadNotifications } unread` : ""
    }`
    return (
        <>
            <div className="relative inline-flex items-center">
                <Link
                    href={ `/dashboard/${ session?.user.username }/notifications` }
                    aria-disabled={ status !== "authenticated" }
                    aria-label={ notificationsLabel }
                    title={ notificationsLabel }
                    className="inline-grid min-h-[36px] min-w-[36px] place-items-center rounded-full border border-stone-200 bg-stone-200 text-center align-middle font-sans text-sm leading-none font-medium text-stone-900 transition-all duration-300 ease-in select-none hover:bg-stone-100 disabled:pointer-events-none disabled:opacity-60"
                    role="button">
                    <FaRegBell aria-hidden="true" className="size-4 stroke-2" />
                    { totalUnreadNotifications > 0 && (
                        <span className="sr-only">{ totalUnreadNotifications } unread notifications</span>
                    ) }
                </Link>

                <NotificationPingIcon total={ totalUnreadNotifications } />
            </div>

            <Dialog
                open={ isOpen }
                onClose={ () => setIsOpen(false) }
                autoFocus
                transition
                className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0">
                <div className="fixed right-0 bottom-4 flex w-screen items-center justify-end p-4">
                    <DialogPanel className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white p-4 shadow-lg ring-1 ring-stone-200">
                        <article className="flex items-start">
                            <div className="flex-shrink-0">
                                <HiBellAlert aria-hidden="true" className="text-marigold-400 size-6" />
                            </div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <DialogTitle as="h2" className="text-shadow-900 text-md font-medium">
                                    New Notification!{ " " }
                                    { totalUnreadNotifications > 1 ? `(${ totalUnreadNotifications })` : "" }
                                </DialogTitle>
                                <Description className="text-shadow-600 mt-1 text-sm">
                                    You just received a new notification, go check it out{ " " }
                                    <Link
                                        href={ `/dashboard/${ session?.user.username }/notifications` }
                                        aria-label="View notifications"
                                        title="View notifications"
                                        className="hover:text-shadow-700 font-semibold hover:underline">
                                        here
                                    </Link>
                                    .
                                </Description>
                            </div>
                            <div className="ml-4 flex flex-shrink-0">
                                <Button
                                    type="button"
                                    onClick={ () => setIsOpen(false) }
                                    className="text-shadow-400 hover:text-shadow-500 focus:ring-marigold-500 inline-flex cursor-pointer rounded-md bg-white transition duration-300 ease-in focus:ring-2 focus:ring-offset-2 focus:outline-none">
                                    <span className="sr-only">Close</span>
                                    <FaX aria-hidden="true" className="size-4" />
                                </Button>
                            </div>
                        </article>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
