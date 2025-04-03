import { Profile }            from "@/@types/user"
import getProfileByUsername   from "@/actions/users/get-profile-by-username"
import EditUserForm           from "@/components/forms/edit-user-form"
import { auth }               from "auth"
import { Metadata }           from "next"
import { notFound, redirect } from "next/navigation"

interface EditingUserPageProps {
    params: Promise<{ username: string; editingUsername: string }>
}

export async function generateMetadata({ params }: EditingUserPageProps): Promise<Metadata> {
    const { editingUsername } = await params
    
    return {
        title: `Editing ${ editingUsername }`,
        description: `Editing user ${ editingUsername }`,
    }
}

export default async function EditingUserPage({ params }: Readonly<EditingUserPageProps>) {
    const { username, editingUsername } = await params
    if (!username || !editingUsername) return null
    if (username === editingUsername) {
        return redirect(`/dashboard/${ username }/users`)
    }
    
    const [ session, userToEditState ] = await Promise.all(
        [ auth(), getProfileByUsername({ username: editingUsername }) ])
    if (!session) return redirect("/auth/login")
    if (session.user.role !== "ADMIN") return redirect("/")
    if (!userToEditState) return notFound()
    
    const userToEdit = userToEditState.response?.data as Profile
    
    return (
        <div className="container">
            <header className="mt-4 max-w-2xl sm:mt-8">
                <h1 className="text-shadow-900 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                    Editing User { userToEdit.username }
                </h1>
                <p className="text-shadow-600 mt-2 text-lg/8">
                    In this page you can edit the user as long as you are an admin. Always make sure to revise the user
                    before updating it. Editing a user is dangerous and should be done with caution. Make sure to not
                    edit the user if you are not sure what you are doing.
                </p>
            </header>
            
            <main className="mt-8 border-t border-stone-200 pt-8 sm:mt-14 sm:pt-14">
                <EditUserForm user={ userToEdit } />
            </main>
        </div>
    )
}
