import { Toolbar, Typography, Box } from '@mui/material';

interface EnhancedTableToolbarProps {
  title: React.ReactNode;
  actions?: React.ReactNode;
}

export function EnhancedTableToolbar({ title, actions }: EnhancedTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        backgroundColor: 'transparent',
        px: { sm: 2, xs: 1 },
        minHeight: 48,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: '1rem',
          fontFamily: 'Inter, Roboto, system-ui, sans-serif',
          whiteSpace: 'nowrap',
        }}
        component="div"
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        {actions}
      </Box>
    </Toolbar>
  );
}