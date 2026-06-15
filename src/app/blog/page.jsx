import { blogPosts } from '../../data/blog';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'WeeklyNaukri Blog: Sarkari Exam Prep & Tips',
  description: 'Read exam preparation guides, syllabus details, patterns, study plans, and career tips for SSC, Railways, and Bank exams at WeeklyNaukri.com.',
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
