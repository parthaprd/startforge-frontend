'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function SkillsInput({ value = [], onChange, placeholder = 'Add a skill and press Enter' }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setInput('');
  };

  const remove = (skill) => onChange(value.filter((s) => s !== skill));

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); add(); }
          }}
          placeholder={placeholder}
          className="input-base"
        />
        <button type="button" onClick={add} className="btn-base bg-primary-600 px-4 text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {value.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
              {skill}
              <button type="button" onClick={() => remove(skill)} className="text-primary-400 hover:text-primary-600">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
