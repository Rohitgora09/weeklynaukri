import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SscGdClient from './SscGdClient';

export const metadata = {
  title: 'SSC GD Answer Key 2026: Download PDF & Score Calculator | WeeklyNaukri',
  description: 'Download official SSC GD Constable 2026 candidate response sheet at ssc.gov.in. Calculate raw marks and check category expected cut-off lists.',
  alternates: {
    canonical: '/ssc-gd-2026',
  },
  openGraph: {
    title: 'SSC GD Answer Key 2026: Download PDF & Score Calculator | WeeklyNaukri',
    description: 'Download official SSC GD Constable 2026 candidate response sheet at ssc.gov.in. Calculate raw marks and check category expected cut-off lists.',
    url: '/ssc-gd-2026',
    type: 'website',
  },
};

export default function SscGdPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full font-sans antialiased text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full" id="main-content">
        <SscGdClient />
      </main>
      <Footer />
    </div>
  );
}
