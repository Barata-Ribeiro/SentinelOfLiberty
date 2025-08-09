import { Profile } from "@/@types/user"
import getProfileByUsername from "@/actions/users/get-profile-by-username"
import ProfileArticlesWritten from "@/components/profile/profile-articles-written"
import { formatDisplayDate, getBackgroundImage, textScrambler } from "@/utils/functions"
import tw from "@/utils/tw"
import { Metadata } from "next"
import Image, { getImageProps } from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { FaCircleCheck } from "react-icons/fa6"
import { LuCalendarRange, LuLink2, LuMapPin } from "react-icons/lu"
import { twMerge } from "tailwind-merge"
import coverImage from "../../../../public/profile-cover-photo.jpg"

interface ProfilePageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Readonly<ProfilePageProps>): Promise<Metadata> {
    const username = (await params).username
    return {
        title: `Profile of ${username}`,
        description: `This is the public profile page of ${username}.`,
    }
}

const FIELDS_TO_SCRAMBLE: (keyof Profile)[] = [
    "email",
    "displayName",
    "fullName",
    "biography",
    "birthDate",
    "location",
    "website",
    "socialMedia",
    "videoChannel",
    "streamingChannel",
] as const

function scrambleField<T, K extends keyof T>(obj: T, key: K, scrambler: (value: string) => string): void {
    const field = obj[key]
    if (typeof field === "string") obj[key] = scrambler(field) as T[K]
}

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
    const username = (await params).username
    if (!username) return notFound()

    const {
        props: { srcSet },
    } = getImageProps({
        alt: "Newspaper business article photo. Photo from Unsplash by @alterego_swiss",
        width: 4000,
        height: 2667,
        loading: "lazy",
        quality: 75,
        src: coverImage,
    })
    const backgroundImage = getBackgroundImage(srcSet)

    const accountState = await getProfileByUsername({ username })
    if (!accountState) return notFound()

    const account = accountState.response?.data as Profile
    if (account.isPrivate) FIELDS_TO_SCRAMBLE.forEach(key => scrambleField(account, key, textScrambler))

    const privateStyle = tw`data-[private=true]:rounded-lg data-[private=true]:bg-black data-[private=true]:text-transparent data-[private=true]:select-none`

    return (
        <div className="container">
            <header
                className="bg-marigold-800 relative -mx-4 grid h-48 shadow-sm sm:-mx-0 sm:h-72 sm:rounded-b-md"
                aria-labelledby="profile-title"
                style={{
                    backgroundImage,
                    backgroundBlendMode: "multiply",
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}>
                {account.avatarUrl && !account.isPrivate ? (
                    <Image
                        src={account.avatarUrl}
                        alt={`Avatar of ${account.username}`}
                        title={`Avatar of ${account.username}`}
                        className="shring-0 mx-auto -mb-20 size-40 self-end bg-stone-200 object-cover shadow-xl ring-2 ring-white select-none sm:rounded-full"
                        width={160}
                        height={160}
                        priority
                        sizes="100vw"
                    />
                ) : (
                    <div
                        aria-label={`Placeholder avatar of ${account.username}`}
                        title={`Placeholder avatar of ${account.username}`}
                        className="shring-0 mx-auto -mb-20 flex size-40 items-center justify-center self-end rounded-full bg-stone-200 shadow-xl ring-2 ring-white select-none">
                        <span aria-hidden="true" className="font-heading text-8xl text-stone-500 capitalize">
                            {account.username.charAt(0)}
                        </span>
                    </div>
                )}
            </header>

            <main className="my-24 grid gap-y-8">
                <section id="profile-section" className="mx-auto grid w-full max-w-7xl gap-y-4">
                    <div className="grid gap-y-2">
                        <h1
                            data-private={account.isPrivate}
                            aria-label={account.isPrivate ? "Redacted display name" : ""}
                            title={account.isPrivate ? "Redacted display name" : ""}
                            className={twMerge(
                                "text-shadow-900 mx-auto flex items-center gap-x-1.5 text-center text-4xl font-bold",
                                privateStyle,
                            )}>
                            {account.displayName}{" "}
                            {account.isVerified && !account.isPrivate && (
                                <span
                                    className="text-marigold-500"
                                    aria-label="Verified account"
                                    title="Verified account">
                                    <FaCircleCheck aria-hidden="true" className="size-5" />
                                </span>
                            )}
                        </h1>

                        <div
                            aria-label={account.isPrivate ? "Redacted location" : ""}
                            title={account.isPrivate ? "Redacted location" : ""}
                            className="text-shadow-300 flex items-center justify-center gap-x-2">
                            <LuMapPin aria-hidden="true" className="size-5" />
                            <span data-private={account.isPrivate} className={privateStyle}>
                                {account.location ?? "Not informed"}
                            </span>
                        </div>
                    </div>

                    <h2 id="profile-title" className="text-shadow-700 text-center text-2xl font-semibold">
                        @{account.username}
                    </h2>

                    <p
                        data-private={account.isPrivate}
                        aria-label={account.isPrivate ? "Redacted biography" : ""}
                        title={account.isPrivate ? "Redacted biography" : ""}
                        className={twMerge(
                            "text-shadow-900 mx-auto w-fit text-center text-balance whitespace-pre-wrap",
                            privateStyle,
                        )}>
                        {account.biography}
                    </p>

                    <div className="border-y-2 border-stone-200 py-4">
                        <div className="text-shadow-300 mx-auto flex w-full max-w-2xl flex-wrap items-center justify-between">
                            <span className="flex items-center gap-x-1.5">
                                <LuLink2 aria-hidden="true" className="size-5 text-inherit" />
                                {account.website && !account.isPrivate ? (
                                    <Link
                                        href={account.website}
                                        className="text-marigold-500 hover:text-marigold-600 active:text-marigold-700 hover:underline">
                                        {account.website}
                                    </Link>
                                ) : (
                                    <span
                                        data-private={account.isPrivate}
                                        className={account.isPrivate ? privateStyle : "text-shadow-300"}>
                                        {account.website ?? "Not informed"}
                                    </span>
                                )}
                            </span>

                            <time
                                dateTime={new Date(account.createdAt).toISOString()}
                                aria-label={`Joined on ${formatDisplayDate(String(account.createdAt), "date")}`}
                                title={`Joined on ${formatDisplayDate(String(account.createdAt), "date")}`}
                                className="flex items-center gap-x-1.5">
                                <LuCalendarRange aria-hidden="true" className="size-5 text-inherit" />
                                Joined{" "}
                                <span>
                                    {new Date(account.createdAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </time>
                        </div>
                    </div>
                </section>

                <section id="profile-content-setion">
                    {account.role !== "ADMIN" && (
                        <p className="text-shadow-200 text-center text-balance">
                            User is not an administrator.
                            <br />
                            No content to display.
                        </p>
                    )}

                    {account.role === "ADMIN" && <ProfileArticlesWritten username={account.username} />}
                </section>
            </main>
        </div>
    )
}
