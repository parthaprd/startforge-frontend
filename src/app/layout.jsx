import { Inter } from 'next/font/google';
import '../styles/globals.css';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { APP_NAME, APP_DESCRIPTION } from '@/constants';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: {
    default: `${APP_NAME} - Build Your Dream Startup Team`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'startup',
    'founders',
    'collaborators',
    'hiring',
    'startup jobs',
    'co-founder',
    'StartupForge',
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    title: `${APP_NAME} - Build Your Dream Startup Team`,
    description: APP_DESCRIPTION,
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#e60023',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
