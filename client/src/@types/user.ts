import { ArticleSummary } from "@/@types/articles"
import { Suggestion }     from "@/@types/suggestions"

type Roles = "NONE" | "USER" | "ADMIN" | "BANNED"

interface User {
    id: string
    username: string
    email: string
    role: Roles
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
    socialMedia: string
    videoChannel: string
    streamingChannel: string
}

interface Account extends User, Profile {
    commentsCount: number
    articlesCount: number
    readNotificationsCount: number
    unreadNotificationsCount: number
}

type Author = Omit<User, "createdAt" | "updatedAt">

interface Dashboard {
    latestWrittenArticle: ArticleSummary;
    latestThreeSuggestions: Set<Suggestion>;
    latestThreeComments: Set<object>;
    totalWrittenArticles: number;
    totalWrittenSuggestions: number;
    totalWrittenComments: number;
}

type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    recipient: Author;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { Roles, User, Profile, Account, Author, Dashboard, NotificationType, Notification }
