import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

interface LogoProps {
  title: string;
  onClick: () => void;
}

// Placeholder icon (rounded square) — replace with your own if desired
const BrandIcon = () => (
  <SvgIcon sx={{ fontSize: 24 }}>
    <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" />
  </SvgIcon>
);

const Logo: React.FC<LogoProps> = ({ title, onClick }) => (
  <Box
    component={Link}
    to="/"
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      textDecoration: 'none',
      color: '#ffffffdd',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: '#ffffff',
        textShadow: '0 0 6px rgba(255, 255, 255, 0.2)',
      },
      '&:focus': {
        outline: '2px solid rgba(255, 255, 255, 0.5)',
        outlineOffset: '2px',
      },
    }}
  >
    <BrandIcon />
    <Typography
      variant="h5"
      sx={{
        fontFamily: 'Inter, Roboto, system-ui, sans-serif',
        fontWeight: 700,
        fontSize: { xs: '1rem', sm: '1.25rem' },
        letterSpacing: '0.03rem',
        lineHeight: 1.2,
        color: 'inherit',
      }}
    >
      {title}
    </Typography>
  </Box>
);

export default Logo;