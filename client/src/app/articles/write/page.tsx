import NewArticleForm from "@/components/forms/new-article-form"
import { auth }       from "auth"
import { Metadata }   from "next"
import { redirect }   from "next/navigation"

export const metadata: Metadata = {
    title: "Write Article",
    description:
        "In this page you can write a new article to be published as long as you are an admin and follow the rules.",
}

export default async function ArticlesWritePage() {
    const session = await auth()
    if (!session) return redirect("/auth/login")
    if (session.user.role !== "ADMIN") return redirect("/")
    
    return (
        <div className="container">
            <header className="mt-4 max-w-2xl sm:mt-8">
                <h1 className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                    Write Article
                </h1>
                <p className="text-shadow-600 mt-2 text-lg/8">
                    In this page you can write a new article to be published as long as you are an admin and follow the
                    rules.
                </p>
            </header>

            <main className="mt-8 border-t border-stone-200 pt-8 sm:mt-14 sm:pt-14">
                <NewArticleForm />
            </main>
        </div>
    )
}
