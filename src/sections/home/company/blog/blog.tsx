import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { useRouter } from '../../../../routes/hooks';
import BlogTitle from './blog-title';
import { BlogCategory, IPostItem, PostItem } from './post-item';

const BRAND_BLUE = '#175195';

const CATEGORIES: Array<BlogCategory | 'All'> = ['All', 'Design tips', 'Marketing', 'Guides'];

const POSTS: IPostItem[] = [
    {
        id: '1',
        title: '5 creative ways to use custom stickers for your brand',
        coverUrl: '/assets/images/product/product-11.webp',
        description:
            'From packaging to event swag, stickers are one of the most versatile tools in your marketing kit. Here are five practical ideas to put your brand in more hands — without blowing your budget.',
        category: 'Marketing',
        readTime: 4,
        postedAt: '2025-06-01T00:00:00',
    },
    {
        id: '2',
        title: 'Glossy vs matte: choosing the right sticker finish',
        coverUrl: '/assets/images/product/product-5.webp',
        description:
            'Finish changes how your design looks and feels in the real world. Compare gloss and matte so you can pick the option that matches your artwork, surface, and vibe.',
        category: 'Guides',
        readTime: 3,
        postedAt: '2025-05-20T00:00:00',
    },
    {
        id: '3',
        title: 'Custom sticker packs that make events unforgettable',
        coverUrl: '/assets/images/product/product-3.webp',
        description:
            'Sticker packs turn guests into walking billboards. Learn how to theme a pack for conferences, pop-ups, and community events that people actually want to take home.',
        category: 'Marketing',
        readTime: 5,
        postedAt: '2025-05-10T00:00:00',
    },
    {
        id: '4',
        title: 'How to prepare artwork for sticker printing',
        coverUrl: '/assets/images/home-products/cg-sticker-house.png',
        description:
            'Clean files mean sharper prints. A quick checklist for resolution, bleed, color, and file types so your stickers look exactly how you designed them.',
        category: 'Design tips',
        readTime: 6,
        postedAt: '2025-04-28T00:00:00',
    },
    {
        id: '5',
        title: 'Why die-cut stickers stand out on shelves and laptops',
        coverUrl: '/assets/images/product/product-12.webp',
        description:
            'Custom shapes grab attention instantly. See when die-cut makes sense, how to design for cut lines, and why creators and brands love the extra personality.',
        category: 'Design tips',
        readTime: 4,
        postedAt: '2025-04-15T00:00:00',
    },
];

export default function Blog() {
    const theme = useTheme();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('All');

    const filteredPosts = useMemo(() => {
        if (activeCategory === 'All') {
            return POSTS;
        }
        return POSTS.filter((post) => post.category === activeCategory);
    }, [activeCategory]);

    const featuredPost = filteredPosts[0] ?? null;
    const gridPosts = filteredPosts.slice(1);

    const handleReadPost = (post: IPostItem) => {
        router.push(`/contact-us?subject=${encodeURIComponent(`Blog: ${post.title}`)}`);
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', pb: { xs: 6, md: 8 } }}>
            <BlogTitle />

            <Container maxWidth="lg" sx={{ pb: 2 }}>
                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ justifyContent: 'center', mb: { xs: 4, md: 5 } }}
                >
                    {CATEGORIES.map((category) => {
                        const isActive = activeCategory === category;
                        return (
                            <Chip
                                key={category}
                                label={category}
                                clickable
                                onClick={() => setActiveCategory(category)}
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8125rem',
                                    borderRadius: 50,
                                    px: 0.5,
                                    bgcolor: isActive ? BRAND_BLUE : '#ffffff',
                                    color: isActive ? '#ffffff' : theme.palette.grey[700],
                                    border: `1px solid ${
                                        isActive ? BRAND_BLUE : alpha(BRAND_BLUE, 0.2)
                                    }`,
                                    '&:hover': {
                                        bgcolor: isActive ? '#124578' : alpha(BRAND_BLUE, 0.06),
                                    },
                                }}
                            />
                        );
                    })}
                </Stack>

                {filteredPosts.length > 0 ? (
                    <Stack spacing={3}>
                        {featuredPost && (
                            <PostItem
                                post={featuredPost}
                                featured
                                onRead={handleReadPost}
                            />
                        )}

                        {gridPosts.length > 0 && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: '1fr 1fr',
                                        lg: 'repeat(3, 1fr)',
                                    },
                                    gap: 3,
                                }}
                            >
                                {gridPosts.map((post) => (
                                    <PostItem
                                        key={post.id}
                                        post={post}
                                        onRead={handleReadPost}
                                    />
                                ))}
                            </Box>
                        )}
                    </Stack>
                ) : (
                    <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary' }}>
                        <ArticleOutlinedIcon
                            sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.25), mb: 1.5 }}
                        />
                        <Typography sx={{ fontWeight: 600, color: theme.palette.grey[700], mb: 0.5 }}>
                            No articles in this category yet
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Check back soon — we&apos;re always adding new sticker tips.
                        </Typography>
                        <Button
                            onClick={() => setActiveCategory('All')}
                            sx={{
                                fontWeight: 600,
                                color: BRAND_BLUE,
                                textTransform: 'none',
                            }}
                        >
                            View all articles
                        </Button>
                    </Box>
                )}
            </Container>

            <Box
                sx={{
                    mt: { xs: 4, md: 6 },
                    py: { xs: 5, md: 6 },
                    bgcolor: alpha(BRAND_BLUE, 0.03),
                    borderTop: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
                }}
            >
                <Container maxWidth="sm">
                    <Stack spacing={2.5} alignItems="center" sx={{ textAlign: 'center' }}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.25rem', md: '1.5rem' },
                                color: theme.palette.grey[900],
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Have a sticker question?
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                            Our team is happy to help with artwork, materials, and order advice.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => router.push('/contact-us')}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 700,
                                    borderRadius: 50,
                                    bgcolor: BRAND_BLUE,
                                    textTransform: 'none',
                                    boxShadow: `0 8px 24px ${alpha(BRAND_BLUE, 0.25)}`,
                                    '&:hover': { bgcolor: '#124578' },
                                }}
                            >
                                Contact us
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                fullWidth
                                onClick={() => {
                                    router.push('/');
                                    setTimeout(() => {
                                        document
                                            .getElementById('home-products')
                                            ?.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                }}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 700,
                                    borderRadius: 50,
                                    color: BRAND_BLUE,
                                    borderColor: alpha(BRAND_BLUE, 0.3),
                                    textTransform: 'none',
                                    '&:hover': {
                                        borderColor: BRAND_BLUE,
                                        bgcolor: alpha(BRAND_BLUE, 0.04),
                                    },
                                }}
                            >
                                Shop stickers
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
