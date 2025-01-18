import { ZodIssue } from "zod"

type ValidationError = Partial<Pick<ZodIssue, "path" | "message">>

interface RestResponse {
    status: string
    code: number
    message: string
    data?: unknown
}

interface InvalidParam {
    fieldName: string
    reason: string
}

interface ProblemDetails {
    type: string
    title: string
    status: number
    detail: string
    instance: string
    "invalid-params"?: InvalidParam[]
}

interface State {
    ok: boolean
    error: string | ValidationError[] | ProblemDetails | null
    response: RestResponse | null
}

interface Paginated<T> {
    content: T[]
    page: {
        size: number
        number: number
        totalElements: number
        totalPages: number
    }
}

export type { ValidationError, RestResponse, InvalidParam, ProblemDetails, State, Paginated }