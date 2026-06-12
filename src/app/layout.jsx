import '../index.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata = {
  title: 'WeeklyNaukri.com — Latest Govt & Private Jobs in India 2026',
  description: "WeeklyNaukri.com — India's #1 weekly job portal. Latest sarkari naukri, government jobs, private jobs, results, admit cards & answer keys updated every week.",
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://weeklynaukri.com/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://weeklynaukri.com/',
    siteName: 'WeeklyNaukri.com',
    title: 'WeeklyNaukri.com — Latest Govt & Private Jobs in India 2026',
    description: "WeeklyNaukri.com — India's #1 weekly job portal. Latest sarkari naukri, government jobs, private jobs, results, admit cards & answer keys updated every week.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WeeklyNaukri.com — Latest Govt & Private Jobs in India 2026',
    description: "WeeklyNaukri.com — India's #1 weekly job portal. Latest sarkari naukri, government jobs, private jobs, results, admit cards & answer keys updated every week.",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N7B0CBR4R6" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N7B0CBR4R6');
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-white">
        {children}
      </body>
    </html>
  );
}
