'use client';

import { Share2 } from 'lucide-react';

export default function ShareButtonClient({ jobTitle }) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: jobTitle,
          text: `Check out this job on WeeklyNaukri: ${jobTitle}`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Sharing cancelled or failed', err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors bg-transparent border-none cursor-pointer"
    >
      <Share2 className="w-4 h-4" />
      <span className="text-sm font-medium hidden sm:inline">Share</span>
    </button>
  );
}
