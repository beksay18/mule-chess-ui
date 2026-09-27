import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { alpha, useTheme } from '@mui/material/styles';
import { blogCoverSrc, BlogPost, deleteBlogPost, getAllBlogPosts } from 'src/api/blog';
import { DashboardContent } from 'src/layouts/dashboard';
import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';

const BRAND_BLUE = '#175195';

export function BlogAdminView() {
    const theme = useTheme();
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setLoading(true);
        setError('');
        try {
            setPosts(await getAllBlogPosts());
        } catch (err) {
            console.error('Failed to load blog posts', err);
            setPosts([]);
            setError('Could not load blog posts.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (post: BlogPost) => {
        if (!window.confirm(`Delete “${post.title}”?`)) {
            return;
        }
        try {
            await deleteBlogPost(post.id);
            await loadPosts();
        } catch (err) {
            console.error('Failed to delete blog post', err);
            setError('Could not delete that post.');
        }
    };

    return (
        <DashboardContent maxWidth="xl">
            <Stack spacing={3}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9375rem', maxWidth: 520 }}>
                        Create and edit articles shown on the public blog. Drafts stay hidden until you publish them.
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/blog-posts/form')}
                        sx={{
                            flexShrink: 0,
                            px: 2.5,
                            py: 1,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            borderRadius: 50,
                            bgcolor: BRAND_BLUE,
                            textTransform: 'none',
                            boxShadow: `0 4px 16px ${alpha(BRAND_BLUE, 0.25)}`,
                            '&:hover': { bgcolor: '#124578' },
                        }}
                    >
                        New article
                    </Button>
                </Box>

                {error && (
                    <Typography sx={{ color: 'error.main', fontWeight: 600 }}>{error}</Typography>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress sx={{ color: BRAND_BLUE }} />
                    </Box>
                ) : error ? null : posts.length > 0 ? (
                    <Stack spacing={1.5}>
                        {posts.map((post) => (
                            <Box
                                key={post.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2,
                                    p: 1.5,
                                    alignItems: { sm: 'center' },
                                    borderRadius: 2.5,
                                    border: `1px solid ${alpha(BRAND_BLUE, 0.12)}`,
                                    bgcolor: '#ffffff',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={blogCoverSrc(post.coverUrl)}
                                    alt=""
                                    sx={{
                                        width: { xs: '100%', sm: 112 },
                                        height: 72,
                                        objectFit: 'cover',
                                        borderRadius: 1.5,
                                        bgcolor: alpha(BRAND_BLUE, 0.06),
                                        flexShrink: 0,
                                    }}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color: theme.palette.grey[900],
                                            mb: 0.5,
                                        }}
                                    >
                                        {post.title}
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        <Chip
                                            size="small"
                                            label={post.category}
                                            sx={{
                                                fontWeight: 600,
                                                bgcolor: alpha(BRAND_BLUE, 0.08),
                                                color: BRAND_BLUE,
                                            }}
                                        />
                                        <Chip
                                            size="small"
                                            label={post.published ? 'Published' : 'Draft'}
                                            sx={{
                                                fontWeight: 600,
                                                bgcolor: post.published ? '#dcfce7' : theme.palette.grey[100],
                                                color: post.published ? '#166534' : theme.palette.grey[700],
                                            }}
                                        />
                                        <Typography variant="body2" sx={{ color: 'text.secondary', alignSelf: 'center' }}>
                                            {fDate(post.postedAt)} · {post.readTime} min
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Stack direction="row" spacing={0.5} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                                    <IconButton
                                        aria-label="Edit article"
                                        onClick={() => router.push(`/blog-posts/form/${post.id}`)}
                                    >
                                        <EditOutlinedIcon />
                                    </IconButton>
                                    <IconButton aria-label="Delete article" onClick={() => handleDelete(post)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Box
                        sx={{
                            py: 10,
                            textAlign: 'center',
                            borderRadius: 3,
                            border: `1px dashed ${alpha(BRAND_BLUE, 0.2)}`,
                            bgcolor: alpha(BRAND_BLUE, 0.02),
                        }}
                    >
                        <ArticleOutlinedIcon sx={{ fontSize: 48, color: alpha(BRAND_BLUE, 0.25), mb: 1.5 }} />
                        <Typography sx={{ fontWeight: 700, color: theme.palette.grey[800], mb: 0.5 }}>
                            No articles yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                            Add the first post for the public blog.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/blog-posts/form')}
                            sx={{
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 50,
                                color: BRAND_BLUE,
                                borderColor: alpha(BRAND_BLUE, 0.35),
                            }}
                        >
                            Create first article
                        </Button>
                    </Box>
                )}
            </Stack>
        </DashboardContent>
    );
}
