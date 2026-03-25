// ============================================================
//  inject.ts — High-Compatibility Signal Collector
//  Fixes 'Class constructor u cannot be invoked without new'
// ============================================================

(function() {
  var d = window;
  var b = d.fetch;
  var o = XMLHttpRequest.prototype.open;
  var s = XMLHttpRequest.prototype.send;

  function msg(t: string, p: any) {
    try {
      window.postMessage({ source: 'DEV_INSIGHT_EXT', type: t, data: p }, '*');
    } catch(e) {}
  }

  // ── FETCH OVERRIDE (Synchronous passthrough to avoid transpiler classes) ──
  if (b) {
    window.fetch = function(a, i) {
      try {
        var u = typeof a === 'string' ? a : (a instanceof Request ? a.url : String(a));
        var m = (i && i.method || (a instanceof Request ? a.method : 'GET')).toUpperCase();
        msg('NETWORK_REQUEST', { url: u, method: m, timestamp: Date.now(), initiator: 'fetch' });
      } catch(e) {}
      return b.call(window, a, i);
    };
  }

  // ── XHR OVERRIDE ──
  XMLHttpRequest.prototype.open = function() {
    (this as any)._dia_m = (arguments[0] || 'GET').toUpperCase();
    (this as any)._dia_u = String(arguments[1] || '');
    return o.apply(this, arguments as any);
  };

  XMLHttpRequest.prototype.send = function() {
    try {
      if ((this as any)._dia_u) msg('NETWORK_REQUEST', { url: (this as any)._dia_u, method: (this as any)._dia_m, timestamp: Date.now(), initiator: 'XHR' });
    } catch(e) {}
    return s.apply(this, arguments as any);
  };

  // ── SCANNER ──
  function scan() {
    try {
      var j: string[] = []; 
      var win = window as any;
      if (win.React) j.push('React'); 
      if (win.jQuery) j.push('jQuery'); 
      if (win.gsap) j.push('GSAP'); 
      if (win.Mustache) j.push('Mustache.js'); 
      if (win.ECharts || win.echarts) j.push('ECharts');
      if (win.Chart) j.push('Chart.js');
      if (win.bootstrap) j.push('Bootstrap');
      if (win.__mobxGlobal || win.__mobxInstanceCount) j.push('MobX');
      if (win['__core-js_shared__']) j.push('core-js');
      if (win.statsig) j.push('statsig');
      
      var u: string[] = []; 
      document.querySelectorAll('script[src], link[href]').forEach(function(e){ 
        var v = (e as any).src || (e as any).href; 
        if(v) u.push(v); 
      });

      if (performance?.getEntriesByType) {
        performance.getEntriesByType('resource').forEach(function(e: any) {
          if (e.name && !u.includes(e.name)) u.push(e.name);
        });
      }

      var p: string[] = []; 
      var w = function(n: any){ 
        if(!n) return; 
        var k = Object.keys(n); 
        for(var i=0; i<k.length; i++){ 
          var x = k[i];
          if (x.indexOf('__reactFiber') === 0 || x.indexOf('__reactInternal') === 0) if(!p.includes('React')) p.push('React');
          if (x.indexOf('__vue') === 0) if(!p.includes('Vue')) p.push('Vue');
          if (x.indexOf('__svelte') === 0) if(!p.includes('Svelte')) p.push('Svelte');
          if (x.indexOf('__lit') === 0) if(!p.includes('lit-html')) p.push('lit-html');
        }
      };
      w(document.body);
      w(document.documentElement);

      var d_hits: string[] = [];
      var s_list = [
        '[data-reactroot]', '[data-v-app]', '[data-wf-page]', '[ng-version]', 
        '[class*="color-bg-"]', '[class*="Header-item"]', '.github-box',
        '[class*="sc-"]', '[data-styled]', '.ant-btn', '.ant-layout',
        'meta[name="twitter:card"]', 'link[rel="canonical"]',
        '[class*="mt-"]', '[class*="mb-"]', '[class*="py-"]',
        '[data-radix-collection-item]', '[class*="radix-"]'
      ];
      s_list.forEach(function(s) {
        try { if (document.querySelector(s)) d_hits.push(s); } catch(e) {}
      });

      var m = document.querySelector('meta[name="generator"]');
      var ms = m ? m.getAttribute('content') || '' : '';

      msg('SIGNALS_COLLECTED', {
        js: j.concat(p),
        scripts: u,
        cookies: document.cookie.split(';').map(function(c){ return c.trim().split('=')[0]; }),
        dom: d_hits,
        meta: ms
      });
    } catch(e) {}
  }

  scan();
  window.addEventListener('load', scan);
  setTimeout(scan, 2000);
  setTimeout(scan, 5000);
})();
