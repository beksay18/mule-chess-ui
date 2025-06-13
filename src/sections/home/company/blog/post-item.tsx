import type { CardProps } from '@mui/material/Card';
import type { IconifyName } from 'src/components/iconify';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

export type IPostItem = {
    id: string;
    title: string;
    coverUrl: string;
    totalViews: number;
    description: string;
    totalShares: number;
    totalComments: number;
    totalFavorites: number;
    postedAt: string | number | null;
    author: {
        name: string;
        avatarUrl: string;
    };
};

export function PostItem({
                             sx,
                             post,
                             latestPost,
                             latestPostLarge,
                             ...other
                         }: CardProps & {
    post: IPostItem;
    latestPost: boolean;
    latestPostLarge: boolean;
}) {
    return (
        <Card sx={sx} {...other}>
            <Box
                sx={(theme) => ({
                    position: 'relative',
                    pt: 'calc(100% * 3 / 4)',
                    overflow: 'hidden',
                    borderRadius: 2,
                    ...(latestPostLarge || latestPost
                        ? {
                            pt: 'calc(100% * 4 / 3)',
                            '&:after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                bgcolor: varAlpha(theme.palette.grey['900Channel'], 0.72),
                                zIndex: 1,
                            },
                        }
                        : {}),
                })}
            >
                <Box
                    component="img"
                    alt={post.title}
                    src={post.coverUrl}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />

                {(latestPostLarge || latestPost) && (
                    <>
                        <SvgColor
                            src="/assets/icons/shape-avatar.svg"
                            sx={{
                                position: 'absolute',
                                left: 0,
                                bottom: -16,
                                width: 88,
                                height: 36,
                                zIndex: 2,
                                color: 'background.paper',
                            }}
                        />
                        <Avatar
                            src={post.author.avatarUrl}
                            alt={post.author.name}
                            sx={{
                                position: 'absolute',
                                left: 24,
                                top: 24,
                                zIndex: 2,
                            }}
                        />
                    </>
                )}
            </Box>

            <Box
                sx={{
                    p: 3,
                    ...(latestPostLarge || latestPost
                        ? {
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            color: 'common.white',
                        }
                        : {}),
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        mb: 1,
                        color: (latestPostLarge || latestPost) ? 'common.white' : 'text.disabled',
                    }}
                >
                    {fDate(post.postedAt)}
                </Typography>

                <Link
                    variant={latestPostLarge ? 'h5' : 'subtitle2'}
                    underline="hover"
                    color="inherit"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {post.title}
                </Link>

                <Box
                    sx={{
                        mt: 2,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        color: (latestPostLarge || latestPost) ? 'common.white' : 'text.disabled',
                    }}
                >
                    {[{ icon: 'solar:chat-round-dots-bold', number: post.totalComments },
                        { icon: 'solar:eye-bold', number: post.totalViews },
                        { icon: 'solar:share-bold', number: post.totalShares },
                    ].map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Iconify icon={item.icon as IconifyName} width={16} sx={{ mr: 0.5 }} />
                            <Typography variant="caption">{fShortenNumber(item.number)}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Card>
    );
}
