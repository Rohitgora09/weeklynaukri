'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Award, 
  Clock, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  FileText
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import { mockTestSeriesList } from '../../data/mockTests';

export default function TestSeriesClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stats, setStats] = useState({ totalAttempts: 0, avgAccuracy: 0, highestScore: 0 });
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mock_test_attempts');
      if (saved) {
        const attempts = JSON.parse(saved);
        setHistory(attempts.slice(0, 5)); // Get last 5 attempts

        // Calculate statistics
        const total = attempts.length;
        let accuracySum = 0;
        let maxScore = 0;

        attempts.forEach(a => {
          accuracySum += parseFloat(a.accuracy) || 0;
          if (a.score > maxScore) maxScore = a.score;
        });

        setStats({
          totalAttempts: total,
          avgAccuracy: total > 0 ? Math.round(accuracySum / total) : 0,
          highestScore: maxScore
        });
      }
    } catch (e) {
      console.error("Failed to load mock test stats:", e);
    }
  }, []);

  // Filter series based on search and category
  const filteredSeries = mockTestSeriesList.filter(series => {
    const matchesCategory = selectedCategory === 'All' || series.category === selectedCategory;
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          series.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          series.org.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white px-6 py-12 md:py-16 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Boost Your Sarkari Exam Score
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight tracking-tight mb-4">
            Practice Real-Time <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Free Mock Test Series</span>
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mb-8">
            Experience real exam console UI, negative markings, detailed sectional scorecards, and expert solutions.
          </p>
        </div>
      </section>

      {/* Stats and Dashboard Content */}
      <section className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        {stats.totalAttempts > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
            <Card padding="p-6" hover={false} className="border-blue-100 bg-gradient-to-br from-blue-50/20 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tests Attempted</span>
                  <span className="block text-3xl font-extrabold text-blue-950 mt-1">{stats.totalAttempts}</span>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card padding="p-6" hover={false} className="border-green-100 bg-gradient-to-br from-green-50/20 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Accuracy</span>
                  <span className="block text-3xl font-extrabold text-green-600 mt-1">{stats.avgAccuracy}%</span>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card padding="p-6" hover={false} className="border-amber-100 bg-gradient-to-br from-amber-50/20 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Highest Score</span>
                  <span className="block text-3xl font-extrabold text-amber-600 mt-1">{stats.highestScore} Marks</span>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {['All', 'SSC', 'Railways', 'Banking'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-black text-white'
                    : 'bg-gray-50 border border-gray-200/60 hover:bg-gray-100 text-gray-650'
                }`}
              >
                {cat} Exams
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-gray-200 rounded-full outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50/30"
            />
          </div>
        </div>

        {/* Test Series Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredSeries.map(series => (
            <Card key={series.id} padding="p-6 flex flex-col justify-between" className="border-gray-200/80 hover:border-blue-500 hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    series.category === 'SSC' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                    series.category === 'Railways' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                    'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {series.category}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">{series.org}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">{series.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-6">{series.description}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-gray-400" /> {series.totalTests} Tests</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {series.durationMinutes} Mins</span>
                </div>
                
                <Link 
                  href={`/test-series/${series.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  View Pack <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}

          {filteredSeries.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-gray-200 rounded-2xl">
              <p className="text-sm text-gray-400 font-medium">No test series match your filters.</p>
            </div>
          )}
        </div>

        {/* Attempt History Section */}
        {history.length > 0 && (
          <div className="mt-12 mb-16">
            <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" /> Your Recent Attempts
            </h3>
            <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100">
                {history.map((attempt, index) => (
                  <div key={index} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{attempt.seriesTitle}</p>
                      <p className="text-xs text-gray-400 mt-1">{attempt.testTitle} &bull; {new Date(attempt.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-left sm:text-right">
                        <span className="block text-xs font-bold text-gray-450 uppercase tracking-wider">Score</span>
                        <span className="text-sm font-extrabold text-gray-800">{attempt.score} / {attempt.totalMarks} Marks</span>
                      </div>
                      
                      <div className="text-left sm:text-right">
                        <span className="block text-xs font-bold text-gray-450 uppercase tracking-wider">Accuracy</span>
                        <span className="text-sm font-extrabold text-green-600">{attempt.accuracy}%</span>
                      </div>

                      <Link 
                        href={`/test-series/${attempt.seriesId}/result/${attempt.testIndex}?attemptId=${attempt.id}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                      >
                        View Analysis
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
