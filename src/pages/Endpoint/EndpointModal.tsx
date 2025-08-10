import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { CreateEndpoint } from '../../libraries/Endpoint';
import EndpointForm from './EndpointForm';

interface EndpointModalProps {
  resourceTypeId: number;
  resourceTypeName?: string; // Optional: if you want to show it in UI
  onClose: () => void;
  onEndpointCreated: (endpoint: any) => void;
}

const EndpointModal: React.FC<EndpointModalProps> = ({
  resourceTypeId,
  resourceTypeName,
  onClose,
  onEndpointCreated,
}) => {
  const initialData = {
    name: '',
    description: '',
    httpMethod: 'GET',
    pathTemplate: '',
    resourceTypeId: resourceTypeId,
    resourceTypeName: resourceTypeName ?? '',
    permissionCode: 'RED',
    accessType: 'Free',
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        http_method: data.httpMethod,
        path_template: data.pathTemplate,
        resource_type_id: resourceTypeId,
        permission_code: data.permissionCode,
        access_type: data.accessType
          ? data.accessType.trim().toLowerCase()
          : "paid"
      };

      const newEndpoint = await CreateEndpoint(payload);

      const enrichedEndpoint = {
        ...newEndpoint,
        resourceTypeName: resourceTypeName ?? '', // Optional display field
      };

      onEndpointCreated(enrichedEndpoint);
      onClose();
    } catch (error) {
      console.error('Error creating endpoint:', error);
      // Optionally add error toast handling here
    } finally {
      onClose();
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflowY: 'auto',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 800,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 3,
            fontSize: '1.05rem',
          }}
        >
          Register Endpoint
        </Typography>

        <EndpointForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </Box>
    </Modal>
  );
};

export default EndpointModal;