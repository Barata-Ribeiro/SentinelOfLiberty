import { Profile }      from "@/@types/user"
import EditAccountModal from "@/components/modals/edit-account-modal"
import Avatar           from "@/components/shared/avatar"
import RegularButton    from "@/components/shared/regular-button"

interface DashboardUserProfileProps {
    name: string
    profile: Profile
}

export default function DashboardUserProfile({ name, profile }: Readonly<DashboardUserProfileProps>) {
    return (
        <div className="grid place-items-center gap-y-4">
            <Avatar name={ name } size={ 96 } src={ profile.avatarUrl } />

            <div className="text-center text-balance">
                <h1 className="text-shadow-900 text-2xl font-bold">{ profile.displayName }</h1>
                <h2 className="text-shadow-300 text-sm font-medium">{ profile.email }</h2>
            </div>

            <time dateTime={ profile.createdAt } className="text-shadow-500 text-sm">
                Member since{ " " }
                { new Date(profile.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                }) }
            </time>
            
            { profile.roles === "ADMIN" ? (
                <span
                    className="mt-2 rounded-full border border-red-400 bg-red-100 px-2.5 py-1 text-xs leading-none font-medium text-red-800 select-none dark:bg-red-900 dark:text-red-300"
                    aria-label="You are an admin">
                    Admin
                </span>
            ) : (
                  <span
                      className="mt-2 rounded-full border border-stone-500 bg-stone-100 px-2.5 py-1 text-xs leading-none font-medium text-stone-800 select-none"
                      aria-label="You are a reader">
                    Reader
                </span>
              ) }
            
            <div className="my-4 flex flex-col items-center justify-center gap-4 lg:mt-6 lg:flex-row">
                <EditAccountModal />

                <RegularButton
                    className="text-shadow-900 border border-stone-300 bg-white hover:bg-stone-100 active:bg-stone-200"
                    aria-label="Check account details">
                    Account Details
                </RegularButton>
            </div>

            <div className="border-t-2 border-stone-100 pt-3">
                <h3 className="text-shadow-900 mb-2 text-center text-xl font-medium">Biography</h3>
                <p className="text-shadow-600 text-center text-sm">
                    { profile.biography ?? "No biography yet. Edit you profile above!!" }
                </p>
            </div>
        </div>
    )
}
