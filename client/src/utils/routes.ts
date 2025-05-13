// apiRoutes.ts
import env from "@/helpers/env"

// =================================================================
// =======================  Global Constant  =======================
// =================================================================
const BACKEND_URL = env.BACKEND_ORIGIN ?? "http://localhost:8080"
const API_URL = BACKEND_URL + "/api/v1"

// ================================================================
// ====================  Query Params Builder  ====================
// ================================================================
function buildQueryParams(params: Record<string, string | number | boolean | undefined>): string {
    const queryParams: string[] = []

    for (const key in params) {
        const value = params[key]
        if (value !== undefined) {
            queryParams.push(`${key}=${value}`)
        }
    }

    return queryParams.length > 0 ? `?${queryParams.join("&")}` : ""
}

// ===============================================================
// ===================  Auth Module Functions  ===================
// ===============================================================
export function registerAuthUrl(): string {
    return `${API_URL}/auth/register`
}

export function loginAuthUrl(): string {
    return `${API_URL}/auth/login`
}

export function refreshTokenAuthUrl(): string {
    return `${API_URL}/auth/refresh-token`
}

export function logoutAuthUrl(): string {
    return `${API_URL}/auth/logout`
}

// ===============================================================
// ===================  User Module Functions  ===================
// ===============================================================
export function getUserProfileUrl(username: string): string {
    return `${API_URL}/users/public/profile/${username}`
}

export function getOwnProfileUrl(): string {
    return `${API_URL}/users/me`
}

export function getOwnDashboardUrl(): string {
    return `${API_URL}/users/me/dashboard`
}

export function updateOwnProfileUrl(): string {
    return `${API_URL}/users/me`
}

export function deleteOwnProfileUrl(): string {
    return `${API_URL}/users/me`
}

// ==================================================================
// ===================  Article Module Functions  ===================
// ==================================================================
export function getLatestPublicArticlesUrl(): string {
    return `${API_URL}/articles/public/latest`
}

export function getPopularPublicArticlesUrl(): string {
    return `${API_URL}/articles/public/popular`
}

export function getAllArticlesUrl(page: number, perPage: number, direction: string, orderBy: string): string {
    const queryString = buildQueryParams({ page, perPage, direction, orderBy })
    return `${API_URL}/articles/public${queryString}`
}

export function getAllArticlesByCategoryUrl(
    category: string,
    page: number,
    perPage: number,
    direction: string,
    orderBy: string,
): string {
    const queryString = buildQueryParams({ page, perPage, direction, orderBy })
    return `${API_URL}/articles/public/category/${category}${queryString}`
}

export function getArticleUrl(articleId: number): string {
    return `${API_URL}/articles/public/article/${articleId}`
}

export function getAllCategoriesUrl(): string {
    return `${API_URL}/articles/public/categories`
}

export function getAllOwnArticlesUrl(
    search?: string,
    page?: number,
    perPage?: number,
    direction?: string,
    orderBy?: string,
): string {
    const queryString = buildQueryParams({ search, page, perPage, direction, orderBy })
    return `${API_URL}/articles${queryString}`
}

export function createArticleUrl(): string {
    return `${API_URL}/articles`
}

export function updateArticleUrl(articleId: number): string {
    return `${API_URL}/articles/${articleId}`
}

export function deleteArticleUrl(articleId: number): string {
    return `${API_URL}/articles/${articleId}`
}

// ==================================================================
// ===================  Comment Module Functions  ===================
// ==================================================================
export function getArticleCommentsTreeUrl(articleId: number): string {
    return `${API_URL}/comments/public/${articleId}`
}

export function createCommentUrl(articleId: number): string {
    return `${API_URL}/comments/${articleId}`
}

export function deleteCommentUrl(articleId: number, commentId: number): string {
    return `${API_URL}/comments/${articleId}/${commentId}`
}

// ==================================================================
// ===================  Notice Module Functions  ====================
// ==================================================================
export function getLatestNoticeUrl(): string {
    return `${API_URL}/notices/public/latest`
}

