# 🔍 Auto Error Monitor - راهنمای استفاده

## فایل‌های اضافه شده

### 1. ✅ `src/autoErrorMonitor.js`
سیستم خودکار مانیتورینگ خطا که:
- خطاهای JavaScript را catch می‌کند
- Promise rejections را track می‌کند
- Fetch/XHR failures را لاگ می‌کند
- نوار هشدار در بالای صفحه نمایش می‌دهد
- به `/api/log` ارسال می‌کند (اگر موجود باشد)

### 2. ✅ `api/log.js`
API endpoint برای دریافت و ذخیره لاگ‌های خطا (اختیاری)

### 3. ✅ `src/main.jsx`
Import اضافه شده در اولین خط

## فعال کردن Debug Mode

در Console مرورگر:

```javascript
// فعال کردن نوار هشدار و لاگ‌های تفصیلی:
localStorage.setItem('debug', '1');

// غیرفعال کردن:
localStorage.removeItem('debug');
```

## خطاهایی که catch می‌شوند

### 1. JavaScript Errors
```javascript
// مثال: ReferenceError
undefinedVariable.someMethod();
// → نوار قرمز: "JS Error: undefinedVariable is not defined"
// → لاگ: window.error
```

### 2. Unhandled Promise Rejections
```javascript
Promise.reject(new Error('Something went wrong'));
// → نوار قرمز: "Promise Rejection: Something went wrong"
// → لاگ: unhandledrejection
```

### 3. Fetch Failures
```javascript
fetch('/api/nonexistent');
// → نوار قرمز: "FETCH 404: /api/nonexistent"
// → لاگ: fetch.fail
```

### 4. XHR Failures
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/broken');
xhr.send();
// → نوار قرمز: "XHR 404: /api/broken"
// → لاگ: xhr.fail
```

### 5. Console Errors/Warnings
```javascript
console.error('Test error');
console.warn('Test warning');
// → لاگ: console.error / console.warn
```

### 6. Navigation Tracking
```javascript
history.pushState(null, '', '/new-page');
// → لاگ: navigation
```

## مشاهده لاگ‌ها

### در Console:
```javascript
// اگر debug mode فعال باشد:
[AUTO-ERR] window.error { type: 'window.error', time: '...', url: '...', data: {...} }
```

### در Server (Vercel Logs):
```
[LOG] window.error 2024-10-31T... https://mindvaultip.com/ {...}
```

### در Browser Network Tab:
- Request به `/api/log` (POST)
- Status: 200 OK

## مثال استفاده

### تست خطا:
```javascript
// در Console:
throw new Error('Test error');
// → نوار قرمز بالای صفحه: "JS Error: Test error"
```

### تست Fetch 404:
```javascript
fetch('/api/nonexistent-endpoint');
// → نوار قرمز: "FETCH 404: /api/nonexistent-endpoint"
```

## تنظیمات

### تغییر زمان نمایش نوار:
در `autoErrorMonitor.js`:
```javascript
clearTimeout(el.__t); el.__t = setTimeout(()=> el.remove(), 6000);
// تغییر 6000 به زمان دلخواه (میلی‌ثانیه)
```

### تغییر رنگ نوار:
```javascript
banner(`Error: ${msg}`, '#ff0000'); // قرمز
banner(`Warning: ${msg}`, '#ffa500'); // نارنجی
banner(`Info: ${msg}`, '#0066cc');  // آبی
```

## نکات مهم

1. **Performance**: مانیتور بسیار سبک است و performance را تحت تأثیر قرار نمی‌دهد
2. **Privacy**: فقط در debug mode نوار نمایش داده می‌شود
3. **Server Logs**: اگر `/api/log` موجود نباشد، فقط console log می‌کند (خطا نمی‌دهد)
4. **Non-blocking**: خطاها مانع اجرای کد نمی‌شوند

## مثال خروجی در Server

```
[LOG] fetch.fail 2024-10-31T12:34:56.789Z https://mindvaultip.com/createproof {
  url: '/api/createproof',
  status: 404,
  statusText: 'Not Found',
  body: '404: NOT_FOUND'
}
```

همه چیز آماده است! ✅

