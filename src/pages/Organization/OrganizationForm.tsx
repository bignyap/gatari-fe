import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  useTheme,
  useMediaQuery,
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
  includeConfig?: boolean;
  disabled?: boolean;
  buttonAtTop?: boolean;
}

export function GridComponentInEdit({
  value,
  size,
  sx = {},
}: {
  value: React.ReactNode;
  size: { xs: number; sm: number; md?: number };
  sx?: any;
}) {
  return (
    <Grid item xs={size.xs} sm={size.sm} md={size.md} sx={sx}>
      {value}
    </Grid>
  );
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  columns = 2,
  includeConfig = true,
  disabled = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const gridSize =
    columns === 3
      ? { xs: 12, sm: 6, md: 4 }
      : { xs: 12, sm: 6 };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
        {snackbar && (
          <CustomizedSnackbars
            message={snackbar.message}
            status={snackbar.status}
            open={true}
            onClose={() => setSnackbar(null)}
          />
        )}

        <Grid container spacing={2}>
          <GridComponentInEdit
            value={
              <TextField
                fullWidth
                size="medium"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            }
            size={gridSize}
          />

          <GridComponentInEdit
            value={
              <TextField
                fullWidth
                size="medium"
                label="Realm"
                name="realm"
                value={formData.realm}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            }
            size={gridSize}
          />

          <GridComponentInEdit
            value={
              <OrganizationTypeSelect
                value={formData.type_id}
                onChange={(e) =>
                  setFormData({ ...formData, type_id: Number(e.target.value) })
                }
                disabled={disabled}
              />
            }
            size={gridSize}
          />

          <GridComponentInEdit
            value={
              <TextField
                fullWidth
                size="medium"
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={disabled}
              />
            }
            size={gridSize}
          />

          <GridComponentInEdit
            value={
              <TextField
                fullWidth
                size="medium"
                label="Support Email"
                name="support_email"
                value={formData.support_email}
                onChange={handleChange}
                required
                disabled={disabled}
              />
            }
            size={gridSize}
          />

          <GridComponentInEdit
            value={
              <FormControl fullWidth size="medium">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="active"
                  value={formData.active ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      active: e.target.value === 'true',
                    })
                  }
                  disabled={disabled}
                >
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            }
            size={gridSize}
          />

          <GridComponentInEdit
            value={
              <FormControl fullWidth size="medium">
                <InputLabel>Reporting</InputLabel>
                <Select
                  label="Reporting"
                  name="report_q"
                  value={formData.report_q ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      report_q: e.target.value === 'true',
                    })
                  }
                  disabled={disabled}
                >
                  <MenuItem value="true">True</MenuItem>
                  <MenuItem value="false">False</MenuItem>
                </Select>
              </FormControl>
            }
            size={gridSize}
          />
        </Grid>

        {includeConfig && (
          <Box mt={3}>
            <ConfigEditor
              config={formData.config}
              onConfigChange={(newConfig) =>
                setFormData({ ...formData, config: newConfig })
              }
              editorMode={false}
              alwaysEditMode
              disabled={disabled}
            />
          </Box>
        )}
      </Box>

      {!disabled && (
        <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'background.paper',
        }}
      >
        <CommonButton
          label="Cancel"
          type="button"
          variant="outlined"
          onClick={onCancel}
        />
        <CommonButton
          label="Create"
          type="submit"
          variant="contained"
          onClick={handleSubmit}
        />
      </Box>
      
      )}
    </Box>
  );
};

export default OrganizationForm;