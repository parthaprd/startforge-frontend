'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Shield, Crown, Edit3, MapPin,
  Globe, Briefcase, Star, Award, ExternalLink
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageHeader from '@/components/dashboard/PageHeader';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import useUser from '@/hooks/useUser';
import { formatDate, capitalize, APP_NAME } from '@/lib/utils';

function ProfileView() {
  const { user, isPremium } = useUser();

  if (!user) return null;

  const profileFields = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Shield, label: 'Role', value: capitalize(user.role), badge: true },
    { icon: Calendar, label: 'Joined', value: formatDate(user.createdAt) },
    ...(user.bio ? [{ icon: User, label: 'Bio', value: user.bio }] : []),
    ...(user.location ? [{ icon: MapPin, label: 'Location', value: user.location }] : []),
    ...(user.portfolio ? [{ icon: Globe, label: 'Portfolio', value: user.portfolio, isLink: true }] : []),
  ];

  return (
    <div>
      <PageHeader title="My Profile" description="View your profile information.">
        <Link href="/dashboard/profile/edit">
          <Button leftIcon={Edit3}>Edit Profile</Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardContent className="flex flex-col items-center py-8">

                <div className="relative mb-4">
                  <Avatar
                    src={user.image}
                    name={user.name}
                    size="xl"
                    className="h-24 w-24 text-2xl"
                  />
                  {isPremium && (
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-warning-500">
                      <Crown className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-ink">{user.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary">{capitalize(user.role)}</Badge>
                  {isPremium && (
                    <Badge variant="premium">
                      <Star className="mr-1 h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                </div>

                <div className="mt-6 grid w-full grid-cols-2 gap-4">
                  <div className="rounded-lg bg-surface-card p-3 text-center">
                    <p className="text-lg font-bold text-ink">
                      {user.stats?.applications || user.stats?.opportunities || 0}
                    </p>
                    <p className="text-xs text-mute">
                      {user.role === 'founder' ? 'Opportunities' : 'Applications'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-card p-3 text-center">
                    <p className="text-lg font-bold text-ink">
                      {user.stats?.startups || '-'}
                    </p>
                    <p className="text-xs text-mute">
                      {user.role === 'founder' ? 'Startup' : 'Startups Joined'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 w-full space-y-2">
                  {user.role === 'founder' && !isPremium && (
                    <Link href="/dashboard/founder/upgrade" className="block w-full">
                      <Button variant="gradient" fullWidth leftIcon={Crown}>
                        Upgrade to Premium
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard/profile/edit" className="block w-full">
                    <Button variant="outline" fullWidth leftIcon={Edit3}>
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <h3 className="mb-4 text-lg font-semibold text-ink">Personal Information</h3>
                <div className="space-y-4">
                  {profileFields.map((field) => (
                    <div key={field.label} className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <field.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-mute uppercase tracking-wide">{field.label}</p>
                        {field.badge ? (
                          <Badge variant="secondary" className="mt-1">{field.value}</Badge>
                        ) : field.isLink ? (
                          <a
                            href={field.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline break-all"
                          >
                            {field.value}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-ink-soft break-words">{field.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {user.skills && user.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardContent>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
                    <Award className="h-5 w-5 text-primary" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {user.role === 'founder' && user.startup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardContent>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
                    <Briefcase className="h-5 w-5 text-primary" />
                    My Startup
                  </h3>
                  <Link href={`/startups/${user.startup._id}`} className="group flex items-center gap-4 rounded-lg border border-hairline p-4 transition-colors hover:border-primary/30 hover:bg-surface-soft">
                    <Avatar src={user.startup.logo} name={user.startup.startup_name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink group-hover:text-primary">{user.startup.startup_name}</p>
                      <p className="text-sm text-mute truncate">{user.startup.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.startup.status === 'approved' ? 'success' : user.startup.status === 'rejected' ? 'danger' : 'warning'}>
                        {user.startup.status}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-ash group-hover:text-primary" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="border-warning-100 bg-warning-50">
                <CardContent>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-ink">
                    <Crown className="h-5 w-5 text-warning-600" />
                    Premium Benefits
                  </h3>
                  <ul className="space-y-2 text-sm text-mute">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Unlimited opportunity postings
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Priority listing in search results
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Advanced analytics dashboard
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Direct messaging with collaborators
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['founder', 'collaborator', 'admin']}>
      <ProfileView />
    </ProtectedRoute>
  );
}
