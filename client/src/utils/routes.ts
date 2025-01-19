// apiRoutes.ts

// =================================================================
// =======================  Global Constant  =======================
// =================================================================
export const ORIGIN_URL = process.env.BACKEND_ORIGIN ?? "http://localhost:8080"

// ================================================================
// ====================  Query Params Builder  ====================
// ================================================================
function buildQueryParams(params: Record<string, string | number | undefined>): string {
    const queryParams: string[] = []
    
    for (const key in params) {
        const value = params[key]
        if (value !== undefined) {
            queryParams.push(`${ key }=${ value }`)
        }
    }
    
    return queryParams.length > 0 ? `?${ queryParams.join("&") }` : ""
}

// ===============================================================
// ===================  Auth Module Functions  ===================
// ===============================================================
export function registerAuthUrl(): string {
    return `${ ORIGIN_URL }/api/v1/auth/register`
}

export function loginAuthUrl(): string {
    return `${ ORIGIN_URL }/api/v1/auth/login`
}

export function refreshTokenAuthUrl(): string {
    return `${ ORIGIN_URL }/api/v1/auth/refresh-token`
}

export function logoutAuthUrl(): string {
    return `${ ORIGIN_URL }/api/v1/auth/logout`
}

// ===============================================================
// ===================  User Module Functions  ===================
// ===============================================================
export function getUserProfileUrl(username: string): string {
    return `${ ORIGIN_URL }/api/v1/users/public/profile/${ username }`
}

export function getOwnProfileUrl(): string {
    return `${ ORIGIN_URL }/api/v1/users/me`
}

export function updateOwnProfileUrl(): string {
    return `${ ORIGIN_URL }/api/v1/users/me`
}

export function deleteOwnProfileUrl(): string {
    return `${ ORIGIN_URL }/api/v1/users/me`
}

// ==================================================================
// ===================  Article Module Functions  ===================
// ==================================================================
export function getAllArticlesUrl(
    page: number = 0,
    perPage: number = 10,
    direction: string = "ASC",
    orderBy: string = "createdAt",
): string {
    const queryString = buildQueryParams({ page, perPage, direction, orderBy })
    return `${ ORIGIN_URL }/api/v1/articles/public${ queryString }`
}

export function getAllArticlesByCategoryUrl(
    category: string,
    page: number = 0,
    perPage: number = 10,
    direction: string = "ASC",
    orderBy: string = "createdAt",
): string {
    const queryString = buildQueryParams({ page, perPage, direction, orderBy })
    return `${ ORIGIN_URL }/api/v1/articles/public/category/${ category }${ queryString }`
}

export function getArticleUrl(articleId: number): string {
    return `${ ORIGIN_URL }/api/v1/articles/public/article/${ articleId }`
}

export function getAllOwnArticlesUrl(
    search?: string,
    page: number = 0,
    perPage: number = 10,
    direction: string = "ASC",
    orderBy: string = "createdAt",
): string {
    const queryString = buildQueryParams({ search, page, perPage, direction, orderBy })
    return `${ ORIGIN_URL }/api/v1/articles${ queryString }`
}

export function createArticleUrl(): string {
    return `${ ORIGIN_URL }/api/v1/articles`
}

export function updateArticleUrl(articleId: number): string {
    return `${ ORIGIN_URL }/api/v1/articles/${ articleId }`
}

export function deleteArticleUrl(articleId: number): string {
    return `${ ORIGIN_URL }/api/v1/articles/${ articleId }`
}

// ==================================================================
// ====================  Admin Module Functions  ====================
// ==================================================================
export function adminUpdateUserUrl(username: string): string {
    return `${ ORIGIN_URL }/api/v1/admin/users/${ username }/update`
}

export function adminUpdateArticleUrl(articleId: number): string {
    return `${ ORIGIN_URL }/api/v1/admin/articles/${ articleId }`
}

export function adminBanOrUnbanUserUrl(username: string, action: string = "ban"): string {
    const queryString = buildQueryParams({ action })
    return `${ ORIGIN_URL }/api/v1/admin/users/${ username }${ queryString }`
}

export function adminToggleUserVerificationUrl(username: string): string {
    return `${ ORIGIN_URL }/api/v1/admin/users/${ username }/toggle-verification`
}

export function adminUpdateSuggestionUrl(id: number): string {
    return `${ ORIGIN_URL }/api/v1/admin/suggestions/${ id }`
}

export function adminDeleteUserUrl(username: string): string {
    return `${ ORIGIN_URL }/api/v1/admin/users/${ username }`
}
