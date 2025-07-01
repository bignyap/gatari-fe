import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CommonButton from '../Common/Button';

interface GenericModalProps {
  title: string;
  renderFields: (
    formData: Record<string, any>,
    handleChange: (e: React.ChangeEvent<any>) => void
  ) => React.ReactNode;
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => Promise<any>;
  onSuccess: (result: any) => void;
}

const GenericModal: React.FC<GenericModalProps> = ({
  title,
  renderFields,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await onSubmit(formData);
      onSuccess(result);
      onClose();
    } catch (error) {
      console.error(`Error creating ${title.toLowerCase()}:`, error);
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
          width: 420,
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: 6,
          p: 4,
          pt: 3,
          border: '1px solid #e0e0e0',
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
          {title}
        </Typography>

        <form onSubmit={handleSubmit}>
          {renderFields(formData, handleChange)}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 4,
            }}
          >
            <CommonButton
              label="Cancel"
              type="button"
              onClick={onClose}
              variant="outlined"
            />
            <CommonButton
              label="Create"
              type="submit"
              variant="outlined"
              sx={{ minWidth: 100 }}
            />
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default GenericModal;