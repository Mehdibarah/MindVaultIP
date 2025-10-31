# 🔧 Complete Fix: Vercel 404 Error

## مشکل

هنوز 404 از Vercel می‌گیرید حتی بعد از اعمال rewrites.

## علت‌های احتمالی

### 1. Deploy نشده
تغییرات `vercel.json` باید deploy شوند.

### 2. Rewrite Rule ترتیب مشکل دارد
Vercel rewrites باید قبل از API routes بررسی شوند.

### 3. Route Handler مشکل دارد
ممکن است یک route handler خاص مشکل ایجاد کند.

## راه‌حل کامل

### 1. بررسی vercel.json

مطمئن شوید `vercel.json` این است:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin-allow-popups"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "unsafe-none"
        },
        {
          "key": "Cross-Origin-Resource-Policy",
          "value": "cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

**نکته مهم:** `((?!api/).*)` یعنی همه routes به جز `/api/*` به `index.html` بروند.

### 2. Deploy

```bash
git add vercel.json
git commit -m "fix: SPA routing for all non-API routes"
git push
```

### 3. بررسی در Vercel Dashboard

1. Vercel Dashboard → Project → Settings
2. Check "Framework Preset" = **Vite** یا **Other**
3. Check "Build Command" = `npm run build`
4. Check "Output Directory" = `dist`

### 4. اگر هنوز مشکل دارد

ممکن است نیاز به `_redirects` file باشد:

**`public/_redirects`** (برای Vercel):
```
/*    /index.html   200
```

یا در `vite.config.js`:

```js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
}
```

## تست

1. Deploy کنید
2. URL مستقیم را تست کنید: `https://mindvaultip.com/proofs/xxx`
3. باید به SPA redirect شود (نه 404)

## Debug

اگر هنوز مشکل دارد، در Console بررسی کنید:

```javascript
// چک کن که route درست است:
console.log(window.location.pathname);

// چک کن که React Router درست کار می‌کند:
import { useLocation } from 'react-router-dom';
```

