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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

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
        m: 0,
        p: 0,
      }}
    >
      {/* LEFT PANE */}
      <Box
        sx={{
          display: isMobile && selectedOrgId ? 'none' : 'flex',
          width: 320,
          flexShrink: 0,
          height: '100%',
          borderRight: isMobile ? 'none' : '1px solid #ddd',
          borderBottom: isMobile ? '1px solid #ddd' : 'none',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
          transition: 'all 0.3s ease',
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
              bgcolor: '#fafafa',
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

          {/* Scrollable List */}
          <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
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
                      }}
                    >
                      {type}
                    </Typography>
                    {orgs.map((org) => (
                      <ListItemButton
                        key={org.id}
                        selected={String(org.id) === selectedOrgId}
                        onClick={() => handleOrgSelect(String(org.id))}
                      >
                        <ListItemText primary={org.name} />
                      </ListItemButton>
                    ))}
                  </Box>
                ))}
              </List>
            )}
          </Box>
      </Box>

      {/* RIGHT PANE */}
      {(!isMobile || selectedOrgId) && (
        <Box
          sx={{
            flexGrow: 1,
            height: '100%',
            overflowY: 'auto',
            backgroundColor: '#f5f5f5',
            p: isMobile ? 2 : 2,
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
              <Typography variant="h6">Select an organization to view details</Typography>
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

      {/* Toast */}
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