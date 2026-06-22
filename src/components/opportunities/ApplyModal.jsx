'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { applicationSchema } from '@/validations/opportunitySchema';
import { applicationService } from '@/services/applicationService';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/lib/utils';

export default function ApplyModal({ open, onClose, opportunity, onApplied, alreadyApplied }) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(applicationSchema),
    defaultValues: { portfolio_link: '', motivation: '' },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await applicationService.apply({ opportunity_id: opportunity._id, ...data });
      toast.success('Application submitted successfully!');
      reset();
      onApplied?.();
      onClose?.();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to submit application'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={`Apply for ${opportunity?.role_title || 'Opportunity'}`} description="Tell the founder why you're a great fit.">
      {alreadyApplied ? (
        <div className="py-6 text-center">
          <p className="text-sm text-gray-600">You have already applied for this opportunity.</p>
          <Button variant="outline" className="mt-4" onClick={onClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Portfolio Link (optional)" placeholder="https://your-portfolio.com" error={errors.portfolio_link?.message} {...register('portfolio_link')} />
          <Textarea label="Motivation" rows={5} placeholder="Why are you a great fit for this role?" error={errors.motivation?.message} {...register('motivation')} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>Submit Application</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
