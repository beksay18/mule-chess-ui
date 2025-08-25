import * as React from 'react';
import {Container, Typography, Box} from '@mui/material';
import {Masonry} from '@mui/lab';
import {PostItem} from "./post-item";
import BlogTitle from "./blog-title";

export type IPostItem = {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
    totalViews: number;
    totalShares: number;
    totalComments: number;
    totalFavorites: number;
    postedAt: string | number | null;
    author: {
        name: string;
        avatarUrl: string;
    };
};

export default function Blog() {
    const posts: IPostItem[] = [
        {
            id: '1',
            title: '5 Creative Ways to Use Custom Stickers for Your Brand',
            coverUrl: '/assets/images/product/product-11.webp',
            description: 'Boost brand visibility with these sticker marketing ideas.',
            totalViews: 338,
            totalShares: 58,
            totalComments: 26,
            totalFavorites: 33,
            postedAt: '2025-06-01T00:00:00',
            author: {
                name: 'CG Team',
                avatarUrl: '/assets/images/avatar/avatar-1.webp',
            },
        },
        {
            id: '2',
            title: 'How to Choose the Right Sticker Finish: Glossy vs Matte',
            coverUrl: '/assets/images/product/product-5.webp',
            description: "Deciding between gloss and matte? Here's a breakdown.",
            totalViews: 999,
            totalShares: 44,
            totalComments: 17,
            totalFavorites: 27,
            postedAt: '2025-05-20T00:00:00',
            author: {
                name: 'CG Stickers',
                avatarUrl: '/assets/images/avatar/avatar-1.webp',
            },
        },
        {
            id: '3',
            title: 'The Magic of Custom Sticker Packs for Events and Make them',
            coverUrl: '/assets/images/product/product-3.webp',
            description: 'Engage event guests with themed sticker packs.',
            totalViews: 691,
            totalShares: 36,
            totalComments: 12,
            totalFavorites: 44,
            postedAt: '2025-05-10T00:00:00',
            author: {
                name: 'Bektur Saiitkulov',
                avatarUrl: '/assets/images/avatar/avatar-1.webp',
            },
        },
    ];

    return (
        <>
            <BlogTitle/>
            <Container sx={{py: 5}}>
                <Box>
                    <Masonry columns={{xs: 1, md: 3}} spacing={3}>
                        {posts.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                latestPost={false}
                                latestPostLarge={false}
                            />
                        ))}
                    </Masonry>
                </Box>
            </Container>
        </>
    );
}
