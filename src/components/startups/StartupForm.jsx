'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Building2 } from 'lucide-react';
import { startupSchema } from '@/validations/startupSchema';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import { INDUSTRIES, FUNDING_STAGES } from '@/constants';

export default function StartupForm({ defaultValues, onSubmit, submitting }) {
  const [logo, setLogo] = useState(defaultValues?.logo || '');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(startupSchema),
    defaultValues: {
      startup_name: defaultValues?.startup_name || '',
      logo: defaultValues?.logo || '',
      industry: defaultValues?.industry || '',
      description: defaultValues?.description || '',
      funding_stage: defaultValues?.funding_stage || '',
      team_size: defaultValues?.team_size || 1,
      website: defaultValues?.website || '',
    },
  });

  const submit = (data) => onSubmit({ ...data, logo, team_size: Number(data.team_size) });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <ImageUpload value={logo} onChange={(url) => { setLogo(url); setValue('logo', url); }} label="Startup Logo" />
      <Input label="Startup Name" placeholder="Acme Inc." leftIcon={Building2} error={errors.startup_name?.message} {...register('startup_name')} />
      <Select label="Industry" placeholder="Select an industry" error={errors.industry?.message} {...register('industry')}>
        {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
      </Select>
      <Textarea label="Description" rows={5} placeholder="What does your startup do?" maxLength={1000} error={errors.description?.message} {...register('description')} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Funding Stage" placeholder="Select stage" error={errors.funding_stage?.message} {...register('funding_stage')}>
          {FUNDING_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Input label="Team Size" type="number" min={1} placeholder="5" error={errors.team_size?.message} {...register('team_size')} />
      </div>
      <Input label="Website (optional)" placeholder="https://acme.com" error={errors.website?.message} {...register('website')} />
      <Button type="submit" fullWidth size="lg" loading={submitting}>{defaultValues ? 'Update Startup' : 'Create Startup'}</Button>
    </form>
  );
}