export function getAllOwnNoticesUrl(
    search?: string,
    page?: number,
    perPage?: number,
    direction?: string,
    orderBy?: string,
): string {
    const queryString = buildQueryParams({ search, page, perPage, direction, orderBy })
    return `${API_URL}/notices${queryString}`
}

export function createNoticeUrl(): string {
    return `${API_URL}/notices`
}

export function updateNoticeUrl(id: number): string {
    return `${API_URL}/notices/${id}`
}

export function setNoticeStatusUrl(id: number, isActive: boolean): string {
    const queryString = buildQueryParams({ isActive })
    return `${API_URL}/notices/${id}/status${queryString}`
}

export function deleteNoticeUrl(id: number): string {
    return `${API_URL}/notices/${id}`
}

// ==================================================================
// =================  Suggestion Module Functions  ==================
// ==================================================================
export function getLatestSuggestionsUrl(): string {
    return `${API_URL}/suggestions/public/latest`
}

export function getAllSuggestionsUrl(page: number, perPage: number, direction: string, orderBy: string): string {
    const queryString = buildQueryParams({ page, perPage, direction, orderBy })
    return `${API_URL}/suggestions/public${queryString}`
}

export function getSuggestionByIdUrl(id: number): string {
    return `${API_URL}/suggestions/public/${id}`
}

export function createSuggestionUrl(): string {
    return `${API_URL}/suggestions`
}

export function deleteSuggestionUrl(id: number): string {
    return `${API_URL}/suggestions/${id}`
}

// ==================================================================
// ================= Notification Module Functions ==================
// ==================================================================
export function getLatestNotificationUrl(): string {
    return `${API_URL}/notifications/latest`
}

export function getAllNotificationsUrl(
    page: number = 0,
    perPage: number = 10,
    direction: string = "ASC",
    orderBy: string = "createdAt",
): string {
    const queryString = buildQueryParams({ page, perPage, direction, orderBy })
    return `${API_URL}/notifications${queryString}`
}

export function changeNotificationStatusUrl(notifId: number, isRead: boolean): string {
    const queryString = buildQueryParams({ isRead })
    return `${API_URL}/notifications/${notifId}/status${queryString}`
}

export function changeNotificationStatusInBulkUrl(isRead: boolean): string {
    const queryString = buildQueryParams({ isRead })
    return `${API_URL}/notifications/status${queryString}`
}

export function deleteNotificationUrl(notifId: number): string {
    return `${API_URL}/notifications/${notifId}`
}

export function deleteNotificationsInBulkUrl(ids: number[]): string {
    const queryString = buildQueryParams({ ids: ids.join(",") })
    return `${API_URL}/notifications${queryString}`
}

// ==================================================================
// ====================  Admin Module Functions  ====================
// ==================================================================
export function adminGetAllUsersUrl(
    search?: string,
    page?: number,
    perPage?: number,
    direction?: string,
    orderBy?: string,
): string {
    const queryString = buildQueryParams({ search, page, perPage, direction, orderBy })
    return `${API_URL}/admin/users${queryString}`
}

export function adminUpdateUserUrl(username: string): string {
    return `${API_URL}/admin/users/${username}/update`
}

export function adminUpdateArticleUrl(articleId: number): string {
    return `${API_URL}/admin/articles/${articleId}`
}

export function adminBanOrUnbanUserUrl(username: string, action: string = "ban"): string {
    const queryString = buildQueryParams({ action })
    return `${API_URL}/admin/users/${username}${queryString}`
}

export function adminToggleUserVerificationUrl(username: string): string {
    return `${API_URL}/admin/users/${username}/toggle-verification`
}

export function adminUpdateSuggestionUrl(id: number): string {
    return `${API_URL}/admin/suggestions/${id}`
}

export function adminDeleteUserUrl(username: string): string {
    return `${API_URL}/admin/users/${username}`
}
