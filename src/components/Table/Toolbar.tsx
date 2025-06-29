import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export function EnhancedTableToolbar({ title }: { title: React.ReactNode }) {
  return (
    <Toolbar
      sx={{
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        backgroundColor: 'transparent',
        color: 'inherit',
        minHeight: '48px !important',
        px: { sm: 2, xs: 1 }
      }}
    >
      <Typography
        sx={{
          flex: '1 1 100%',
          fontWeight: 600,
          fontSize: '1rem',
          fontFamily: 'Inter, Roboto, system-ui, sans-serif',
        }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
    </Toolbar>
  );
}