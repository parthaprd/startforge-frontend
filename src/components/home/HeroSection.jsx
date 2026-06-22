'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight, Search, Sparkles, Users } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface-soft border-b border-hairline-soft">
      <div className="container-custom relative py-20 md:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-canvas px-4 py-1.5 text-sm font-medium text-ink shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Join 12,000+ founders & collaborators
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance font-semibold text-ink text-4xl sm:text-5xl md:text-6xl lg:text-[70px] lg:leading-[1.1] lg:tracking-[-1.2px]"
          >
            Build Your Dream{' '}
            <span className="text-primary">
              Startup Team
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-balance text-body-md text-mute md:text-lg"
          >
            Connect with talented collaborators and bring your ideas to life.
            Find co-founders, hire skilled team members, or discover exciting
            startup opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              href="/register"
              variant="primary"
              size="lg"
              leftIcon={Rocket}
              className="w-full sm:w-auto rounded-full"
            >
              Post Opportunity
            </Button>
            <Button
              href="/opportunities"
              variant="secondary"
              size="lg"
              rightIcon={ArrowRight}
              className="w-full sm:w-auto rounded-full"
            >
              Browse Opportunities
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-mute"
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Verified founders
            </span>
            <span className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" /> Smart matching
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Free to join
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
