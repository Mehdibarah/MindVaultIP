# Fix: SPA Routing & Storage URL 404

## مشکل

وقتی فایل از Supabase Storage لینک می‌شود و باز می‌شود، Vercel 404 می‌دهد.

### علت

اگر storage URL به صورت relative path باشد (مثلاً `/proofs/...`):
- مرورگر فکر می‌کند این یک route داخلی SPA است
- Vercel سعی می‌کند این route را پیدا کند
- چون وجود ندارد → 404.html برمی‌گرداند

## راه‌حل

### 1. Vercel Rewrites (✅ انجام شد)

در `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

این باعث می‌شود تمام routes به `index.html` redirect شوند (SPA fallback).

### 2. استفاده از Absolute URL برای Storage

**✅ درست:**
```typescript
const { data } = supabase.storage.from('proofs').getPublicUrl(path);
const publicUrl = data.publicUrl; // https://xxx.supabase.co/storage/v1/...

// استفاده:
window.open(publicUrl, '_blank'); // ✅ Absolute URL
```

**❌ اشتباه:**
```typescript
const relativePath = `/proofs/${proofId}/${fileName}`;
window.open(relativePath, '_blank'); // ❌ Relative path → Vercel routing
```

### 3. Validation در PublicProof

کد اضافه شد که:
- چک می‌کند `ipfs_hash` (storage URL) با `http` شروع می‌شود
- فقط absolute URL ها را نمایش/استفاده می‌کند
- از `window.open()` با absolute URL استفاده می‌کند

## تغییرات اعمال شده

1. ✅ `vercel.json` - Rewrite rule برای تمام routes
2. ✅ `PublicProof.jsx` - Validation و استفاده از absolute URL
3. ✅ `CreateProof.jsx` - استفاده از `publicUrl` از Supabase SDK (absolute)

## نتیجه

- ✅ Storage URLs همیشه absolute هستند (از Supabase SDK)
- ✅ Vercel routes به `index.html` redirect می‌شوند
- ✅ فایل‌ها با absolute URL در tab جدید باز می‌شوند
- ✅ دیگر 404 از Vercel نمی‌دهد

## تست

بعد از deploy:
1. یک proof با فایل بساز
2. در PublicProof page → "View File" را بزن
3. باید فایل در tab جدید باز شود (نه 404)

