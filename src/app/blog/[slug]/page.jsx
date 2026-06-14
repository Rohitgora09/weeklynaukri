import { notFound } from 'next/navigation';
import { blogPosts } from '../../../data/blog';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  
  if (!post) {
    return {
      title: 'Post Not Found — WeeklyNaukri',
    };
  }

  return {
    title: `${post.title} — WeeklyNaukri Study Guides`,
    description: post.excerpt,
    keywords: [...post.tags, 'WeeklyNaukri Study Guide', 'Sarkari Preparation'],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostClient post={post} />
  );
}
