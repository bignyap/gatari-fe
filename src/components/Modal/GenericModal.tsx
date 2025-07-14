import React, { useState } from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      console.error(`Error submitting ${title.toLowerCase()}:`, error);
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
          width: isMobile ? '90%' : 460,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #eee',
          }}
        >
          <Typography variant="subtitle1">{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ px: 3, py: 3 }}
        >
          {renderFields(formData, handleChange)}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
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
        </Box>
      </Box>
    </Modal>
  );
};

export default GenericModal;