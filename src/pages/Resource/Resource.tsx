import { useEffect, useState } from 'react';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSearchParams } from 'react-router-dom';

import { ListAllResourceTypes } from '../../libraries/ResourceType';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import ResourceTypeModal from './ResourceModal';
import ViewEndpoints from '../Endpoint/Endpoint';

export function ResourcePage() {
  const [resourceTypes, setResourceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedResId = searchParams.get("id");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  useEffect(() => {
    async function fetchResourceTypes() {
      try {
        const data = await ListAllResourceTypes();
        setResourceTypes(data || []);
        if (!selectedResId && data?.length > 0) {
          setSearchParams({ id: String(data[0].id) });
        }
      } catch {
        setSnackbar({ message: 'Failed to load resource types.', status: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchResourceTypes();
  }, []);

  const handleSelect = (id: string) => {
    setSearchParams({ id });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100vw',
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
      }}
    >
      {/* LEFT PANE */}
      <Box
        sx={{
          display: isMobile && selectedResId ? 'none' : 'flex',
          width: 320,
          flexShrink: 0,
          height: '100%',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
          borderRight: isMobile ? 'none' : '1px solid #ddd',
          borderBottom: isMobile ? '1px solid #ddd' : 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: '#fafafa',
          }}
        >
          <ListItemButton
            onClick={() => setIsModalOpen(true)}
            sx={{
              borderRadius: 1,
              px: 2,
              py: 1,
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
            }}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            <ListItemText
              primary="Create Resource Type"
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
            />
          </ListItemButton>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Scrollable List */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {resourceTypes.map((res) => (
                <ListItemButton
                  key={res.id}
                  selected={String(res.id) === selectedResId}
                  onClick={() => handleSelect(String(res.id))}
                >
                  <ListItemText primary={res.name} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* RIGHT PANE */}
      {(!isMobile || selectedResId) && (
        <Box
          sx={{
            flexGrow: 1,
            height: '100%',
            overflowY: 'auto',
            backgroundColor: '#f5f5f5',
            p: 2,
          }}
        >
          {isMobile && selectedResId && (
            <IconButton onClick={() => setSearchParams({})} sx={{ mb: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          {selectedResId ? (
            <ViewEndpoints key={selectedResId} resourceId={Number(selectedResId)} />
          ) : (
            !isMobile && (
              <Typography variant="h6">
                Select a resource type to view endpoints
              </Typography>
            )
          )}
        </Box>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ResourceTypeModal
          onClose={() => setIsModalOpen(false)}
          onResourceTypeCreated={() => window.location.reload()}
        />
      )}

      {/* Snackbar */}
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open
          onClose={() => setSnackbar(null)}
        />
      )}
    </Box>
  );
}