import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

type FeedSource = {
  name: string;
  url: string;
  category: string;
  important?: boolean;
  forcedRegion?: string;
  scope: 'national' | 'regional';
};

type NewsItem = {
  title: string;
  source: string;
  category: string;
  region: string;
  important: boolean;
  time: string;
  link: string;
  publishedAt: string;
  scope: 'national' | 'regional';
};

type ParsedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  contentSnippet?: string;
  content?: string;
};

const parser = new Parser<Record<string, never>, ParsedItem>({
  timeout: 15000,
  headers: {
    'User-Agent': 'UkraineMonitor/1.0',
    Accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  },
});

const NATIONAL_FEEDS: FeedSource[] = [
  {
    name: 'Українська правда',
    url: 'https://www.pravda.com.ua/rss/',
    category: 'Головне',
    important: true,
    scope: 'national',
  },
  {
    name: 'Українська правда',
    url: 'https://www.pravda.com.ua/rss/view_news/',
    category: 'Новини',
    scope: 'national',
  },
  {
    name: 'Українська правда',
    url: 'https://www.pravda.com.ua/rss/important/',
    category: 'Термінові',
    important: true,
    scope: 'national',
  },
  {
    name: 'Укрінформ',
    url: 'https://www.ukrinform.ua/rss/block-lastnews',
    category: 'Головне',
    important: true,
    scope: 'national',
  },
  {
    name: 'Укрінформ',
    url: 'https://www.ukrinform.ua/rss/rubric-regions',
    category: 'Регіони',
    scope: 'national',
  },
  {
    name: 'Укрінформ',
    url: 'https://www.ukrinform.ua/rss/rubric-ato',
    category: 'Війна',
    important: true,
    scope: 'national',
  },
];

const REGIONAL_FALLBACK_FEEDS: FeedSource[] = [
  { name: 'Суспільне Рівне', url: 'https://suspilne.media/rivne/', category: 'Регіони', forcedRegion: 'Рівненська', scope: 'regional' },
  { name: 'Суспільне Львів', url: 'https://suspilne.media/lviv/', category: 'Регіони', forcedRegion: 'Львівська', scope: 'regional' },
  { name: 'Суспільне Харків', url: 'https://suspilne.media/kharkiv/', category: 'Регіони', forcedRegion: 'Харківська', scope: 'regional' },
  { name: 'Суспільне Одеса', url: 'https://suspilne.media/odesa/', category: 'Регіони', forcedRegion: 'Одеська', scope: 'regional' },
  { name: 'Суспільне Вінниця', url: 'https://suspilne.media/vinnytsia/', category: 'Регіони', forcedRegion: 'Вінницька', scope: 'regional' },
  { name: 'Суспільне Дніпро', url: 'https://suspilne.media/dnipro/', category: 'Регіони', forcedRegion: 'Дніпропетровська', scope: 'regional' },
  { name: 'Суспільне Запоріжжя', url: 'https://suspilne.media/zaporizhzhia/', category: 'Регіони', forcedRegion: 'Запорізька', scope: 'regional' },
  { name: 'Суспільне Житомир', url: 'https://suspilne.media/zhytomyr/', category: 'Регіони', forcedRegion: 'Житомирська', scope: 'regional' },
  { name: 'Суспільне Херсон', url: 'https://suspilne.media/kherson/', category: 'Регіони', forcedRegion: 'Херсонська', scope: 'regional' },
  { name: 'Суспільне Полтава', url: 'https://suspilne.media/poltava/', category: 'Регіони', forcedRegion: 'Полтавська', scope: 'regional' },
  { name: 'Суспільне Черкаси', url: 'https://suspilne.media/cherkasy/', category: 'Регіони', forcedRegion: 'Черкаська', scope: 'regional' },
  { name: 'Суспільне Чернігів', url: 'https://suspilne.media/chernihiv/', category: 'Регіони', forcedRegion: 'Чернігівська', scope: 'regional' },
  { name: 'Суспільне Суми', url: 'https://suspilne.media/sumy/', category: 'Регіони', forcedRegion: 'Сумська', scope: 'regional' },
  { name: 'Суспільне Чернівці', url: 'https://suspilne.media/chernivtsi/', category: 'Регіони', forcedRegion: 'Чернівецька', scope: 'regional' },
  { name: 'Суспільне Ужгород', url: 'https://suspilne.media/uzhhorod/', category: 'Регіони', forcedRegion: 'Закарпатська', scope: 'regional' },
  { name: 'Суспільне Івано-Франківськ', url: 'https://suspilne.media/ivano-frankivsk/', category: 'Регіони', forcedRegion: 'Івано-Франківська', scope: 'regional' },
  { name: 'Суспільне Тернопіль', url: 'https://suspilne.media/ternopil/', category: 'Регіони', forcedRegion: 'Тернопільська', scope: 'regional' },
  { name: 'Суспільне Миколаїв', url: 'https://suspilne.media/mykolaiv/', category: 'Регіони', forcedRegion: 'Миколаївська', scope: 'regional' },
  { name: 'Суспільне Кропивницький', url: 'https://suspilne.media/kropyvnytskiy/', category: 'Регіони', forcedRegion: 'Кіровоградська', scope: 'regional' },
  { name: 'Суспільне Луцьк', url: 'https://suspilne.media/lutsk/', category: 'Регіони', forcedRegion: 'Волинська', scope: 'regional' },
  { name: 'Суспільне Київ', url: 'https://suspilne.media/kyiv/', category: 'Регіони', forcedRegion: 'Київська', scope: 'regional' },
  { name: 'Суспільне Донбас', url: 'https://suspilne.media/donbas/', category: 'Регіони', forcedRegion: 'Донецька', scope: 'regional' },
  { name: 'Суспільне Донбас', url: 'https://suspilne.media/donbas/', category: 'Регіони', forcedRegion: 'Луганська', scope: 'regional' },
];

