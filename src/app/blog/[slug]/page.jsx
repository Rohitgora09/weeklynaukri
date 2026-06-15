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
          url: post.image || 'https://weeklynaukri.com/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} — WeeklyNaukri Study Guides`,
      description: desc,
      images: [post.image || 'https://weeklynaukri.com/og-image.png'],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.image || 'https://weeklynaukri.com/og-image.png',
    datePublished: post.date || new Date().toISOString().split('T')[0],
    dateModified: post.date || new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'WeeklyNaukri.com',
      url: 'https://weeklynaukri.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WeeklyNaukri.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://weeklynaukri.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://weeklynaukri.com/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://weeklynaukri.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://weeklynaukri.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://weeklynaukri.com/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostClient post={post} />
    </>
  );
}
