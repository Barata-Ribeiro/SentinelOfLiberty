import RegisterForm from "@/components/forms/register-form"
import { Metadata } from "next"
import Link         from "next/link"

export const metadata: Metadata = {
    title: "Register",
    description: "Create your account to get started using the servies",
}

export default function RegisterPage() {
    return (
        <section className="mb-20 w-full sm:container" aria-labelledby="register-heading">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow-sm sm:rounded-md sm:px-12">
                    <div className="mb-8">
                        <h1 id="register-heading" className="block text-2xl font-medium text-shadow-800">
                            Create an Account
                        </h1>
                        <p className="text-sm font-light text-shadow-500">
                            Welcome! Please create an account to get started.
                        </p>
                    </div>

                    <RegisterForm />
                </div>

                <p className="mt-10 text-center text-sm text-shadow-300" role="note">
                    Already a member?{ " " }
                    <Link
                        href="/auth/login"
                        className="font-semibold leading-6 text-marigold-600 hover:text-marigold-500 active:text-marigold-700">
                        Login to your account
                    </Link>
                </p>
            </div>
        </section>
    )
}
