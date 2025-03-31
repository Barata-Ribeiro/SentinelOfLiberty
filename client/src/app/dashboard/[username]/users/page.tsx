import { Paginated }                                      from "@/@types/application"
import { User }                                           from "@/@types/user"
import getAllUsersPaginated                               from "@/actions/admin/get-all-users-paginated"
import ActionsMenu                                        from "@/components/dashboard/users/actions-menu"
import AvatarWithText                                     from "@/components/shared/avatar-with-text"
import LinkButton                                         from "@/components/shared/link-button"
import NavigationPagination                               from "@/components/shared/navigation-pagination"
import RoleBadge                                          from "@/components/shared/role-badge"
import { Button, Field, Input, Label }                    from "@headlessui/react"
import { auth }                                           from "auth"
import { Metadata }                                       from "next"
import Link                                               from "next/link"
import { permanentRedirect }                              from "next/navigation"
import { LuChevronDown, LuChevronUp, LuSearch, LuTrash2 } from "react-icons/lu"

interface UsersPageProps {
    params: Promise<{ username: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
    title: "Users",
    description: "Manage all the users registered on this platform. Only accessible to the administrators.",
}

type UsersPageParams = Pick<User, "username" | "email" | "role" | "isVerified" | "createdAt" | "updatedAt">
type Direction = "ASC" | "DESC"

function TableHeader(props: {
    href: string
    direction: "ASC" | "DESC"
    orderBy: "username" | "email" | "role" | "isVerified" | "createdAt" | "updatedAt"
    href1: string
    href2: string
    href3: string
    href4: string
}) {
    return (
        <thead>
            <tr>
                <th scope="col" className="text-shadow-900 py-3.5 pr-3 pl-4 text-left text-sm font-semibold sm:pl-0">
                    Id
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    <Link href={ props.href } className="group inline-flex">
                        Username{ " " }
                        <span className="text-shadow-400 invisible ml-2 flex-none rounded-sm group-hover:visible group-focus:visible">
                            { props.direction === "ASC" && props.orderBy === "username" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    <Link href={ props.href1 } className="group inline-flex">
                        Email{ " " }
                        <span className="text-shadow-400 invisible ml-2 flex-none rounded-sm group-hover:visible group-focus:visible">
                            { props.direction === "ASC" && props.orderBy === "email" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    <Link href={ props.href2 } className="group inline-flex">
                        Role{ " " }
                        <span className="text-shadow-400 invisible ml-2 flex-none rounded-sm group-hover:visible group-focus:visible">
                            { props.direction === "ASC" && props.orderBy === "email" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    <Link href={ props.href3 } className="group inline-flex">
                        Created At{ " " }
                        <span className="text-shadow-400 invisible ml-2 flex-none rounded-sm group-hover:visible group-focus:visible">
                            { props.direction === "ASC" && props.orderBy === "createdAt" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="text-shadow-900 px-3 py-3.5 text-left text-sm font-semibold">
                    <Link href={ props.href4 } className="group inline-flex">
                        Last Update{ " " }
                        <span className="text-shadow-400 invisible ml-2 flex-none rounded-sm group-hover:visible group-focus:visible">
                            { props.direction === "ASC" && props.orderBy === "updatedAt" ? (
                                <LuChevronUp aria-hidden="true" className="h-5 w-full text-inherit" />
                            ) : (
                                  <LuChevronDown aria-hidden="true" className="h-5 w-full text-inherit" />
                              ) }
                        </span>
                    </Link>
                </th>
                <th scope="col" className="relative py-3.5 pr-0 pl-3">
                    <span className="sr-only">Manage</span>
                </th>
            </tr>
        </thead>
    )
}

export default async function UsersPage({ params, searchParams }: Readonly<UsersPageProps>) {
    const [ session, { username }, pageParams ] = await Promise.all([ auth(), params, searchParams ])
    if (!pageParams) return null
    
    if (!session || !username || session?.user.role !== "ADMIN" || session?.user.username !== username) {
        return permanentRedirect("/")
    }
    
    const search = (pageParams.search as string) || ""
    const page = parseInt(pageParams.page as string, 10) || 0
    const perPage = parseInt(pageParams.perPage as string, 10) || 10
    const direction = (pageParams.direction as Direction) || "DESC"
    const orderBy = (pageParams.orderBy as keyof UsersPageParams) || "createdAt"
    
    const usersState = await getAllUsersPaginated({ search, page, perPage, direction, orderBy })
    const pagination = usersState.response?.data as Paginated<User>
    const content = pagination.content ?? []
    
    const baseUrl = `/dashboard/${ username }/users`
    
    function buildUrl(item: keyof UsersPageParams, direction: Direction) {
        let orderUrl = `${ baseUrl }?orderBy=${ item }`
        
        function getNextDirection(currentOrderBy: string) {
            return orderBy === currentOrderBy ? (direction === "ASC" ? "DESC" : "ASC") : "ASC"
        }
        
        if (getNextDirection(item) === "ASC") orderUrl += "&direction=ASC"
        if (search) orderUrl += `&search=${ encodeURIComponent(search) }`
        if (page) orderUrl += `&page=${ page }`
        return orderUrl
    }
    
    return (
        <div
            className="flex h-full min-h-0 flex-col justify-between"
            aria-labelledby="page-title"
            aria-describedby="page-description">
            <header className="mt-4 sm:mt-8">
                <h1
                    id="page-title"
                    className="text-shadow-900 block text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                    Users
                </h1>

                <p id="page-description" className="text-shadow-600 mt-2 text-lg/8">
                    There are currently { pagination.page.totalElements } user(s) registered in the service. Manage them
                    here.
                </p>
            </header>

            <main className="mt-8 flow-root h-full border-t border-stone-200 pt-8">
                <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <form action={ baseUrl } method="GET" className="max-sm:pl-4">
                                <Field className="w-full max-w-sm">
                                    <Label htmlFor="search" className="sr-only">
                                        Search
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            id="search"
                                            name="search"
                                            type="search"
                                            className="peer text-shadow-800 placeholder:text-shadow-300 aria-disabled:cursor-not-allowedfocus:border-stone-400 dark:text-shadow-50 w-full rounded-md border border-stone-200 bg-transparent py-2 pr-10 pl-3 text-sm shadow-sm ring ring-transparent transition-all duration-300 ease-in outline-none hover:border-stone-800 hover:ring-stone-300 focus:border-stone-800 focus:shadow focus:ring-stone-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                                            placeholder="e.g. Title, Subtitle, etc."
                                        />
                                        <Button
                                            className="from-marigold-500 to-marigold-600 border-marigold-500 text-shadow-50 absolute top-1 right-1 inline-grid cursor-pointer place-items-center rounded-md border bg-gradient-to-tr p-1.5 text-center align-middle font-sans text-sm leading-none font-medium transition-all duration-300 ease-in select-none hover:brightness-110 focus:shadow-none"
                                            aria-label="Click to search"
                                            title="Click to search"
                                            type="submit">
                                            <LuSearch aria-hidden="true" className="size-4" />
                                        </Button>
                                    </div>
                                </Field>
                            </form>
                            <LinkButton
                                aria-label="Clear url params"
                                title="Clear url params"
                                buttonStyle="ghost"
                                href={ baseUrl }>
                                <LuTrash2 aria-hidden="true" className="size-4" />
                            </LinkButton>
                        </div>

                        <table className="min-w-full divide-y divide-stone-300">
                            <TableHeader
                                href={ buildUrl("username", direction) }
                                direction={ direction }
                                orderBy={ orderBy }
                                href1={ buildUrl("email", direction) }
                                href2={ buildUrl("role", direction) }
                                href3={ buildUrl("createdAt", direction) }
                                href4={ buildUrl("updatedAt", direction) }
                            />

                            <tbody className="divide-y divide-stone-200 bg-white">
                                { content.map(user => {
                                    return (
                                        <tr key={ user.id }>
                                            <td
                                                className="text-shadow-900 max-w-[10ch] truncate py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-0"
                                                aria-label={ `User ID: ${ user.id }` }
                                                title={ `User ID: ${ user.id }` }>
                                                { user.id }
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap">
                                                <div className="group text-marigold-500 hover:text-marigold-600 active:text-marigold-700 inline-flex items-center gap-x-2">
                                                    <AvatarWithText
                                                        name={ user.username }
                                                        size={ 32 }
                                                        src={ user.avatarUrl }
                                                        type="profile"
                                                        isPrivate={ user.isPrivate }
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap">
                                                <Link
                                                    href={ `mailto:${ user.email }` }
                                                    className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 hover:underline"
                                                    aria-label={ `Send email to ${ user.email }` }
                                                    title={ `Send email to ${ user.email }` }>
                                                    { user.email }
                                                </Link>
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap">
                                                <RoleBadge role={ user.role } />
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap">
                                                { new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                }) }
                                            </td>
                                            <td className="px-3 py-4 text-sm whitespace-nowrap">
                                                { user.createdAt !== user.updatedAt ? (
                                                    new Date(user.updatedAt).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "numeric",
                                                        minute: "numeric",
                                                    })
                                                ) : (
                                                      <span className="text-shadow-300">No updates</span>
                                                  ) }
                                            </td>
                                            <td className="relative py-4 pr-4 pl-3 text-sm whitespace-nowrap sm:pr-0">
                                                <ActionsMenu user={ user } />
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
                
                { pagination.page.totalElements <= 0 && (
                    <div className="flex h-96 items-center justify-center">
                        <p className="text-shadow-500 text-lg">No users registered.</p>
                    </div>
                ) }
            </main>

            <NavigationPagination pageInfo={ pagination.page } />
        </div>
    )
}
