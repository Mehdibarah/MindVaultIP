// src/autoErrorMonitor.js
// فعال/غیرفعال کردن: localStorage.setItem('debug','1')  /  removeItem('debug')
(() => {
  const ON = localStorage.getItem('debug') === '1';
  const now = () => new Date().toISOString();
  const send = async (type, data) => {
    const payload = { type, time: now(), url: location.href, ua: navigator.userAgent, data };
    try {
      // اگر اندپوینت وجود نداشته باشد، fetch شکست می‌خورد؛ اشکالی ندارد.
      await fetch('/api/log', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    } catch (_) {}
    if (ON) console.info('[AUTO-ERR]', type, payload);
  };

  // نوار هشدار کوچک بالای صفحه
  const banner = (msg, color = '#e11d48') => {
    if (!ON) return;
    let el = document.getElementById('__auto_err_banner');
    if (!el) {
      el = Object.assign(document.createElement('div'), { id:'__auto_err_banner' });
      Object.assign(el.style, {
        position:'fixed', top:0, left:0, right:0, zIndex:999999,
        color:'#fff', padding:'6px 10px', font:'12px/1.4 ui-mono, monospace',
        background: color, boxShadow:'0 2px 8px rgba(0,0,0,.2)'
      });
      document.body.appendChild(el);
    }
    el.style.background = color;
    el.textContent = msg;
    clearTimeout(el.__t); el.__t = setTimeout(()=> el.remove(), 6000);
  };

  // 1) خطاهای sync
  window.addEventListener('error', (e) => {
    send('window.error', { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno, stack: e.error?.stack });
    banner(`JS Error: ${e.message}`);
  });

  // 2) Promise های بدون catch
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason?.message || String(e.reason);
    send('unhandledrejection', { reason, stack: e.reason?.stack });
    banner(`Promise Rejection: ${reason}`);
  });

  // 3) لاگ کردن fetch غیرموفق
  const _fetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const url = args[0] instanceof Request ? args[0].url : String(args[0] || '');
    try {
      const res = await _fetch(...args);
      if (!res.ok) {
        const txt = await res.clone().text().catch(()=> '');
        send('fetch.fail', { url, status: res.status, statusText: res.statusText, body: txt.slice(0, 300) });
        if (res.status === 404) banner(`FETCH 404: ${url}`);
      }
      return res;
    } catch (err) {
      send('fetch.error', { url, message: err.message, stack: err.stack });
      banner(`FETCH error: ${url}`);
      throw err;
    }
  };

  // 4) XHR غیرموفق
  const XO = XMLHttpRequest.prototype.open;
  const XS = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, url, ...rest) { this.__url = url; return XO.call(this, m, url, ...rest); };
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', () => {
      if (this.status >= 400) {
        send('xhr.fail', { url: this.__url, status: this.status, body: (this.responseText||'').slice(0,300) });
        if (this.status === 404) banner(`XHR 404: ${this.__url}`);
      }
    });
    this.addEventListener('error', () => send('xhr.error', { url: this.__url }));
    return XS.apply(this, args);
  };

  // 5) console.warn/error هم به گزارش اضافه شود
  ['error','warn'].forEach(level => {
    const orig = console[level].bind(console);
    console[level] = (...args) => { try { send(`console.${level}`, { args: args.map(a => String(a)).join(' ') }); } catch(_){}; orig(...args); };
  });

  // 6) ناوبری‌های SPA برای 404 های صفحه
  const push = history.pushState.bind(history);
  const rep  = history.replaceState.bind(history);
  function navHook(fn) {
    return function(...a){ const r = fn(...a); send('navigation', { path: location.pathname }); return r; };
  }
  history.pushState = navHook(push); history.replaceState = navHook(rep);

  // 7) یک سلامت ساده
  send('boot', { ok: true });
})();

