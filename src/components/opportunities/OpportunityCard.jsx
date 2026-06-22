'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, MoreHorizontal, MapPin } from 'lucide-react';
import { deadlineCountdown, getPlaceholderImage } from '@/lib/utils';
import { useState } from 'react';

export default function OpportunityCard({ opportunity }) {
  const {
    _id,
    role_title,
    required_skills = [],
    work_type,
    commitment_level,
    deadline,
    startup_id,
  } = opportunity;

  const startupName =
    typeof startup_id === 'object' ? startup_id?.startup_name : 'Startup';
  const startupLogo =
    typeof startup_id === 'object' ? startup_id?.logo : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const visibleSkills = required_skills.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      className="card-base bg-canvas rounded-md border border-hairline-soft overflow-visible"
    >
      <div className="p-4 flex flex-col gap-3 h-full">

        {/* Top row: startup logo + name + work_type tag + 3-dot menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Startup logo */}
            <div className="relative h-10 w-10 rounded-md overflow-hidden border border-hairline-soft bg-surface-soft flex-shrink-0">
              <Image
                src={startupLogo || getPlaceholderImage(startupName)}
                alt={`${startupName} logo`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            {/* Startup name + work type */}
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-ink leading-tight truncate">
                {startupName}
              </p>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-mute">
                {work_type || 'Opportunity'}
              </span>
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => { e.preventDefault(); setMenuOpen((v) => !v); }}
              className="h-7 w-7 rounded-full flex items-center justify-center text-ash hover:bg-surface-card hover:text-mute transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-36 rounded-md border border-hairline-soft bg-canvas shadow-modal py-1">
                  <Link
                    href={`/opportunities/${_id}`}
                    className="block px-3 py-2 text-xs text-ink hover:bg-surface-card"
                    onClick={() => setMenuOpen(false)}
                  >
                    View Details
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Role title (main heading) */}
        <div>
          <Link href={`/opportunities/${_id}`}>
            <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2 hover:text-primary transition-colors">
              {role_title}
            </h3>
          </Link>
          {commitment_level && (
            <p className="text-xs text-mute mt-0.5">{commitment_level}</p>
          )}
        </div>

        {/* Skills pills */}
        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-surface-soft border border-hairline-soft text-mute text-[10px] px-2 py-0.5 rounded-full font-semibold"
              >
                {skill}
              </span>
            ))}
            {required_skills.length > 3 && (
              <span className="bg-surface-soft border border-hairline-soft text-ash text-[10px] px-2 py-0.5 rounded-full font-semibold">
                +{required_skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom row: deadline chip (left) + commitment level (right) */}
        <div className="flex items-center justify-between pt-2 border-t border-hairline-soft">
          <div>
            <p className="text-[10px] text-ash font-medium">Deadline</p>
            <p className="text-xs font-semibold text-body flex items-center gap-1">
              <Clock className="h-3 w-3 text-mute" />
              {deadlineCountdown(deadline)}
            </p>
          </div>

          {/* Apply chip */}
          <Link
            href={`/opportunities/${_id}`}
            className="flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold hover:bg-primary/20 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
