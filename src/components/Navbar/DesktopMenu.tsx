import React, { useState } from 'react';
import { Button, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Page {
  name: string;
  link?: string;
  children?: Page[];
}

interface DesktopMenuProps {
  pages: Page[];
  selectedPage: string;
  selectedParentPage?: string;
  onMenuItemClick: (name: string) => void;
}

export default function DesktopMenu({
  pages,
  selectedPage,
  selectedParentPage,
  onMenuItemClick,
}: DesktopMenuProps) {
  const navigate = useNavigate();
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleOpen = (event: React.MouseEvent<HTMLElement>, name: string) => {
    setAnchorEls((prev) => ({ ...prev, [name]: event.currentTarget }));
  };

  const handleClose = (name: string) => {
    setAnchorEls((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      {pages.map((page) =>
        page.children ? (
          <div key={page.name}>
            <Button
              onClick={(e) => handleOpen(e, page.name)}
              sx={{
                color: 'white',
                fontWeight: 500,
                textTransform: 'none',
                backgroundColor:
                  selectedPage === page.name || selectedParentPage === page.name
                    ? 'rgba(33, 48, 66, 0.4)'
                    : 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 1,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(33, 48, 66, 0.4)' },
              }}
            >
              {page.name}
            </Button>
            <Menu
              anchorEl={anchorEls[page.name]}
              open={Boolean(anchorEls[page.name])}
              onClose={() => handleClose(page.name)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  bgcolor: 'rgba(33, 48, 66, 0.75)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderRadius: 1,
                  boxShadow: (theme) => theme.shadows[4],
                  color: 'white',
                },
              }}
            >
              {page.children.map((child) => (
                <MenuItem
                  key={child.name}
                  onClick={() => {
                    onMenuItemClick(child.name);
                    navigate(child.link || '/');
                    handleClose(page.name);
                  }}
                  sx={{
                    fontWeight: 400,
                    color: 'white',
                    backgroundColor:
                      selectedPage === child.name ? 'rgba(33, 48, 66, 0.4)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 48, 66, 0.4)',
                    },
                  }}
                >
                  {child.name}
                </MenuItem>
              ))}
            </Menu>
          </div>
        ) : (
          <Button
            key={page.name}
            onClick={() => {
              onMenuItemClick(page.name);
              navigate(page.link || '/');
            }}
            sx={{
              color: 'white',
              fontWeight: 500,
              textTransform: 'none',
              backgroundColor:
                selectedPage === page.name ? 'rgba(33, 48, 66, 0.4)' : 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 1,
              px: 2,
              '&:hover': { backgroundColor: 'rgba(33, 48, 66, 0.4)' },
            }}
          >
            {page.name}
          </Button>
        )
      )}
    </Box>
  );
}
