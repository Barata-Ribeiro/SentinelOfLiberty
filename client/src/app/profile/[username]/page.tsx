import { Profile }                           from "@/@types/user"
import getProfileByUsername                  from "@/actions/users/get-profile-by-username"
import { getBackgroundImage, textScrambler } from "@/utils/functions"
import Image, { getImageProps }              from "next/image"
import { notFound }                          from "next/navigation"
import coverImage                            from "../../../../public/profile-cover-photo.jpg"

interface ProfilePageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Readonly<ProfilePageProps>) {
    const username = (await params).username
    return {
        title: `Profile of ${ username }`,
        description: `This is the public profile page of ${ username }.`,
    }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
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
    
    return (
        <div className="container">
            <header
                className="bg-marigold-800 relative -mx-4 grid h-48 shadow-sm sm:-mx-0 sm:h-96 sm:rounded-b-md"
                aria-labelledby="profile-title"
                style={ {
                    backgroundImage,
                    backgroundBlendMode: "multiply",
                    backgroundSize: "cover",
                    backgroundAttachment: "fixed",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                } }>
                { account.avatarUrl ? (
                    <Image
                        src={ account.avatarUrl }
                        alt={ `Avatar of ${ account.username }` }
                        title={ `Avatar of ${ account.username }` }
                        className="shring-0 mx-auto -mb-20 size-40 self-end bg-stone-200 object-cover ring-2 shadow-xl ring-white select-none sm:rounded-full"
                        width={ 160 }
                        height={ 160 }
                        priority
                        sizes="100vw"
                    />
                ) : (
                      <div
                          aria-label={ `Placeholder avatar of ${ account.username }` }
                          title={ `Placeholder avatar of ${ account.username }` }
                          className="shring-0 mx-auto -mb-20 flex size-40 items-center justify-center self-end rounded-full bg-stone-200 ring-2 shadow-xl ring-white select-none">
                        <span aria-hidden="true" className="font-heading text-8xl text-stone-500 capitalize">
                            { account.username.charAt(0) }
                        </span>
                    </div>
                  ) }
            </header>

            <main className="mt-24 grid gap-y-4">
                <div className="mx-auto grid gap-y-2">
                    <h1 id="profile-title" className="text-shadow-900 text-4xl font-semibold">
                        @{ account.username }
                    </h1>

                    <h2 className="mx-auto text-2xl font-bold">
                        <span className="inline-block rounded-sm bg-black text-transparent select-none">
                            { textScrambler(account.displayName) }
                        </span>
                    </h2>

                    <div className="mx-auto whitespace-pre-wrap text-gray-600">
                        { " " }
                        <div className="inline-block max-w-full rounded-sm bg-black text-balance whitespace-pre-wrap text-transparent select-none">
                            { textScrambler(account.biography) }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
