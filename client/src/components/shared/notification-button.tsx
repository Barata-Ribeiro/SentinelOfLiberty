import { useWebsocket }                                          from "@/providers/websocket-provider"
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useSession }                                            from "next-auth/react"
import {
    DialogBody,
    DialogContent,
}                                                                from "next/dist/client/components/react-dev-overlay/internal/components/Dialog"
import Link                                                      from "next/link"
import { useEffect, useRef, useState }                           from "react"
import { FaRegBell, FaX }                                        from "react-icons/fa6"
import { HiBellAlert }                                           from "react-icons/hi2"

function NotificationPingIcon() {
    return (
        <>
            <span
                aria-hidden="true"
                className="absolute top-[14%] right-[14%] z-[1] grid min-h-[12px] min-w-[12px] -translate-y-2/4 translate-x-2/4 place-items-center rounded-full border border-white bg-red-500 px-1 py-1 text-xs leading-none font-medium text-white content-['']"></span>
            <span
                aria-hidden="true"
                className="absolute top-[14%] right-[14%] z-0 grid min-h-[12px] min-w-[12px] -translate-y-2/4 translate-x-2/4 animate-ping place-items-center rounded-full border bg-red-500 px-1 py-1 text-xs leading-none font-medium content-['']"></span>
        </>
    )
}

export default function NotificationButton() {
    const [ isOpen, setIsOpen ] = useState(false)
    const { notifications } = useWebsocket()
    const { data: session, status } = useSession()
    
    const prevNotificationsLength = useRef(notifications.length)
    const hasMounted = useRef(false)
    
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true
            prevNotificationsLength.current = notifications.length
            return
        }
        
        if (notifications.length > prevNotificationsLength.current) {
            setIsOpen(true)
        }
        
        prevNotificationsLength.current = notifications.length
    }, [ notifications.length ])
    
    return (
        <>
            <Link
                href={ `/dashboard/${ session?.user.username }/notifications` }
                data-disabled={ status !== "authenticated" }
                className="text-shadow-400 hover:text-shadow-500 focus:outline-marigold-900 relative mr-4 shrink-0 rounded-full bg-stone-50 p-1 focus:outline-2 focus:outline-offset-2 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                aria-live="polite"
                aria-atomic="true">
                <span className="sr-only">View notifications</span>
                <FaRegBell aria-hidden="true" className="h-6 w-7" />
                { notifications.length > 0 && <NotificationPingIcon /> }
            </Link>

            <Dialog
                open={ isOpen }
                onClose={ () => setIsOpen(false) }
                autoFocus
                transition
                className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0">
                <div className="fixed right-0 bottom-4 flex w-screen items-center justify-end p-4">
                    <DialogPanel className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white p-4 ring-1 shadow-lg ring-stone-200">
                        <DialogContent className="flex items-start">
                            <div className="flex-shrink-0">
                                <HiBellAlert aria-hidden="true" className="text-marigold-400 size-6" />
                            </div>
                            <DialogBody className="ml-3 w-0 flex-1 pt-0.5">
                                <DialogTitle as="h2" className="text-shadow-900 text-md font-medium">
                                    New Notification! { notifications.length > 1 ? `(${ notifications.length })` : "" }
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
                            </DialogBody>
                            <div className="ml-4 flex flex-shrink-0">
                                <Button
                                    type="button"
                                    onClick={ () => {
                                        setIsOpen(false)
                                    } }
                                    className="text-shadow-400 hover:text-shadow-500 focus:ring-marigold-500 inline-flex rounded-md bg-white focus:ring-2 focus:ring-offset-2 focus:outline-none">
                                    <span className="sr-only">Close</span>
                                    <FaX aria-hidden="true" className="size-4" />
                                </Button>
                            </div>
                        </DialogContent>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}
