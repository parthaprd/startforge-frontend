'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { opportunitySchema } from '@/validations/opportunitySchema';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import SkillsInput from '@/components/ui/SkillsInput';
import { useState } from 'react';
import { WORK_TYPES, COMMITMENT_LEVELS } from '@/constants';
import { Plus, Trash2 } from 'lucide-react';

export default function OpportunityForm({ defaultValues, onSubmit, submitting }) {
  const [skills, setSkills] = useState(defaultValues?.required_skills || []);
  const [responsibilities, setResponsibilities] = useState(defaultValues?.responsibilities?.length ? defaultValues.responsibilities : ['']);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(opportunitySchema),
    defaultValues: {
      role_title: defaultValues?.role_title || '',
      work_type: defaultValues?.work_type || '',
      commitment_level: defaultValues?.commitment_level || '',
      deadline: defaultValues?.deadline ? new Date(defaultValues.deadline).toISOString().split('T')[0] : '',
      description: defaultValues?.description || '',
    },
  });

  const addResp = () => setResponsibilities([...responsibilities, '']);
  const updateResp = (i, v) => setResponsibilities(responsibilities.map((r, idx) => idx === i ? v : r));
  const removeResp = (i) => setResponsibilities(responsibilities.filter((_, idx) => idx !== i));

  const submit = (data) => {
    onSubmit({
      ...data,
      required_skills: skills,
      responsibilities: responsibilities.filter((r) => r.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <Input label="Role Title" placeholder="Senior React Developer" error={errors.role_title?.message} {...register('role_title')} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Required Skills <span className="text-danger-500">*</span></label>
        <SkillsInput value={skills} onChange={setSkills} placeholder="e.g. React, TypeScript" />
        {errors.required_skills && <p className="mt-1 text-xs text-danger-600">{errors.required_skills.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Work Type" placeholder="Select work type" error={errors.work_type?.message} {...register('work_type')}>
          {WORK_TYPES.map((w) => <option key={w} value={w}>{w}</option>)}
        </Select>
        <Select label="Commitment Level" placeholder="Select level" error={errors.commitment_level?.message} {...register('commitment_level')}>
          {COMMITMENT_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

      <Input label="Deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />

      <Textarea label="Description" rows={5} placeholder="Describe the role..." maxLength={1000} error={errors.description?.message} {...register('description')} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Responsibilities</label>
        <div className="space-y-2">
          {responsibilities.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input value={r} onChange={(e) => updateResp(i, e.target.value)} placeholder={`Responsibility ${i + 1}`} className="input-base" />
              {responsibilities.length > 1 && (
                <button type="button" onClick={() => removeResp(i)} className="rounded-lg p-2 text-danger-500 hover:bg-danger-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addResp} className="mt-2 inline-flex items-center gap-1 text-sm text-primary-600 hover:underline">
          <Plus className="h-4 w-4" /> Add responsibility
        </button>
      </div>

      <Button type="submit" fullWidth size="lg" loading={submitting}>{defaultValues ? 'Update Opportunity' : 'Create Opportunity'}</Button>
    </form>
  );
}
