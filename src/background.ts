// background.ts — Service Worker
// Runs the detection engine against collected signals + HTTP headers

import { detectTechnologies, type DetectedTech } from './rules';

export interface ApiCall {
  url: string;
  method: string;
  apiType: string;
  timestamp: number;
  initiator: string;
}

export interface TabData {
  technologies: DetectedTech[];
  apiCalls: ApiCall[];
  signals: {
    js: string[];
    scripts: string[];
    dom: string[];
    cookies: string[];
    meta: string;
    network: string[];
    headers: Record<string, string>;
  };
}

const STORAGE_PREFIX = 'dev_insight_v4_';

function emptyTabData(): TabData {
  return {
    technologies: [],
    apiCalls: [],
    signals: { js: [], scripts: [], dom: [], cookies: [], meta: '', network: [], headers: {} },
  };
}

async function getTabData(tabId: number): Promise<TabData> {
  const key = `${STORAGE_PREFIX}${tabId}`;
  const res = await chrome.storage.local.get(key);
  const stored = res[key];
  if (stored && typeof stored === 'object' && 'technologies' in stored) {
    return stored as TabData;
  }
  return emptyTabData();
}

async function saveTabData(tabId: number, data: TabData) {
  try {
    if (!chrome.runtime?.id) return;
    const key = `${STORAGE_PREFIX}${tabId}`;
    await chrome.storage.local.set({ [key]: data });
  } catch {}
}

function mergeStringArrayUniq(a: string[], b: string[]): string[] {
  return Array.from(new Set([...a, ...b]));
}

async function runDetection(tabId: number) {
  const data = await getTabData(tabId);
  const { signals } = data;
  data.technologies = detectTechnologies({
    js: signals.js,
    dom: signals.dom,
    scripts: signals.scripts,
    headers: signals.headers,
    cookies: signals.cookies,
    meta: signals.meta,
    network: signals.network,
  });
  await saveTabData(tabId, data);
}

// ── Header-based signal collection via webRequest ─────────────
const HEADER_PATTERNS = [
  'x-powered-by', 'server', 'x-aspnet-version', 'x-aspnetmvc-version',
  'x-generator', 'x-vercel-id', 'cf-ray', 'cf-cache-status',
  'x-nf-request-id', 'via', 'x-amzn-requestid', 'x-amz-cf-pop',
  'x-fastly-request-id', 'set-cookie', 'x-application-context',
  'x-realm-app-id', 'ps-client', 'sap-metadata', 'x-frame-options',
  'strict-transport-security', 'x-amz-bucket-region', 'x-amz-request-id',
  'x-runtime', 'x-vcap-request-id'
];

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.tabId < 0) return;
    const headers: Record<string, string> = {};
    for (const h of (details.responseHeaders || [])) {
      const name = h.name.toLowerCase();
      if (HEADER_PATTERNS.some(p => name.startsWith(p))) {
        headers[name] = (h.value || '').toLowerCase();
      }
    }
    if (Object.keys(headers).length === 0) return;

    // Fire-and-forget update (can't be async in callback)
    getTabData(details.tabId).then(data => {
      data.signals.headers = { ...data.signals.headers, ...headers };
      saveTabData(details.tabId, data).then(() => runDetection(details.tabId));
    });

    return undefined; // Return undefined for non-blocking in MV3
  },
  { urls: ['<all_urls>'], types: ['main_frame', 'sub_frame', 'xmlhttprequest', 'script'] },
  ['responseHeaders']
);

// ── Tab lifecycle ─────────────────────────────────────────────
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    await saveTabData(tabId, emptyTabData());
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await chrome.storage.local.remove(`${STORAGE_PREFIX}${tabId}`);
});

// ── Message handling ──────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender) => {
  if (!sender.tab?.id) return;
  const tabId = sender.tab.id;

  if (message.action === 'SIGNALS_COLLECTED') {
    const { js, scripts, dom, cookies, meta } = message.payload;
    (async () => {
      const data = await getTabData(tabId);
      data.signals.js = mergeStringArrayUniq(data.signals.js, js || []);
      data.signals.scripts = mergeStringArrayUniq(data.signals.scripts, scripts || []);
      data.signals.dom = mergeStringArrayUniq(data.signals.dom, dom || []);
      data.signals.cookies = mergeStringArrayUniq(data.signals.cookies, cookies || []);
      if (meta) data.signals.meta = meta;
      await saveTabData(tabId, data);
      await runDetection(tabId);
    })();
  }

  else if (message.action === 'NETWORK_REQUEST') {
    (async () => {
      const payload = message.payload as ApiCall;
      const data = await getTabData(tabId);
      data.signals.network = mergeStringArrayUniq(data.signals.network, [payload.url]).slice(-500);
      data.apiCalls = [...data.apiCalls, payload].slice(-200);
      await saveTabData(tabId, data);
      await runDetection(tabId);
    })();
  }

  else if (message.action === 'RESET_TAB') {
    (async () => {
      const targetId = message.tabId || tabId;
      await saveTabData(targetId, emptyTabData());
      // Re-trigger content script scan if possible
    })();
  }
});
