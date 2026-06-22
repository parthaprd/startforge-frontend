'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SUCCESS_STORIES } from '@/constants';
import Image from 'next/image';

export default function SuccessStories() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((i) => (i + 1) % SUCCESS_STORIES.length);
  const prev = () =>
    setCurrent(
      (i) => (i - 1 + SUCCESS_STORIES.length) % SUCCESS_STORIES.length
    );

  const story = SUCCESS_STORIES[current];

  return (
    <section className="py-section bg-surface-soft">
      <div className="container-custom">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center mb-10"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-mute block mb-1">
            Testimonials
          </span>
          <h2 className="text-heading-xl font-bold text-ink md:text-3xl md:tracking-[-1.2px]">
            Success Stories
          </h2>
          <p className="mt-2 text-body-md text-mute">
            Hear from founders and collaborators who found their perfect match.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-10 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="rounded-lg border border-hairline-soft bg-canvas p-8 md:p-10 text-center shadow-none"
            >

              <Quote className="mx-auto h-9 w-9 text-primary-100" />

              <p className="mt-5 text-lg leading-relaxed text-ink-soft md:text-xl">
                &ldquo;{story.quote}&rdquo;
              </p>

              <div className="mt-7 flex items-center justify-center gap-1">
                {Array.from({ length: story.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-hairline-soft">
                  <Image
                    src={story.avatar}
                    alt={story.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-ink">{story.name}</p>
                  <p className="text-sm text-mute">{story.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 rounded-full border border-hairline-soft bg-canvas p-2.5 shadow-none transition text-ink hover:border-primary hover:text-primary hidden md:flex"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 rounded-full border border-hairline-soft bg-canvas p-2.5 shadow-none transition text-ink hover:border-primary hover:text-primary hidden md:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {SUCCESS_STORIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-hairline hover:bg-mute'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
