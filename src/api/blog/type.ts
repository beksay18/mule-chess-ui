export type BlogCategory = 'Design tips' | 'Marketing' | 'Guides';

export const BLOG_CATEGORIES: BlogCategory[] = ['Design tips', 'Marketing', 'Guides'];

export type BlogPost = {
    id: number;
    title: string;
    description: string;
    category: BlogCategory;
    coverUrl: string;
    readTime: number;
    postedAt: string;
    published: boolean;
};

export type BlogPostRequest = {
    title: string;
    description: string;
    category: BlogCategory;
    readTime: number;
    postedAt: string;
    published: boolean;
    image?: File | null;
};
