import { ValidationError } from "@/@types/application"
import { FaCircleXmark } from "react-icons/fa6"

interface ValidationErrorProps {
    errors: ValidationError[]
}

export default function InputValidationError({ errors }: Readonly<ValidationErrorProps>) {
    const errorCount = errors.length
    const errorText = errorCount > 1 ? "errors" : "error"
    const verb = errorCount > 1 ? "were" : "was"

    return (
        <div className="border-red-500 bg-red-50 rounded-md border p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <FaCircleXmark className="text-red-400 h-5 w-5" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-red-800 text-sm font-medium">
                        There {verb} {errorCount} {errorText} with your submission
                    </h3>
                    <ul className="list-disc space-y-1 pl-5 font-body">
                        {errors.map((err, index) => (
                            <li key={`${err.path}_${index}`} className="text-red-600">
                                {err.message}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
