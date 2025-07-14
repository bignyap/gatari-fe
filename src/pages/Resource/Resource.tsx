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
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category'; // ✅ Resource icon
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
      <Paper
        elevation={2}
        sx={{
          display: isMobile && selectedResId ? 'none' : 'flex',
          width: 320,
          flexShrink: 0,
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#fefefe',
        }}
      >
        {/* Sticky Header */}
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            position: 'sticky',
            top: { xs: '56px', sm: '64px' },
            zIndex: 10,
            bgcolor: '#fff',
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
            <List dense sx={{ py: 1 }}>
              {resourceTypes.map((res) => (
                <ListItemButton
                  key={res.id}
                  selected={String(res.id) === selectedResId}
                  onClick={() => handleSelect(String(res.id))}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    px: 2,
                    py: 1,
                    transition: '0.2s',
                    color: String(res.id) === selectedResId ? '#fff' : 'inherit',
                    backgroundColor: String(res.id) === selectedResId
                      ? 'rgba(33, 48, 66, 0.75)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: String(res.id) === selectedResId
                        ? 'rgba(33, 48, 66, 0.85)'
                        : 'rgba(33, 48, 66, 0.05)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(33, 48, 66, 0.75)',
                      color: '#fff',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(33, 48, 66, 0.85)',
                    },
                  }}
                >
                  <CategoryIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: String(res.id) === selectedResId ? '#fff' : 'text.secondary',
                    }}
                  />
                  <ListItemText
                    primary={res.name}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Paper>

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
              <Typography variant="h6" color="text.secondary">
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