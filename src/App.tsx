// ============================================================
//  App.tsx — Dev Insight Assistant Popup UI
// ============================================================
import { useEffect, useState, useMemo } from 'react';
import './index.css';
import type { TabData, ApiCall } from './background';
import type { DetectedTech, Category } from './rules';

const STORAGE_PREFIX = 'dev_insight_v4_';

type View = 'overview' | 'network';

const CATEGORY_LABELS: Record<Category, string> = {
  frontend:  '⚡ Frontend',
  styling:   '🎨 Styling / UI',
  backend:   '🔧 Backend',
  language:  '💻 Language',
  cms:       '📝 CMS',
  analytics: '📊 Analytics',
  infra:     '☁️ Infrastructure',
  database:  '🗄️ Database / BaaS',
  security:  '🔒 Security',
  font:      '🔤 Fonts',
  misc:      '📦 Miscellaneous',
};

const CATEGORY_ORDER: Category[] = [
  'frontend', 'styling', 'backend', 'language', 'cms', 'analytics', 'infra', 'database', 'security', 'font', 'misc'
];

function emptyData(): TabData {
  return { technologies: [], apiCalls: [], signals: { js: [], scripts: [], dom: [], cookies: [], meta: '', network: [], headers: {} } };
}

function TechBadge({ tech }: { tech: DetectedTech }) {
  return (
    <div className="tech-card">
      <span className="tech-name">{tech.name}</span>
    </div>
  );
}

export default function App() {
  const [tabId, setTabId] = useState<number | null>(null);
  const [data, setData] = useState<TabData>(emptyData());
  const [view, setView] = useState<View>('overview');
  const [search, setSearch] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      // Dev mode mock data
      setData({
        technologies: [
          { name: 'React', category: 'frontend', confidence: 95, sources: ['JavaScript globals', 'DOM markers'] },
          { name: 'Next.js', category: 'frontend', confidence: 90, sources: ['JavaScript globals', 'Script URLs'] },
          { name: 'Tailwind CSS', category: 'styling', confidence: 75, sources: ['DOM markers'] },
          { name: 'Vercel', category: 'infra', confidence: 80, sources: ['HTTP headers'] },
        ],
        apiCalls: [],
        signals: { js: [], scripts: [], dom: [], cookies: [], meta: '', network: [], headers: {} },
      });
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        setTabId(tabs[0].id);
        loadData(tabs[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!tabId || typeof chrome === 'undefined' || !chrome.storage) return;
    const id = setInterval(() => loadData(tabId), 1000);
    return () => clearInterval(id);
  }, [tabId]);

  const loadData = async (id: number) => {
    const key = `${STORAGE_PREFIX}${id}`;
    const result = await chrome.storage.local.get(key);
    if (result[key]) setData(result[key] as TabData);
  };

  const handleRefresh = () => {
    if (tabId && typeof chrome !== 'undefined') {
      chrome.tabs.reload(tabId);
      setTimeout(() => loadData(tabId), 500);
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `dev-insight-${Date.now()}.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyUrl = (url: string, idx: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Group detected technologies by category
  const grouped = useMemo(() => {
    const map: Partial<Record<Category, DetectedTech[]>> = {};
    for (const tech of data.technologies) {
      if (!map[tech.category]) map[tech.category] = [];
      map[tech.category]!.push(tech);
    }
    return map;
  }, [data.technologies]);

  const filteredCalls = useMemo(() => {
    if (!search) return [...data.apiCalls].reverse();
    const q = search.toLowerCase();
    return [...data.apiCalls]
      .reverse()
      .filter(a => a.url.toLowerCase().includes(q) || a.method.toLowerCase().includes(q) || a.apiType.toLowerCase().includes(q));
  }, [data.apiCalls, search]);

  const totalTech = data.technologies.length;

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="header">
        <div className="header-left">
          <span className="logo">🔍</span>
          <h1>Sparkle Dev Insight</h1>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={handleRefresh} title="Reload Page">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
          <button className="icon-btn" onClick={exportData} title="Export JSON">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── STAT BAR ───────────────────────────────────────── */}
      <div className="stat-bar">
        <div className="stat">
          <span className="stat-num">{totalTech}</span>
          <span className="stat-label">Detected</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num" style={{ color: '#58a6ff' }}>{data.apiCalls.length}</span>
          <span className="stat-label">API calls</span>
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────── */}
      <div className="tabs">
        <button className={`tab ${view === 'overview' ? 'active' : ''}`} onClick={() => setView('overview')}>
          Technologies
        </button>
        <button className={`tab ${view === 'network' ? 'active' : ''}`} onClick={() => setView('network')}>
          Network ({data.apiCalls.length})
        </button>
      </div>

      {/* ── CONTENT ────────────────────────────────────────── */}
      <div className="content-area">
        {view === 'overview' ? (
          <>
            {CATEGORY_ORDER.map(cat => {
              const techs = grouped[cat];
              if (!techs || techs.length === 0) return null;
              return (
                <div key={cat} className="category-section">
                  <div className="category-title">{CATEGORY_LABELS[cat]}</div>
                  <div className="tech-grid">
                    {techs.map(tech => <TechBadge key={tech.name} tech={tech} />)}
                  </div>
                </div>
              );
            })}
            {totalTech === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div>No technologies detected yet.</div>
                <div className="empty-sub">Hit refresh or wait for signals to load.</div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="search-wrap">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Filter by URL, method, type..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="search-clear" onClick={() => setSearch('')}>×</button>}
            </div>
            <div className="api-list">
              {filteredCalls.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📡</div>
                  <div>{search ? 'No matching requests' : 'No API calls captured yet'}</div>
                </div>
              ) : filteredCalls.map((api, i) => (
                <ApiCard key={i} api={api} index={i} copiedIdx={copiedIdx} onCopy={copyUrl} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ApiCard({ api, index, copiedIdx, onCopy }: { api: ApiCall; index: number; copiedIdx: number | null; onCopy: (url: string, idx: number) => void }) {
  const typeColor: Record<string, string> = {
    GraphQL: '#e10098',
    Firebase: '#ffca28',
    Supabase: '#3ecf8e',
    Analytics: '#d29922',
    REST: '#58a6ff',
    Unknown: '#484f58',
  };
  const methodColors: Record<string, string> = {
    GET: 'get', POST: 'post', PUT: 'put', DELETE: 'delete', PATCH: 'patch',
  };

  return (
    <div className="api-card">
      <div className="api-card-top">
        <div className="api-badges">
          <span className={`method-badge ${methodColors[api.method] || ''}`}>{api.method}</span>
          <span className="type-badge" style={{ color: typeColor[api.apiType] || '#888', borderColor: typeColor[api.apiType] || '#888' }}>
            {api.apiType}
          </span>
        </div>
        <button className="copy-btn" onClick={() => onCopy(api.url, index)} title="Copy URL">
          {copiedIdx === index ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
          )}
        </button>
      </div>
      <div className="api-url">{api.url}</div>
      <div className="api-meta">
        <span>{new Date(api.timestamp).toLocaleTimeString()}</span>
        <span className="api-initiator">{api.initiator}</span>
      </div>
    </div>
  );
}
