// NewsAPI integration for crypto headlines and events
// Requires NewsAPI key from https://newsapi.org

export interface NewsArticle {
  id: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  published_at: string;
  source: string;
  relevance_score?: number; // 1-10
}

export interface NewsData {
  articles: NewsArticle[];
  total_count: number;
  timestamp: string;
}

/**
 * Fetch crypto news from NewsAPI
 * Free tier: 100 requests/day, 250k/month
 * Paid: higher limits
 */
export async function fetchCryptoNews(
  query: string = "bitcoin ethereum crypto",
  limit: number = 10
): Promise<NewsData | null> {
  try {
    const apiKey = process.env.NEWSAPI_KEY;
    if (!apiKey) {
      console.warn("NewsAPI key not configured");
      return null;
    }

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.append("q", query);
    url.searchParams.append("sortBy", "publishedAt");
    url.searchParams.append("pageSize", Math.min(limit, 100).toString());
    url.searchParams.append("language", "en");
    url.searchParams.append("apiKey", apiKey);

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      console.warn("NewsAPI error:", data.message);
      return null;
    }

    const articles: NewsArticle[] = (data.articles || []).map(
      (article: any, index: number) => ({
        id: `news-${Date.now()}-${index}`,
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage,
        published_at: article.publishedAt,
        source: article.source?.name || "Unknown",
        relevance_score: 7, // Default, could be enhanced with keyword matching
      })
    );

    return {
      articles,
      total_count: data.totalResults,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("News fetch error:", error);
    return null;
  }
}

/**
 * Fetch news about a specific wallet or project
 */
export async function fetchProjectNews(
  projectName: string,
  limit: number = 5
): Promise<NewsArticle[]> {
  const data = await fetchCryptoNews(projectName, limit);
  return data?.articles || [];
}

/**
 * Score articles by relevance to keywords
 */
export function scoreArticleRelevance(
  article: NewsArticle,
  keywords: string[]
): number {
  const text = (
    article.title +
    " " +
    (article.description || "")
  ).toLowerCase();

  let score = 0;
  keywords.forEach((keyword) => {
    if (text.includes(keyword.toLowerCase())) {
      score += 2;
    }
  });

  return Math.min(score, 10);
}
