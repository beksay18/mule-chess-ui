import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';
import { logoClasses } from './classes';
import {getCurrentUser} from "../../api";

// ----------------------------------------------------------------------

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
  const theme = useTheme();
  const user = getCurrentUser();
  const href = user?.role === 'ROLE_ADMIN' ? '/dashboard' : '/';

    return (
      <LogoRoot
          component={RouterLink}
          href={href}
          aria-label="Logo"
          underline="none"
          className={mergeClasses([logoClasses.root, className])}
          sx={[
            {
              width: 'auto',
              height: 'auto',
              fontSize: isSingle ? 20 : 28,
              fontWeight: 800,
              color: theme.palette.primary.main,
              ...(disabled && { pointerEvents: 'none', opacity: 0.5 }),
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...other}
      >
        SAKAI
      </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(({ theme }) => ({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
  fontFamily: `'Poppins', 'Segoe UI', 'Roboto', sans-serif`,
  textDecoration: 'none',
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  fontWeight: 900,
  fontSize: 24,
  transition: 'all 0.3s ease',
}));
