import { blogPosts } from '../../data/blog';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'WeeklyNaukri Blog: Sarkari Exam Prep & Tips',
  description: 'Read exam preparation guides, syllabus details, patterns, study plans, and career tips for SSC, Railways, and Bank exams at WeeklyNaukri.com.',
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
    title: 'WeeklyNaukri Blog: Sarkari Exam Prep & Tips',
    description: 'Read exam preparation guides, syllabus details, patterns, study plans, and career tips for SSC, Railways, and Bank exams at WeeklyNaukri.com.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <BlogClient posts={blogPosts} />
  );
}
