import React from 'react';
import { CreatePermissionType } from '../../../libraries/PermissionType';
import SettingsModal from '../Modal';

interface PermissionTypeFormProps {
  onClose: () => void;
  onPermissionTypeCreated: (org: any) => void;
}

const PermissionTypeModal: React.FC<PermissionTypeFormProps> = ({ onClose, onPermissionTypeCreated }) => {
  return (
    <SettingsModal
      title="Create Resource Type"
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'code', label: 'Code', required: true },
        { name: 'description', label: 'Description', required: true },
      ]}
      onClose={onClose}
      onSubmit={CreatePermissionType}
      onSuccess={onPermissionTypeCreated}
    />
  );
};

export default PermissionTypeModal;