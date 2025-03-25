import { Suggestion } from "@/@types/suggestions"
import { Author }     from "@/@types/user"

interface Category {
    id: number;
    name: string;
    description: string;
}

interface Article {
    id: number;
    title: string;
    subTitle: string;
    content: string;
    summary: string;
    references: string[];
    mediaUrl: string;
    slug: string;
    wasEdit: boolean;
    author: Author;
    suggestion: Suggestion;
    categories: Set<Category>;
    createdAt: Date;
    updatedAt: Date;
}

interface ArticleSummary {
    id: number;
    title: string;
    subTitle: string;
    summary: string;
    mediaUrl: string;
    slug: string;
    commentsCount: number;
    author: Author;
    createdAt: Date;
}

export type { Category, Article, ArticleSummary }