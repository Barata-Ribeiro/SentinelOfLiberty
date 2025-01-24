import { Author } from "@/@types/user"

interface Notice {
    id: number;
    title: string;
    message: string;
    isActive: boolean;
    user: Author;
    createdAt: Date;
    updatedAt: Date;
}

export type { Notice }