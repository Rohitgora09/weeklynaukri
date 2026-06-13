export const revalidate = 86400; // 24h

export async function GET() {
  const body = `# WeeklyNaukri.com

> India's weekly job portal for the latest Sarkari Naukri (government jobs), private jobs, results, admit cards, and answer keys. Aggregates and lists active government and IT job notifications with direct apply links.

## About

- WeeklyNaukri.com helps Indian job seekers find the latest government and private job openings, exam results, admit cards, and answer keys.
- Content is organized into categories: Latest Jobs, Results, Admit Cards, Answer Keys, Admissions, Documents, and Private Jobs.
- The site also offers exam preparation test series and mock tests.

## Key pages

- [Home](https://weeklynaukri.com/): Latest government and private job listings.
- [IT Government Jobs](https://weeklynaukri.com/it-govt-jobs): Technical and software government vacancies.
- [Test Series](https://weeklynaukri.com/test-series): Exam preparation mock tests.
- [Referrals](https://weeklynaukri.com/referrals): Community job referrals.
- [About](https://weeklynaukri.com/about): About WeeklyNaukri.com.
- [Contact](https://weeklynaukri.com/contact): Contact and support.
- [Privacy Policy](https://weeklynaukri.com/privacy-policy): Privacy and data handling.

## Sitemaps

- [Sitemap](https://weeklynaukri.com/sitemap.xml)

## Notes

- WeeklyNaukri.com is an independent portal and is not affiliated with any government body.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
