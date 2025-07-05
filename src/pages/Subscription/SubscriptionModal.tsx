import React, { useState, useEffect } from 'react';
import { CreateSubscription, UpdateSubscription } from '../../libraries/Subscription';
import { ListAllSubscriptionTiers } from '../../libraries/SubscriptionTier';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CommonButton from '../../components/Common/Button';

interface SubscriptionFormProps {
  onClose: () => void;
  onSubscriptionCreated: (sub: any) => void;
  orgId: number;
  subInitName?: string;
  editMode?: boolean;
  initialData?: Record<string, any> | null;
}

interface SubTiers {
  id: number;
  name: string;
}

function formatDate(value: string | number | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value);
  return date.toISOString().split('T')[0];
}

const SubscriptionModal: React.FC<SubscriptionFormProps> = ({
  onClose,
  onSubscriptionCreated,
  orgId,
  subInitName = '',
  editMode = false,
  initialData = null
}) => {
  const safeInitialData = initialData ?? {};

  const [formData, setFormData] = useState({
    name: safeInitialData.name ?? subInitName,
    type: safeInitialData.type ?? '',
    start_date: formatDate(safeInitialData.start_date),
    api_limit: safeInitialData.api_limit ?? 0,
    expiry_date: formatDate(safeInitialData.expiry_date),
    description: safeInitialData.description ?? '',
    status: safeInitialData.status ?? true,
    organization_id: orgId,
    subscription_tier_id: safeInitialData.subscription_tier_id ?? 0,
    billing_interval: safeInitialData.billing_interval ?? 'once',
    billing_model: safeInitialData.billing_model ?? 'usage',
    quota_reset_interval: safeInitialData.quota_reset_interval ?? 'monthly',
  });
  

  const [subTiers, setSubTiers] = useState<SubTiers[]>([]);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

  useEffect(() => {
    ListAllSubscriptionTiers()
      .then(setSubTiers)
      .catch(() =>
        setSnackbar({ message: 'Failed to load subscription tiers.', status: 'error' })
      );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'api_limit' ? Math.max(0, Number(value)) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (editMode && safeInitialData?.id) {
        result = await UpdateSubscription(safeInitialData.id, formData);
      } else {
        result = await CreateSubscription(formData);
      }

      onSubscriptionCreated(result);
      onClose();
      setSnackbar({
        message: `Subscription ${editMode ? 'updated' : 'created'} successfully!`,
        status: 'success',
      });
    } catch (error) {
      console.error('Error submitting subscription:', error);
      setSnackbar({
        message: `Failed to ${editMode ? 'update' : 'create'} subscription.`,
        status: 'error',
      });
    }
  };

  return (
    <>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}
      <Modal open={true} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="type"
              label="Type"
              value={formData.type}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="start_date"
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="api_limit"
              label="API Limit"
              type="number"
              value={formData.api_limit}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              name="expiry_date"
              label="Expiry Date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                label="Status"
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Subscription Tier</InputLabel>
              <Select
                name="subscription_tier_id"
                value={formData.subscription_tier_id}
                onChange={(e) => setFormData({ ...formData, subscription_tier_id: Number(e.target.value) })}
                label="Subscription Tier"
                required
              >
                {subTiers.map((tier) => (
                  <MenuItem key={tier.id} value={tier.id}>
                    {tier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Billing Interval</InputLabel>
              <Select
                name="billing_interval"
                value={formData.billing_interval}
                onChange={(e) => setFormData({ ...formData, billing_interval: e.target.value })}
                required
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="once">Once</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Billing Model</InputLabel>
              <Select
                name="billing_model"
                value={formData.billing_model}
                onChange={(e) => setFormData({ ...formData, billing_model: e.target.value })}
                required
              >
                <MenuItem value="flat">Flat</MenuItem>
                <MenuItem value="usage">Usage</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Quota Reset Interval</InputLabel>
              <Select
                name="quota_reset_interval"
                value={formData.quota_reset_interval}
                onChange={(e) => setFormData({ ...formData, quota_reset_interval: e.target.value })}
                required
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="total">Total</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <CommonButton
                label={editMode ? 'Update' : 'Create'}
                type="submit"
                variant="contained"
              />
              <CommonButton
                label="Cancel"
                type="button"
                variant="outlined"
                onClick={onClose}
              />
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default SubscriptionModal;