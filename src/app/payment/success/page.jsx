'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle2, Crown, ArrowRight, Home, CreditCard, Calendar, Star } from 'lucide-react';
import { FullPageSpinner } from '@/components/ui/Spinner';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { paymentService } from '@/services/paymentService';
import { useUser } from '@/hooks/useUser';
import { formatCurrency, formatDate } from '@/lib/utils';
import { APP_NAME } from '@/constants';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {

        await refreshUser();

        const sessionId = searchParams.get('session_id');
        if (sessionId) {
          const res = await paymentService.verifyPremium({ sessionId });
          setTransaction(res.data || res);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [searchParams, refreshUser]);

  if (loading) {
    return <FullPageSpinner />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 rounded-full bg-warning/10 p-6">
          <CreditCard className="h-16 w-16 text-warning" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-ink">Payment Processing</h1>
        <p className="mb-6 max-w-md text-mute">
          {error}
        </p>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mb-8 rounded-full bg-success/10 p-6"
      >
        <CheckCircle2 className="h-20 w-20 text-success" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md text-center"
      >
        <h1 className="mb-2 text-3xl font-bold text-ink">Payment Successful!</h1>
        <p className="mb-2 text-mute">
          Welcome to {APP_NAME} Premium
        </p>
        <div className="mb-8 flex items-center justify-center gap-2">
          <Badge variant="premium" className="px-4 py-1.5 text-sm">
            <Crown className="mr-1.5 h-4 w-4" />
            Premium Member
          </Badge>
        </div>

        {transaction && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-8 text-left">
              <CardContent>
                <h3 className="mb-3 font-semibold text-ink">Transaction Details</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-mute">
                      <CreditCard className="h-4 w-4" /> Amount
                    </span>
                    <span className="font-semibold text-ink">
                      {formatCurrency(transaction.amount || 29)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-mute">
                      <Star className="h-4 w-4" /> Plan
                    </span>
                    <Badge variant="premium" size="sm">Premium</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-mute">
                      <Calendar className="h-4 w-4" /> Date
                    </span>
                    <span className="text-sm text-ink-soft">
                      {formatDate(transaction.createdAt)}
                    </span>
                  </div>
                  {transaction.transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-mute">Transaction ID</span>
                      <span className="font-mono text-xs text-mute">
                        {transaction.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8 text-left"
        >
          <Card className="border-warning-100 bg-warning-50">
            <CardContent>
              <h3 className="mb-3 font-semibold text-ink">You now have access to:</h3>
              <ul className="space-y-2 text-sm text-mute">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Unlimited opportunity postings
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Priority listing in search results
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Advanced analytics dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Direct messaging with collaborators
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link href="/dashboard">
            <Button variant="gradient" size="lg" rightIcon={ArrowRight}>
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" leftIcon={Home}>
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <SuccessContent />
    </Suspense>
  );
}
