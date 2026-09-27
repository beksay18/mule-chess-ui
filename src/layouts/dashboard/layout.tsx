import type { Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';

import { NavMobile, NavDesktop } from './nav';
import { layoutClasses } from '../core/classes';
import { _account } from '../nav-config-account';
import { dashboardLayoutVars } from './css-vars';
import {getNavData} from '../nav-config-dashboard';
import { MainSection } from '../core/main-section';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountPopover } from '../components/account-popover';
import IconButton from '@mui/material/IconButton';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useRouter} from "../../routes/hooks";
import {useEffect, useState} from "react";
import {getNewContactCount} from "../../api/contacts";
import {getNewOrdersCount} from "../../api/order";
import {getCurrentUser} from "../../api";

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
    orderNumber?: string;
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
                                    orderNumber,
}: DashboardLayoutProps) {
  const theme = useTheme();
  const router = useRouter();
  const isManager = getCurrentUser()?.role === 'ROLE_MANAGER';
  const [newContactCount, setNewContactCount] = useState(0);
  const [newOrderCount, setNewOrderCount] = useState(0);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const getPageTitle = (pathname: string): string => {
    if (pathname.startsWith('/orders')) return 'Orders';
    if (pathname.startsWith('/user')) return 'Users';
    if (pathname.startsWith('/contacts')) return 'Contacts';
    if (pathname.startsWith('/faq')) return 'FAQ';
    if (pathname.startsWith('/blog-posts')) return 'Blog';
    if (pathname.startsWith('/products-types')) return 'Product Types';
    if (pathname.startsWith('/products')) return 'Products';
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    return '';
  };

  const pageTitle = getPageTitle(location.pathname);
  const isOrderDetails = location.pathname.startsWith('/order-details');

    useEffect(() => {
        if (!isManager) {
            getNewContactCount().then(setNewContactCount).catch(() => setNewContactCount(0));
        }
        getNewOrdersCount().then(setNewOrderCount).catch(() => setNewOrderCount(0));
    }, [isManager]);

    const navData = getNavData(newOrderCount, getCurrentUser()?.role);

    const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
              onClick={onOpen}
              sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          {isOrderDetails ? (
              <Box display="flex" alignItems="center" gap={1.5} ml={1}>
                  <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={() => router.back()}
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'none' }}
                  >
                      Back
                  </Button>
                  <Typography variant="h4" noWrap>
                      {orderNumber ? `Order #${orderNumber}` : 'Order'}
                  </Typography>
              </Box>
          ) : pageTitle ? (
              <Typography variant="h4" ml={3} noWrap>
                {pageTitle}
              </Typography>
          ) : null}
          <NavMobile data={navData} open={open} onClose={onClose} />
        </>
      ),
      rightArea: (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 4 } }}>
              {!isManager && <IconButton
                  onClick={() => router.push('/contacts')}
                  sx={{
                      p: 0,
                  }}
              >
                  <Badge badgeContent={newContactCount} color="error">
                      <MailIcon
                          color="action"
                          sx={{
                              fontSize: {
                                  xs: 24,
                                  sm: 30,
                              },
                          }}
                      />
                  </Badge>
              </IconButton>}
            <AccountPopover data={_account} />
          </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          {
            borderBottom: `1px dotted ${theme.palette.divider}`,
            zIndex: theme.zIndex.appBar,
            mb: 3,
          },
          ...(Array.isArray(slotProps?.header?.sx) ? slotProps.header.sx : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery}  />
      }
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            position: 'relative',
            bgcolor: '#f6f8fb',
            backgroundImage: `radial-gradient(${alpha('#175195', 0.09)} 1.2px, transparent 1.2px)`,
            backgroundSize: '22px 22px',
            [theme.breakpoints.up(layoutQuery)]: {
              pl: 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
