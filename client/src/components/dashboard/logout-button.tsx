"use client"

import deleteAuthLogout                                             from "@/actions/auth/delete-auth-logout"
import Spinner                                                      from "@/components/helpers/spinner"
import RegularButton                                                from "@/components/shared/regular-button"
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useSession }                                               from "next-auth/react"
import { redirect }                                                 from "next/navigation"
import { useState, useTransition }                                  from "react"
import { FaExclamationTriangle }                                    from "react-icons/fa"
import { FaArrowRightFromBracket }                                  from "react-icons/fa6"

export default function LogoutButton() {
    const { data: session, status } = useSession()
    const [ open, setOpen ] = useState(false)
    const [ isPending, startTransition ] = useTransition()
    
    function handleLogout() {
        startTransition(async () => {
            const logoutState = await deleteAuthLogout()
            if (!logoutState.ok) {
                setOpen(false)
                redirect("/auth/login")
            }
            
            startTransition(() => {
                setOpen(false)
                redirect("/auth/login")
            })
        })
    }
    
    return (
        <>
            <Button
                type="button"
                className="text-shadow-900 inline-flex cursor-pointer items-center gap-x-2 rounded-md px-3.5 py-2.5 font-semibold hover:bg-stone-50 active:bg-stone-100 disabled:pointer-events-none disabled:opacity-50 disabled:hover:bg-white"
                aria-label="Logout"
                title="Logout"
                onClick={ () => setOpen(true) }
                disabled={ !session || status !== "authenticated" }>
                Logout <FaArrowRightFromBracket aria-hidden="true" className="size-4 text-inherit" />
            </Button>

            <Dialog open={ open } onClose={ setOpen } className="relative z-10">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-stone-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
                />

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel
                            transition
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                        <FaExclamationTriangle aria-hidden="true" className="size-5 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className="text-shadow-900 text-base font-semibold">
                                            Logout
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className="text-shadow-500 text-sm">Are you sure you want to logout?</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-stone-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <Button
                                    type="button"
                                    disabled={ isPending }
                                    aria-label="Yes, logout"
                                    title="Yes, logout"
                                    onClick={ handleLogout }
                                    className="text-shadow-50 inline-flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold shadow-xs transition duration-200 select-none hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:bg-red-800 disabled:pointer-events-none disabled:opacity-50 sm:ml-3 sm:w-auto">
                                    { isPending ? (
                                        <>
                                            <Spinner /> Loading...
                                        </>
                                    ) : (
                                          "Yes, Logout"
                                      ) }
                                </Button>
                                <RegularButton
                                    type="button"
                                    disabled={ isPending }
                                    data-autofocus
                                    aria-label="Cancel logout"
                                    title="Cancel logout"
                                    onClick={ () => setOpen(false) }
                                    className="text-shadow-900 border border-stone-300 bg-white transition duration-200 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-stone-200 disabled:pointer-events-none disabled:opacity-50">
                                    Cancel
                                </RegularButton>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
