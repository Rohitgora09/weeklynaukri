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

  const desc = post.excerpt && post.excerpt.length > 150
    ? `${post.excerpt.slice(0, 147)}...`
    : (post.excerpt || '');

  return {
    title: `${post.title} — WeeklyNaukri Study Guides`,
    description: desc,
  alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} — WeeklyNaukri Study Guides`,
      description: desc,
      url: `/blog/${post.slug}`,
      type: 'article',
      siteName: 'WeeklyNaukri.com',
      images: [
        {
          url: post.image || 'https://weeklynaukri.com/logo.png',
        }
      ]
    }
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
