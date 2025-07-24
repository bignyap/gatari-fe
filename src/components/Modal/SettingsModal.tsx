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

interface SettingsModalProps<TFormData extends Record<string, unknown>> {
  title: string;
  fields: ModalField[];
  onClose: () => void;
  onSubmit: (formData: TFormData) => Promise<unknown>;
  onSuccess: (result: unknown) => void;
}

const SettingsModal = <TFormData extends Record<string, unknown>>({
  title,
  fields,
  onClose,
  onSubmit,
  onSuccess,
}: SettingsModalProps<TFormData>) => {
  const renderFields = (
    formData: TFormData,
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
          value={formData[name as keyof TFormData] as string || ''}
          onChange={handleChange}
          required={required}
          type={type}
          placeholder={placeholder}
        />
      ))}
    </>
  );

  return (
    <GenericModal<TFormData>
      title={title}
      renderFields={renderFields}
      onClose={onClose}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    />
  );
};

export default SettingsModal;