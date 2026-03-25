// ============================================================
//  Dev Insight Assistant — Central Detection Rule Engine v2
//  Multi-signal detection: JS globals, DOM, scripts, headers,
//  cookies, meta tags, and network request URLs.
// ============================================================

export type Category =
  | 'frontend'
  | 'styling'
  | 'backend'
  | 'cms'
  | 'analytics'
  | 'infra'
  | 'database'
  | 'language'
  | 'security'
  | 'font'
  | 'misc';

export interface TechRule {
  name: string;
  category: Category;
  patterns: {
    js?: string[];
    dom?: string[];
    script?: string[];
    headers?: { key: string; value?: string }[];
    cookies?: string[];
    meta?: string[];
    network?: string[];
  };
}

export const TECH_RULES: TechRule[] = [

  // ─── FRONTEND FRAMEWORKS ──────────────────────────────────
  {
    name: 'React',
    category: 'frontend',
    patterns: {
      js: ['React', '__REACT_DEVTOOLS_GLOBAL_HOOK__', 'ReactDOM'],
      dom: ['[data-reactroot]', '#__react-root'],
      script: ['react.development.js', 'react.production.min.js', 'react-dom', '/static/js/main'],
    },
  },
  {
    name: 'Next.js',
    category: 'frontend',
    patterns: {
      js: ['__NEXT_DATA__', '__next'],
      dom: ['script#__NEXT_DATA__', '[id="__next"]'],
      script: ['/_next/static/', '_next/chunk', 'next/dist'],
      headers: [{ key: 'x-powered-by', value: 'next.js' }],
      network: ['/_next/data/', '/__nextjs_'],
      meta: ['next.js'],
    },
  },
  {
    name: 'Vue.js',
    category: 'frontend',
    patterns: {
      js: ['Vue', '__VUE__', '__VUE_DEVTOOLS_GLOBAL_HOOK__'],
      dom: ['[data-v-app]'],
      script: ['vue.runtime.esm', 'vue.min.js', 'vue@', 'vue.global.js'],
    },
  },
  {
    name: 'Nuxt.js',
    category: 'frontend',
    patterns: {
      js: ['__NUXT__', '$nuxt'],
      dom: ['#__nuxt', '#__layout'],
      script: ['/_nuxt/', 'nuxt.config'],
      headers: [{ key: 'x-powered-by', value: 'nuxt' }],
    },
  },
  {
    name: 'Angular',
    category: 'frontend',
    patterns: {
      js: ['angular', 'getAllAngularRootElements', 'ng'],
      dom: ['[ng-version]', 'app-root', '[_nghost'],
      script: ['angular.min.js', '@angular/core', 'angular.js', 'zone.min.js'],
    },
  },
  {
    name: 'Svelte',
    category: 'frontend',
    patterns: {
      js: ['__svelte', 'svelte'],
      dom: ['[class*="svelte-"]'],
      script: ['svelte/internal', '.svelte-kit/', '__sveltekit'],
    },
  },
  {
    name: 'SolidJS',
    category: 'frontend',
    patterns: {
      js: ['_$insert', '_$delegateEvents'],
      script: ['solid-js', 'solid.min.js'],
    },
  },
  {
    name: 'Remix',
    category: 'frontend',
    patterns: {
      js: ['__remixContext', '__remixManifest'],
      script: ['/build/', '@remix-run'],
      network: ['/__manifest', '/api/routes'],
    },
  },
  {
    name: 'Gatsby',
    category: 'frontend',
    patterns: {
      js: ['___gatsby', '__GATSBY'],
      dom: ['[data-gatsby-image-wrapper]', '#___gatsby'],
      script: ['/page-data/', 'gatsby-browser', 'gatsby-runtime'],
      meta: ['gatsby'],
    },
  },
  {
    name: 'Astro',
    category: 'frontend',
    patterns: {
      js: ['__ASTRO__'],
      dom: ['astro-island'],
      script: ['/_astro/', '.astro.mjs'],
    },
  },

  // ─── JavaScript Libraries ─────────────────────────────────
  {
    name: 'jQuery',
    category: 'frontend',
    patterns: {
      js: ['jQuery'],
      script: ['jquery.min.js', 'jquery-3', 'jquery/dist/jquery', 'code.jquery.com', 'jquery.js'],
    },
  },
  {
    name: 'Alpine.js',
    category: 'frontend',
    patterns: {
      js: ['Alpine'],
      dom: ['[x-data]', '[x-bind]'],
      script: ['alpinejs', 'alpine.min.js'],
    },
  },
  {
    name: 'HTMX',
    category: 'frontend',
    patterns: {
      dom: ['[hx-get]', '[hx-post]', '[hx-target]'],
      script: ['htmx.min.js', 'htmx.org'],
    },
  },
  {
    name: 'React Router',
    category: 'frontend',
    patterns: {
      js: ['__react_router_build_manifest'],
      script: ['react-router', 'react-router-dom'],
      network: ['/api/routes'],
    },
  },
  {
    name: 'Axios',
    category: 'frontend',
    patterns: {
      js: ['axios'],
      script: ['axios.min.js', 'cdn.jsdelivr.net/npm/axios', 'unpkg.com/axios'],
    },
  },
  {
    name: 'Lodash',
    category: 'frontend',
    patterns: {
      js: ['lodash'],
      script: ['lodash.min.js', 'cdnjs.cloudflare.com/ajax/libs/lodash'],
    },
  },
  {
    name: 'MobX',
    category: 'frontend',
    patterns: {
      js: ['MobX'],
      script: ['mobx', 'mobx-react'],
    },
  },
  {
    name: 'core-js',
    category: 'frontend',
    patterns: {
      js: ['core-js'],
      script: ['core-js'],
    },
  },
  {
    name: 'Redux',
    category: 'frontend',
    patterns: {
      script: ['redux', 'react-redux'],
    },
  },

  // ─── CSS-IN-JS / Styled ───────────────────────────────────
  {
    name: 'styled-components',
    category: 'styling',
    patterns: {
      js: ['__styled_components_version__', 'styled'],
      dom: ['[class*="sc-"]'],
      script: ['styled-components', '@emotion/styled'],
    },
  },
  {
    name: 'Emotion',
    category: 'styling',
    patterns: {
      script: ['@emotion/react', '@emotion/css', 'emotion.js'],
      dom: ['[class*="css-"]'],
    },
  },

  // ─── ANIMATION / GRAPHICS ─────────────────────────────────
  {
    name: 'GSAP',
    category: 'frontend',
    patterns: {
      js: ['gsap', 'TweenMax', 'TweenLite', 'TimelineMax', 'ScrollTrigger'],
      script: ['gsap.min.js', 'gsap/all', 'cdn.jsdelivr.net/npm/gsap', 'cdnjs.cloudflare.com/ajax/libs/gsap'],
    },
  },
  {
    name: 'ECharts',
    category: 'frontend',
    patterns: {
      js: ['echarts', 'ECharts'],
      script: ['echarts.min.js', 'cdn.jsdelivr.net/npm/echarts', 'echarts/lib'],
      network: ['echarts.apache.org'],
    },
  },
  {
    name: 'Three.js',
    category: 'frontend',
    patterns: {
      js: ['THREE', 'three'],
      script: ['three.min.js', 'three.js', 'cdn.jsdelivr.net/npm/three'],
    },
  },
  {
    name: 'Chart.js',
    category: 'frontend',
    patterns: {
      js: ['Chart'],
      script: ['chart.min.js', 'chart.js', 'cdn.jsdelivr.net/npm/chart.js'],
    },
  },
  {
    name: 'Highcharts',
    category: 'frontend',
    patterns: {
      js: ['Highcharts'],
      script: ['highcharts.js', 'highcharts.src.js'],
    },
  },
  {
    name: 'Lottie',
    category: 'frontend',
    patterns: {
      js: ['Lottie', 'lottie'],
      script: ['lottie.min.js', 'lottie-web'],
    },
  },
  {
    name: 'Framer Motion',
    category: 'frontend',
    patterns: {
      js: ['__framer_motion_init', 'Framer'],
      dom: ['[data-framer-component-type]'],
      script: ['framer-motion', 'framer.com'],
    },
  },

  // ─── TEMPLATING ───────────────────────────────────────────
  {
    name: 'Mustache.js',
    category: 'frontend',
    patterns: {
      js: ['Mustache'],
      script: ['mustache.min.js', 'cdn.jsdelivr.net/npm/mustache', 'cdnjs.cloudflare.com/ajax/libs/mustache'],
    },
  },
  {
    name: 'Handlebars',
    category: 'frontend',
    patterns: {
      js: ['Handlebars'],
      script: ['handlebars.min.js', 'cdn.jsdelivr.net/npm/handlebars'],
    },
  },

  // ─── STYLING / UI FRAMEWORKS ──────────────────────────────
  {
    name: 'Tailwind CSS',
    category: 'styling',
    patterns: {
      dom: ['[class*="text-sm"]', '[class*="bg-gray"]', '[class*="hover:"]', '[class*="px-"]', '[class*="rounded-"]'],
      script: ['tailwind.min.js', 'tailwindcss'],
    },
  },
  {
    name: 'Bootstrap',
    category: 'styling',
    patterns: {
      js: ['bootstrap'],
      dom: ['.container', '.navbar', '.btn', '.col-md', '.modal.fade'],
      script: ['bootstrap.min.css', 'bootstrap.bundle.min.js', 'getbootstrap.com', 'bootstrap@', '/bootstrap/'],
    },
  },
  {
    name: 'Material UI',
    category: 'styling',
    patterns: {
      dom: ['.MuiButton-root', '.MuiPaper-root', '[class*="Mui"]'],
      script: ['@mui/material', '@material-ui/core'],
    },
  },
  {
    name: 'Chakra UI',
    category: 'styling',
    patterns: {
      dom: ['.chakra-ui-light', '.chakra-ui-dark', '[class*="chakra-"]'],
      script: ['@chakra-ui/react'],
    },
  },
  {
    name: 'Primer',
    category: 'styling',
    patterns: {
      dom: ['[class*="color-bg-"]', '[class*="color-text-"]', '[class*="Header-item"]'],
      script: ['primer'],
    },
  },
  {
    name: 'GitHub',
    category: 'infra',
    patterns: {
      dom: ['.github-box', '[data-github-url]'],
      headers: [{ key: 'server', value: 'github.com' }],
    },
  },
  {
    name: 'Ant Design',
    category: 'styling',
    patterns: {
      dom: ['.ant-btn', '.ant-layout', '.ant-menu', '[class*="ant-"]'],
      script: ['antd/dist', 'ant-design'],
    },
  },
  {
    name: 'Radix UI',
    category: 'styling',
    patterns: {
      dom: ['[data-radix-', '[class*="radix-"]'],
    },
  },

  // ─── WEB COMPONENTS / LIT ─────────────────────────────────
  {
    name: 'lit-html',
    category: 'frontend',
    patterns: {
      js: ['litHtml', 'LitElement'],
      script: ['lit-html', 'lit-element', '@lit/reactive-element', 'cdn.jsdelivr.net/npm/lit'],
    },
  },

  // ─── BUILD TOOLS ──────────────────────────────────────────
  {
    name: 'Vite',
    category: 'infra',
    patterns: {
      js: ['__vite_plugin_react_preamble_installed__', '__VITE_IS_MODERN__'],
      script: ['/@vite/client', 'vite/client', '@vite/'],
    },
  },
  {
    name: 'Webpack',
    category: 'infra',
    patterns: {
      js: ['webpackChunk', 'webpackJsonp', '__webpack_require__', 'webpackHotUpdate'],
      script: ['webpack.min.js', 'webpack-runtime', '.chunk.js'],
    },
  },
  {
    name: 'Turbopack',
    category: 'infra',
    patterns: {
      js: ['__TURBOPACK__'],
      script: ['turbopack'],
    },
  },

  // ─── CDNs ─────────────────────────────────────────────────
  {
    name: 'jsDelivr',
    category: 'infra',
    patterns: {
      script: ['cdn.jsdelivr.net'],
    },
  },
  {
    name: 'cdnjs',
    category: 'infra',
    patterns: {
      script: ['cdnjs.cloudflare.com'],
    },
  },
  {
    name: 'unpkg',
    category: 'infra',
    patterns: {
      script: ['unpkg.com'],
    },
  },

  // ─── BACKEND / LANGUAGES ──────────────────────────────────
  {
    name: 'PHP',
    category: 'language',
    patterns: {
      headers: [{ key: 'x-powered-by', value: 'php' }],
      cookies: ['PHPSESSID', 'phpsess'],
      script: ['.php'],
      network: ['.php?', '/api.php', '/index.php'],
    },
  },
  {
    name: 'Node.js',
    category: 'language',
    patterns: {
      headers: [{ key: 'x-powered-by', value: 'express' }, { key: 'server', value: 'node' }],
    },
  },
  {
    name: 'Express.js',
    category: 'backend',
    patterns: {
      headers: [{ key: 'x-powered-by', value: 'express' }],
    },
  },
  {
    name: 'Python',
    category: 'language',
    patterns: {
      headers: [{ key: 'server', value: 'python' }, { key: 'x-powered-by', value: 'python' }],
    },
  },
  {
    name: 'Django',
    category: 'backend',
    patterns: {
      headers: [{ key: 'server', value: 'wsgi' }],
      cookies: ['csrftoken', 'sessionid'],
      network: ['/admin/', '/graphql/'],
    },
  },
  {
    name: 'Flask',
    category: 'backend',
    patterns: {
      headers: [{ key: 'server', value: 'werkzeug' }],
    },
  },
  {
    name: 'Laravel',
    category: 'backend',
    patterns: {
      headers: [{ key: 'x-powered-by', value: 'php' }],
      cookies: ['laravel_session', 'XSRF-TOKEN'],
      network: ['/sanctum/csrf-cookie'],
    },
  },
  {
    name: 'Ruby on Rails',
    category: 'backend',
    patterns: {
      headers: [{ key: 'server', value: 'puma' }],
      cookies: ['_session_id', '_rails_session'],
    },
  },
  {
    name: 'ASP.NET',
    category: 'backend',
    patterns: {
      headers: [{ key: 'x-powered-by', value: 'asp.net' }, { key: 'x-aspnet-version', value: '' }, { key: 'x-aspnetmvc-version', value: '' }],
      cookies: ['ASP.NET_SessionId', '__RequestVerificationToken'],
      dom: ['input[name="__VIEWSTATE"]'],
    },
  },
  {
    name: 'Java / Spring Boot',
    category: 'backend',
    patterns: {
      headers: [{ key: 'server', value: 'apache-coyote' }, { key: 'server', value: 'tomcat' }, { key: 'x-application-context', value: '' }],
      cookies: ['JSESSIONID'],
      network: ['/actuator/', '/swagger-ui'],
    },
  },
  {
    name: 'Go',
    category: 'backend',
    patterns: {
      headers: [{ key: 'server', value: 'gin' }, { key: 'server', value: 'echo' }, { key: 'server', value: 'fasthttp' }],
    },
  },
  {
    name: 'SAP',
    category: 'backend',
    patterns: {
      js: ['sap', 'SAPLaunchpad', 'SAPFiori', 'SAPUI5'],
      dom: ['[class*="sapM"]', '[class*="sapUi"]'],
      script: ['sap-ui-core.js', '/sap/bc/', 'sapui5', 'openui5'],
      network: ['/sap/opu/', '/sap/bc/', '/odata/'],
    },
  },

  // ─── CMS ──────────────────────────────────────────────────
  {
    name: 'WordPress',
    category: 'cms',
    patterns: {
      js: ['wp', 'wpApiSettings', 'woocommerce'],
      dom: ['body.wp-admin', '[class*="wp-block"]', '#wpadminbar'],
      script: ['/wp-content/', '/wp-includes/', '/wp-json/'],
      meta: ['wordpress'],
      network: ['/wp-json/wp/v2/', '/xmlrpc.php'],
      cookies: ['wordpress_'],
    },
  },
  {
    name: 'Shopify',
    category: 'cms',
    patterns: {
      js: ['Shopify', 'ShopifyBuy'],
      dom: ['[data-shopify]', '#shopify-section-header'],
      script: ['cdn.shopify.com', 'shopify.com/s/files'],
      network: ['/cart.json', 'shopify.com'],
    },
  },
  {
    name: 'Wix',
    category: 'cms',
    patterns: {
      js: ['wixBiSession', 'wixPerformanceMeasurements'],
      dom: ['[data-mesh-id]', '[class*="wixui-"]'],
      script: ['static.wixstatic.com'],
    },
  },
  {
    name: 'Webflow',
    category: 'cms',
    patterns: {
      js: ['Webflow'],
      dom: ['[data-wf-page]', '[data-wf-domain]'],
      script: ['webflow.com/static/', 'webflow.js'],
    },
  },
  {
    name: 'Ghost',
    category: 'cms',
    patterns: {
      js: ['__ghost_url__'],
      dom: ['.gh-canvas'],
      script: ['ghost/core/', '/ghost/api/'],
      meta: ['ghost'],
    },
  },
  {
    name: 'Squarespace',
    category: 'cms',
    patterns: {
      js: ['Squarespace'],
      dom: ['.sqsp-'],
      script: ['static1.squarespace.com'],
    },
  },
  {
    name: 'Drupal',
    category: 'cms',
    patterns: {
      js: ['Drupal'],
      script: ['/sites/default/files/', '/misc/drupal.js'],
      meta: ['drupal'],
      cookies: ['drupal'],
    },
  },
  {
    name: 'Joomla',
    category: 'cms',
    patterns: {
      js: ['Joomla'],
      script: ['/media/system/js/core.js', '/components/com_'],
      meta: ['joomla'],
      cookies: ['joomla_'],
    },
  },

  // ─── INFRA / HOSTING ──────────────────────────────────────
  {
    name: 'Vercel',
    category: 'infra',
    patterns: {
      headers: [{ key: 'x-vercel-id', value: '' }, { key: 'server', value: 'vercel' }],
      js: ['__vercel_asset_cache_state__'],
      network: ['vercel.app', 'vercel-insights.js'],
    },
  },
  {
    name: 'Cloudflare',
    category: 'infra',
    patterns: {
      headers: [{ key: 'cf-ray', value: '' }, { key: 'server', value: 'cloudflare' }, { key: 'cf-cache-status', value: '' }],
    },
  },
  {
    name: 'Netlify',
    category: 'infra',
    patterns: {
      headers: [{ key: 'x-nf-request-id', value: '' }, { key: 'server', value: 'netlify' }],
      cookies: ['nf_'],
    },
  },
  {
    name: 'Amazon Web Services',
    category: 'infra',
    patterns: {
      headers: [{ key: 'x-amzn-requestid', value: '' }, { key: 'server', value: 'awselb' }, { key: 'x-amz-cf-pop', value: '' }],
      network: ['amazonaws.com', 'cloudfront.net', 's3.amazonaws.com', 'execute-api'],
    },
  },
  {
    name: 'Amazon S3',
    category: 'infra',
    patterns: {
      network: ['s3.amazonaws.com', '.s3-website.', 's3.ap-', 's3.us-'],
      headers: [{ key: 'x-amz-bucket-region', value: '' }],
    },
  },
  {
    name: 'GitHub Pages',
    category: 'infra',
    patterns: {
      network: ['github.io', 'githubusercontent.com'],
      headers: [{ key: 'server', value: 'github.com' }, { key: 'x-github-request-id', value: '' }],
    },
  },
  {
    name: 'Google Cloud',
    category: 'infra',
    patterns: {
      headers: [{ key: 'server', value: 'gws' }, { key: 'via', value: 'google' }],
      network: ['googleapis.com', 'storage.cloud.google.com', 'run.app'],
    },
  },
  {
    name: 'Nginx',
    category: 'infra',
    patterns: {
      headers: [{ key: 'server', value: 'nginx' }],
    },
  },
  {
    name: 'HTTP/3',
    category: 'infra',
    patterns: {
      headers: [{ key: 'alt-svc', value: 'h3' }],
    },
  },
  {
    name: 'Apache',
    category: 'infra',
    patterns: {
      headers: [{ key: 'server', value: 'apache' }],
    },
  },
  {
    name: 'Microsoft IIS',
    category: 'infra',
    patterns: {
      headers: [{ key: 'server', value: 'microsoft-iis' }],
    },
  },
  {
    name: 'Windows Server',
    category: 'infra',
    patterns: {
      headers: [{ key: 'server', value: 'microsoft-iis' }, { key: 'x-aspnet-version', value: '' }],
    },
  },
  {
    name: 'Fastly',
    category: 'infra',
    patterns: {
      headers: [{ key: 'x-fastly-request-id', value: '' }, { key: 'via', value: 'fastly' }],
    },
  },

  // ─── DATABASES / BAAS ─────────────────────────────────────
  {
    name: 'Firebase',
    category: 'database',
    patterns: {
      js: ['firebase', '__FIREBASE_DEFAULTS__'],
      script: ['firebase-app', 'firebase/app', 'firebase/firestore', 'firebaseio.com'],
      network: ['firebaseio.com', 'firestore.googleapis.com', 'identitytoolkit.googleapis.com'],
    },
  },
  {
    name: 'Supabase',
    category: 'database',
    patterns: {
      js: ['supabase'],
      script: ['@supabase/supabase-js'],
      network: ['supabase.co', '.supabase.co/rest/', '.supabase.co/auth/'],
    },
  },
  {
    name: 'MongoDB Atlas',
    category: 'database',
    patterns: {
      network: ['mongodb.net', 'cloud.mongodb.com', 'data.mongodb-api.com'],
      headers: [{ key: 'x-realm-app-id', value: '' }],
    },
  },
  {
    name: 'PlanetScale',
    category: 'database',
    patterns: {
      network: ['planetscale.com', 'pscale.io'],
    },
  },

  // ─── APIs ─────────────────────────────────────────────────
  {
    name: 'GraphQL',
    category: 'backend',
    patterns: {
      network: ['/graphql', '?query='],
      dom: ['[data-apollo]'],
    },
  },
  {
    name: 'REST API',
    category: 'backend',
    patterns: {
      network: ['/api/v1', '/api/v2', '/api/v3', '/rest/'],
    },
  },
  {
    name: 'WebSocket',
    category: 'backend',
    patterns: {
      network: ['ws://', 'wss://', 'socket.io', 'sockjs'],
      script: ['socket.io.js', 'sockjs.min.js'],
    },
  },

  // ─── ANALYTICS ────────────────────────────────────────────
  {
    name: 'Google Analytics',
    category: 'analytics',
    patterns: {
      js: ['ga', 'gtag', 'GoogleAnalyticsObject', 'gaGlobal'],
      script: ['google-analytics.com/analytics.js', 'gtag/js?id=G-', 'ga.js'],
      network: ['google-analytics.com', 'analytics.google.com'],
    },
  },
  {
    name: 'Google Tag Manager',
    category: 'analytics',
    patterns: {
      js: ['google_tag_manager', 'dataLayer'],
      script: ['googletagmanager.com/gtm.js'],
      network: ['googletagmanager.com'],
    },
  },
  {
    name: 'Mixpanel',
    category: 'analytics',
    patterns: {
      js: ['mixpanel'],
      script: ['cdn.mxpnl.com', 'mixpanel'],
      network: ['api.mixpanel.com'],
    },
  },
  {
    name: 'Segment',
    category: 'analytics',
    patterns: {
      script: ['segment.io', 'cdn.segment.io'],
      network: ['api.segment.io', 'api.segment.com'],
    },
  },
  {
    name: 'Hotjar',
    category: 'analytics',
    patterns: {
      js: ['hj', 'hjBootstrap'],
      script: ['static.hotjar.com', 'script.hotjar.com'],
      network: ['hotjar.com'],
    },
  },
  {
    name: 'Amplitude',
    category: 'analytics',
    patterns: {
      js: ['amplitude', 'AmplitudeClient'],
      script: ['cdn.amplitude.com'],
      network: ['api.amplitude.com', 'api2.amplitude.com'],
    },
  },
  {
    name: 'Facebook Pixel',
    category: 'analytics',
    patterns: {
      js: ['fbq'],
      script: ['connect.facebook.net/en_US/fbevents.js'],
      network: ['connect.facebook.net', 'facebook.com/tr'],
    },
  },
  {
    name: 'Clarity (Microsoft)',
    category: 'analytics',
    patterns: {
      js: ['clarity'],
      script: ['clarity.ms/tag'],
      network: ['clarity.ms'],
    },
  },
  {
    name: 'Google Ads',
    category: 'analytics',
    patterns: {
      script: ['pagead2.googlesyndication.com', 'googleadservices.com', 'googleads.g.doubleclick.net'],
      network: ['googleads.g.doubleclick.net', 'pagead2.googlesyndication.com'],
    },
  },
  {
    name: 'LinkedIn Insight Tag',
    category: 'analytics',
    patterns: {
      script: ['snap.licdn.com/li.lms-analytics/insight.min.js'],
      network: ['px.ads.linkedin.com'],
    },
  },
  {
    name: 'LinkedIn Ads',
    category: 'analytics',
    patterns: {
      script: ['snap.licdn.com'],
    },
  },
  {
    name: 'Statsig',
    category: 'analytics',
    patterns: {
      js: ['statsig'],
      script: ['cdn.statsig.com'],
      network: ['api.statsig.com'],
    },
  },
  {
    name: 'Intercom',
    category: 'analytics',
    patterns: {
      js: ['Intercom', 'intercomSettings'],
      script: ['widget.intercom.io', 'js.intercomcdn.com'],
      network: ['api.intercom.io'],
    },
  },
  {
    name: 'Sentry',
    category: 'analytics',
    patterns: {
      js: ['Sentry', '__SENTRY__'],
      script: ['browser.min.js', 'sentry/bundle', 'sentry-cdn.com', 'sentry.io'],
      network: ['sentry.io/api/', 'o0.ingest.sentry.io'],
    },
  },
  {
    name: 'DataDog RUM',
    category: 'analytics',
    patterns: {
      js: ['DD_RUM'],
      script: ['datadoghq.com/datadog-rum'],
      network: ['datadoghq.com'],
    },
  },
  {
    name: 'New Relic',
    category: 'analytics',
    patterns: {
      js: ['newrelic'],
      script: ['js-agent.newrelic.com'],
      network: ['newrelic.com', 'nr-data.net'],
    },
  },

  // ─── SECURITY / AUTH ──────────────────────────────────────
  {
    name: 'HSTS',
    category: 'security',
    patterns: {
      headers: [{ key: 'strict-transport-security', value: '' }],
    },
  },
  {
    name: 'reCAPTCHA',
    category: 'security',
    patterns: {
      js: ['grecaptcha'],
      dom: ['iframe[src*="recaptcha"]', '.grecaptcha-badge'],
      script: ['www.google.com/recaptcha'],
    },
  },
  {
    name: 'Cloudflare Turnstile',
    category: 'security',
    patterns: {
      js: ['turnstile'],
      script: ['challenges.cloudflare.com/turnstile'],
    },
  },
  {
    name: 'Cloudflare Bot Management',
    category: 'security',
    patterns: {
      cookies: ['__cf_bm'],
    },
  },
  {
    name: 'Auth0',
    category: 'security',
    patterns: {
      js: ['Auth0', 'auth0'],
      script: ['cdn.auth0.com', 'auth0-spa-js', '@auth0/auth0-react'],
      network: ['auth0.com/oauth/'],
    },
  },
  {
    name: 'Clerk',
    category: 'security',
    patterns: {
      js: ['Clerk', 'clerk'],
      script: ['clerk.browser.js', 'clerk.js', 'clerk.dev/npm/@clerk'],
      network: ['clerk.dev', 'accounts.clerk.dev'],
    },
  },
  {
    name: 'Apple Sign-In',
    category: 'security',
    patterns: {
      script: ['appleid.cdn-apple.com', 'apple-body.apple.com'],
      dom: ['[id="appleid-signin"]'],
      network: ['appleid.apple.com'],
    },
  },

  // ─── PAYMENT ──────────────────────────────────────────────
  {
    name: 'Stripe',
    category: 'backend',
    patterns: {
      js: ['Stripe', 'stripe'],
      script: ['js.stripe.com/v3', 'js.stripe.com/v2'],
      network: ['stripe.com'],
    },
  },
  {
    name: 'PayPal',
    category: 'backend',
    patterns: {
      js: ['paypal', 'PAYPAL'],
      script: ['paypal.com/sdk/js', 'paypalobjects.com'],
      network: ['paypal.com/v2/', 'api.paypal.com'],
    },
  },

  // ─── FONTS ────────────────────────────────────────────────
  {
    name: 'Google Fonts',
    category: 'font',
    patterns: {
      script: ['fonts.googleapis.com', 'fonts.gstatic.com'],
      dom: ['link[href*="fonts.googleapis.com"]'],
    },
  },
  {
    name: 'Font Awesome',
    category: 'font',
    patterns: {
      js: ['FontAwesome', 'fontawesome'],
      dom: ['[class*="fa-"]', 'link[href*="font-awesome"]'],
      script: ['font-awesome', 'fontawesome.com', 'kit.fontawesome.com'],
    },
  },

  // ─── PWA / MISC ───────────────────────────────────────────
  {
    name: 'PWA',
    category: 'infra',
    patterns: {
      dom: ['link[rel="manifest"]'],
      script: ['sw.js', 'service-worker.js', 'workbox-'],
      network: ['/manifest.json'],
    },
  },
  {
    name: 'Open Graph',
    category: 'misc',
    patterns: {
      dom: ['meta[property^="og:"]'],
    },
  },
  {
    name: 'RSS',
    category: 'misc',
    patterns: {
      dom: ['link[type="application/rss+xml"]', 'link[type="application/atom+xml"]'],
    },
  },
  {
    name: 'Pusher',
    category: 'backend',
    patterns: {
      js: ['Pusher', '__Pusher'],
      script: ['pusher.min.js', 'js.pusher.com'],
      network: ['pusher.com/app/', 'sockjs.pusher.com'],
    },
  },
];

