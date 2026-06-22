'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { PLATFORM_STATS } from '@/constants';
import { formatNumber } from '@/lib/utils';

function Counter({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="container-custom relative z-10 pt-16 pb-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PLATFORM_STATS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="card-base p-6 text-center bg-canvas"
          >
            <div className="text-3xl font-bold text-ink md:text-4xl tracking-tight">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-sm font-medium text-mute">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
