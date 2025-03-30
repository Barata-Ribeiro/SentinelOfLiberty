"use client"

import { User }                                                   from "@/@types/user"
import { Button, Menu, MenuButton, MenuItem, MenuItems }          from "@headlessui/react"
import { useSession }                                             from "next-auth/react"
import Link                                                       from "next/link"
import { LuCircleSlash2, LuEllipsisVertical, LuPencil, LuTrash2 } from "react-icons/lu"

export default function ActionsMenu({ user }: Readonly<{ user: User }>) {
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
                    {/*TODO: Add action to ban/unban user*/ }
                    <Button className="group flex w-full cursor-pointer items-center px-4 py-2 text-sm text-red-600 data-focus:bg-stone-100 data-focus:text-red-800 data-focus:outline-hidden data-hover:text-red-700">
                        <LuCircleSlash2 aria-hidden="true" className="mr-3 size-4 text-inherit" />
                        Ban/Unban
                    </Button>
                </MenuItem>
                <MenuItem>
                    {/*TODO: Add action to delete user*/ }
                    <Button className="group flex w-full cursor-pointer items-center px-4 py-2 text-sm text-red-600 data-focus:bg-stone-100 data-focus:text-red-800 data-focus:outline-hidden data-hover:text-red-700">
                        <LuTrash2 aria-hidden="true" className="mr-3 size-4 text-inherit" />
                        Delete
                    </Button>
                </MenuItem>
            </MenuItems>
        </Menu>
    )
}
