import { Author } from "@/@types/user"

interface Suggestion {
    id: number;
    title: string;
    content: string;
    mediaUrl: string;
    sourceUrl: string;
    user: Author;
    articlesWritten: number;
    createdAt: Date;
    updatedAt: Date;
}

export type { Suggestion }