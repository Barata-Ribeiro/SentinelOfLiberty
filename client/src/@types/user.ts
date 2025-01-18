type Roles = "NONE" | "USER" | "ADMIN" | "BANNED"

interface User {
    id: string
    username: string
    email: string
    roles: Roles
    avatarUrl: string
    isPrivate: boolean
    isVerified: boolean
    createdAt: string
    updatedAt: string
}

interface Profile extends User {
    displayName: string
    fullName: string
    biography: string
    birthDate: string
    location: string
    website: string
    socialMedia: string;
    videoChannel: string
    streamingChannel: string
}

interface Account extends User, Profile {
    commentsCount: number
    articlesCount: number
    readNotificationsCount: number
    unreadNotificationsCount: number
}

interface Author extends Omit<User, "createdAt" | "updatedAt"> {}

export type { Roles, User, Profile, Account, Author }