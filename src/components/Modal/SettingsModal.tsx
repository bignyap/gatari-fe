import React from 'react';
import { TextField } from '@mui/material';
import GenericModal from './GenericModal';

export interface ModalField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface SettingsModalProps {
  title: string;
  fields: ModalField[];
  onClose: () => void;
  onSubmit: (formData: Record<string, any>) => Promise<any>;
  onSuccess: (result: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  title,
  fields,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const renderFields = (
    formData: Record<string, any>,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <>
      {fields.map(({ name, label, required, type = 'text', placeholder }) => (
        <TextField
          key={name}
          fullWidth
          margin="normal"
          name={name}
          label={label}
          value={formData[name] || ''}
          onChange={handleChange}
          required={required}
          type={type}
          placeholder={placeholder}
        />
      ))}
    </>
  );

  return (
    <GenericModal
      title={title}
      renderFields={renderFields}
      onClose={onClose}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
};

export default SettingsModal;