import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import type { NavItem } from '../nav-config-dashboard';

const BRAND_BLUE = '#175195';
const NAV_BG = '#f6f8fb';

const navSurfaceSx = {
    bgcolor: NAV_BG,
    borderRight: `1px solid ${alpha(BRAND_BLUE, 0.08)}`,
};

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        ...navSurfaceSx,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...navSurfaceSx,
          borderRight: 'none',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots}  />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();

  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Logo
            sx={{
              flex: 1,
              minWidth: 0,
              '& img': {
                width: '100%',
                maxWidth: 'none',
                height: 42,
                objectFit: 'contain',
                objectPosition: 'left center',
              },
            }}
          />
          <Chip
            label="Admin"
            size="small"
            sx={{
              flexShrink: 0,
              height: 24,
              fontWeight: 700,
              fontSize: '0.6875rem',
              letterSpacing: '0.04em',
              bgcolor: alpha(BRAND_BLUE, 0.1),
              color: BRAND_BLUE,
              border: `1px solid ${alpha(BRAND_BLUE, 0.18)}`,
            }}
          />
        </Stack>

        <Divider sx={{ mt: 2.5, borderColor: alpha(BRAND_BLUE, 0.1) }} />
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box
            component="ul"
            sx={{
              gap: 0.5,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                        pl: 1.75,
                        py: 1,
                        gap: 1.5,
                        pr: 1.5,
                        borderRadius: 2,
                        typography: 'body2',
                        fontWeight: isActived ? 700 : 500,
                        color: isActived ? BRAND_BLUE : 'text.secondary',
                        minHeight: 44,
                        border: '1px solid transparent',
                        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                        ...(isActived
                            ? {
                                  bgcolor: '#ffffff',
                                  borderColor: alpha(BRAND_BLUE, 0.12),
                                  boxShadow: `0 2px 8px ${alpha(BRAND_BLUE, 0.08)}`,
                                  '&:hover': {
                                      bgcolor: '#ffffff',
                                  },
                              }
                            : {
                                  '&:hover': {
                                      bgcolor: alpha(BRAND_BLUE, 0.06),
                                  },
                              }),
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    <Box component="span" sx={{ flexGrow: 1 }}>
                      {item.title}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
