'use client';

import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Bell
} from 'lucide-react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Card from '../../../components/ui/Card';

export default function BlogPostClient({ post }) {
  const handleCategorySelect = () => {
    window.location.href = '/';
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* Breadcrumbs Section */}
      <div className="max-w-7xl mx-auto px-6 pt-8 w-full">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 truncate max-w-xs sm:max-w-md" aria-current="page">
            {post.title}
          </span>
        </nav>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Career Blog
            </Link>

            {/* Title & Metadata */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 mb-8 text-sm text-gray-500">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">
                    {post.author[0]}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 block text-xs leading-none">{post.author}</span>
                    <span className="text-[10px] text-gray-400">Author</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{post.publishedDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <button 
                onClick={shareArticle}
                className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-full text-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>

            {/* Cover Image */}
            <div className="w-full h-80 md:h-[450px] bg-gray-100 rounded-3xl overflow-hidden mb-10 shadow-sm">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rich Text Body */}
            <div 
              className="prose prose-blue max-w-none text-gray-750 leading-relaxed text-base md:text-lg space-y-6 
                prose-headings:text-blue-950 prose-headings:font-bold prose-h3:text-xl prose-h3:mt-8 
                prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6
                prose-table:w-full prose-table:border-collapse prose-table:my-6
                prose-th:bg-gray-50 prose-th:text-gray-700 prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-gray-200
                prose-td:p-3 prose-td:border prose-td:border-gray-200 prose-td:text-sm"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            {/* CTA: Try mock tests */}
            <Card className="p-6 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Free Exam Practice
                </div>
                <h3 className="text-xl font-bold mb-2">Practice Mock Tests</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Prepare for SSC CGL, RRB NTPC, IBPS, and state government exams with our free, high-quality test series.
                </p>
                <Link 
                  href="/test-series"
                  className="inline-flex items-center justify-center bg-white text-blue-900 font-bold px-6 py-3 rounded-full text-xs hover:bg-gray-100 transition-colors w-full"
                >
                  Start Free Test Series
                </Link>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            </Card>

            {/* Referrals box */}
            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-650">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Targeting Private Roles?</h3>
                  <p className="text-[10px] text-gray-400">Get internal employee referrals</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                Connect with professionals working at India's top tech companies and request job referrals directly.
              </p>
              <Link 
                href="/referrals"
                className="inline-flex items-center justify-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold px-6 py-2.5 rounded-full text-xs transition-colors w-full"
              >
                Browse Referral Board
              </Link>
            </Card>

            {/* Mock Newsletter Signup */}
            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-gray-50/50">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4 text-blue-600" />
                Free Job Alerts
              </h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Get the latest government job notices, results, admit cards, and prep tips delivered weekly to your inbox.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="space-y-3">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 shadow-inner bg-white text-xs outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Subscribe Now
                </button>
              </form>
            </Card>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
