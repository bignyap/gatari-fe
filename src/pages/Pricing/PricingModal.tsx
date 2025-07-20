import React, { useState, useEffect } from 'react';
import { ListAllEndpoints } from '../../libraries/Endpoint';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import { CreateTierPricing } from '../../libraries/TierPricing';
import CommonButton from '../../components/Common/Button';

interface TierPricingFormProps {
    onClose: () => void;
    onTierPricingCreated: (org: any) => void;
    tierId: number;
  }

interface Endpoint {
    id: number;
    name: string;
}

const TierPricingModal: React.FC<TierPricingFormProps> = ({ onClose, onTierPricingCreated, tierId }) => {
    type CostMode = "fixed" | "dynamic";

    const [formData, setFormData] = useState<{
      base_cost_per_call: number;
      base_rate_limit: number;
      api_endpoint_id: number;
      cost_mode: CostMode;
    }>({
      base_cost_per_call: 1,
      base_rate_limit: 100,
      api_endpoint_id: 0,
      cost_mode: "fixed",
    });
  
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

    async function fetchEndoints() {
      try {
        const endpoints = await ListAllEndpoints();
        setEndpoints(endpoints);
      } catch (error) {
        console.error("Error fetching endpoints:", error);
        setEndpoints([]);
        setSnackbar({
          message: "Failed to load endpoints. Please try again later.",
          status: "error"
        });
      }
    };

    useEffect(() => {
        fetchEndoints().then(() => {
            if (endpoints.length > 0 && !endpoints.some(endpoint => endpoint.id === formData.api_endpoint_id)) {
                setFormData({
                    ...formData,
                    api_endpoint_id: endpoints[0].id
                });
            }
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        const { name, value, type, checked } = target as HTMLInputElement;
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const newSub = await CreateTierPricing({
          ...formData,
          subscription_tier_id: tierId,
        });
        onTierPricingCreated(newSub);
        onClose();
        setSnackbar({
          message: `Tier pricing created successfully!`,
          status: "success",
        });
      } catch (error) {
        console.error("Error creating tier pricing:", error);
        setSnackbar({
          message: "Failed to create tier pricing.",
          status: "error",
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
            <FormControl fullWidth margin="normal">
                <InputLabel>Endpoint</InputLabel>
                <Select
                    name="api_endpoint_id"
                    value={formData.api_endpoint_id }
                    onChange={(e) => setFormData({ ...formData, api_endpoint_id : Number(e.target.value) })}
                    label="Subscription Tier"
                    required
                >
                    {endpoints.map((subTier) => (
                        <MenuItem key={subTier.id} value={subTier.id}>
                            {subTier.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
              <TextField
                  fullWidth
                  margin="normal"
                  name="base_cost_per_call"
                  label="Cost Per Call"
                  type="number"
                  value={formData.base_cost_per_call}
                  onChange={handleChange}
                  required
              />
              <TextField
                  fullWidth
                  margin="normal"
                  name="base_rate_limit"
                  label="Rate Limit"
                  type="number"
                  value={formData.base_rate_limit}
                  onChange={handleChange}
                  required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="cost-mode-label">Cost Mode</InputLabel>
                <Select
                  labelId="cost-mode-label"
                  name="cost_mode"
                  value={formData.cost_mode}
                  onChange={(e) =>
                    setFormData({ ...formData, cost_mode: e.target.value as CostMode })
                  }
                  label="Cost Mode"
                  fullWidth
                  required
                >
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="dynamic">Dynamic</MenuItem>
                </Select>
              </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <CommonButton
                  label='Create' 
                  type="submit" 
                  variant="contained" 
                  onClick={handleSubmit} 
              />
              <CommonButton
                  label='Cancel' 
                  type="button" 
                  onClick={onClose} 
                  variant="outlined" 
              />
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default TierPricingModal;