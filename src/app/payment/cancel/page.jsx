'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { XCircle, RotateCcw, Home, ArrowRight } from 'lucide-react';
import { FullPageSpinner } from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { APP_NAME } from '@/constants';

function CancelContent() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mb-8 rounded-full bg-danger/10 p-6"
      >
        <XCircle className="h-20 w-20 text-danger" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-ink">Payment Cancelled</h1>
        <p className="mb-2 text-mute">
          Your payment was not completed.
        </p>
        <p className="mb-8 text-sm text-mute">
          No charges have been made to your account. You can try again whenever you&apos;re ready.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 text-left"
        >
          <div className="rounded-lg border border-hairline bg-surface-card p-6">
            <h3 className="mb-3 font-semibold text-ink">Common Reasons</h3>
            <ul className="space-y-2 text-sm text-mute">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ash"></span>
                Payment was cancelled before completion
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ash"></span>
                Your bank declined the transaction
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ash"></span>
                Network connectivity issues
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ash"></span>
                Card details were entered incorrectly
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link href="/dashboard/founder/upgrade">
            <Button variant="gradient" size="lg" rightIcon={RotateCcw}>
              Try Again
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" leftIcon={ArrowRight}>
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="lg" leftIcon={Home}>
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <CancelContent />
    </Suspense>
  );
}
