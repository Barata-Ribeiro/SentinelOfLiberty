import { Author } from "@/@types/user"

interface Comment {
    id: number;
    content: string;
    user: Author;
    articleId: number;
    articleTitle: string;
    articleSlug: string;
    parentId?: number;
    childrenCount: number;
    children: Comment[];
    createdAt: Date;
    updatedAt: Date;
}

export type { Comment }