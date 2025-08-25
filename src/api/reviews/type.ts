import {PaginatedResponse} from "../order";

export type ProductReviewResponsePage = PaginatedResponse<ProductReviewContent>;

export interface ProductReviewContent {
    rating: number;
    customerFirstName: string;
    customerLastName: string;
    dateCreated: string;
    title: string;
    description: string;
}

export type ReviewRequest = {
    title: string;
    description: string;
    rating: number;
    productId: number;
    userId: number;
    isActive: boolean;
};

export type ProductReviewSummary = {
    averageRating: number;
    totalReviews: number;
    wouldOrderAgainPct: number;
};