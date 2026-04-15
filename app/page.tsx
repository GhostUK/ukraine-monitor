"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Globe,
  ShieldAlert,
  Radio,
  RefreshCw,
  Filter,
  MapPinned,
  Shield,
  AlertTriangle,
  Map,
} from 'lucide-react';

type AlertStatus = 'clear' | 'partial' | 'alert';

type AlertItem = {
  region: string;
  status: AlertStatus;
  updated: string;
};

type NewsItem = {
  source: string;
  category: string;
  region: string;
  important: boolean;
  title: string;
  time: string;
  link?: string;
};

type VideoChannel = {
  id: string;
  name: string;
  embedUrl: string;
};

type RegionLayout = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

type SourceItem = {
  name: string;
  scope: 'national' | 'regional';
};

const initialAlerts: AlertItem[] = [
  { region: 'Волинська', status: 'clear', updated: '21:24' },
  { region: 'Рівненська', status: 'clear', updated: '21:24' },
  { region: 'Львівська', status: 'clear', updated: '21:24' },
  { region: 'Закарпатська', status: 'clear', updated: '21:24' },
  { region: 'Івано-Франківська', status: 'clear', updated: '21:24' },
  { region: 'Тернопільська', status: 'clear', updated: '21:24' },
  { region: 'Хмельницька', status: 'partial', updated: '21:24' },
  { region: 'Чернівецька', status: 'clear', updated: '21:24' },
  { region: 'Житомирська', status: 'clear', updated: '21:24' },
  { region: 'Київська', status: 'clear', updated: '21:24' },
  { region: 'Чернігівська', status: 'partial', updated: '21:24' },
  { region: 'Сумська', status: 'alert', updated: '21:24' },
  { region: 'Полтавська', status: 'clear', updated: '21:24' },
  { region: 'Харківська', status: 'alert', updated: '21:24' },
  { region: 'Луганська', status: 'alert', updated: '21:24' },
  { region: 'Донецька', status: 'alert', updated: '21:24' },
  { region: 'Черкаська', status: 'clear', updated: '21:24' },
  { region: 'Вінницька', status: 'clear', updated: '21:24' },
  { region: 'Кіровоградська', status: 'partial', updated: '21:24' },
  { region: 'Дніпропетровська', status: 'partial', updated: '21:24' },
  { region: 'Запорізька', status: 'alert', updated: '21:24' },
  { region: 'Миколаївська', status: 'clear', updated: '21:24' },
  { region: 'Одеська', status: 'clear', updated: '21:24' },
  { region: 'Херсонська', status: 'alert', updated: '21:24' },
  { region: 'АР Крим', status: 'alert', updated: '21:24' },
];

