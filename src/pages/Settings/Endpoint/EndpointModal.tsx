import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { CreateEndpoint } from '../../../libraries/Endpoint';
import EndpointForm from './EndpointForm';

interface EndpointModalProps {
  onClose: () => void;
  onEndpointCreated: (endpoint: any) => void;
}

const EndpointModal: React.FC<EndpointModalProps> = ({ onClose, onEndpointCreated }) => {
  const initialData = {
    name: '',
    description: '',
    httpMethod: 'GET',
    pathTemplate: '',
    resourceTypeId: '',
    resourceTypeName: '',
  };

  const handleSubmit = async (data: any) => {
    const payload = {
      name: data.name,
      description: data.description,
      http_method: data.httpMethod,
      path_template: data.pathTemplate,
      resource_type_id: data.resourceTypeId,
    };
  
    const newEndpoint = await CreateEndpoint(payload);

    const enrichedEndpoint = {
      ...newEndpoint,
      resource_type_name: data.resourceTypeName,
    };
  
    onEndpointCreated(enrichedEndpoint);
    onClose();
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
            ml: -1,
            fontSize: '1.05rem',
            pl: 1.5,
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

