import React from 'react';
import { UnifiedAuthModal } from './UnifiedAuthModal';
import { ApexAccount, Vehicle } from '../types';

export interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account?: ApexAccount, vehicle?: Vehicle) => void;
  onMechanicLogin?: (techName: string, bay: string) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <UnifiedAuthModal
      isOpen={isOpen}
      onClose={onClose}
      initialTab="register"
      onSuccess={(account, _tokenOrVin, newVehicle) => {
        onSuccess(account, newVehicle);
      }}
    />
  );
};
