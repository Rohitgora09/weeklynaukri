import { getMockTestByIndex, getTestSeriesById } from '../../../../../data/mockTests';
import TestTakeClient from './TestTakeClient';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Online Mock Test Console - WeeklyNaukri',
  description: 'Distraction-free live exam console for mock test series practice.',
  robots: {
    index: false,
    follow: false
  }
};

export default async function TestTakePage({ params }) {
  const { id, testIndex } = await params;
  const series = getTestSeriesById(id);
  const test = getMockTestByIndex(id, testIndex);
  
  if (!series || !test) {
    notFound();
  }

  return <TestTakeClient series={series} test={test} />;
}
