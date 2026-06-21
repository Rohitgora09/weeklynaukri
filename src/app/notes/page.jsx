'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Download, 
  Calendar, 
  Loader2,
  FileDown,
  Inbox
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { supabase } from '../../lib/supabase';

// Helper to format file sizes
function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch study notes on mount
  useEffect(() => {
    async function loadNotes() {
      try {
        const { data, error } = await supabase
          .from('study_materials')
          .select('*')
          .order('telegram_date', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } catch (err) {
        console.error('Failed to load study materials:', err.message);
        setError('Could not retrieve notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, []);

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (note.title || '').toLowerCase().includes(q) ||
      (note.file_name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">
        {/* Breadcrumbs & Back Link */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold border border-blue-100">
            {notes.length} PDF Notes Synced
          </span>
        </div>

        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-blue-950 tracking-tight mb-3">
            📚 FREE STUDY NOTES &amp; SYLLABUS VAULT
          </h1>
          <p className="text-sm text-gray-550 leading-relaxed">
            Download high-quality preparation materials, official syllabus sheets, and PDFs synced in real-time from our Telegram channel.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-12">
          <div className="flex items-center border border-slate-200 bg-white rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition shadow-sm overflow-hidden">
            <Search className="w-5 h-5 ml-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes, exams, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-3 outline-none text-sm bg-transparent text-gray-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold px-4 py-2 bg-transparent border-none cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl text-center max-w-md mx-auto mb-8 font-medium">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-gray-400 font-medium">Loading synced documents...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          /* Grid of notes */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              // Fallback link: direct Telegram file path if Supabase upload failed
              const downloadLink = note.storage_path || '#';
              
              return (
                <div key={note.id} className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all group relative">
                  <div>
                    {/* Header info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded uppercase">
                        {note.file_type?.split('/').pop() || 'PDF'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-blue-950 text-sm line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>
                  </div>

                  <div>
                    {/* Size & Date metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-450 border-t border-gray-100 pt-4 mb-4">
                      <span className="flex items-center gap-1">
                        <FileDown className="w-3.5 h-3.5" />
                        {formatBytes(note.file_size)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(note.telegram_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>

                    {/* Download Button */}
                    <a
                      href={downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full text-center flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        downloadLink === '#' 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-950 text-white hover:bg-blue-800 shadow-sm'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto gap-4 border border-dashed border-gray-200 bg-white rounded-3xl p-8">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">No notes found</h3>
              <p className="text-xs text-gray-400 mt-1">
                We couldn't find any study material matching your search query. Try typing something else.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
