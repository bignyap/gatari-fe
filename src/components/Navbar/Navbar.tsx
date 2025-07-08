import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar, Box, Container, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';

import '../../App.css';

const pages = [
  { name: 'Organizations', link: '/organizations' },
  { name: 'Subscription Tiers', link: '/subTier' },
  {
    name: 'Resources',
    link: '/resources',
    children: [
      { name: 'Endpoints', link: '/resources/endpoints' },
      { name: 'Resources', link: '/resources/types' },
    ],
  },
  { name: 'Usage', link: '/usage' },
];

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState<HTMLElement | null>(null);
  const [selectedPage, setSelectedPage] = React.useState<string>('');
  const [selectedParentPage, setSelectedParentPage] = React.useState<string>('');

  React.useEffect(() => {
    const currentPath = location.pathname;

    const parent = pages.find((page) =>
      page.children?.some((sub) => sub.link === currentPath)
    );

    const child = parent?.children?.find((sub) => sub.link === currentPath);

    if (child) {
      setSelectedPage(child.name);
      setSelectedParentPage(parent?.name || '');
    } else {
      const page = pages.find((p) => p.link === currentPath);
      setSelectedPage(page?.name || '');
      setSelectedParentPage('');
    }
  }, [location.pathname]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuItemClick = (pageName: string) => {
    setSelectedPage(pageName);
    handleCloseNavMenu();
  };

  const handleLogoClick = () => {
    setSelectedPage('');
    setSelectedParentPage('');
  };

  return (
    <Box
      className="main--content"
      sx={{
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.background?.default || '#f7f9fc',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(33, 48, 66, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
        elevation={0}
      >
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ minHeight: 56 }}>
            <Logo title={title} onClick={handleLogoClick} />
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <MobileMenu
                anchorElNav={anchorElNav}
                handleOpenNavMenu={handleOpenNavMenu}
                handleCloseNavMenu={handleCloseNavMenu}
                pages={pages}
                selectedPage={selectedPage}
                onMenuItemClick={handleMenuItemClick}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <DesktopMenu
                pages={pages}
                selectedPage={selectedPage}
                selectedParentPage={selectedParentPage}
                onMenuItemClick={handleMenuItemClick}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: '64px',
          paddingBottom: '32px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexGrow: 1,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            minHeight: 'calc(100vh - 64px)', // or just height: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}