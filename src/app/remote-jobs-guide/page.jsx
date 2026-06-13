import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import Link from 'next/link';
import { Briefcase, ArrowRight, CheckCircle, Search, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Remote Jobs in India: Guide to ZipRecruiter, LinkedIn & Referrals',
  description: 'Looking for work-from-home or remote jobs in India? Learn how to successfully use ZipRecruiter, LinkedIn, and WeeklyNaukri community referrals to land your dream role.',
  alternates: {
    canonical: '/remote-jobs-guide',
  },
};

export default function RemoteJobsGuide() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full inline-flex items-center gap-1 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Career Resources
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 max-w-2xl mx-auto">
            How to Find High-Paying Remote Jobs in India: The Ultimate Guide
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Learn how to leverage platforms like ZipRecruiter, LinkedIn, and community referrals to land remote work-from-home opportunities.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          
          {/* Section 1: Intro */}
          <Card padding="p-6 md:p-8 space-y-4" hover={false}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">1</span>
              The Rise of Remote Jobs in India
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Remote work has transformed the job market in India, allowing software engineers, marketers, analysts, and designers to work for global corporations from the comfort of their homes. 
              Search trends show a massive surge of interest in international job boards like **ZipRecruiter** and **LinkedIn** as Indian job seekers seek jobs that offer work-life balance and competitive pay.
            </p>
          </Card>

          {/* Section 2: ZipRecruiter */}
          <Card padding="p-6 md:p-8 space-y-4" hover={false}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">2</span>
              Using ZipRecruiter for Global & US Remote Jobs
            </h2>
            <p className="text-gray-700 leading-relaxed font-semibold">
              Why is ZipRecruiter experiencing record breakout search volumes in India?
            </p>
            <p className="text-gray-700 leading-relaxed">
              While ZipRecruiter is primarily headquartered in the US, many global startups use it to post remote-first roles open to talent in India. Additionally, social media creators frequently highlight ZipRecruiter as a "secret weapon" for finding remote customer service and tech jobs that pay in dollars.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
              <p className="font-semibold text-gray-900 text-sm">Best Practices for ZipRecruiter in India:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Set your location profile to **"Remote"** and filter by companies that hire globally.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Enable **"1-Click Apply"** alerts so you can submit your resume the moment a listing goes live.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Always check if the description lists **"Worldwide Remote"** or **"India Remote friendly"** parameters.</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Section 3: LinkedIn & Referrals */}
          <Card padding="p-6 md:p-8 space-y-4" hover={false}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">3</span>
              The Shortcut: LinkedIn & Community Referrals
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Applying blindly on massive job portals can lead to your resume getting lost in applicant tracking systems (ATS). The most successful way to land a private or remote IT job is through **referrals**.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Having an employee inside a company submit your resume directly bypasses the initial screening filter and gives you a 10x higher chance of landing an interview.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="font-bold text-blue-900">Explore WeeklyNaukri Referrals</h4>
                <p className="text-sm text-blue-800">Browse active job referrals posted by employees at top IT companies in India.</p>
              </div>
              <Link 
                href="/referrals" 
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 shrink-0 shadow-sm"
              >
                Go to Referrals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* Section 4: Resume Optimization */}
          <Card padding="p-6 md:p-8 space-y-4" hover={false}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 text-sm font-bold">4</span>
              Prepare Your ATS-Friendly Resume
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To apply for remote jobs on LinkedIn or ZipRecruiter, you need a clean, single-column PDF resume that can be parsed easily by automated systems. Avoid complex graphics, tables, or text boxes, as they scramble the parser.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Make sure to list your technical skills (like JavaScript, Python, React, SQL) in clear bullet points, as these are the exact keywords search filters target.
            </p>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
