# 🔍 راهنمای کامل: پیدا کردن و اصلاح خطای 404 برای createproof1

## ✅ تغییرات اعمال شده:

### 1. Proxy Endpoint اضافه شد
**فایل:** `api/createproof.js` (بدون "1")

این فایل تمام درخواست‌های `/api/createproof` را به `/api/createproof1` forward می‌کند.

**استفاده:**
```javascript
// هر دو کار می‌کنند:
fetch('/api/createproof', ...)  // ✅ حالا کار می‌کنه
fetch('/api/createproof1', ...) // ✅ همیشه کار می‌کرد
```

---

## 🔎 اگر هنوز خطا دارید:

### مرحله 1: جستجوی دقیق در Source Code

```bash
# در Terminal VSCode:
cd /Users/Home/Downloads/mind-vault-ip-copy-copy-dcccaa8f

# جستجوی گسترده:
grep -rn "createproof" src/ --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" | grep -i fetch
```

**یا در VSCode:**
1. `Cmd+Shift+F` (Mac) یا `Ctrl+Shift+F` (Windows)
2. جستجو: `fetch.*createproof`
3. Include files: `src/**/*.{js,jsx,ts,tsx}`

---

### مرحله 2: بررسی فایل‌های Build شده

اگر کد در source نیست، احتمالاً در build شده است:

```bash
# پیدا کردن فایل‌های build:
find dist -name "*.js" -exec grep -l "createproof" {} \; 2>/dev/null

# جستجو در build:
grep -n "createproof" dist/assets/*.js | head -10
```

---

### مرحله 3: Monkey Patch (راه‌حل موقت)

اگر نمی‌توانید کد را پیدا کنید، این را به `index.html` اضافه کنید:

```html
<!-- قبل از closing </body> tag -->
<script>
(function() {
  console.log('🔧 Installing fetch override for createproof1');
  
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Convert string or Request object to string
    const urlString = typeof url === 'string' ? url : url.url;
    
    // Check if it's createproof without /api/
    if (urlString && (
      urlString === 'createproof1' ||
      urlString === '/createproof1' ||
      urlString.endsWith('/createproof1') ||
      urlString.includes('/createproof1')
    )) {
      // Normalize to /api/createproof1
      const fixedUrl = urlString.startsWith('/') 
        ? '/api' + urlString 
        : '/api/' + urlString;
      
      console.log('🔄 Redirecting:', urlString, '→', fixedUrl);
      
      // Convert back to original type
      if (typeof url === 'string') {
        url = fixedUrl;
      } else {
        url = new Request(fixedUrl, url);
      }
    }
    
    return originalFetch(url, options);
  };
  
  console.log('✅ Fetch override installed');
})();
</script>
```

**محل قرارگیری:** در `index.html` قبل از `</body>`

---

### مرحله 4: بررسی Network Tab

1. **F12** → **Network** tab
2. **Clear** (🚫 icon)
3. دکمه پرداخت را بزنید
4. در Network tab، روی `createproof1` کلیک کنید
5. تب **Headers** را باز کنید

**چک کنید:**
- **Request URL:** چیست؟
- **Request Method:** POST است؟
- **Status Code:** 404 یا 200؟

**اگر Request URL این است:**
```
http://localhost:3000/createproof1        ← ❌ اشتباه (بدون /api/)
```

**باید این باشد:**
```
http://localhost:3000/api/createproof1   ← ✅ درست
```

---

## 🔧 مراحل اصلاح:

### گزینه 1: پیدا کردن و اصلاح کد (توصیه می‌شود)

1. **پیدا کردن فایل:**
   ```bash
   grep -rn "createproof" src/ | grep fetch
   ```

2. **اصلاح کد:**
   ```javascript
   // ❌ قبل:
   fetch('createproof1', ...)
   fetch('/createproof1', ...)
   
   // ✅ بعد:
   fetch('/api/createproof1', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(data)
   })
   ```

3. **Rebuild:**
   ```bash
   rm -rf dist .next build
   npm run build
   npm run dev
   ```

### گزینه 2: استفاده از Proxy Endpoint

از حالا به بعد می‌توانید از هر دو استفاده کنید:

```javascript
// هر دو کار می‌کنند:
fetch('/api/createproof', ...)   // ✅ جدید (proxy)
fetch('/api/createproof1', ...)  // ✅ مستقیم
```

### گزینه 3: Monkey Patch (موقت)

اگر نمی‌توانید کد را پیدا کنید، از monkey patch در `index.html` استفاده کنید (کد بالا).

---

## 📊 چک‌لیست Debug:

- [ ] Proxy endpoint `/api/createproof` ایجاد شد
- [ ] جستجوی `createproof` در source انجام شد
- [ ] Network tab بررسی شد
- [ ] Request URL چک شد
- [ ] Build جدید انجام شد (`rm -rf dist && npm run build`)
- [ ] Browser cache پاک شد (Ctrl+Shift+R)
- [ ] Monkey patch اضافه شد (اگر لازم)

---

## 🎯 تست نهایی:

```bash
# تست Proxy:
curl -X POST http://localhost:3000/api/createproof \
  -H "Content-Type: application/json" \
  -d '{"transactionHash":"0xtest","userAddress":"0xtest"}'

# تست مستقیم:
curl -X POST http://localhost:3000/api/createproof1 \
  -H "Content-Type: application/json" \
  -d '{"transactionHash":"0xtest","userAddress":"0xtest"}'
```

**هر دو باید 200 OK بدهند.**

---

## 💡 اگر هنوز مشکل دارید:

این اطلاعات را ارسال کنید:

1. **Network Tab Screenshot:**
   - Request URL کامل
   - Status Code
   - Request Headers

2. **Console Output:**
   - تمام خطاهای console
   - Stack trace کامل

3. **Source Code:**
   - فایل‌هایی که `createproof` دارند
   - خطوط مربوطه (با context)

---

## ✅ نتیجه:

با ایجاد proxy endpoint `/api/createproof`، حالا هر دو مسیر کار می‌کنند:
- `/api/createproof` → proxy به `/api/createproof1`
- `/api/createproof1` → endpoint اصلی

اگر هنوز مشکل دارید، کد monkey patch را در `index.html` اضافه کنید.

