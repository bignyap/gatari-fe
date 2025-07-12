import React, { useState } from 'react';
import {
  Box, TextField, MenuItem, FormControl,
  Select, InputLabel, Tabs, Tab, Grid, SxProps, Theme
} from '@mui/material';
import OrganizationTypeSelect from './OrganizationTypeSelect';
import ConfigEditor from './ConfigEditor';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import CommonButton from '../../components/Common/Button';

interface OrganizationFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  columns?: number;
  buttonAtTop?: boolean;
  includeConfig?: boolean;
  disabled?: boolean;
}

interface GridComponentInEditProps {
  value: React.ReactNode;
  size: { xs: number; sm: number; md?: number };
  sx?: SxProps<Theme>;
}

export function GridComponentInEdit({ value, size, sx = {} }: GridComponentInEditProps) {
  return (
    <Grid item xs={size.xs} sm={size.sm} md={size.md} sx={sx}>
      {value}
    </Grid>
  );
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  initialData, onSubmit, onCancel,
  columns = 2, buttonAtTop = false,
  includeConfig = true, disabled = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const gridSize = columns === 3
    ? { xs: 12, sm: 6, md: 4 }
    : { xs: 12, sm: 12, md: 6 };

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, pt: 2 }}>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open={true}
          onClose={() => setSnackbar(null)}
        />
      )}

      {includeConfig && (
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="organization form tabs">
          <Tab label="Info" />
          <Tab label="Configuration" />
        </Tabs>
      )}

      {activeTab === 0 && (
        <Grid container spacing={2}>
          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="realm"
              label="Realm"
              value={formData.realm}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <OrganizationTypeSelect
              value={formData.type_id}
              onChange={(e) => setFormData({ ...formData, type_id: Number(e.target.value) })}
              disabled={disabled}
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              disabled={disabled}
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <TextField
              fullWidth
              margin="normal"
              name="support_email"
              label="Support Email"
              value={formData.support_email}
              onChange={handleChange}
              required
              disabled={disabled}
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <FormControl fullWidth margin="normal" disabled={disabled}>
              <InputLabel>Status</InputLabel>
              <Select
                name="active"
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                label="Status"
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          } size={gridSize} />

          <GridComponentInEdit value={
            <FormControl fullWidth margin="normal" disabled={disabled}>
              <InputLabel>Reporting</InputLabel>
              <Select
                name="report_q"
                value={formData.report_q ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, report_q: e.target.value === 'true' })}
                label="Reporting"
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </FormControl>
          } size={gridSize} />
        </Grid>
      )}

      {activeTab === 1 && includeConfig && (
        <Grid container spacing={0}>
          <GridComponentInEdit
            value={
              <ConfigEditor
                config={formData.config}
                onConfigChange={(newConfig) =>
                  setFormData({ ...formData, config: newConfig })
                }
                editorMode={false}
                alwaysEditMode={includeConfig}
                disabled={disabled}
              />
            }
            size={{ xs: 12, sm: 12 }}
            sx={{
              p: 0,
              background: 'none',
              border: 'none',
              boxShadow: 'none',
            }}
          />
        </Grid>
      )}

      {!buttonAtTop && !disabled && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <CommonButton
            label="Create"
            type="submit"
            variant="contained"
            sx={{ mr: 1 }}
            onClick={handleSubmit}
          />

          <CommonButton
            label="Cancel"
            type="button"
            variant="outlined"
            onClick={onCancel}
          />
        </Box>
      )}
    </Box>
  );
};

export default OrganizationForm;