import type { ReactNode } from 'react';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { RouterLink } from 'src/routes/components';
import { usePathname } from 'src/routes/hooks';

import { chessColors } from './theme';
import { useChessState } from './store';

// ----------------------------------------------------------------------

const HERO = '/assets/images/chess-hero.jpg';

function Mark() {
  return (
    <Box
      component="svg"
      viewBox="0 0 32 32"
      aria-hidden
      sx={{ width: 32, height: 32, display: 'block' }}
    >
      <rect width="32" height="32" rx="7" fill={chessColors.green} />
      <path fill="#f6f3ec" d="M15 5h2v3h3v2h-3v2.1c2.9.4 5 2.3 5 4.9v2H10v-2c0-2.6 2.1-4.5 5-4.9V10h-3V8h3V5z" />
      <path fill="#f6f3ec" d="M9 22.5h14v2.2H9z" />
    </Box>
  );
}

function usePageActive(href: string) {
  const pathname = usePathname();
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function SiteShell({
  children,
  variant = 'banner',
}: {
  children: ReactNode;
  variant?: 'home' | 'banner';
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', color: chessColors.ink, display: 'flex', flexDirection: 'column' }}>
      <SiteHeader />
      {variant === 'home' ? <HomeHero /> : <Banner />}
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <SiteFooter />
    </Box>
  );
}

export function MissingEvent() {
  return (
    <SiteShell>
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          That event is not listed
        </Typography>
        <Typography sx={{ color: chessColors.muted, mb: 3 }}>
          It may have been removed. The tournament list has everything that is still open.
        </Typography>
        <Button component={RouterLink} href="/tournaments" variant="contained" sx={{ bgcolor: chessColors.green }}>
          Back to tournaments
        </Button>
      </Container>
    </SiteShell>
  );
}

function SiteHeader() {
  const cartCount = useChessState().cart.length;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [supportAnchor, setSupportAnchor] = useState<HTMLElement | null>(null);

  const close = () => {
    setDrawerOpen(false);
    setSupportAnchor(null);
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        bgcolor: chessColors.headerBg,
        borderBottom: `1px solid ${chessColors.headerBorder}`,
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', minHeight: 68, gap: 2 }}>
        <Link
          component={RouterLink}
          href="/"
          underline="none"
          color="inherit"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mr: 'auto' }}
        >
          <Mark />
          <Typography sx={{ fontWeight: 800, fontSize: 18 }}>Mule Chess</Typography>
        </Link>

        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <NavLink href="/tournaments">Tournaments</NavLink>
          <NavLink href="/results">Results/Pairings</NavLink>
          <Button
            color="inherit"
            endIcon={<ArrowDropDownIcon />}
            onClick={(event) => setSupportAnchor(event.currentTarget)}
            aria-expanded={Boolean(supportAnchor)}
            aria-haspopup="menu"
          >
            Support
          </Button>
          <Menu anchorEl={supportAnchor} open={Boolean(supportAnchor)} onClose={close}>
            <MenuItem component={RouterLink} href="/contact" onClick={close}>
              Contact
            </MenuItem>
            <MenuItem component={RouterLink} href="/organize" onClick={close}>
              Organize a tournament
            </MenuItem>
          </Menu>
          <IconButton component={RouterLink} href="/registration-cart" aria-label="Cart" onClick={close}>
            <Badge badgeContent={cartCount} color="primary" invisible={cartCount === 0}>
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          <IconButton component={RouterLink} href="/registration-cart" aria-label="Cart">
            <Badge badgeContent={cartCount} color="primary" invisible={cartCount === 0}>
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
          <IconButton aria-label="Open menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Stack>
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ fontWeight: 800 }}>Mule Chess</Typography>
            <IconButton aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <DrawerLink href="/tournaments" onClick={close}>
            Tournaments
          </DrawerLink>
          <DrawerLink href="/results" onClick={close}>
            Results/Pairings
          </DrawerLink>
          <DrawerLink href="/past-events" onClick={close}>
            Past events
          </DrawerLink>
          <DrawerLink href="/contact" onClick={close}>
            Contact
          </DrawerLink>
          <DrawerLink href="/organize" onClick={close}>
            Organize a tournament
          </DrawerLink>
        </Box>
      </Drawer>
    </Box>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  const active = usePageActive(href);
  return (
    <Button
      component={RouterLink}
      href={href}
      color="inherit"
      sx={{ fontWeight: active ? 800 : 600, color: active ? chessColors.link : chessColors.ink }}
    >
      {children}
    </Button>
  );
}

function DrawerLink({ href, children, onClick }: { href: string; children: string; onClick: () => void }) {
  return (
    <Button component={RouterLink} href={href} onClick={onClick} color="inherit" fullWidth sx={{ justifyContent: 'flex-start' }}>
      {children}
    </Button>
  );
}

function HomeHero() {
  return (
    <Box sx={{ position: 'relative', height: { xs: 460, md: 620 }, bgcolor: chessColors.hero, overflow: 'hidden' }}>
      <Box
        component="img"
        src={HERO}
        alt=""
        sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(12,18,14,0.05) 20%, rgba(12,18,14,0.72) 100%)',
        }}
      />
      <Container
        maxWidth="lg"
        sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, pb: { xs: 4, md: 7 }, color: '#fff' }}
      >
        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: 40, md: 64 }, letterSpacing: -0.5 }}>
          Mule Chess
        </Typography>
        <Typography sx={{ mt: 1, mb: 3, maxWidth: 560, fontSize: { xs: 18, md: 22 }, fontWeight: 500 }}>
          An advanced registration system for chess tournaments
        </Typography>
        <Button
          component={RouterLink}
          href="/tournaments"
          variant="contained"
          size="large"
          sx={{ bgcolor: chessColors.green, '&:hover': { bgcolor: chessColors.greenHover } }}
        >
          Browse tournaments
        </Button>
      </Container>
    </Box>
  );
}

function Banner() {
  return (
    <Box sx={{ height: { xs: 96, md: 132 }, bgcolor: chessColors.hero, overflow: 'hidden' }}>
      <Box
        component="img"
        src={HERO}
        alt=""
        sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
      />
    </Box>
  );
}

function SiteFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: '#f7f7f8', borderTop: `1px solid ${chessColors.line}`, py: 4, mt: 4 }}>
      <Stack spacing={1} sx={{ alignItems: 'center' }}>
        <FooterLinks
          items={[
            { href: '/', label: 'Home' },
            { href: '/tournaments', label: 'Tournaments' },
            { href: '/past-events', label: 'Past Events' },
            { href: '/contact', label: 'Contact' },
          ]}
        />
        <Typography sx={{ color: chessColors.muted, fontSize: 14, textAlign: 'center', px: 2 }}>
          Copyright © {new Date().getFullYear()} Mule Chess. All Rights Reserved.
        </Typography>
        <FooterLinks
          items={[
            { href: '/about', label: 'About' },
            { href: '/terms', label: 'Terms' },
            { href: '/organize', label: 'Organize' },
          ]}
        />
      </Stack>
    </Box>
  );
}

function FooterLinks({ items }: { items: { href: string; label: string }[] }) {
  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={1.5}
      sx={{ justifyContent: 'center', flexWrap: 'wrap', py: 0.5 }}
    >
      {items.map((item) => (
        <Link key={item.href} component={RouterLink} href={item.href} underline="hover" sx={{ color: chessColors.link }}>
          {item.label}
        </Link>
      ))}
    </Stack>
  );
}
