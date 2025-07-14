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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FolderIcon from '@mui/icons-material/Folder';
import { ListOrganizations } from '../../libraries/Organization';
import OrganizationModal from './OrganizationModal';
import OrgTypeModal from '../OrganizationType/OrgTypeModal';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import { ViewOrganizationPage } from './ViewOrganization';
import { useSearchParams } from 'react-router-dom';

export function OrganizationPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrgId = searchParams.get("id");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const data = await ListOrganizations(1, 100);
        setOrganizations(data.data || []);
        if (!selectedOrgId && data.data?.length > 0) {
          setSearchParams({ id: String(data.data[0].id) });
        }
      } catch (err) {
        setSnackbar({ message: 'Failed to load organizations.', status: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchOrganizations();
  }, []);

  const handleOrgSelect = (id: string) => {
    setSearchParams({ id });
  };

  const groupedOrgs = organizations.reduce((acc: Record<string, any[]>, org) => {
    const type = org.type || 'Other';
    acc[type] = acc[type] || [];
    acc[type].push(org);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100vw',
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
      }}
    >
      {/* LEFT PANEL */}
      <Paper
        elevation={2}
        sx={{
          display: isMobile && selectedOrgId ? 'none' : 'flex',
          width: 320,
          flexShrink: 0,
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#fefefe',
        }}
      >
        {/* Sticky Action Header */}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                primary="Create Organization"
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
            </ListItemButton>

            <ListItemButton
              onClick={() => setIsTypeModalOpen(true)}
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
                primary="Create Org Type"
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
              />
            </ListItemButton>
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Organization List */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List dense sx={{ py: 1 }}>
              {Object.entries(groupedOrgs).map(([type, orgs]) => (
                <Box key={type} sx={{ px: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: 'text.secondary',
                      px: 1,
                      pt: 1,
                      pb: 0.5,
                    }}
                  >
                    <FolderIcon fontSize="inherit" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    {type}
                  </Typography>
                  {orgs.map((org) => (
                  <ListItemButton
                      key={org.id}
                      selected={String(org.id) === selectedOrgId}
                      onClick={() => handleOrgSelect(String(org.id))}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        px: 2,
                        py: 1,
                        transition: '0.2s',
                        color: String(org.id) === selectedOrgId ? '#fff' : 'inherit',
                        backgroundColor: String(org.id) === selectedOrgId
                          ? 'rgba(33, 48, 66, 0.75)'
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: String(org.id) === selectedOrgId
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
                      <ApartmentIcon
                        fontSize="small"
                        sx={{
                          mr: 1,
                          color: String(org.id) === selectedOrgId ? '#fff' : 'text.secondary',
                        }}
                      />
                      <ListItemText
                        primary={org.name}
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
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Paper>

      {/* RIGHT PANEL */}
      {(!isMobile || selectedOrgId) && (
        <Box
          sx={{
            flexGrow: 1,
            height: '100%',
            overflowY: 'auto',
            backgroundColor: '#f5f5f5',
            p: 2,
          }}
        >
          {isMobile && selectedOrgId && (
            <IconButton onClick={() => setSearchParams({})} sx={{ mb: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          {selectedOrgId ? (
            <ViewOrganizationPage key={selectedOrgId} orgId={Number(selectedOrgId)} />
          ) : (
            !isMobile && (
              <Typography variant="h6" color="text.secondary">
                Select an organization to view details
              </Typography>
            )
          )}
        </Box>
      )}

      {/* Modals */}
      {isModalOpen && (
        <OrganizationModal
          onClose={() => setIsModalOpen(false)}
          onOrganizationCreated={() => window.location.reload()}
        />
      )}
      {isTypeModalOpen && (
        <OrgTypeModal
          onClose={() => setIsTypeModalOpen(false)}
          onOrgTypeCreated={() => setIsTypeModalOpen(false)}
        />
      )}

      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}
    </Box>
  );
}