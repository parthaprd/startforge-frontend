'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Crown, Check, Sparkles } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import PricingCard from '@/components/payment/PricingCard';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services/paymentService';
import { PREMIUM_PLAN } from '@/constants';
import { getErrorMessage } from '@/lib/utils';

function Upgrade() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await paymentService.createCheckout({
        price: PREMIUM_PLAN.price,
        name: PREMIUM_PLAN.name,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.success('Redirecting to checkout...');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to start checkout'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Upgrade to Premium" description="Unlock the full power of StartupForge." />

      <div className="grid items-start gap-8 lg:grid-cols-2">

        <div>
          <PricingCard plan={PREMIUM_PLAN} isPremium={user?.isPremium} onUpgrade={handleUpgrade} loading={loading} />
        </div>

        <div className="space-y-4">
          <div className="card-base p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
              <Sparkles className="h-5 w-5 text-warning-500" /> Why upgrade?
            </h3>
            <p className="mt-2 text-sm text-mute">The free plan limits you to 3 opportunities. Premium removes all limits and gives you advanced tools to grow your team faster.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { title: 'Unlimited Posts', desc: 'Post as many opportunities as you need' },
              { title: 'Priority Listing', desc: 'Your opportunities appear first' },
              { title: 'Advanced Analytics', desc: 'Deep insights into your performance' },
              { title: 'Featured Badge', desc: 'Stand out with a premium badge' },
            ].map((b) => (
              <div key={b.title} className="card-base p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mt-3 font-semibold text-ink">{b.title}</h4>
                <p className="text-sm text-mute">{b.desc}</p>
              </div>
            ))}
          </div>

          {user?.isPremium && (
            <div className="rounded-xl border border-success-50 bg-success-pale p-4 text-sm text-success-deep">
              <Crown className="mr-1 inline h-4 w-4" /> You&apos;re already a Premium member. Enjoy all the benefits!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return <ProtectedRoute allowedRoles={['founder']}><Upgrade /></ProtectedRoute>;
}
