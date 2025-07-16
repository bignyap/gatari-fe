import React, { useEffect, useState } from 'react';
import {
  Grid, TextField, Select, MenuItem, InputLabel,
  FormControl, Box, CircularProgress
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import CommonButton from '../../components/Common/Button';
import { GridComponentInEdit } from '../Organization/OrganizationForm';
import { ListAllResourceTypes } from '../../libraries/ResourceType';
import { CustomizedSnackbars } from '../../components/Common/Toast';
import { ListAllPermissionTypes } from '../../libraries/PermissionType';

interface EndpointFormProps {
  initialData: EndpointData;
  onSubmit: (data: EndpointData) => void;
  onCancel: () => void;
}

interface EndpointData {
  name: string;
  description: string;
  httpMethod: string;
  pathTemplate: string;
  resourceTypeId: number | string;
  resourceTypeName: string;
  permissionCode?: string;
}

const EndpointForm: React.FC<EndpointFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<EndpointData>(initialData);
  const [resourceTypes, setResourceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ message: string; status: string } | null>(null);
  const [permissionTypes, setPermissionTypes] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([ListAllResourceTypes(), ListAllPermissionTypes()])
      .then(([resTypes, permTypes]) => {
        setResourceTypes(resTypes || []);
        setPermissionTypes(permTypes || []);
      })
      .catch(() =>
        setSnackbar({ message: 'Failed to load dropdown data', status: 'error' })
      )
      .finally(() => setLoading(false));
  }, []);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
  
    if (name === 'resourceTypeId') {
      const selected = resourceTypes.find((type) => type.id === Number(value));
  
      setFormData((prev) => ({
        ...prev,
        resourceTypeId: Number(value),
        resourceTypeName: selected?.name || '',
      }));
    } else if (name === 'permissionCode') {
        const selected = permissionTypes.find((perm) => perm.code === value);
        setFormData((prev) => ({
          ...prev,
          permissionCode: value,
        }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const gridSize = { xs: 12, sm: 6 };

  return (
    <>
      {snackbar && (
        <CustomizedSnackbars
          message={snackbar.message}
          status={snackbar.status}
          open
          onClose={() => setSnackbar(null)}
        />
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ minWidth: '800px' }}>
          <GridComponentInEdit value={
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <FormControl fullWidth>
              <InputLabel>HTTP Method</InputLabel>
              <Select
                name="httpMethod"
                value={formData.httpMethod}
                onChange={handleSelectChange}
                label="HTTP Method"
              >
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((method) => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>
          } size={gridSize} />

          <GridComponentInEdit value={
            <TextField
              fullWidth
              name="pathTemplate"
              label="Path Template"
              value={formData.pathTemplate}
              onChange={handleInputChange}
              required
            />
          } size={gridSize} />

          <GridComponentInEdit value={
            <FormControl fullWidth>
              <InputLabel>Resource Type</InputLabel>
              <Select
                name="resourceTypeId"
                value={formData.resourceTypeId.toString()}
                onChange={handleSelectChange}
                label="Resource Type"
              >
                {resourceTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          } size={gridSize} />

          <GridComponentInEdit value={
            <FormControl fullWidth>
              <InputLabel>Permission Type</InputLabel>
              <Select
                name="permissionCode"
                value={formData.permissionCode || ''}
                onChange={handleSelectChange}
                label="Permission Type"
              >
                {permissionTypes.map((perm) => (
                  <MenuItem key={perm.code} value={perm.code}>
                    {perm.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          } size={gridSize} />

        </Grid>
      )}

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
    </>
  );
};

export default EndpointForm;