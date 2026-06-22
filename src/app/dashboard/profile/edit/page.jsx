'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, User } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Card, { CardContent } from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUpload';
import SkillsInput from '@/components/ui/SkillsInput';
import useUser from '@/hooks/useUser';
import { profileSchema } from '@/validations/authSchema';
import { authService } from '@/services/authService';
import { getErrorMessage } from '@/lib/utils';
import { APP_NAME } from '@/constants';

function ProfileEditForm() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: '',
      bio: '',
      skills: [],
      portfolio: '',
    },
  });

  const imageValue = watch('image');

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('bio', user.bio || '');
      setValue('skills', user.skills || []);
      setValue('portfolio', user.portfolio || '');
      if (user.image) setValue('image', user.image);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const res = await authService.updateProfile(data);

      await updateUser(res.data || { ...user, ...data });
      toast.success('Profile updated successfully!');
      router.push('/dashboard/profile');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Edit Profile" description="Update your profile information.">
        <Link href="/dashboard/profile">
          <Button variant="ghost" leftIcon={ArrowLeft}>Cancel</Button>
        </Link>
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-ink">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <Avatar
                  src={imageValue || user?.image}
                  name={user?.name}
                  size="xl"
                  className="h-20 w-20 text-xl"
                />
                <div className="flex-1">
                  <ImageUpload
                    value={imageValue || user?.image || ''}
                    onChange={(url) => setValue('image', url, { shouldDirty: true })}
                    label="Upload Photo"
                  />
                  <p className="mt-1 text-xs text-mute">
                    JPG, PNG or GIF. Max 2MB. Recommended 200x200px.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-ink">Basic Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your name"
                  error={errors.name?.message}
                  leftIcon={User}
                  {...register('name')}
                />
                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  error={errors.bio?.message}
                  rows={4}
                  hint={`${(watch('bio') || '').length}/500 characters`}
                  {...register('bio')}
                />
                <Input
                  label="Portfolio URL"
                  placeholder="https://your-portfolio.com"
                  error={errors.portfolio?.message}
                  hint="Link to your portfolio, GitHub, or LinkedIn"
                  {...register('portfolio')}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-ink">Skills</h3>
              <SkillsInput
                value={watch('skills') || []}
                onChange={(skills) => setValue('skills', skills, { shouldDirty: true })}
                error={errors.skills?.message}
                placeholder="Add a skill (e.g., React, Node.js, Design)"
                maxSkills={20}
              />
              <p className="mt-2 text-xs text-mute">
                Add skills relevant to your expertise. Max 20 skills.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardContent>
              <h3 className="mb-4 text-lg font-semibold text-ink">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-surface-card p-3">
                  <span className="text-sm text-mute">Email</span>
                  <span className="text-sm font-medium text-ink">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-surface-card p-3">
                  <span className="text-sm text-mute">Role</span>
                  <Badge variant="secondary">{user?.role}</Badge>
                </div>
                {user?.isPremium && (
                  <div className="flex items-center justify-between rounded-lg bg-warning-50 p-3">
                    <span className="text-sm text-mute">Plan</span>
                    <Badge variant="premium">Premium</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex justify-end gap-3 pb-8"
        >
          <Link href="/dashboard/profile">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" variant="gradient" loading={saving} leftIcon={Save} disabled={!isDirty}>
            Save Changes
          </Button>
        </motion.div>
      </form>
    </div>
  );
}

export default function ProfileEditPage() {
  return (
    <ProtectedRoute allowedRoles={['founder', 'collaborator', 'admin']}>
      <ProfileEditForm />
    </ProtectedRoute>
  );
}
