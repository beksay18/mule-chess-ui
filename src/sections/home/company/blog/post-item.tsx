import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { alpha, useTheme } from '@mui/material/styles';
import { fDate } from 'src/utils/format-time';

const BRAND_BLUE = '#175195';

export type BlogCategory = 'Design tips' | 'Marketing' | 'Guides';

export type IPostItem = {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
    category: BlogCategory;
    readTime: number;
    postedAt: string;
};

type PostItemProps = {
    post: IPostItem;
    featured?: boolean;
    onRead?: (post: IPostItem) => void;
};

export function PostItem({ post, featured = false, onRead }: PostItemProps) {
    const theme = useTheme();

    return (
        <Box
            component="article"
            onClick={() => onRead?.(post)}
            sx={{
                display: 'flex',
                flexDirection: featured ? { xs: 'column', md: 'row' } : 'column',
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: '#ffffff',
                border: `1px solid ${theme.palette.grey[200]}`,
                cursor: onRead ? 'pointer' : 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                '&:hover': onRead
                    ? {
                          transform: 'translateY(-4px)',
                          borderColor: alpha(BRAND_BLUE, 0.25),
                          boxShadow: `0 12px 32px ${alpha(BRAND_BLUE, 0.12)}`,
                          '& .post-cover': { transform: 'scale(1.03)' },
                          '& .post-read-link': {
                              color: BRAND_BLUE,
                              '& .MuiSvgIcon-root': { transform: 'translateX(4px)' },
                          },
                      }
                    : {},
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    flexShrink: 0,
                    width: featured ? { xs: '100%', md: '48%' } : '100%',
                    pt: featured ? { xs: '56%', md: 0 } : '56%',
                    minHeight: featured ? { md: 280 } : undefined,
                    overflow: 'hidden',
                    bgcolor: alpha(BRAND_BLUE, 0.04),
                }}
            >
                <Box
                    component="img"
                    alt={post.title}
                    src={post.coverUrl}
                    className="post-cover"
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                    }}
                />
                <Chip
                    label={post.category}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        bgcolor: alpha('#ffffff', 0.95),
                        color: BRAND_BLUE,
                        border: `1px solid ${alpha(BRAND_BLUE, 0.15)}`,
                    }}
                />
            </Box>

            <Stack
                spacing={1.5}
                sx={{
                    flex: 1,
                    p: featured ? { xs: 2.5, md: 3.5 } : 2.5,
                    justifyContent: featured ? 'center' : 'flex-start',
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {fDate(post.postedAt)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                        ·
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        {post.readTime} min read
                    </Typography>
                </Stack>

                <Typography
                    component="h2"
                    sx={{
                        fontWeight: 800,
                        fontSize: featured ? { xs: '1.25rem', md: '1.5rem' } : '1.0625rem',
                        lineHeight: 1.35,
                        color: theme.palette.grey[900],
                        letterSpacing: '-0.02em',
                    }}
                >
                    {post.title}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        lineHeight: 1.7,
                        display: '-webkit-box',
                        WebkitLineClamp: featured ? 4 : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {post.description}
                </Typography>

                {onRead && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        className="post-read-link"
                        sx={{
                            pt: 0.5,
                            color: theme.palette.grey[600],
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            transition: 'color 0.2s ease',
                        }}
                    >
                        Read article
                        <ArrowForwardIcon
                            sx={{ fontSize: 16, transition: 'transform 0.2s ease' }}
                        />
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
