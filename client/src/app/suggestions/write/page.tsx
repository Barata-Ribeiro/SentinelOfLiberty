import NewSuggestionForm from "@/components/forms/new-suggestion-form"
import { auth }          from "auth"
import { Metadata }      from "next"
import { redirect }      from "next/navigation"

export const metadata: Metadata = {
    title: "Make a Suggestion",
    description: "In this page you can write a new suggestion to be published as long as you follow the rules.",
}

export default async function SuggestionsWritePage() {
    const session = await auth()
    if (!session) return redirect("/")
    
    return (
        <div className="container">
            <header className="mt-4 max-w-2xl sm:mt-8">
                <h1 className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                    Make a Suggestion
                </h1>
                <p className="text-shadow-600 mt-2 text-lg/8">
                    In this page you can write a new suggestion to be published as long as you follow the rules. Be
                    consistent and use proper sources.
                </p>
            </header>

            <main className="mt-8 border-t border-stone-200 pt-8 sm:mt-14 sm:pt-14">
                <NewSuggestionForm />
            </main>
        </div>
    )
}
