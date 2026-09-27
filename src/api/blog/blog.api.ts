import { axios } from '../http';
import { ENDPOINTS } from '../constant';
import { BlogPost, BlogPostRequest } from './type';

export const blogCoverSrc = (coverUrl?: string) => {
    if (!coverUrl) return '';
    if (coverUrl.startsWith('http') || coverUrl.startsWith('/assets') || coverUrl.startsWith('data:')) {
        return coverUrl;
    }
    const base = import.meta.env.MODE === 'development' ? import.meta.env.VITE_API_BASE_IMAGE_URL : '';
    return `${base}${coverUrl}`;
};

const toFormData = (payload: BlogPostRequest) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('category', payload.category);
    formData.append('readTime', String(payload.readTime));
    formData.append('postedAt', payload.postedAt);
    formData.append('published', String(payload.published));
    if (payload.image) {
        formData.append('image', payload.image);
    }
    return formData;
};

const publicHeaders = { headers: { 'x-skip-auth': 'true' } };

export const getPublishedPosts = (): Promise<BlogPost[]> =>
    axios.get<BlogPost[]>(ENDPOINTS.BLOG.GET_PUBLISHED, publicHeaders).then(({ data }) => data);

export const getPublishedPost = (id: number): Promise<BlogPost> =>
    axios.get<BlogPost>(ENDPOINTS.BLOG.GET_PUBLISHED_BY_ID(id), publicHeaders).then(({ data }) => data);

export const getAllBlogPosts = (): Promise<BlogPost[]> =>
    axios.getWithRetries<BlogPost[]>(ENDPOINTS.BLOG.GET_ALL).then(({ data }) => data);

export const getBlogPost = (id: number): Promise<BlogPost> =>
    axios.getWithRetries<BlogPost>(ENDPOINTS.BLOG.GET_BY_ID(id)).then(({ data }) => data);

export const createBlogPost = (payload: BlogPostRequest): Promise<BlogPost> =>
    axios
        .post<BlogPost>(ENDPOINTS.BLOG.CREATE, toFormData(payload), {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(({ data }) => data);

export const updateBlogPost = (id: number, payload: BlogPostRequest): Promise<BlogPost> =>
    axios
        .put<BlogPost>(ENDPOINTS.BLOG.UPDATE(id), toFormData(payload), {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(({ data }) => data);

export const deleteBlogPost = (id: number): Promise<void> =>
    axios.deleteWithRetries<void>(ENDPOINTS.BLOG.DELETE(id)).then(() => {});
