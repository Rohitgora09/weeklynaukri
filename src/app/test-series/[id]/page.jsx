import { getTestSeriesById } from '../../../data/mockTests';
import TestDetailClient from './TestDetailClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const series = getTestSeriesById(id);
  
  if (!series) {
    return { title: 'Test Series Not Found' };
  }

  return {
    title: `${series.title} Online Practice Exam - WeeklyNaukri`,
    description: `Attempt free online full mock tests for ${series.title}. Check solutions, syllabus coverage, correct options, and negative marking scoring rules.`,
    alternates: {
      canonical: `https://weeklynaukri.com/test-series/${id}`
    }
  };
}

export default async function TestDetailPage({ params }) {
  const { id } = await params;
  const series = getTestSeriesById(id);
  
  if (!series) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": series.title,
    "description": series.description || `Attempt free online full mock tests for ${series.title}. Check solutions, syllabus coverage, correct options, and negative marking scoring rules.`,
    "learningResourceType": "Practice Test",
    "publisher": {
      "@type": "Organization",
      "name": "WeeklyNaukri.com",
      "url": "https://weeklynaukri.com",
      "logo": "https://weeklynaukri.com/logo.png"
    },
    "assesses": series.sections.join(", "),
    "educationalUse": "Practice",
    "typicalAgeRange": "18-30"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TestDetailClient series={series} />
    </>
  );
}
