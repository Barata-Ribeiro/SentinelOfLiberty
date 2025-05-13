import RegisterForm from "@/components/forms/register-form"
import { Metadata } from "next"
import Link from "next/link"

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
                        <h1 id="register-heading" className="text-shadow-800 block text-2xl font-medium">
                            Create an Account
                        </h1>
                        <p className="text-shadow-500 text-sm font-light">
                            Welcome! Please create an account to get started.
                        </p>
                    </div>

                    <RegisterForm />
                </div>

                <p className="text-shadow-300 mt-10 text-center text-sm" role="note">
                    Already a member?{" "}
                    <Link
                        href="/auth/login"
                        className="text-marigold-600 hover:text-marigold-500 active:text-marigold-700 leading-6 font-semibold">
                        Login to your account
                    </Link>
                </p>
            </div>
        </section>
    )
}
