import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
      <h1 className="text-6xl font-bold text-blue-950 mb-4">404</h1>
      <p className="text-xl text-gray-650 mb-6 font-semibold">Page Not Found</p>
      <p className="text-gray-500 mb-8 max-w-sm">
        The listing or page you are looking for does not exist or has been removed.
      </p>
      <Link 
        href="/" 
        className="bg-blue-950 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-900 transition-colors shadow-md shadow-blue-900/10"
      >
        Return Home
      </Link>
    </div>
  );
}
