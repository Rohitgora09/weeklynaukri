import '../index.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

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
  title: 'Government Jobs: Latest Govt Jobs & Sarkari Result 2026 - Weekly Naukri',
  description: "WeeklyNaukri.com (Weekly Naukri) is India's leading portal for active Government Jobs, technical IT govt vacancies, and Sarkari Results. Find latest govt job openings.",
  keywords: [
    'Sarkari Result',
    'Sarkari Naukri',
    'Naukri Result',
    'Weekly Naukri',
    'WeeklyNaukri',
    'Government Jobs',
    'Latest Govt Jobs',
    'Private Jobs',
    'Admit Card',
    'Answer Key',
    'Sarkari Exam',
    'Free Job Alert'
  ],
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
    title: 'Sarkari Result | Weekly Naukri | Latest Govt & Private Jobs 2026',
    description: "WeeklyNaukri.com (Weekly Naukri) is India's premier Sarkari Result portal. Get the latest updates on Sarkari Naukri, Govt Jobs, Private Jobs, Results, Admit Cards, and Answer Keys.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarkari Result | Weekly Naukri | Latest Govt & Private Jobs 2026',
    description: "WeeklyNaukri.com (Weekly Naukri) is India's premier Sarkari Result portal. Get the latest updates on Sarkari Naukri, Govt Jobs, Private Jobs, Results, Admit Cards, and Answer Keys.",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N7B0CBR4R6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N7B0CBR4R6');
          `}
        </Script>
        {/* WebSite and Organization JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://weeklynaukri.com/#website",
                  "url": "https://weeklynaukri.com/",
                  "name": "WeeklyNaukri.com",
                  "alternateName": ["Weekly Naukri", "Naukri Result", "Sarkari Result Weekly"],
                  "description": "India's leading weekly job portal for latest Sarkari Naukri, government jobs, private jobs, results, admit cards, and answer keys.",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://weeklynaukri.com/?search={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  },
                  "inLanguage": "en-IN"
                },
                {
                  "@type": "Organization",
                  "@id": "https://weeklynaukri.com/#organization",
                  "name": "Weekly Naukri",
                  "url": "https://weeklynaukri.com/",
                  "logo": {
                    "@type": "ImageObject",
                    "@id": "https://weeklynaukri.com/#logo",
                    "url": "https://weeklynaukri.com/favicon.svg",
                    "caption": "Weekly Naukri Logo"
                  },
                  "image": {
                    "@id": "https://weeklynaukri.com/#logo"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-white">
        {children}
      </body>
    </html>
  );
}
