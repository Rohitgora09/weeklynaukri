'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';

export default function BlogClient({ posts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const handleCategorySelect = () => {
    window.location.href = '/';
  };

  // Get all unique tags from posts
  const allTags = ['All', ...new Set(posts.flatMap(post => post.tags))];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'All' || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Career Resources & Guides
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-950 leading-tight tracking-tight mb-6">
            WeeklyNaukri <span className="bg-gradient-to-r from-blue-600 to-indigo-650 bg-clip-text text-transparent">Career Blog</span>
          </h1>
          
          <p className="text-gray-650 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Expert strategies, syllabus guides, exam preparation study plans, and career advice to help you crack government examinations and land private tech roles.
          </p>
        </div>
      </section>

      {/* Main Blog Listings & Filters */}
      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        {/* Search and Tag Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          {/* Tag Chips */}
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto" role="group" aria-label="Filter posts by tag">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-4 py-2 rounded-full font-semibold transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-gray-50/50 text-sm font-medium"
            />
          </div>
        </div>

        {/* Blog Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <article key={post.id} className="flex flex-col h-full group">
                <Card className="flex flex-col h-full overflow-hidden border border-gray-100 hover:border-blue-200/80 transition-all rounded-3xl group-hover:shadow-md">
                  {/* Thumbnail Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-950 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-none">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-650 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.publishedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Read More Link */}
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group/link self-start"
                    >
                      Read Study Guide
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Card>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-55/10 rounded-3xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">No Study Guides Found</h3>
            <p className="text-gray-550 text-sm max-w-sm mx-auto">
              We couldn't find any articles matching "{searchQuery}". Try selecting another tag or using different keywords.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
