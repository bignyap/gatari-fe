import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface LogoProps {
  title: string;
  onClick: () => void;
}

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
    <img
      src="/logo.png" // Ensure this points to your PNG in the `public/` folder
      alt="Logo"
      style={{
        width: 32, // adjust size as needed
        height: 32,
        objectFit: 'contain',
        borderRadius: 4,
        backgroundColor: 'transparent',
      }}
    />
    <Typography
      variant="h5"
      sx={{
        fontFamily: `'Poppins', 'Inter', sans-serif`,
        fontWeight: 600,
        fontSize: { xs: '1.2rem', sm: '1.4rem' },
        letterSpacing: '0.04em',
        lineHeight: 1.3,
        background: 'linear-gradient(90deg, #5bc0be, #cfeafe)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 1px 1px rgba(0, 0, 0, 0.15)',
        textTransform: 'capitalize',
      }}
    >
      {title}
    </Typography>
  </Box>
);

export default Logo;