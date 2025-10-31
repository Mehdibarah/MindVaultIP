# Fix: Storage URL 404 Error

## مشکل
- فایل آپلود می‌شود ✅
- تراکنش موفق می‌شود ✅  
- اما URL عمومی 404 می‌دهد ❌

## علت
نام فایل با فاصله و کاراکترهای خاص (مثلاً `WhatsApp Image 2025-08-21 at 05.04.24.jpeg`) نیاز به URL encoding دارد.

## راه‌حل اعمال شده

### 1. استفاده از SDK's getPublicUrl
SDK به صورت خودکار URL encoding انجام می‌دهد:

```typescript
// ✅ درست - SDK خودش encode می‌کند
const { data: urlData } = supabase.storage
  .from('proofs')
  .getPublicUrl(path);
const publicUrl = urlData.publicUrl;
```

### 2. Path Format
```typescript
const path = `${proofId}/${file.name}`;
// مثال: "abc123-uuid/WhatsApp Image 2025-08-21 at 05.04.24.jpeg"
```

### 3. URL Verification
بعد از آپلود، URL را verify می‌کنیم:

```typescript
const testResponse = await fetch(storageUrl, { method: 'HEAD' });
if (testResponse.ok) {
  console.log('✅ URL verified:', testResponse.status);
}
```

## تست در Console

```javascript
// 1. چک کردن URL:
const url = 'YOUR_PUBLIC_URL';
const r = await fetch(url, { method: 'HEAD' });
console.log('Status:', r.status); // باید 200 باشد
console.log('Content-Type:', r.headers.get('content-type'));

// 2. لیست فایل‌ها در proofId:
const { data: files } = await window.__sb.storage
  .from('proofs')
  .list('YOUR_PROOF_ID', { limit: 100 });
console.log('Files:', files);

// 3. اگر فایل پیدا نشد، جستجو:
const { data: search } = await window.__sb.storage
  .from('proofs')
  .list('', { limit: 100, search: 'WhatsApp' });
console.log('Search results:', search);
```

## چک‌های تکمیلی

### 1. Bucket Public است؟
- Supabase Dashboard → Storage → Buckets
- `proofs` باید **Public** باشد (badge نارنجی)

### 2. RLS Policy
```sql
-- Policy باید باشد:
CREATE POLICY "proofs_public_read" ON storage.objects
FOR SELECT USING (bucket_id = 'proofs');
```

### 3. اگر باز هم 404
- چک کن فایل واقعاً آپلود شده:
  ```javascript
  await window.__sb.storage.from('proofs').list('proofId');
  ```
- اگر فایل نیست → مشکل آپلود
- اگر فایل هست اما URL 404 می‌دهد → مشکل encoding (حل شد با SDK)

## تغییرات اعمال شده

1. ✅ `uploadProofFile()` حالا `publicUrl` را برمی‌گرداند (SDK encoded)
2. ✅ `CreateProof.jsx` از `publicUrl` از upload result استفاده می‌کند
3. ✅ URL verification بعد از آپلود اضافه شد
4. ✅ استفاده از SDK's `getPublicUrl()` به جای ساخت دستی URL

