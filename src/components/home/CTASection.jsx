'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="bg-ink py-section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-on-dark-mute/20 bg-on-dark-mute/10 px-4 py-1.5 text-sm font-medium text-on-dark-mute">
            <Sparkles className="h-4 w-4" />
            Free to get started
          </div>

          <h2 className="text-heading-xl font-bold text-on-dark md:text-4xl md:tracking-[-1.5px]">
            Ready to build something amazing?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-body-lg text-on-dark-mute">
            Join thousands of founders and collaborators already building the
            future on StartupForge.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href="/register"
              size="lg"
              rightIcon={ArrowRight}
              className="w-full sm:w-auto rounded-full"
            >
              Create Free Account
            </Button>
            <Button
              href="/startups"
              size="lg"
              variant="ghost"
              className="w-full border border-on-dark-mute/20 text-on-dark hover:bg-white/10 sm:w-auto rounded-full"
            >
              Explore Startups
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
