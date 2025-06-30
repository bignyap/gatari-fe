import PermissionGrid from './PermissionGrid';
import { Box } from '@mui/material';

export default function PermissionsPage({ organizationId }: { organizationId: number }) {
    return (
      <Box sx={{ px: 4, py: 2 }}>
        <PermissionGrid organizationId={organizationId} />
      </Box>
    );
  }
  
