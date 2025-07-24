import React from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

interface PageChild {
  name: string;
  link: string;
}

interface PageItem {
  name: string;
  link?: string;
  children?: PageChild[];
}

interface MobileMenuProps {
  anchorElNav: HTMLElement | null;
  handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseNavMenu: () => void;
  pages: PageItem[];
  onMenuItemClick: (name: string) => void;
}

export default function MobileMenu({
  anchorElNav,
  handleOpenNavMenu,
  handleCloseNavMenu,
  pages,
  onMenuItemClick,
}: MobileMenuProps) {
  const navigate = useNavigate();

  return (
    <>
      <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
      >
        {pages.map((page) =>
          page.children ? (
            <Accordion key={page.name} sx={{ boxShadow: 'none' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{page.name}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pl: 2 }}>
                {page.children.map((child) => (
                  <MenuItem
                    key={child.name}
                    onClick={() => {
                      onMenuItemClick(page.name);
                      navigate(child.link);
                      handleCloseNavMenu();
                    }}
                  >
                    {child.name}
                  </MenuItem>
                ))}
              </AccordionDetails>
            </Accordion>
          ) : (
            <MenuItem
              key={page.name}
              onClick={() => {
                onMenuItemClick(page.name);
                if (page.link) navigate(page.link);
                handleCloseNavMenu();
              }}
            >
              {page.name}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
}