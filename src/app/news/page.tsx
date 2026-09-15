import { SiteNavbar } from "@/components/site-navbar";
import { NewsContent } from "@/components/news-content";
import { fetchNewsForCategory, parseCategory } from "@/lib/services/news-service";

// Opt into ISR: the server-rendered HTML is cached for 5 minutes.
// Category switches that land server-side get a fresh render after TTL.
export const revalidate = 300;

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = parseCategory(params.category);
  const { articles, error } = await fetchNewsForCategory(category, 12);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNavbar />
      <NewsContent
        initialArticles={articles}
        initialCategory={category}
        initialError={error}
      />
    </div>
  );
}

