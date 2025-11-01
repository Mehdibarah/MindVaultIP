// src/autoHealer.js
// Auto-healer for common errors: retry, URL normalization, fallbacks, safe JSON parsing, ethers fixes
(() => {
  // ===== config =====
  const CFG = {
    API_BASE: location.origin,              // برای /api/*
    RETRY_STATUS: [408, 425, 429, 500, 502, 503, 504],
    RETRIES: 3,
    BASE_CHAIN_ID: 8453,                    // Base mainnet
    FALLBACK_FEE_WEI: '1000000000000000',   // 0.001 ETH = 1e15 wei
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const isApi = (u) => /^\/?api\//.test(u.replace(location.origin,''));
  const norm = (u) => {
    // اگر /api/foo باشد به origin بچسبان
    if (u.startsWith('/')) return new URL(u, CFG.API_BASE).toString();
    try { new URL(u); return u; } catch { return new URL('/' + u, CFG.API_BASE).toString(); }
  };

  // ===== fetch healer =====
  const rawFetch = window.fetch.bind(window);
  window.fetch = async function healedFetch(input, init={}) {
    let url = input instanceof Request ? input.url : String(input||'');
    const opts = input instanceof Request ? input : init;

    // نرمال‌سازی /api/*
    if (isApi(url)) url = norm(url);

    let lastErr, res;
    for (let attempt = 0; attempt <= CFG.RETRIES; attempt++) {
      try {
        res = await rawFetch(url, {
          ...opts,
          headers: { 'Accept': 'application/json, text/plain,*/*', ...(opts.headers||{}) }
        });

        // 404 روی API: تلاش به fallback بدون پوشه‌ها (ورسل فانکشن‌ها فایل‌محورند)
        if (res.status === 404 && isApi(url)) {
          const u = new URL(url);
          const parts = u.pathname.split('/').filter(Boolean); // ['api','foo','bar']
          if (parts.length > 2) {
            // /api/foo/bar -> /api/bar
            const fallback = new URL('/api/' + parts.at(-1), u.origin).toString();
            res = await rawFetch(fallback, { ...opts, headers: { ...(opts.headers||{}) } });
            if (res.ok) return res;
          }
        }

        // ریترا‌ی برای وضعیت‌های موقتی
        if (!res.ok && CFG.RETRY_STATUS.includes(res.status) && attempt < CFG.RETRIES) {
          await sleep(300 * Math.pow(2, attempt));
          continue;
        }
        return res;
      } catch (e) {
        lastErr = e;
        if (attempt < CFG.RETRIES) { await sleep(300 * Math.pow(2, attempt)); continue; }
        throw e;
      }
    }
    throw lastErr ?? new Error('fetch failed');
  };

  // ===== JSON امن =====
  window.safeJson = async (res) => {
    try { return await res.json(); } catch {
      const txt = await res.text().catch(()=> '');
      return { ok:false, parseError:true, status: res.status, body: txt };
    }
  };

  // ===== ethers.js self-heal (اختیاری) =====
  window.ethHeal = {
    async ensureBaseNetwork() {
      const eth = window.ethereum;
      if (!eth) return;
      const chainIdHex = await eth.request({ method: 'eth_chainId' }).catch(()=>null);
      const chainId = chainIdHex ? parseInt(chainIdHex, 16) : null;
      if (chainId !== CFG.BASE_CHAIN_ID) {
        try {
          await eth.request({ method:'wallet_switchEthereumChain', params:[{ chainId: '0x' + CFG.BASE_CHAIN_ID.toString(16) }] });
        } catch {}
      }
    },
    // تبدیل‌های BigNumber اشتباه به ورودی معتبر
    toWeiSafe(v) {
      try {
        // اجازه بده عدد، رشته یا BigInt بیاید
        if (typeof v === 'bigint') return v.toString();
        const s = String(v).trim();
        if (/^\d+$/.test(s)) return s;
        // اگر کاربر 0.001 زد
        if (/^\d*\.?\d+$/.test(s)) {
          // 0.001 ETH -> wei
          return BigInt(Math.round(parseFloat(s) * 1e18)).toString();
        }
      } catch {}
      return CFG.FALLBACK_FEE_WEI;
    }
  };

  // ===== واکنش به خطاهای قبلی و تلاش برای ترمیم =====
  window.addEventListener('unhandledrejection', (e) => {
    const msg = String(e.reason?.message || e.reason || '');
    // BigNumber: cannot call constructor directly
    if (/BigNumber|UNSUPPORTED_OPERATION/.test(msg)) {
      // پرچم سراسری برای فرانت‌اند
      window.__FEE_WEI_OVERRIDE__ = CFG.FALLBACK_FEE_WEI;
      console.warn('[autoHealer] BigNumber issue detected; using fallback fee', CFG.FALLBACK_FEE_WEI);
    }
    // Could not read fee -> روی UI از ثابت استفاده شود
    if (/Could not read fee|fee not readable/i.test(msg)) {
      window.__USE_FIXED_FEE__ = true;
      window.__FEE_WEI_OVERRIDE__ = CFG.FALLBACK_FEE_WEI;
      console.warn('[autoHealer] Fee read failed; forcing fixed fee', CFG.FALLBACK_FEE_WEI);
    }
  });

  // اگر صفحه SPA به مسیر 404 رفته، به روت برگردان و مسیر را به کوئری اضافه کن (fallback سمت کلاینت)
  if (typeof document !== 'undefined' && !location.pathname.startsWith('/api/')) {
    fetch('/__nonexistent__.txt').catch(()=>{}); // warm-up
    // اگر HTML 404 ورسل روی داکیومنت فعلی باشد، نشانه‌اش title "404: NOT_FOUND" است
    const isVercel404 = () => document.title?.includes('404') && document.body?.innerText?.includes('NOT_FOUND');
    if (isVercel404()) {
      const p = location.pathname.replace(/^\//,'');
      const q = location.search ? '&' + location.search.slice(1) : '';
      location.replace('/?p=' + encodeURIComponent(p) + q + location.hash);
    }
  }

  console.info('[autoHealer] ready');
})();

