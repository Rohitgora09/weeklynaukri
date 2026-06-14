import { blogPosts } from '../../data/blog';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'WeeklyNaukri Career Blog: Sarkari Exam Prep Guides & Job Tips',
  description: 'Read the latest exam preparation guides, syllabus details, exam patterns, study plans, and career tips for SSC, Railways, Bank, and other competitive government exams at WeeklyNaukri.com.',
  keywords: [
    'Career Blog',
    'Sarkari Exam Preparation',
    'SSC CGL Preparation',
    'Govt Exam Study Plan',
    'Railway Exam Guide',
    'WeeklyNaukri Blog'
  ],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'WeeklyNaukri Career Blog: Sarkari Exam Prep Guides & Job Tips',
    description: 'Read the latest exam preparation guides, syllabus details, exam patterns, study plans, and career tips for SSC, Railways, Bank, and other competitive government exams at WeeklyNaukri.com.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <BlogClient posts={blogPosts} />
  );
}
