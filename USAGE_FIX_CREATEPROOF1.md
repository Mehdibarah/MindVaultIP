# 🛠️ راهنمای استفاده از اسکریپت fix-createproof1.sh

## 📋 توضیحات

این اسکریپت به صورت خودکار فایل‌های frontend را پیدا می‌کند که `createproof1` را بدون `/api/` call می‌کنند و آن‌ها را اصلاح می‌کند.

---

## 🚀 استفاده

### روش 1: اجرای مستقیم

```bash
# در root پروژه:
./fix-createproof1.sh
```

### روش 2: با bash

```bash
bash fix-createproof1.sh
```

---

## 🔍 عملکرد اسکریپت

### 1. جستجو
- در پوشه `src/` برای فایل‌های `.js`, `.jsx`, `.ts`, `.tsx` جستجو می‌کند
- فایل‌هایی که `createproof` دارند را پیدا می‌کند

### 2. نمایش
- خطوط مشکل‌دار را نمایش می‌دهد
- برای هر فایل سوال می‌پرسد

### 3. اصلاح
- قبل از اصلاح، یک backup می‌سازد
- الگوهای زیر را اصلاح می‌کند:
  ```javascript
  // ❌ قبل:
  fetch('createproof1', ...)
  fetch('/createproof1', ...)
  axios.post('createproof1', ...)
  postJson('createproof1', ...)
  
  // ✅ بعد:
  fetch('/api/createproof1', ...)
  axios.post('/api/createproof1', ...)
  postJson('/api/createproof1', ...)
  ```

---

## 📂 Backup

اسکریپت قبل از هر تغییر، یک backup می‌سازد:

```
backups-YYYYMMDD-HHMMSS/
├── FileName.js.backup
├── Component.jsx.backup
└── ...
```

**بازگردانی:**
```bash
cp backups-YYYYMMDD-HHMMSS/FileName.js.backup ./src/path/to/FileName.js
```

---

## ✅ مراحل بعدی

بعد از اجرای اسکریپت:

1. **Rebuild:**
   ```bash
   rm -rf dist .next build
   npm run build
   ```

2. **Restart:**
   ```bash
   npm run dev
   ```

3. **Test:**
   - دکمه پرداخت را بزنید
   - در Network tab چک کنید که `/api/createproof1` call می‌شود

---

## 🎯 الگوهای اصلاح شده

اسکریپت این الگوها را پیدا و اصلاح می‌کند:

| قبل (اشتباه) | بعد (درست) |
|--------------|------------|
| `fetch('createproof1')` | `fetch('/api/createproof1')` |
| `fetch('/createproof1')` | `fetch('/api/createproof1')` |
| `fetch(\`createproof1\`)` | `fetch(\`/api/createproof1\`)` |
| `axios.post('createproof1')` | `axios.post('/api/createproof1')` |
| `postJson('createproof1')` | `postJson('/api/createproof1')` |
| `const url = 'createproof1'` | `const url = '/api/createproof1'` |

---

## ⚠️ نکات مهم

1. **Backup:** همیشه قبل از اجرا، پروژه را commit کنید:
   ```bash
   git add .
   git commit -m "backup before fix-createproof1"
   ```

2. **Review:** بعد از اصلاح، فایل‌های تغییر یافته را بررسی کنید:
   ```bash
   git diff src/
   ```

3. **Test:** حتماً بعد از rebuild، تست کنید

---

## 🔧 Troubleshooting

### خطا: "Permission denied"
```bash
chmod +x fix-createproof1.sh
```

### اسکریپت فایلی پیدا نمی‌کند
- احتمالاً مشکل در build شده است
- `rm -rf dist .next build` را اجرا کنید
- `npm run build` کنید

### تغییرات اعمال نشد
- فایل backup را بررسی کنید
- دستی اصلاح کنید
- یا از monkey patch در `index.html` استفاده کنید

---

## 📞 مثال استفاده

```bash
$ ./fix-createproof1.sh

🔍 جستجوی فایل‌های مشکل‌دار...

📂 جستجو در پوشه src/...

✓ فایل پیدا شد: src/components/Payment.jsx
خطوط مشکل‌دار:
  45:  fetch('createproof1', {
  67:  const url = '/createproof1';

آیا می‌خواهید این فایل را اصلاح کنید؟ (y/n/q): y
✓ بکاپ گرفته شد: backups-20241031-192300/Payment.jsx.backup
✓ فایل اصلاح شد!
تغییرات اعمال شده:
  45:  fetch('/api/createproof1', {
  67:  const url = '/api/createproof1';

════════════════════════════════════════
✓ خلاصه:
  فایل‌های پیدا شده: 1
  فایل‌های اصلاح شده: 1
  پوشه backup: ./backups-20241031-192300

🎉 اصلاحات انجام شد!
```

---

## ✅ چک‌لیست

- [ ] اسکریپت executable است (`chmod +x`)
- [ ] پروژه commit شده (backup)
- [ ] اسکریپت اجرا شده
- [ ] فایل‌های تغییر یافته بررسی شده
- [ ] Rebuild انجام شده
- [ ] تست انجام شده

---

## 🎉 نتیجه

با استفاده از این اسکریپت، تمام فایل‌های مشکل‌دار به صورت خودکار اصلاح می‌شوند و backup نیز ذخیره می‌شود.