const REGION_KEYWORDS: Record<string, string[]> = {
  Волинська: ['волин', 'луцьк'],
  Рівненська: ['рівнен', 'рівне'],
  Львівська: ['львів'],
  Закарпатська: ['закарпат', 'ужгород', 'мукачев'],
  'Івано-Франківська': ['івано-франків', 'прикарпат'],
  Тернопільська: ['терноп'],
  Хмельницька: ['хмельниць'],
  Чернівецька: ['чернівц', 'буковин'],
  Житомирська: ['житомир'],
  Київська: ['київщин', 'київськ обл', 'бровар', 'борисп', 'буча', 'ірпін', 'біла церква'],
  Чернігівська: ['черніг'],
  Сумська: ['сумщин', 'сум'],
  Полтавська: ['полтав'],
  Харківська: ['харків'],
  Луганська: ['луганщин', 'луган'],
  Донецька: ['донеччин', 'донец', 'краматор', "слов'янськ", 'покровськ'],
  Черкаська: ['черкас'],
  Вінницька: ['віннич', 'вінниц'],
  Кіровоградська: ['кіровоград', 'кропивниць'],
  Дніпропетровська: ['дніпр', 'кривий ріг', 'павлоград', 'нікополь'],
  Запорізька: ['запоріж'],
  Миколаївська: ['миколаїв'],
  Одеська: ['одес'],
  Херсонська: ['херсон'],
  'АР Крим': ['крим', 'севастоп'],
  'Усі області': [],
};

function formatTime(input?: string): string {
  const date = input ? new Date(input) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
}

function detectRegion(text: string): string {
  const normalized = text.toLowerCase();
  for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
    if (region === 'Усі області') continue;
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return region;
    }
  }
  return 'Усі області';
}

function makeKey(item: NewsItem): string {
  return `${item.source}::${item.title}::${item.link}`;
}

function normalizeRegionalSourceUrl(url: string): string {
  if (url.endsWith('/')) return url;
  return `${url}/`;
}

