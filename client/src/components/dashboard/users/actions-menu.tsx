"use client"

import { User }                                  from "@/@types/user"
import AdminBanButton                            from "@/components/dashboard/users/admin-ban-button"
import AdminDeleteButton                         from "@/components/dashboard/users/admin-delete-button"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { useSession }                            from "next-auth/react"
import Link                                      from "next/link"
import { LuEllipsisVertical, LuPencil }          from "react-icons/lu"

interface ActionsMenuProps {
    user: User
}

export default function ActionsMenu({ user }: Readonly<ActionsMenuProps>) {
    const { data: session } = useSession()
    
    return (
        <Menu as="nav" className="inline-block text-left">
            <MenuButton
                className="inline-grid min-h-[38px] min-w-[38px] cursor-pointer place-items-center rounded-md border border-transparent bg-transparent text-center align-middle font-sans text-sm font-medium text-stone-900 shadow-none transition-all duration-300 ease-in select-none hover:border-stone-200 hover:bg-stone-100 hover:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                aria-label="Actions menu">
                <LuEllipsisVertical aria-hidden="true" className="size-4 text-inherit" />
            </MenuButton>

            <MenuItems
                transition
                anchor="bottom end"
                className="z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-stone-200 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                <MenuItem>
                    <Link
                        className="group text-marigold-500 data-hover:text-marigold-600 data-focus:text-marigold-700 flex items-center px-4 py-2 text-sm data-focus:bg-stone-100 data-focus:outline-hidden"
                        aria-label={ `Edit ${ user.username }` }
                        title={ `Edit ${ user.username }` }
                        href={ `/dashboard/${ session?.user.username }/users/${ user.username }/edit` }>
                        <LuPencil aria-hidden="true" className="mr-3 size-4 text-inherit" />
                        Edit
                    </Link>
                </MenuItem>
                <MenuItem>
                    <AdminBanButton username={ user.username } isBanned={ user.role === "BANNED" } />
                </MenuItem>
                <MenuItem>
                    <AdminDeleteButton username={ user.username } />
                </MenuItem>
            </MenuItems>
        </Menu>
    )
}