const fallbackNews: NewsItem[] = [
  { source: 'Українська правда', category: 'Головне', region: 'Усі області', important: true, title: 'Головні новини України: оперативні події, заяви та ключові зміни за день', time: '21:20', link: '#' },
  { source: 'Укрінформ', category: 'Війна', region: 'Усі області', important: true, title: 'Офіційні та оперативні повідомлення про ситуацію в Україні від державних джерел', time: '21:11', link: '#' },
  { source: 'Суспільне', category: 'Регіони', region: 'Рівненська', important: false, title: 'Оновлення по Рівненщині: місцева інфраструктура, безпекова ситуація та події області', time: '21:08', link: '#' },
  { source: 'Рівне Вечірнє', category: 'Регіони', region: 'Рівненська', important: true, title: 'Оперативні події у Рівному та області: головне на зараз', time: '20:54', link: '#' },
  { source: 'Суспільне', category: 'Регіони', region: 'Вінницька', important: false, title: 'Новини Вінниччини: інфраструктура, безпека та наслідки ударів', time: '20:52', link: '#' },
  { source: '20 хвилин', category: 'Регіони', region: 'Вінницька', important: false, title: 'Події Вінниці та області: оперативна стрічка регіону', time: '20:49', link: '#' },
  { source: 'Суспільне', category: 'Регіони', region: 'Львівська', important: false, title: 'Події Львівщини: безпека, транспорт та рішення влади', time: '20:45', link: '#' },
  { source: 'ZAXID.NET', category: 'Регіони', region: 'Львівська', important: true, title: 'Головні новини Львова та області: що важливо зараз', time: '20:41', link: '#' },
  { source: 'Суспільне', category: 'Регіони', region: 'Харківська', important: true, title: 'Оновлення по Харківщині, наслідках атак та ситуації на місцях', time: '20:37', link: '#' },
  { source: 'Суспільне', category: 'Регіони', region: 'Одеська', important: false, title: 'Новини Одеси та області: безпекова ситуація, транспорт, інфраструктура', time: '20:33', link: '#' },
  { source: 'Думська', category: 'Регіони', region: 'Одеська', important: false, title: 'Оперативна стрічка подій Одещини та головні регіональні теми', time: '20:28', link: '#' },
  { source: '24 Канал', category: 'Терміново', region: 'Усі області', important: true, title: 'Термінові новини України та найважливіші події в режимі реального часу', time: '20:24', link: '#' },
  { source: 'Еспресо', category: 'Політика', region: 'Усі області', important: false, title: 'Політична стрічка: ключові рішення, заяви та міжнародні реакції', time: '20:19', link: '#' },
  { source: 'Рада', category: 'Головне', region: 'Усі області', important: false, title: 'Офіційні державні повідомлення та парламентські оновлення', time: '20:13', link: '#' },
  { source: 'Ми - Україна', category: 'Головне', region: 'Усі області', important: false, title: 'Прямі включення, головні заяви та оперативні повідомлення по країні', time: '20:09', link: '#' },
  { source: 'Суспільне', category: 'Регіони', region: 'Дніпропетровська', important: false, title: 'Новини Дніпропетровщини: ситуація в області, відновлення та наслідки атак', time: '20:03', link: '#' },
];

const regionLayout: RegionLayout[] = [
  { id: 'Волинська', x: 60, y: 80, w: 72, h: 44 },
  { id: 'Рівненська', x: 138, y: 76, w: 78, h: 44 },
  { id: 'Житомирська', x: 222, y: 74, w: 84, h: 44 },
  { id: 'Київська', x: 312, y: 76, w: 82, h: 44 },
  { id: 'Чернігівська', x: 398, y: 54, w: 92, h: 48 },
  { id: 'Сумська', x: 498, y: 72, w: 86, h: 44 },
  { id: 'Львівська', x: 52, y: 132, w: 82, h: 46 },
  { id: 'Тернопільська', x: 140, y: 128, w: 76, h: 46 },
  { id: 'Хмельницька', x: 222, y: 126, w: 86, h: 46 },
  { id: 'Черкаська', x: 314, y: 130, w: 82, h: 46 },
  { id: 'Полтавська', x: 402, y: 126, w: 90, h: 46 },
  { id: 'Харківська', x: 498, y: 126, w: 86, h: 46 },
  { id: 'Закарпатська', x: 36, y: 186, w: 92, h: 44 },
  { id: 'Івано-Франківська', x: 134, y: 184, w: 88, h: 44 },
  { id: 'Чернівецька', x: 228, y: 184, w: 82, h: 44 },
  { id: 'Вінницька', x: 316, y: 184, w: 84, h: 44 },
  { id: 'Кіровоградська', x: 406, y: 184, w: 88, h: 44 },
  { id: 'Дніпропетровська', x: 500, y: 182, w: 98, h: 48 },
  { id: 'Одеська', x: 198, y: 240, w: 106, h: 54 },
  { id: 'Миколаївська', x: 310, y: 238, w: 96, h: 50 },
  { id: 'Херсонська', x: 410, y: 240, w: 92, h: 50 },
  { id: 'Запорізька', x: 506, y: 238, w: 92, h: 50 },
  { id: 'Донецька', x: 600, y: 210, w: 88, h: 50 },
  { id: 'Луганська', x: 692, y: 186, w: 88, h: 54 },
  { id: 'АР Крим', x: 470, y: 302, w: 150, h: 52 },
];