async function readRssFeed(source: FeedSource): Promise<NewsItem[]> {
  const feed = await parser.parseURL(source.url);
  return (feed.items || [])
    .map((item) => {
      const text = [item.title, item.contentSnippet, item.content].filter(Boolean).join(' ');
      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();
      return {
        title: item.title?.trim() || 'Без заголовка',
        source: source.name,
        category: source.category,
        region: source.forcedRegion || detectRegion(text),
        important: Boolean(source.important),
        time: formatTime(publishedAt),
        link: item.link || '#',
        publishedAt,
        scope: source.scope,
      } satisfies NewsItem;
    })
    .filter((item) => item.title && item.link);
}

function extractRegionalLinks(html: string, source: FeedSource): NewsItem[] {
  const now = new Date().toISOString();
  const matches = Array.from(
    html.matchAll(/<a[^>]+href="(https:\/\/suspilne\.media\/[^"]+)"[^>]*>(.*?)<\/a>/gims)
  );

  const cleaned = matches
    .map((match) => {
      const link = match[1];
      const rawTitle = match[2]
        .replace(/<[^>]+>/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        title: rawTitle,
        link,
      };
    })
    .filter((item) => item.title.length > 24)
    .filter((item) => !item.title.includes('Суспільне'))
    .slice(0, 25)
    .map((item) => ({
      title: item.title,
      source: source.name,
      category: source.category,
      region: source.forcedRegion || 'Усі області',
      important: false,
      time: formatTime(now),
      link: item.link,
      publishedAt: now,
      scope: 'regional' as const,
    }));

  return cleaned;
}

async function readRegionalHtml(source: FeedSource): Promise<NewsItem[]> {
  const response = await fetch(normalizeRegionalSourceUrl(source.url), {
    headers: {
      'User-Agent': 'UkraineMonitor/1.0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Regional fetch failed: ${response.status}`);
  }

  const html = await response.text();
  return extractRegionalLinks(html, source);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'Усі області';
  const source = searchParams.get('source') || 'Усі';
  const category = searchParams.get('category') || 'Усі';
  const limitParam = Number(searchParams.get('limit') || '120');
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 120;

  const targetRegionalFeeds =
    region === 'Усі області'
      ? []
      : REGIONAL_FALLBACK_FEEDS.filter((item) => item.forcedRegion === region);

  const rssResults = await Promise.allSettled(NATIONAL_FEEDS.map((feed) => readRssFeed(feed)));
  const regionalResults = await Promise.allSettled(targetRegionalFeeds.map((feed) => readRegionalHtml(feed)));

  const rssItems = rssResults
    .filter((result): result is PromiseFulfilledResult<NewsItem[]> => result.status === 'fulfilled')
    .flatMap((result) => result.value);

  const regionalItems = regionalResults
    .filter((result): result is PromiseFulfilledResult<NewsItem[]> => result.status === 'fulfilled')
    .flatMap((result) => result.value);

  const merged = [...regionalItems, ...rssItems];
  const deduped = Array.from(new Map(merged.map((item) => [makeKey(item), item])).values());

  const filtered = deduped.filter((item) => {
    const regionMatch =
      region === 'Усі області'
        ? true
        : item.region === region;
    const sourceMatch = source === 'Усі' || item.source === source;
    const categoryMatch = category === 'Усі' || item.category === category;
    return regionMatch && sourceMatch && categoryMatch;
  });

  filtered.sort((a, b) => {
    if (a.important !== b.important) {
      return a.important ? -1 : 1;
    }
    if (a.scope !== b.scope) {
      return a.scope === 'regional' ? -1 : 1;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const failedSources = [
    ...rssResults.map((result, index) => ({ result, source: NATIONAL_FEEDS[index].name, url: NATIONAL_FEEDS[index].url })),
    ...regionalResults.map((result, index) => ({ result, source: targetRegionalFeeds[index]?.name || 'regional', url: targetRegionalFeeds[index]?.url || '' })),
  ]
    .filter((item) => item.result.status === 'rejected')
    .map((item) => ({ source: item.source, url: item.url }));

  return NextResponse.json(
    {
      items: filtered.slice(0, limit),
      meta: {
        total: filtered.length,
        fetchedAt: new Date().toISOString(),
        failedSources,
        regionalRequested: region !== 'Усі області',
      },
    },
    {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
      },
    }
  );
}
