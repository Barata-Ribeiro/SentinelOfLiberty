import { ProblemDetails } from "@/@types/application"
import { FaTriangleExclamation } from "react-icons/fa6"

interface ApplicationRequestFormErrorProps {
    error: ProblemDetails
}

export default function ApplicationRequestFormError({ error }: Readonly<ApplicationRequestFormErrorProps>) {
    return (
        <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4">
            <div className="flex">
                <div className="shrink-0">
                    <FaTriangleExclamation className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-semibold text-yellow-800">
                        <span className="font-bold">{error.status}</span> - {error.title}
                    </h3>
                    <div className="font-body mt-2 text-sm text-yellow-700">
                        <p>{error.detail}</p>
                        {error["invalid-params"] && (
                            <ul className="mt-2 list-disc space-y-1 pl-5">
                                {error["invalid-params"].map((param: { fieldName: string; reason: string }) => (
                                    <li key={param.fieldName}>{param.reason}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
