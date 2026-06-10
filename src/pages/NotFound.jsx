import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <Helmet>
        <title>Page Not Found — WeeklyNaukri.com</title>
      </Helmet>
      <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="bg-blue-950 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-900 transition-colors">
        Return Home
      </Link>
    </div>
  );
}
