# Fix: Ledger HID Permission Error

## مشکل

```
TransportOpenUserCancelled: Failed to execute 'requestDevice' on 'HID': 
Must be handling a user gesture to show a permission request.
```

## علت

Ledger HID connector سعی می‌کند در زمان initialization صفحه، دستگاه Ledger را scan کند. این نیاز به user gesture (مثل کلیک) دارد که در startup وجود ندارد.

## راه‌حل اعمال شده

### 1. حذف Ledger HID Connector از Config

Ledger HID connector از `wagmiConfig` حذف شد تا در startup اجرا نشود.

### 2. Ledger Live از طریق WalletConnect

Ledger Live همچنان قابل دسترس است از طریق **WalletConnect** در Web3Modal:
- نیازی به HID permission ندارد
- از طریق WalletConnect protocol کار می‌کند
- در Web3Modal به عنوان featured wallet موجود است

### 3. Error Handling

Global error handlers در `main.jsx` برای جلوگیری از crash:
- خطاهای `TransportOpenUserCancelled` به صورت silent ignore می‌شوند

## نتیجه

✅ **Ledger HID connector حذف شد** - دیگر خطای HID permission در startup نیست

✅ **Ledger Live همچنان موجود است** - از طریق WalletConnect در Web3Modal

✅ **سایر wallet connectors بدون تغییر** - MetaMask, Coinbase Wallet, WalletConnect

## استفاده از Ledger

کاربران می‌توانند Ledger را از طریق:
1. **WalletConnect** در Web3Modal → Ledger Live
2. یا استفاده مستقیم از Ledger Live app

HID connector فقط برای direct USB connection بود که حالا حذف شده.

