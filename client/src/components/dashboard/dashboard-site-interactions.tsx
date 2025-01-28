import { Dashboard } from "@/@types/user"

interface DashboardSiteInteractionsProps {
    dashboard: Dashboard
}

export default function DashboardSiteInteractions({ dashboard }: Readonly<DashboardSiteInteractionsProps>) {
    return <div>
                    <h3 className="text-shadow-900 mb-2 self-center text-xl font-medium">Site Interactions</h3>
                    <ul
                        className="space-y-2 divide-y divide-stone-200 *:px-4 *:sm:px-6"
                        aria-label="List of site interactions">
                        <li className="pb-2">
                            <p className="text-shadow-400 text-sm leading-6 font-medium">Suggestions Made</p>
                            <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-shadow-900 text-4xl font-semibold tracking-tight">
                                    { dashboard.totalWrittenSuggestions }
                                </span>
                            </p>
                        </li>
                        <li className="pb-2">
                            <p className="text-shadow-400 text-sm leading-6 font-medium">Articles Published</p>
                            <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-shadow-900 text-4xl font-semibold tracking-tight">
                                    { dashboard.totalWrittenArticles }
                                </span>
                            </p>
                        </li>
                        <li>
                            <p className="text-shadow-400 text-sm leading-6 font-medium">Comments Written</p>
                            <p className="mt-2 flex items-baseline gap-x-2">
                                <span className="text-shadow-900 text-4xl font-semibold tracking-tight">
                                    { dashboard.totalWrittenComments }
                                </span>
                            </p>
                        </li>
                    </ul>
                </div>
};