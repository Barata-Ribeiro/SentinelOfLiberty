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

type ArticleSummary = Pick<
    Article,
    "id" | "title" | "subTitle" | "summary" | "mediaUrl" | "slug" | "wasEdit" | "author" | "createdAt" | "updatedAt"
> & {
    commentsCount: number;
}

export type { Category, Article, ArticleSummary }