// ─── CONFIDENCE SCORING ENGINE ────────────────────────────────

const WEIGHTS = {
  js:     40,
  header: 40,
  cookie: 30,
  network:35,
  script: 25,
  dom:    20,
  meta:   25,
};

export interface DetectedTech {
  name: string;
  category: Category;
  confidence: number;
  sources: string[];
}

export interface SignalsPayload {
  js: string[];
  dom: string[];
  scripts: string[];
  headers: Record<string, string>;
  cookies: string[];
  meta: string;
  network: string[];
}

function matchPatterns(patterns: string[] | undefined, targets: string[]): boolean {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some(p => targets.some(t => t.toLowerCase().includes(p.toLowerCase())));
}

function matchHeaders(
  patterns: { key: string; value?: string }[] | undefined,
  headers: Record<string, string>
): boolean {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some(p => {
    const hv = headers[p.key.toLowerCase()];
    if (hv === undefined) return false;
    if (!p.value) return true;
    return hv.includes(p.value.toLowerCase());
  });
}

function matchMeta(patterns: string[] | undefined, meta: string): boolean {
  if (!patterns || patterns.length === 0 || !meta) return false;
  const lower = meta.toLowerCase();
  return patterns.some(p => lower.includes(p.toLowerCase()));
}

export function detectTechnologies(signals: SignalsPayload): DetectedTech[] {
  const results: DetectedTech[] = [];

  for (const rule of TECH_RULES) {
    let score = 0;
    const sources: string[] = [];
    const p = rule.patterns;

    if (p.js && matchPatterns(p.js, signals.js)) {
      score += WEIGHTS.js; sources.push('JS globals');
    }
    if (p.dom && matchPatterns(p.dom, signals.dom)) {
      score += WEIGHTS.dom; sources.push('DOM');
    }
    if (p.script && matchPatterns(p.script, signals.scripts)) {
      score += WEIGHTS.script; sources.push('Scripts');
    }
    if (p.headers && matchHeaders(p.headers, signals.headers)) {
      score += WEIGHTS.header; sources.push('Headers');
    }
    if (p.cookies && matchPatterns(p.cookies, signals.cookies)) {
      score += WEIGHTS.cookie; sources.push('Cookies');
    }
    if (p.meta && matchMeta(p.meta, signals.meta)) {
      score += WEIGHTS.meta; sources.push('Meta');
    }
    if (p.network && matchPatterns(p.network, signals.network)) {
      score += WEIGHTS.network; sources.push('Network');
    }

    const confidence = Math.min(100, score);
    if (confidence >= 20) {
      results.push({ name: rule.name, category: rule.category, confidence, sources });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}
