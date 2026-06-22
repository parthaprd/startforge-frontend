'use client';

import Link from 'next/link';
import { Linkedin, Twitter, Github } from 'lucide-react';
import Logo from './Logo';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/startups', label: 'Startups' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/login', label: 'Login' },
];

const resourceLinks = [
  { href: '/startups', label: 'Browse Startups' },
  { href: '/opportunities', label: 'Find Opportunities' },
  { href: '/register', label: 'Become a Founder' },
  { href: '/register', label: 'Become a Collaborator' },
];

const socialLinks = [
  { href: '#', label: 'LinkedIn', icon: Linkedin },
  { href: '#', label: 'Twitter', icon: Twitter },
  { href: '#', label: 'GitHub', icon: Github },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-canvas rounded-none">
      <div className="container-custom py-8 px-6 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">

          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-body-sm text-mute">
              The platform where startup founders meet talented collaborators to
              build the future together.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-mute transition-colors hover:border-primary hover:bg-surface-card hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-body-sm-strong text-ink uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-mute transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm-strong text-ink uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link, idx) => (
                <li key={`${link.label}-${idx}`}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-mute transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-body-sm-strong text-ink uppercase tracking-wider">
              Get Started
            </h3>
            <p className="mt-4 text-body-sm text-mute">
              Join thousands of founders and collaborators building the next big
              thing.
            </p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary-pressed px-5 py-2.5 text-sm font-bold text-on-primary transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-hairline pt-6 text-center">
          <p className="text-caption-sm text-mute dark:text-gray-400">
            © {currentYear} StartupForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
