'use client';

import { Rocket, Users, Sparkles, TrendingUp } from 'lucide-react';
import Logo from '@/components/layout/Logo';

const SIDE_STATS = [
  { icon: Rocket, label: '12,500+ Founders', value: 'Building dreams' },
  { icon: Users, label: '8,900+ Opportunities', value: 'Open right now' },
  { icon: Sparkles, label: '5,600+ Hires', value: 'Successful matches' },
  { icon: TrendingUp, label: '3,400+ Startups', value: 'Actively hiring' },
];

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Form side — warm cream */}
      <div className="flex flex-col justify-center bg-canvas px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10">
          </div>
          {children}
        </div>
      </div>

      {/* Brand side — ink */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="relative flex h-full flex-col justify-center p-14">
          {/* Heading */}

          {/* Heading */}
          <h2 className="text-4xl font-bold leading-tight text-on-dark md:text-5xl md:tracking-[-1.5px]">
            Join thousands of<br />
            <span className="text-primary">builders</span> shaping<br />
            the future.
          </h2>
          <p className="mt-5 max-w-sm text-body-lg text-on-dark-mute">
            Whether you&apos;re a founder looking for talent or a collaborator
            seeking your next adventure — StartupForge connects you.
          </p>

          {/* Stats grid */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {SIDE_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-md border border-on-dark-mute/15 bg-on-dark-mute/8 p-4"
              >
                <stat.icon className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-semibold text-on-dark">
                  {stat.label}
                </p>
                <p className="text-xs text-on-dark-mute">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
