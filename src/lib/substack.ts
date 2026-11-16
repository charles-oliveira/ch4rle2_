import { SITE } from '../config';

export interface NewsletterIssue {
  title: string;
  url: string;
  date: string;
}

const PLACEHOLDER_ISSUES: NewsletterIssue[] = [
  {
    title: '#03 — Por que sites simples ainda vencem',
    url: `${SITE.substackUrl}/p/exemplo-03`,
    date: '2026-11-10',
  },
  {
    title: '#02 — Notas sobre texto puro e estética ASCII',
    url: `${SITE.substackUrl}/p/exemplo-02`,
    date: '2026-11-03',
  },
  {
    title: '#01 — Começando a escrever em público',
    url: `${SITE.substackUrl}/p/exemplo-01`,
    date: '2026-10-27',
  },
];

function decodeXmlEntities(text: string): string {
  return text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .trim();
}

function formatDate(pubDate: string): string {
  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) return pubDate;
  return parsed.toISOString().slice(0, 10);
}

/**
 * Busca as últimas edições do RSS do Substack no momento do build.
 * Usa placeholders enquanto `SITE.fetchLiveSubstack` estiver `false` ou se o feed falhar.
 */
export async function getNewsletterIssues(limit = 5): Promise<{
  issues: NewsletterIssue[];
  isPlaceholder: boolean;
}> {
  if (!SITE.fetchLiveSubstack) {
    return { issues: PLACEHOLDER_ISSUES.slice(0, limit), isPlaceholder: true };
  }

  try {
    const response = await fetch(`${SITE.substackUrl}/feed`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return { issues: PLACEHOLDER_ISSUES.slice(0, limit), isPlaceholder: true };
    }

    const xml = await response.text();
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    const issues: NewsletterIssue[] = itemMatches
      .slice(0, limit)
      .map((match) => {
        const block = match[1];
        const title = decodeXmlEntities(
          block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? 'Sem título'
        );
        const url = decodeXmlEntities(
          block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? SITE.substackUrl
        );
        const pubDate = decodeXmlEntities(
          block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? ''
        );

        return {
          title,
          url,
          date: formatDate(pubDate),
        };
      });

    if (issues.length === 0) {
      return { issues: PLACEHOLDER_ISSUES.slice(0, limit), isPlaceholder: true };
    }

    return { issues, isPlaceholder: false };
  } catch {
    return { issues: PLACEHOLDER_ISSUES.slice(0, limit), isPlaceholder: true };
  }
}

