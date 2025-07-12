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
import { ListSubscriptionTiers } from '../../libraries/SubscriptionTier';
import TierModal from './TierModal';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import TierPricingView from './ViewPricing';

export function SubScriptionTierTab() {
  return <SubScriptionTierLoader />;
}

export function SubScriptionTierLoader() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTierId = searchParams.get('id');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });

  useEffect(() => {
    async function fetchTiers() {
      try {
        const res = await ListSubscriptionTiers(1, 100);
        setTiers(res.data || []);
        if (!selectedTierId && res.data?.length > 0) {
          setSearchParams({ id: String(res.data[0].id) });
        }
      } catch (err) {
        setSnackbar({ message: 'Failed to load tiers.', status: 'error' });
      } finally {
        setLoading(false);
      }
    }

    fetchTiers();
  }, []);

  const handleTierSelect = (id: string) => {
    setSearchParams({ id });
  };

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
          display: isMobile && selectedTierId ? 'none' : 'flex',
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
            top: 0,
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
                primary="Create Subscription Tier"
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
            <List>
              {tiers.map((tier) => (
                <ListItemButton
                  key={tier.id}
                  selected={String(tier.id) === selectedTierId}
                  onClick={() => handleTierSelect(String(tier.id))}
                >
                  <ListItemText primary={tier.name} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* RIGHT PANE */}
      {(!isMobile || selectedTierId) && (
        <Box
          sx={{
            flexGrow: 1,
            height: '100%',
            overflowY: 'auto',
            backgroundColor: '#f5f5f5',
            p: isMobile ? 2 : 2,
          }}
        >
          {isMobile && selectedTierId && (
            <IconButton onClick={() => setSearchParams({})} sx={{ mb: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}

          {selectedTierId ? (
            <TierPricingView tierId={Number(selectedTierId)} />
          ) : (
            !isMobile && (
              <Typography variant="h6">Select a tier to view pricing</Typography>
            )
          )}
        </Box>
      )}

      {/* Modals */}
      {isModalOpen && (
        <TierModal
          onClose={() => setIsModalOpen(false)}
          onTierCreated={() => {
            setIsModalOpen(false);
            window.location.reload();
          }}
        />
      )}

      {/* Snackbar */}
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