const sourceOptions = ['Усі', 'Українська правда', 'Суспільне', 'Укрінформ', '24 Канал', 'Еспресо', 'Рада', 'Ми - Україна'];
const categoryOptions = ['Усі', 'Війна', 'Політика', 'Регіони', 'Термінові', 'Головне'];

const nationalSources: SourceItem[] = [
  { name: 'Українська правда', scope: 'national' },
  { name: 'Суспільне', scope: 'national' },
  { name: 'Укрінформ', scope: 'national' },
  { name: '24 Канал', scope: 'national' },
  { name: 'Еспресо', scope: 'national' },
  { name: 'Рада', scope: 'national' },
  { name: 'Ми - Україна', scope: 'national' },
];

const regionalSources: Record<string, string[]> = {
  Волинська: ['Суспільне Луцьк', 'Конкурент', 'ВолиньPost'],
  Рівненська: ['Суспільне Рівне', 'Рівне Вечірнє', 'ОГО', 'Район.Рівне'],
  Львівська: ['Суспільне Львів', 'ZAXID.NET', 'Твоє місто', 'Львівський портал'],
  Закарпатська: ['Суспільне Ужгород', 'Закарпаття онлайн', 'Mukachevo.net'],
  'Івано-Франківська': ['Суспільне Івано-Франківськ', 'Галка', 'Курс'],
  Тернопільська: ['Суспільне Тернопіль', '20 хвилин Тернопіль', 'Тернополяни'],
  Хмельницька: ['Суспільне Хмельницький', 'Є', 'XM-inside'],
  Чернівецька: ['Суспільне Чернівці', 'Молодий буковинець', 'АСС'],
  Житомирська: ['Суспільне Житомир', 'Житомир.info', '20 хвилин Житомир'],
  Київська: ['Суспільне Київ', 'Трибуна-Бровари', 'Вечірній Київ', '04597'],
  Чернігівська: ['Суспільне Чернігів', 'ЧЕЛАЙН', 'Високий Вал'],
  Сумська: ['Суспільне Суми', 'Сумські дебати', '0542'],
  Полтавська: ['Суспільне Полтава', 'Полтавщина', 'Коло'],
  Харківська: ['Суспільне Харків', 'Харків Times', 'Status Quo'],
  Луганська: ['Суспільне Донбас', 'Трибун', 'Реальна газета'],
  Донецька: ['Суспільне Донбас', '6262', 'Вільне радіо'],
  Черкаська: ['Суспільне Черкаси', '18000', 'Про все'],
  Вінницька: ['Суспільне Вінниця', '20 хвилин', 'Вежа', 'Vinbazar'],
  Кіровоградська: ['Суспільне Кропивницький', 'Гречка', 'Точка доступу'],
  Дніпропетровська: ['Суспільне Дніпро', 'Інформатор', '056', 'ДніпроTV'],
  Запорізька: ['Суспільне Запоріжжя', '061', 'IPnews'],
  Миколаївська: ['Суспільне Миколаїв', 'НикВести', '0512'],
  Одеська: ['Суспільне Одеса', 'Думська', '048', 'Одеса.Онлайн'],
  Херсонська: ['Суспільне Херсон', 'Мост', 'IPC-Південь'],
  'АР Крим': ['Суспільне Крим', 'Крим.Реалії', 'Центр журналістських розслідувань'],
};

