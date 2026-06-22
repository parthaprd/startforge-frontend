'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Briefcase, MoreHorizontal } from 'lucide-react';
import { getPlaceholderImage } from '@/lib/utils';
import { useState } from 'react';

export default function StartupCard({ startup }) {
  const {
    _id,
    startup_name,
    logo,
    industry,
    team_size,
    funding_stage,
    opportunities,
  } = startup;

  const [menuOpen, setMenuOpen] = useState(false);
  const opportunityCount =
    Array.isArray(opportunities) ? opportunities.length : (startup.opportunity_count ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
      className="card-base bg-canvas rounded-md border border-hairline-soft overflow-visible"
    >
      <div className="p-4 flex flex-col gap-3 h-full">
        {/* Top row: logo + company name + industry tag + 3-dot menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div className="relative h-10 w-10 rounded-md overflow-hidden border border-hairline-soft bg-surface-soft flex-shrink-0">
              <Image
                src={logo || getPlaceholderImage(startup_name)}
                alt={`${startup_name} logo`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            {/* Name + industry */}
            <div className="min-w-0">
              <Link href={`/startups/${_id}`}>
                <p className="text-[13px] font-bold text-ink leading-tight truncate hover:text-primary transition-colors">
                  {startup_name}
                </p>
              </Link>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-mute">
                {industry || 'Startup'}
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
                    href={`/startups/${_id}`}
                    className="block px-3 py-2 text-xs text-ink hover:bg-surface-card"
                    onClick={() => setMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Role / startup name as main heading */}
        <div>
          <Link href={`/startups/${_id}`}>
            <h3 className="text-sm font-bold text-ink leading-snug line-clamp-2 hover:text-primary transition-colors">
              {startup_name}
            </h3>
          </Link>
          {funding_stage && (
            <p className="text-xs text-mute mt-0.5">{funding_stage} Stage</p>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom row: team size + opportunities count */}
        <div className="flex items-center justify-between pt-2 border-t border-hairline-soft">
          <div>
            <p className="text-[10px] text-ash font-medium">Team Size</p>
            <p className="text-xs font-semibold text-body flex items-center gap-1">
              <Users className="h-3 w-3 text-mute" />
              {team_size ?? '—'}
            </p>
          </div>

          {/* Opportunities count chip - primary button style */}
          <Link
            href={`/startups/${_id}`}
            className="flex items-center gap-1.5 rounded-full bg-primary text-on-primary px-3 py-1.5 text-xs font-bold hover:bg-primary-pressed transition-colors"
          >
            <Briefcase className="h-3 w-3" />
            {opportunityCount} {opportunityCount === 1 ? 'Opening' : 'Openings'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
