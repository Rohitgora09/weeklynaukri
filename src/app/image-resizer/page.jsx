import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ResizerClient from './ResizerClient';

export const metadata = {
  title: 'SSC Photo & Signature Resizer Online (Free) | WeeklyNaukri',
  description: 'Free online image resizer and compressor for SSC CGL, SSC GD, UPSC, and Sarkari exam applications. Crop, resize, and compress images to 20KB-50KB instantly.',
  alternates: {
    canonical: '/image-resizer',
  },
  openGraph: {
    title: 'SSC Photo & Signature Resizer Online (Free) | WeeklyNaukri',
    description: 'Free online image resizer and compressor for SSC CGL, SSC GD, UPSC, and Sarkari exam applications. Crop, resize, and compress images to 20KB-50KB instantly.',
    url: '/image-resizer',
    type: 'website',
  },
};

export default function ResizerPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full font-sans antialiased text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full" id="main-content">
        <ResizerClient />
      </main>
      <Footer />
    </div>
  );
}
