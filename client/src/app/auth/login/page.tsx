import LoginForm    from "@/components/forms/login-form"
import { Metadata } from "next"
import Link         from "next/link"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

export default function LoginPage() {
    return (
        <section className="mb-20 w-full sm:container" aria-labelledby="login-heading">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow-sm sm:rounded-md sm:px-12">
                    <div className="mb-8">
                        <h1 id="login-heading" className="block text-2xl font-medium text-shadow-800">
                            Login
                        </h1>
                        <p className="text-sm font-light text-shadow-500">
                            Welcome back! Please login to your account.
                        </p>
                    </div>

                    <LoginForm />
                </div>

                <p className="mt-10 text-center text-sm text-shadow-300" role="note">
                    Not a member?{ " " }
                    <Link
                        href="/auth/register"
                        className="font-semibold leading-6 text-marigold-600 hover:text-marigold-500 active:text-marigold-700">
                        Create an account
                    </Link>
                </p>
            </div>
        </section>
    )
}
