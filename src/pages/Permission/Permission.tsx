import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { ListPermissionTypes, DeletePermissionType } from '../../libraries/PermissionType';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CommonButton from '../../components/Common/Button';
import PermissionTypeModal from './PermissionModal';

export function PermissionTypeTab() {
  return (
    <Box pt={2} height="100vh">
      <PermissionTypeLoader />
    </Box>
  );
}

// Helper to get chip color per code
function getChipColor(code: string): { bg: string; color: string } {
  switch (code.toUpperCase()) {
    case 'ADM': // Administer
      return { bg: '#ede7f6', color: '#5e35b1' }; // Deep Purple
    case 'ANL': // Analyze
      return { bg: '#e8f5e9', color: '#388e3c' }; // Green
    case 'ARC': // Archive
      return { bg: '#efebe9', color: '#6d4c41' }; // Brown
    case 'CFG': // Configure
      return { bg: '#e0f2f1', color: '#00796b' }; // Teal
    case 'CRT': // Create
      return { bg: '#fff8e1', color: '#f9a825' }; // Amber
    case 'DEL': // Delete
      return { bg: '#ffebee', color: '#c62828' }; // Red
    case 'DNL': // Download
      return { bg: '#e3f2fd', color: '#1565c0' }; // Blue
    case 'EXE': // Execute
      return { bg: '#ede7f6', color: '#512da8' }; // Indigo
    case 'LST': // List
      return { bg: '#f1f8e9', color: '#689f38' }; // Light Green
    case 'RED': // Read
      return { bg: '#e3f2fd', color: '#1976d2' }; // Light Blue
    case 'RES': // Restore
      return { bg: '#ede7f6', color: '#673ab7' }; // Deep Purple
    case 'SHR': // Share
      return { bg: '#fce4ec', color: '#ad1457' }; // Pink
    case 'SYN': // Sync
      return { bg: '#f3e5f5', color: '#8e24aa' }; // Purple
    case 'UPD': // Update
      return { bg: '#e8f5e9', color: '#2e7d32' }; // Dark Green
    case 'UPL': // Upload
      return { bg: '#e1f5fe', color: '#0277bd' }; // Cyan
    default:
      return { bg: '#f5f5f5', color: '#424242' }; // Default grey
  }
}

export function PermissionTypeLoader() {
  const [permissionTypes, setPermissionTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

  useEffect(() => {
    fetchPermissionTypes();
  }, []);

  async function fetchPermissionTypes() {
    try {
      const data = await ListPermissionTypes(1, 100);
      setPermissionTypes(data);
    } catch (error) {
      console.error('Error fetching permission types:', error);
      setSnackbar({
        message: 'Failed to load permission types. Please try again later.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCreatePermissionType = () => {
    setIsModalOpen(true);
  };

  const handlePermissionTypeCreated = (newType: any) => {
    setPermissionTypes((prev) => [...prev, newType]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this permission type?')) return;

    try {
      await DeletePermissionType(id);
      setPermissionTypes((prev) => prev.filter((p) => p.id !== id));
      setSnackbar({ message: 'Permission deleted.', status: 'success' });
    } catch (error) {
      setSnackbar({ message: 'Delete failed.', status: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh" px={2}>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open
          onClose={() => setSnackbar(null)}
        />
      )}

      {/* Top Control: Only Button */}
      <Box display="flex" justifyContent="flex-end" py={2}>
        <CommonButton
          label="Create Permission"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePermissionType}
        />
      </Box>

      {/* Card Grid */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Grid container spacing={2}>
          {permissionTypes.map((perm) => {
            const { bg, color } = getChipColor(perm.code);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={perm.id || perm.code}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    height: '100%',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 2,
                    transition: '0.3s',
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ pr: 1, flex: 1, wordBreak: 'break-word' }}
                      >
                        {perm.name}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => { /* TODO: open edit modal */ }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(perm.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Chip
                      label={perm.code}
                      size="small"
                      variant="filled"
                      sx={{
                        mb: 1,
                        backgroundColor: bg,
                        color: color,
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {perm.description || 'No description'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {permissionTypes.length === 0 && (
          <Typography variant="body2" color="text.secondary" mt={4} textAlign="center">
            No permission types found.
          </Typography>
        )}
      </Box>

      {isModalOpen && (
        <PermissionTypeModal
          onClose={() => setIsModalOpen(false)}
          onPermissionTypeCreated={handlePermissionTypeCreated}
        />
      )}
    </Box>
  );
}