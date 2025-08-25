import {axios} from "../http";
import {ENDPOINTS} from "../constant";
import {ProductReviewResponsePage, ProductReviewSummary, ProductTypeReviewSummary, ReviewRequest} from "./type";

export const createReview = (payload: ReviewRequest): Promise<void> =>
    axios.post(ENDPOINTS.REVIEWS.CREATE_REVIEW, payload).then(() => {});

export const getProductReviews = ({page, size, productId, filter}: {
    page: number;
    size: number;
    productId?: number;
    filter?: string;
}): Promise<ProductReviewResponsePage> =>
    axios.getWithRetries<ProductReviewResponsePage>(
        `${ENDPOINTS.REVIEWS.PRODUCT_REVIEW}?page=${page}&size=${size}` +
        `${filter ? `&filter=${encodeURIComponent(filter)}` : ''}` +
        `${productId ? `&productId=${productId}` : ''}`
    ).then(({data}) => data);

export const getProductReviewSummary = (productId: number): Promise<ProductReviewSummary> =>
    axios.get<ProductReviewSummary>(`${ENDPOINTS.REVIEWS.PRODUCT_REVIEW_SUMMARY}/${productId}`)
        .then(({ data }) => data);

export const getProductTypeReviewSummary = (productTypeId: number): Promise<ProductTypeReviewSummary> =>
    axios.get<ProductTypeReviewSummary>(`${ENDPOINTS.REVIEWS.PRODUCT_TYPE_REVIEW_SUMMARY}/${productTypeId}`)
        .then(({ data }) => data);