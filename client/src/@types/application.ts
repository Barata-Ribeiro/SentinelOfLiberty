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
    pageable: {
        pageNumber: number
        pageSize: number
        sort: {
            empty: boolean
            unsorted: boolean
            sorted: boolean
        }
        offset: number
        unpaged: boolean
        paged: boolean
    }
    last: boolean
    totalPages: number
    totalElements: number
    size: number
    number: number
    sort: {
        empty: boolean
        unsorted: boolean
        sorted: boolean
    }
    first: boolean
    numberOfElements: number
    empty: boolean
}

export type { ValidationError, RestResponse, InvalidParam, ProblemDetails, State, Paginated }
