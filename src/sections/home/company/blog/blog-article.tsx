import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { alpha, useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { blogCoverSrc, BlogPost, getPublishedPost, getPublishedPosts } from 'src/api/blog';
import { CONFIG } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';
import { articleBodySx } from 'src/sections/blog/description-editor';
import { looksLikeHtml, sanitizeArticleHtml, toEditorHtml } from 'src/sections/blog/article-html';

const BRAND_BLUE = '#175195';

export default function BlogArticle() {
    const theme = useTheme();
    const router = useRouter();
    const { id } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [missing, setMissing] = useState(false);

    useEffect(() => {
        const postId = Number(id);
        if (!id || !Number.isFinite(postId)) {
            setMissing(true);
            setLoading(false);
            return undefined;
        }

        let active = true;
        setLoading(true);
        getPublishedPost(postId)
            .catch(() =>
                getPublishedPosts().then((posts) => {
                    const found = posts.find((item) => item.id === postId);
                    if (!found) {
                        throw new Error('Article not found');
                    }
                    return found;
                })
            )
            .then((data) => {
                if (!active) return;
                setPost(data);
                setMissing(false);
                document.title = `${data.title} - ${CONFIG.appName}`;
            })
            .catch((err) => {
                console.error('Failed to load article', err);
                if (!active) return;
                setPost(null);
                setMissing(true);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const bodyHtml = post
        ? sanitizeArticleHtml(looksLikeHtml(post.description) ? post.description : toEditorHtml(post.description))
        : '';

    return (
        <Box sx={{ bgcolor: '#ffffff', pb: { xs: 6, md: 10 } }}>
            <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 } }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push('/blog')}
                    sx={{
                        mb: 3,
                        fontWeight: 700,
                        color: BRAND_BLUE,
                        textTransform: 'none',
                    }}
                >
                    All articles
                </Button>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                        <CircularProgress sx={{ color: BRAND_BLUE }} />
                    </Box>
                ) : missing || !post ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', mb: 1 }}>
                            This article is not available
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                            It may be unpublished or the link is no longer valid.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => router.push('/blog')}
                            sx={{
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: 50,
                                bgcolor: BRAND_BLUE,
                            }}
                        >
                            Back to the blog
                        </Button>
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Chip
                                label={post.category}
                                size="small"
                                sx={{
                                    fontWeight: 700,
                                    bgcolor: alpha(BRAND_BLUE, 0.08),
                                    color: BRAND_BLUE,
                                }}
                            />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {fDate(post.postedAt)} · {post.readTime} min read
                            </Typography>
                        </Stack>

                        <Typography
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '1.75rem', md: '2.5rem' },
                                lineHeight: 1.2,
                                letterSpacing: '-0.03em',
                                color: theme.palette.grey[900],
                            }}
                        >
                            {post.title}
                        </Typography>

                        {post.coverUrl && (
                            <Box
                                component="img"
                                src={blogCoverSrc(post.coverUrl)}
                                alt=""
                                sx={{
                                    width: '100%',
                                    maxHeight: 460,
                                    objectFit: 'cover',
                                    borderRadius: 3,
                                }}
                            />
                        )}

                        <Box
                            sx={{
                                color: theme.palette.grey[800],
                                ...articleBodySx,
                                '& p': {
                                    fontSize: { xs: '1.0625rem', md: '1.125rem' },
                                    lineHeight: 1.8,
                                    my: 1.75,
                                },
                            }}
                            dangerouslySetInnerHTML={{ __html: bodyHtml }}
                        />
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
