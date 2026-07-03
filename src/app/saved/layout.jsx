export const metadata = {
  title: 'Saved Jobs | WeeklyNaukri',
  description: 'Your bookmarked government and private job listings on WeeklyNaukri.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/saved',
  },
};

export default function SavedLayout({ children }) {
  return children;
}
