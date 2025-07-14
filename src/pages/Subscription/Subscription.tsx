import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import { ListSubscriptionByOrgIds, ListSubscriptions } from '../../libraries/Subscription';
import CommonButton from '../../components/Common/Button';
import SubscriptionModal from './SubscriptionModal';

interface SubscriptionProps {
  orgId: number | null;
  subInitName?: string;
  tableContainerSx?: object;
}

export function SubscriptionPage({ orgId }: SubscriptionProps) {
  return (
    <div className="container">
      <SubscriptionLoader orgId={orgId} />
    </div>
  );
}

export function SubscriptionLoader({
  orgId,
  subInitName = '',
}: SubscriptionProps) {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubscriptions = async () => {
    try {
      const subData =
        orgId == null
          ? await ListSubscriptions(1, 100)
          : await ListSubscriptionByOrgIds(orgId, 1, 100);
      setSubscriptions(subData['data'] || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSnackbar({
        message: 'Failed to load subscriptions. Please try again later.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCreate = () => {
    setEditingSub(null);
    setIsModalOpen(true);
  };

  const handleSubscriptionCreated = (newSub: any) => {
    if (editingSub) {
      setSubscriptions(subs =>
        subs.map(s => (s.id === newSub.id ? newSub : s))
      );
    } else {
      setSubscriptions(subs => [newSub, ...subs]);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}

      {/* Header with search and create */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          variant="outlined"
          placeholder="Search subscriptions..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <CommonButton
          label="CREATE SUBSCRIPTION"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : filteredSubscriptions.length === 0 ? (
        <Typography variant="body1" color="text.secondary" mt={4}>
          No subscriptions found.
        </Typography>
      ) : (
        filteredSubscriptions.map((sub) => (
          <Accordion key={sub.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box display="flex" flexDirection="column">
                <Typography fontWeight={600}>{sub.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {sub.type} • Status: {sub.status}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                <Field label="Type" value={sub.type} />
                <Field label="Start Date" value={sub.start_date} />
                <Field label="Expiry Date" value={sub.expiry_date} />
                <Field label="API Limit" value={sub.api_limit} />
                <Field label="Billing Model" value={sub.billing_model} />
                <Field label="Billing Interval" value={sub.billing_interval} />
                <Field label="Quota Reset" value={sub.quota_reset_interval} />
                <Field label="Created At" value={sub.created_at} />
                <Field label="Updated At" value={sub.updated_at} />
                <Field label="Description" value={sub.description} />
              </Box>

              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <CommonButton
                  label="Edit"
                  variant="outlined"
                  onClick={() => {
                    setEditingSub(sub);
                    setIsModalOpen(true);
                  }}
                />
                <CommonButton
                  label="Delete"
                  variant="text"
                  onClick={() => {
                    // TODO: Handle delete
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* Modal */}
      {isModalOpen && (
        <SubscriptionModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingSub(null);
          }}
          onSubscriptionCreated={handleSubscriptionCreated}
          orgId={orgId ?? 0}
          subInitName={subInitName}
          editMode={!!editingSub}
          initialData={editingSub}
        />
      )}
    </Box>
  );
}

// Helper to format key-value fields
function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value || '-'}</Typography>
    </Box>
  );
}