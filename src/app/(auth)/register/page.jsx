'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserPlus, Rocket, Users, Upload, ImageIcon, X, Loader2 } from 'lucide-react';
import { registerSchema } from '@/validations/authSchema';
import { authService } from '@/services/authService';
import { setToken } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { getDashboardRoute } from '@/constants/routes';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn, getErrorMessage } from '@/lib/utils';

const IMGBB_API = 'https://api.imgbb.com/1/upload';
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function RegisterPage() {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: '', email: '', image: '', password: '', confirmPassword: '', role: 'collaborator' },
  });

  const password = watch('password') || '';
  const imageUrl = watch('image') || '';
  const strength = useMemo(() => {
    let s = 0;
    if (password.length >= 6) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    return s;
  }, [password]);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-hairline', 'bg-danger-500', 'bg-warning-500', 'bg-accent-blue', 'bg-success-500'];

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB for imgbb free)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${IMGBB_API}?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const uploadedUrl = data.data.display_url;
        setValue('image', uploadedUrl);
        setImagePreview(uploadedUrl);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image. Try using an image URL instead.');
      }
    } catch {
      toast.error('Upload failed. Try using an image URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setValue('image', url);
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const removeImage = () => {
    setValue('image', '');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = { name: data.name, email: data.email, password: data.password, role: data.role, image: data.image || '' };
      const res = await authService.register(payload);
      const { token, user: userData } = res.data;
      setToken(token);
      updateUser(userData);
      toast.success('Account created successfully!');
      router.push(getDashboardRoute(userData.role));
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to create account'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold text-ink dark:text-gray-100">Create your account</h1>
      <p className="mt-2 text-mute dark:text-gray-400">Join StartupForge and start building</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input label="Full Name" placeholder="John Doe" leftIcon={User} error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="you@example.com" leftIcon={Mail} error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" placeholder="••••••••" leftIcon={Lock} hint="Min 6 chars, 1 uppercase, 1 lowercase, 1 number" error={errors.password?.message} {...register('password')} />

        {password && (
          <div>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={cn('h-1.5 flex-1 rounded-full', i < strength ? strengthColors[strength] : 'bg-hairline')} />
              ))}
            </div>
            <p className="mt-1 text-xs text-mute dark:text-gray-400">Password strength: {strengthLabels[strength]}</p>
          </div>
        )}

        <Input label="Confirm Password" type="password" placeholder="••••••••" leftIcon={Lock} error={errors.confirmPassword?.message} {...register('confirmPassword')} />

        {/* Image Upload Box */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-soft dark:text-gray-300">Profile Image</label>
          <div className="rounded-xl border border-hairline dark:border-gray-700 bg-canvas dark:bg-gray-800 p-4">
            {/* Preview area */}
            {imagePreview ? (
              <div className="relative mx-auto mb-3 h-24 w-24 rounded-full overflow-hidden border-2 border-hairline dark:border-gray-600">
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-danger-500 text-white shadow-sm hover:bg-danger-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="mb-3 flex h-24 w-24 mx-auto items-center justify-center rounded-full border-2 border-dashed border-hairline dark:border-gray-600 bg-surface-soft dark:bg-gray-700">
                <User className="h-8 w-8 text-ash dark:text-gray-500" />
              </div>
            )}

            {/* Tab-style toggle */}
            <div className="flex rounded-lg border border-hairline dark:border-gray-600 overflow-hidden mb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs font-semibold transition-colors',
                  uploading
                    ? 'bg-surface-soft dark:bg-gray-700 text-ash dark:text-gray-400'
                    : 'bg-canvas dark:bg-gray-800 text-ink dark:text-gray-200 hover:bg-surface-card dark:hover:bg-gray-700'
                )}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload File
              </button>
              <div className="w-px bg-hairline dark:bg-gray-600" />
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-ink dark:text-gray-200 bg-canvas dark:bg-gray-800 hover:bg-surface-card dark:hover:bg-gray-700 transition-colors"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Image URL
              </button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image URL input */}
            <input
              type="url"
              placeholder="Paste image URL here..."
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="w-full rounded-md border border-hairline dark:border-gray-600 bg-surface-soft dark:bg-gray-700 px-3 py-2 text-sm text-ink dark:text-gray-200 placeholder-ash dark:placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            <p className="mt-1.5 text-[11px] text-ash dark:text-gray-500">
              Upload an image or paste a direct URL (JPG, PNG, GIF)
            </p>
          </div>
        </div>

        {/* Role Selector - Red radio buttons */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink-soft dark:text-gray-300">I want to join as <span className="text-primary">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            {([{ value: 'founder', label: 'Founder', icon: Rocket, desc: 'I have a startup' }, { value: 'collaborator', label: 'Collaborator', icon: Users, desc: 'I want to join' }]).map((opt) => (
              <label key={opt.value} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors', watch('role') === opt.value ? 'border-primary bg-primary-50 dark:bg-primary-950/30' : 'border-hairline hover:border-ash dark:border-gray-700 dark:hover:border-gray-500')}>
                <input type="radio" value={opt.value} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary/20 accent-[#e60023]" {...register('role')} />
                <opt.icon className={cn('h-5 w-5', watch('role') === opt.value ? 'text-primary' : 'text-ash dark:text-gray-500')} />
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-gray-100">{opt.label}</p>
                  <p className="text-xs text-mute dark:text-gray-400">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.role && <p className="mt-1 text-xs text-danger-600">{errors.role.message}</p>}
        </div>

        <Button type="submit" fullWidth size="lg" loading={submitting} leftIcon={UserPlus} className="rounded-full">Create Account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-mute dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
