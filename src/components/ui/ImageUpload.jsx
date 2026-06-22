'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadService } from '@/services/uploadService';
import { cn } from '@/lib/utils';

export default function ImageUpload({ value, onChange, label = 'Upload Image', shape = 'circle', className }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }

    setError('');
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError('Failed to upload image');
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const clear = () => { setPreview(''); onChange(''); if (inputRef.current) inputRef.current.value = ''; };

  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center gap-4">
        <div className={cn('relative overflow-hidden bg-gray-100 ring-1 ring-gray-200', shape === 'circle' ? 'h-20 w-20 rounded-full' : 'h-20 w-20 rounded-xl')}>
          {preview ? (
            <Image src={preview} alt="Preview" fill sizes="80px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className="btn-base cursor-pointer border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            {uploading ? 'Uploading...' : preview ? 'Change' : 'Choose File'}
          </label>
          {preview && !uploading && (
            <button type="button" onClick={clear} className="inline-flex items-center gap-1 text-xs text-danger-600 hover:underline">
              <X className="h-3 w-3" /> Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-600">{error}</p>}
    </div>
  );
}
