import { Profile }                  from "@/@types/user"
import EditAccountDetailsModal      from "@/components/modals/edit-account-details-modal"
import EditAccountModal             from "@/components/modals/edit-account-modal"
import Avatar                       from "@/components/shared/avatar"
import RoleBadge                    from "@/components/shared/role-badge"
import { FaCircleCheck }            from "react-icons/fa6"
import { LuCalendarClock, LuMails } from "react-icons/lu"

interface DashboardUserProfileProps {
    name: string
    profile: Profile
}

export default function DashboardUserProfile({ name, profile }: Readonly<DashboardUserProfileProps>) {
    return (
        <div className="flex flex-col place-items-center gap-y-4">
            <Avatar name={ name } size={ 96 } src={ profile.avatarUrl } />

            <div className="text-center text-balance">
                <h1 className="text-shadow-900 inline-flex items-center gap-x-2 text-2xl font-bold">
                    { profile.displayName }
                    { profile.isVerified && (
                        <span className="text-marigold-500" title="Verified">
                            <FaCircleCheck aria-hidden="true" className="size-4" />
                        </span>
                    ) }
                </h1>
                <h2 className="text-shadow-300 text-sm font-medium">@{ profile.username }</h2>
            </div>

            <div className="grid gap-y-2 divide-y divide-stone-200 *:first:pb-2">
                <p
                    className="text-shadow-500 inline-flex items-center gap-x-2 text-sm"
                    aria-label="Account email"
                    title="Account email">
                    <LuMails aria-hidden="true" className="size-4 text-inherit" />
                    { profile.email }
                </p>

                <time
                    dateTime={ profile.createdAt }
                    aria-label="Account creation date"
                    title="Account creation date"
                    className="text-shadow-500 inline-flex items-center gap-x-2 text-sm">
                    <LuCalendarClock aria-hidden="true" className="size-4 text-inherit" />
                    Since{ " " }
                    { new Date(profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }) }
                </time>
            </div>
            
            <RoleBadge role={ profile.role } />
            
            <div className="my-4 flex flex-col items-center justify-center gap-4 lg:mt-6 lg:flex-row">
                <EditAccountModal />

                <EditAccountDetailsModal />
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