const videoChannels: VideoChannel[] = [
  { id: 'suspilne', name: 'Суспільне Новини', embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCPY6gj8G7dqwPxg9KwHrj5Q&autoplay=1&mute=1&playsinline=1' },
  { id: '24kanal', name: '24 Канал', embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCEC4D0dTTJr_EEnEJz15hnQ&autoplay=1&mute=1&playsinline=1' },
  { id: 'rada', name: 'Рада', embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UC5V8mErVFOpcQXEb3y9IMZw&autoplay=1&mute=1&playsinline=1' },
  { id: 'espreso', name: 'Еспресо', embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCMEiyV8N2J93GdPNltPYM6w&autoplay=1&mute=1&playsinline=1' },
  { id: 'weukraine', name: 'Ми - Україна', embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=UCEduOt4TK8TtOaznB45TrhA&autoplay=1&mute=1&playsinline=1' },
];

function getNowTime(): string {
  return new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
}

function normalizeNewsItem(item: Partial<NewsItem>): NewsItem {
  return {
    source: item.source || 'Невідоме джерело',
    category: item.category || 'Головне',
    region: item.region || 'Усі області',
    important: Boolean(item.important),
    title: item.title || 'Без заголовка',
    time: item.time || getNowTime(),
    link: item.link || '#',
  };
}

async function fetchNewsItems(): Promise<NewsItem[]> {
  const response = await fetch('/api/news', {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  return items.map(normalizeNewsItem).filter((item: NewsItem) => Boolean(item.title));
}

function chunkNews<T>(items: T[], columns: number): T[][] {
  const result = Array.from({ length: columns }, () => [] as T[]);
  items.forEach((item, index) => {
    result[index % columns].push(item);
  });
  return result;
}

export default function UkraineMonitorDashboard() {
  const [alerts] = useState<AlertItem[]>(initialAlerts);
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [selectedSource, setSelectedSource] = useState('Усі');
  const [selectedCategory, setSelectedCategory] = useState('Усі');
  const [selectedVideo, setSelectedVideo] = useState('suspilne');
  const [selectedRegion, setSelectedRegion] = useState('Усі області');
  const [alertsOnly, setAlertsOnly] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('21:24');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newsError, setNewsError] = useState('');
  const [isNewsLoaded, setIsNewsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const loadNews = async (showSpinner = true) => {
      if (showSpinner) {
        setIsRefreshing(true);
      }

      try {
        const liveNews = await fetchNewsItems();
        if (!active) return;

        if (liveNews.length > 0) {
          setNews(liveNews);
          setNewsError('');
          setIsNewsLoaded(true);
          setLastRefresh(getNowTime());
        } else {
          setNewsError('API новин відповіло, але не повернуло записів. Показуються резервні новини.');
        }
      } catch {
        if (active) {
          setNewsError('Не вдалося завантажити живі новини через /api/news. Поки показуються резервні новини.');
        }
      } finally {
        if (active) {
          setIsRefreshing(false);
        }
      }
    };

    loadNews(true);
    const intervalId = window.setInterval(() => loadNews(false), 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const regionOptions = useMemo(() => ['Усі області', ...alerts.map((item) => item.region)], [alerts]);

  const counts = useMemo(() => ({
    alert: alerts.filter((item) => item.status === 'alert').length,
    partial: alerts.filter((item) => item.status === 'partial').length,
    clear: alerts.filter((item) => item.status === 'clear').length,
  }), [alerts]);

  const liveSourceCount = useMemo(() => new Set(news.map((item) => item.source)).size || nationalSources.length, [news]);

  const regionStatusMap = useMemo(
    () => Object.fromEntries(alerts.map((item) => [item.region, item.status])) as Record<string, AlertStatus>,
    [alerts]
  );

  const activeVideo = videoChannels.find((item) => item.id === selectedVideo) || videoChannels[0];

  const activeRegionSources = useMemo<SourceItem[]>(() => {
    if (selectedRegion === 'Усі області') return nationalSources;
    return [
      ...((regionalSources[selectedRegion] || []).map((name) => ({ name, scope: 'regional' as const }))),
      ...nationalSources,
    ];
  }, [selectedRegion]);

  const filteredAlerts = useMemo(() => {
    return selectedRegion === 'Усі області' ? alerts : alerts.filter((item) => item.region === selectedRegion);
  }, [alerts, selectedRegion]);

  const nationalNews = useMemo(() => {
    return news.filter((item) => item.region === 'Усі області');
  }, [news]);

  const regionOnlyNews = useMemo(() => {
    if (selectedRegion === 'Усі області') return [] as NewsItem[];
    return news.filter((item) => item.region === selectedRegion);
  }, [news, selectedRegion]);

  const filteredNews = useMemo(() => {
    const base = selectedRegion === 'Усі області' ? news : regionOnlyNews;
    return base.filter((item) => {
      const sourceMatch = selectedSource === 'Усі' || item.source === selectedSource;
      const categoryMatch = selectedCategory === 'Усі' || item.category === selectedCategory;
      return sourceMatch && categoryMatch;
    });
  }, [news, regionOnlyNews, selectedRegion, selectedSource, selectedCategory]);

  const importantNews = useMemo(() => {
    const base = selectedRegion === 'Усі області'
      ? news.filter((item) => item.important)
      : regionOnlyNews.filter((item) => item.important);
    return base.slice(0, 3);
  }, [news, regionOnlyNews, selectedRegion]);

  const displayedNews = useMemo(() => {
    if (selectedRegion === 'Усі області') {
      return filteredNews.length > 0 ? filteredNews : news;
    }

    if (filteredNews.length > 0) {
      return filteredNews;
    }

    return [] as NewsItem[];
  }, [filteredNews, news, selectedRegion]);

  const fourColumnNews = useMemo(() => {
    return chunkNews(displayedNews, 4);
  }, [displayedNews]);

  const regionNewsCount = useMemo(() => {
    return selectedRegion === 'Усі області' ? displayedNews.length : regionOnlyNews.length;
  }, [selectedRegion, displayedNews.length, regionOnlyNews.length]);

  const safetyStatus = useMemo(() => {
    if (selectedRegion === 'Усі області') {
      if (counts.alert > 0) {
        return {
          title: 'Небезпека по країні',
          text: `Зараз активні тривоги у ${counts.alert} областях, часткові — у ${counts.partial}.`,
          tone: 'danger',
        };
      }
      if (counts.partial > 0) {
        return {
          title: 'Часткова небезпека',
          text: `Часткові тривоги є у ${counts.partial} областях.`,
          tone: 'warning',
        };
      }
      return {
        title: 'Ситуація спокійна',
        text: 'По країні зараз немає активних тривог у відображених областях.',
        tone: 'safe',
      };
    }

    const regionStatus = regionStatusMap[selectedRegion] || 'clear';
    if (regionStatus === 'alert') {
      return {
        title: `Активна тривога: ${selectedRegion}`,
        text: 'Для вибраної області зараз зафіксована активна тривога. Потрібен окремий регіональний режим перегляду.',
        tone: 'danger',
      };
    }
    if (regionStatus === 'partial') {
      return {
        title: `Часткова тривога: ${selectedRegion}`,
        text: 'У вибраній області є часткова безпекова загроза. Карта підготовлена під локальний зум цієї області.',
        tone: 'warning',
      };
    }
    return {
      title: `Без активної тривоги: ${selectedRegion}`,
      text: 'Для вибраної області активна тривога зараз не відображається. Модуль готовий для підключення реального API.',
      tone: 'safe',
    };
  }, [selectedRegion, regionStatusMap, counts]);

  const mapViewBox = useMemo(() => {
    if (selectedRegion === 'Усі області') return '0 0 820 390';
    const region = regionLayout.find((item) => item.id === selectedRegion);
    if (!region) return '0 0 820 390';
    const padding = 55;
    const minX = Math.max(region.x - padding, 0);
    const minY = Math.max(region.y - padding, 0);
    const width = Math.min(region.w + padding * 2, 820 - minX);
    const height = Math.min(region.h + padding * 2, 390 - minY);
    return `${minX} ${minY} ${width} ${height}`;
  }, [selectedRegion]);

  const statusColor: Record<AlertStatus, string> = {
    clear: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
    partial: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    alert: 'bg-red-500/15 text-red-300 border-red-500/20',
  };

  const statusFill: Record<AlertStatus, string> = {
    clear: '#10b981',
    partial: '#f59e0b',
    alert: '#ef4444',
  };

  const statusLabel: Record<AlertStatus, string> = {
    clear: 'Немає тривоги',
    partial: 'Часткова',
    alert: 'Активна',
  };

  const safetyToneClass = {
    safe: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    warning: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    danger: 'border-red-500/20 bg-red-500/10 text-red-200',
  } as const;

  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    try {
      const liveNews = await fetchNewsItems();
      if (liveNews.length > 0) {
        setNews(liveNews);
        setNewsError('');
        setIsNewsLoaded(true);
        setLastRefresh(getNowTime());
      } else {
        setNewsError('API новин не повернуло записів. Показуються резервні новини.');
      }
    } catch {
      setNewsError('Не вдалося оновити живі новини. Поки показуються резервні новини.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
              Ukraine Live Monitor
            </div>
            <h1 className="text-xl font-semibold sm:text-2xl md:text-4xl">Моніторинг новин і тривог по Україні</h1>
            <p className="mt-2 max-w-3xl text-xs text-slate-300 sm:text-sm md:text-base">
              Онлайн-панель для відображення головних новин України, поточної ситуації по областях,
              активних повітряних тривог і термінових подій з українських медіа.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[360px]">
            <StatCard label="Активні тривоги" value={String(counts.alert)} icon={<ShieldAlert className="h-5 w-5" />} />
            <StatCard label="Часткові" value={String(counts.partial)} icon={<Bell className="h-5 w-5" />} />
            <StatCard label="Джерела новин" value={String(liveSourceCount)} icon={<Globe className="h-5 w-5" />} />
            <StatCard label="Оновлено" value={lastRefresh} icon={<RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />} />
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Вибір області</h2>
              <p className="text-sm text-slate-400">Оберіть область, щоб увімкнути локальний режим новин, карти та безпеки</p>
            </div>
            <button
              onClick={() => setSelectedRegion('Усі області')}
              className="rounded-2xl border border-white/10 bg-[#0b1729] px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
            >
              Показати всю Україну
            </button>
          </div>

          <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <SelectControl label="Область" value={selectedRegion} onChange={setSelectedRegion} options={regionOptions} />
            <SelectControl label="Джерело" value={selectedSource} onChange={setSelectedSource} options={sourceOptions} />
            <SelectControl label="Категорія" value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} />
            <div className="flex items-end">
              <button
                onClick={() => setAlertsOnly((prev) => !prev)}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${alertsOnly ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300' : 'border-white/10 bg-[#0b1729] text-slate-300'}`}
              >
                <Filter className="h-4 w-4" />
                {alertsOnly ? 'Режим: тільки тривоги' : 'Показувати все'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {regionOptions.slice(1).map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${selectedRegion === region ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300' : 'border-white/10 bg-[#0b1729] text-slate-300 hover:border-cyan-400/30 hover:text-white'}`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-cyan-300" />
            <h2 className="text-xl font-semibold">Статус безпеки</h2>
          </div>
          <div className={`rounded-2xl border px-4 py-4 ${safetyToneClass[safetyStatus.tone as keyof typeof safetyToneClass]}`}>
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" />
              {safetyStatus.title}
            </div>
            <p className="text-sm leading-relaxed">{safetyStatus.text}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1.05fr_1.65fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Карта тривог України</h2>
                  <p className="text-sm text-slate-400">
                    {selectedRegion === 'Усі області' ? 'Огляд усієї країни' : `Підготовлений зум на область: ${selectedRegion}`}
                  </p>
                </div>
                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">LIVE</span>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#0b1729] p-3">
                <svg viewBox={mapViewBox} className="h-auto w-full transition-all duration-500">
                  <rect x="0" y="0" width="820" height="390" rx="28" fill="#091423" />
                  {regionLayout.map((region) => {
                    const status = regionStatusMap[region.id] || 'clear';
                    const isSelected = selectedRegion === region.id;
                    const isDimmed = selectedRegion !== 'Усі області' && !isSelected;
                    return (
                      <g key={region.id} className="cursor-pointer transition" onClick={() => setSelectedRegion(region.id)}>
                        <rect
                          x={region.x}
                          y={region.y}
                          width={region.w}
                          height={region.h}
                          rx="14"
                          fill={statusFill[status]}
                          fillOpacity={isDimmed ? 0.2 : 0.78}
                          stroke={isSelected ? '#67e8f9' : 'rgba(255,255,255,0.12)'}
                          strokeWidth={isSelected ? 4 : 1.5}
                        />
                        <text
                          x={region.x + region.w / 2}
                          y={region.y + region.h / 2 + 4}
                          textAnchor="middle"
                          fill="white"
                          fontSize={isSelected ? '12' : '10'}
                          fontWeight="600"
                          opacity={isDimmed ? 0.35 : 1}
                        >
                          {region.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <Legend color="bg-emerald-500" label="Немає тривоги" />
                <Legend color="bg-amber-500" label="Часткова тривога" />
                <Legend color="bg-red-500" label="Активна тривога" />
                <button
                  onClick={() => setSelectedRegion('Усі області')}
                  className="rounded-2xl border border-white/10 bg-[#0b1729] px-3 py-2 text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                >
                  Скинути вибір області
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1729] p-4 text-sm text-slate-300">
                {selectedRegion === 'Усі області'
                  ? 'При виборі всієї України карта показує загальний режим по країні та головні новини.'
                  : `Карта підготовлена під локальний зум на ${selectedRegion}. Після підключення токена тут буде повний режим тривог саме по цій області.`}
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-slate-300">
                <Map className="h-4 w-4 text-cyan-300" />
                Автооновлення новин налаштоване, а карта вже підготовлена під реальний регіональний режим після підключення API тривог.
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Онлайн-відео новин</h2>
                  <p className="text-sm text-slate-400">Автозапуск без звуку з можливістю вибору офіційного каналу</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {videoChannels.map((channel) => (
                    <FilterPill key={channel.id} label={channel.name} active={selectedVideo === channel.id} onClick={() => setSelectedVideo(channel.id)} />
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b1729]">
                <div className="aspect-video w-full max-h-[260px] sm:max-h-none">
                  <iframe
                    key={activeVideo.id}
                    className="h-full w-full"
                    src={activeVideo.embedUrl}
                    title={activeVideo.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1729] p-4">
                <div className="mb-2 text-sm font-medium text-white">Джерела для вибраної області</div>
                <div className="flex flex-wrap gap-2">
                  {activeRegionSources.map((item) => (
                    <span
                      key={`${item.scope}-${item.name}`}
                      className={`rounded-full border px-3 py-1.5 text-sm ${item.scope === 'regional' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/5 text-slate-300'}`}
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {!alertsOnly && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Найважливіше зараз</h2>
                    <p className="text-sm text-slate-400">
                      {selectedRegion === 'Усі області' ? 'Головні та дуже важливі новини по Україні' : `Головне по області: ${selectedRegion}`}
                    </p>
                  </div>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">TOP</span>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {importantNews.map((item, idx) => (
                    <article key={`${item.title}-${idx}`} className="rounded-2xl border border-white/10 bg-[#0b1729] p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-red-300">Важливо</span>
                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-300">{item.source}</span>
                      </div>
                      <h3 className="text-sm font-medium leading-relaxed text-white">{item.title}</h3>
                      <div className="mt-3 text-xs text-slate-400">{item.time} · {item.region}</div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Стрічка новин України</h2>
                  <p className="text-sm text-slate-400">
                    {selectedRegion === 'Усі області'
                      ? 'Загальноукраїнська стрічка з важливими новинами у 4 колонки'
                      : `Регіональна стрічка тільки по області: ${selectedRegion}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">Автооновлення: 30с</span>
                  <button
                    onClick={handleRefreshNews}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1729] px-3 py-1.5 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Оновити зараз
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {sourceOptions.map((source) => (
                      <FilterPill key={source} label={source === 'Українська правда' ? 'УП' : source} active={selectedSource === source} onClick={() => setSelectedSource(source)} />
                    ))}
                  </div>
                </div>
              </div>

              {!alertsOnly && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <FilterPill key={category} label={category} active={selectedCategory === category} onClick={() => setSelectedCategory(category)} />
                  ))}
                </div>
              )}

              <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-slate-300">
                {selectedRegion === 'Усі області'
                  ? 'Коли вибрана вся Україна, нижче показуються найважливіші та загальні новини по країні.'
                  : 'Коли вибрана область, стрічка нижче фільтрується тільки під цю область. Якщо даних мало — треба розширювати API джерел для регіону.'}
              </div>

              {newsError && (
                <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{newsError}</div>
              )}

              {!newsError && isNewsLoaded && (
                <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  Живі новини підключені успішно. Стрічка оновлюється автоматично.
                </div>
              )}

              <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1729] p-4 text-sm text-slate-300">
                <MapPinned className="h-4 w-4 text-cyan-300" />
                <span>
                  Поточний режим:
                  <span className="ml-2 font-medium text-white">{selectedRegion}</span>
                </span>
                <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-cyan-300">Новин у поточному режимі: {regionNewsCount}</span>
              </div>

              {displayedNews.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b1729] p-5 text-sm text-slate-400">
                  Для цього регіону зараз немає окремих новин. Треба додавати більше локальних джерел у API саме під вибрану область.
                </div>
              )}

              {selectedRegion === 'Усі області' ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {fourColumnNews.map((column, columnIndex) => (
                    <div key={`column-${columnIndex}`} className="space-y-3">
                      {column.map((item, idx) => (
                        <NewsCard key={`${item.title}-${item.source}-${idx}`} item={item} compact />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedNews.map((item, idx) => (
                    <NewsCard key={`${item.title}-${item.source}-${idx}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Тривоги по областях</h2>
                  <p className="text-sm text-slate-400">{selectedRegion === 'Усі області' ? 'Загальний список областей' : `Статус тільки по області: ${selectedRegion}`}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-[#0b1729] px-3 py-1 text-xs font-medium text-slate-300">{filteredAlerts.length} областей</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {filteredAlerts.map((item) => (
                  <div key={item.region} className="rounded-2xl border border-white/10 bg-[#0b1729] p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{item.region} область</div>
                        <div className="mt-1 text-xs text-slate-400">Оновлено: {item.updated}</div>
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor[item.status]}`}>{statusLabel[item.status]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1729] p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3 text-slate-400">
        <div className="text-xs uppercase tracking-[0.18em]">{label}</div>
        <div>{icon}</div>
      </div>
      <div className="mt-2 text-xl font-semibold text-white sm:text-2xl">{value}</div>
    </div>
  );
}

type FilterPillProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

function FilterPill({ label, active = false, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={active ? 'rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm text-cyan-300' : 'rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm text-slate-300'}
    >
      {label}
    </button>
  );
}

type SelectControlProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function SelectControl({ label, value, onChange, options }: SelectControlProps) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#0b1729] px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400/40 sm:px-4 sm:py-3"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type LegendProps = {
  color: string;
  label: string;
};

function Legend({ color, label }: LegendProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0b1729] px-3 py-2 text-slate-300">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

type NewsCardProps = {
  item: NewsItem;
  compact?: boolean;
};

function NewsCard({ item, compact = false }: NewsCardProps) {
  return (
    <article className={`rounded-2xl border border-white/10 bg-[#0b1729] p-3 sm:p-4 transition hover:border-cyan-400/30 hover:bg-[#0d1c31] ${compact ? 'min-h-[120px] sm:min-h-[140px]' : ''}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-cyan-300">{item.source}</span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-300">{item.category}</span>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-slate-300">{item.region}</span>
        {item.important && <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-red-300">Важливо</span>}
        <span className="ml-auto text-slate-400">{item.time}</span>
      </div>
      <h3 className={`font-medium leading-relaxed text-white ${compact ? 'text-sm' : 'text-sm sm:text-base md:text-lg'}`}>
        {item.link && item.link !== '#' ? (
          <a href={item.link} target="_blank" rel="noreferrer" className="transition hover:text-cyan-300">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h3>
    </article>
  );
}
