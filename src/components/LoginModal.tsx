import React from 'react';
import { UnifiedAuthModal } from './UnifiedAuthModal';
import { ApexAccount, Vehicle } from '../types';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: ApexAccount, tokenOrVin?: string, newVehicle?: Vehicle) => void;
  initialIdentifier?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialIdentifier,
}) => {
  return (
    <UnifiedAuthModal
      isOpen={isOpen}
      onClose={onClose}
      initialTab="login"
      initialIdentifier={initialIdentifier}
      onSuccess={onSuccess}
    />
  );
};
