'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  Award, 
  Lock, 
  Play, 
  BookOpen, 
  Info,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Card from '../../../components/ui/Card';

export default function TestDetailClient({ series }) {
  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar />

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-6 py-10 w-full flex-1">
        
        {/* Back navigation */}
        <Link 
          href="/test-series" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Test Series
        </Link>

        {/* Package Header Card */}
        <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white rounded-2xl p-6 md:p-8 shadow-md mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-extrabold bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-wider">
              {series.category}
            </span>
            <span className="text-xs text-blue-200 font-medium">{series.org}</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">{series.title}</h1>
          <p className="text-blue-100 text-sm max-w-3xl leading-relaxed">{series.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* List of Mock Tests */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-extrabold text-blue-950 text-lg tracking-wide uppercase">Available Mock Tests</h3>
            
            {series.tests.map((test, index) => (
              <Card key={index} padding="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-gray-200/80">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <h4 className="font-bold text-gray-900 text-base">{test.title}</h4>
                    {test.isFree ? (
                      <span className="text-[9px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md uppercase">Free</span>
                    ) : (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md uppercase">Premium</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 font-semibold">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {test.durationMinutes} Minutes</span>
                    <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-gray-400" /> {series.totalQuestions} Questions</span>
                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-gray-400" /> {series.totalMarks} Marks</span>
                    {series.sections && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {series.sections.map((sec, sIdx) => (
                          <span key={sIdx} className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-md border border-blue-100">
                            {sec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex items-center justify-start sm:justify-end">
                    {test.isFree ? (
                      <Link
                        href={`/test-series/${series.id}/take/${test.index}`}
                        className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Start Test
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-100 text-gray-400 text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 border border-gray-200 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" /> Premium Pack
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Sidebar Guidelines */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="font-extrabold text-blue-950 text-lg tracking-wide uppercase">Exam Information</h3>
              
              <Card padding="p-5" hover={false} className="border-gray-200/80">
                <div className="flex items-center gap-2 mb-4 text-blue-900">
                  <Info className="w-4.5 h-4.5" />
                  <h4 className="font-bold text-sm">General Instructions</h4>
                </div>
                
                <ul className="text-xs text-gray-600 space-y-3 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">&bull;</span>
                    <span><strong>Sectional Timing:</strong> Each section has a strict <strong>15-minute time limit</strong>. You cannot switch sections manually.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">&bull;</span>
                    <span><strong>Clock Behavior:</strong> The timer runs on absolute time. Refreshing will <strong>not</strong> reset the clock.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">&bull;</span>
                    <span><strong>Marking Scheme:</strong> Each correct response awards <strong>+{series.marksPerQuestion} marks</strong>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 font-bold">&bull;</span>
                    <span><strong>Negative Marking:</strong> Each incorrect response will deduct <strong>-{series.negativeMark} marks</strong>.</span>
                  </li>
                </ul>
            </Card>

            <Card padding="p-5" hover={false} className="border-amber-100 bg-amber-50/20">
              <div className="flex items-start gap-2.5 text-amber-700">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Aspirant Tip</h4>
                  <p className="text-[11px] leading-relaxed text-amber-800/90 mt-1">
                    Try not to search for answers in another tab. This console simulates a real examination centre experience to gauge your time management and accuracy under pressure.
                  </p>
                </div>
              </div>
            </Card>
          </div>

        </div>

      </section>

      <Footer />
    </div>
  );
}
