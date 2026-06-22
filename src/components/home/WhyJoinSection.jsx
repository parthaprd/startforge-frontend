'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  Target,
  ShieldCheck,
  UserPlus,
  Search,
  Rocket,
} from 'lucide-react';
import { PLATFORM_BENEFITS, HOW_IT_WORKS_STEPS } from '@/constants';

const iconMap = {
  Briefcase,
  Users,
  Target,
  ShieldCheck,
};

const cardColors = [
  'bg-canvas border border-hairline-soft',
  'bg-surface-card border border-hairline-soft',
  'bg-canvas border border-hairline-soft',
  'bg-surface-card border border-hairline-soft',
];

const iconBgMap = {
  primary: 'bg-[#ffe5e0] text-primary',
  secondary: 'bg-secondary-bg text-on-secondary',
  success: 'bg-success-pale text-success-deep',
  warning: 'bg-[#fef3c7] text-[#b45309]',
};

const stepIcons = { UserPlus, Search, Rocket };

export default function WhyJoinSection() {
  return (
    <section className="py-section bg-canvas">
      <div className="container-custom">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-10"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-mute block mb-1">
            Why StartupForge
          </span>
          <h2 className="text-heading-xl font-bold text-ink md:text-3xl md:tracking-[-1.2px]">
            The best place to build together
          </h2>
          <p className="mt-3 text-body-md text-mute">
            Whether you're a founder looking for talent or a collaborator
            seeking your next adventure, we make the connection effortless.
          </p>
        </motion.div>

        {/* Benefits — feature-card alternating */}
        <div className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-4">
          {PLATFORM_BENEFITS.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon] || Briefcase;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`${cardColors[idx % 4]} rounded-md p-8 text-center`}
              >
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                    iconBgMap[benefit.color] || iconBgMap.primary
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-heading-md font-semibold text-ink">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-body-sm text-mute">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* How it works */}
        <div className="mt-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center mb-10"
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-mute block mb-1">
              How It Works
            </span>
            <h2 className="text-heading-xl font-bold text-ink md:text-3xl md:tracking-[-1.2px]">
              Get started in 3 simple steps
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Connecting line on desktop */}
            <div className="absolute left-0 right-0 top-10 hidden h-px bg-hairline md:block" />

            {HOW_IT_WORKS_STEPS.map((step, idx) => {
              const Icon = stepIcons[step.icon] || UserPlus;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-canvas bg-primary text-on-primary shadow-sm">
                    <Icon className="h-8 w-8" />
                    <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-on-dark shadow-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-heading-md font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-body-sm text-mute">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
