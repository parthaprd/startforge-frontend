'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm?.();
      onClose?.();
    } catch (error) {

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-50">
          <AlertTriangle className="h-7 w-7 text-danger-500" />
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          fullWidth
          onClick={onClose}
          disabled={submitting || loading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          fullWidth
          onClick={handleConfirm}
          loading={submitting || loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
