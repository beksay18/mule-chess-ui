import type { LinkProps } from '@mui/material/Link';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { mergeClasses } from 'minimal-shared/utils';

import { RouterLink } from 'src/routes/components';
import { getCurrentUser } from '../../api';
import { logoClasses } from './classes';

const LOGO_SRC = '/assets/images/home-products/cg-sticker-house.png';

export type LogoProps = LinkProps & {
    isSingle?: boolean;
    disabled?: boolean;
};

export function Logo({
    sx,
    disabled,
    className,
    isSingle = true,
    ...other
}: LogoProps) {
    const user = getCurrentUser();
    const href = user?.role === 'ROLE_ADMIN' ? '/dashboard' : '/';

    return (
        <LogoRoot
            component={RouterLink}
            href={href}
            aria-label="CG Sticker House home"
            underline="none"
            className={mergeClasses([logoClasses.root, className])}
            sx={[
                {
                    width: 'auto',
                    ...(disabled && { pointerEvents: 'none', opacity: 0.5 }),
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Box
                component="img"
                src={LOGO_SRC}
                alt="CG Sticker House"
                sx={{
                    height: isSingle ? 44 : 52,
                    width: 'auto',
                    maxWidth: isSingle ? 200 : 240,
                    objectFit: 'contain',
                    display: 'block',
                }}
            />
        </LogoRoot>
    );
}

const LogoRoot = styled(Link)({
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    transition: 'opacity 0.2s ease',
    '&:hover': {
        opacity: 0.88,
    },
});
