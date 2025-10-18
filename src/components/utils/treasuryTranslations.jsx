
export const translations = {
  en: {
    // Header
    title: 'Platform Treasury Management',
    subtitle: 'Ideon Cerebrum (IDN) Token Distribution & Treasury Oversight',
    note: 'Note: This document describes the administrative Treasury Dashboard used by MindVaultIP’s core team and DAO governance. General users do not have direct access to these controls.',

    // Overview
    overviewTitle: 'Overview',
    overviewCols: { col1: 'Section', col2: 'Description' },
    overviewPurpose: 'Purpose',
    overviewPurposeDesc: 'Manage, monitor, and automate the distribution of Ideon Cerebrum (IDN) rewards and platform reserves. All transactions are executed via smart contracts on the Base Network to ensure full transparency and verifiability.',
    overviewAccess: 'Access Level',
    overviewAccessDesc: 'Admin only (connected wallet must match Treasury contract owner).',
    overviewStatus: 'Status',
    overviewStatusDesc: '✅ Active',

    // Balance Summary
    balanceTitle: 'Treasury Balance Summary',
    balanceCols: { col1: 'Metric', col2: 'Description', col3: 'Example Value' },
    balanceCurrent: 'Current Treasury Balance',
    balanceCurrentDesc: 'Total IDN tokens currently held in the platform treasury wallet.',
    balanceCurrentVal: '23,000,000 IDN',
    balanceDistributed: 'Total Rewards Distributed',
    balanceDistributedDesc: 'Total tokens distributed as rewards since launch.',
    balanceDistributedVal: '12,350 IDN',
    balanceRewardRate: 'Reward per Approved Proof',
    balanceRewardRateDesc: 'Fixed reward for each proof approved by the AI Council.',
    balanceRewardRateVal: '1 IDN / Proof',
    balanceThreshold: 'Minimum Balance Threshold',
    balanceThresholdDesc: 'Treasury alert level to trigger notifications or auto-replenishment.',
    balanceThresholdVal: '10,000 IDN',
    balanceStatus: 'Balance Status',
    balanceStatusDesc: 'Indicates whether distribution is currently active.',
    balanceStatusVal: '🟢 Active / 🔴 Paused',

    // Fund Management
    fundTitle: 'Fund Management Controls',
    fundCols: { col1: 'Action', col2: 'Function', col3: 'Notes' },
    fundAdd: 'Add Funds',
    fundAddDesc: 'Transfer IDN from backup or secondary wallet to Treasury.',
    fundAddNotes: 'Requires multi-signature confirmation.',
    fundRemove: 'Remove Funds',
    fundRemoveDesc: 'Withdraw tokens for manual redistribution or emergency liquidity.',
    fundRemoveNotes: 'Admin confirmation + DAO log record.',
    fundAuto: 'Auto-Replenish',
    fundAutoDesc: 'Enable automatic top-up from backup wallet when treasury < threshold.',
    fundAutoNotes: 'Optional; disabled by default.',

    // Reward Logic
    rewardTitle: 'Reward Distribution Logic',
    rewardCols: { col1: 'Parameter', col2: 'Function', col3: 'Example' },
    rewardTrigger: 'Trigger',
    rewardTriggerDesc: 'Approved proof from AI Council → event emitted → contract sends reward.',
    rewardTriggerEg: 'Smart contract auto-call',
    rewardAmount: 'Reward Amount',
    rewardAmountDesc: 'Defined in Treasury settings (default: 1 IDN / proof).',
    rewardAmountEg: 'Adjustable',
    rewardCooldown: 'Cooldown Timer',
    rewardCooldownDesc: 'Prevents double rewards for same proof ID.',
    rewardCooldownEg: '24h',
    rewardTxType: 'Transaction Type',
    rewardTxTypeDesc: 'On-chain (Base Network)',
    rewardTxTypeEg: 'Hash logged in DAO registry',

    // Notifications
    notifTitle: 'Notification & Security Settings',
    notifSetting1: 'Email / Wallet Notifications',
    notifSetting1Desc: 'Sends admin alert when balance < threshold.',
    notifSetting2: '2FA Required for Fund Removal',
    notifSetting2Desc: 'Optional multi-layer security for withdrawals.',
    notifSetting3: 'Audit Trail',
    notifSetting3Desc: 'All add/remove/reward events recorded in on-chain log with timestamp and wallet address.',
    notifSetting4: 'DAO Transparency',
    notifSetting4Desc: 'All treasury changes visible to DAO once governance activates (2027).',

    // Activity Log
    logTitle: 'Recent Activity Log',
    logNote: 'Note: The following records are sample demonstration entries to illustrate the Treasury Dashboard structure. Actual on-chain transactions will begin after the official launch and integration of the Ideon Cerebrum (IDN) token in 2026.',
    logCols: { col1: 'Timestamp', col2: 'Action', col3: 'Amount (IDN)', col4: 'Wallet', col5: 'Status', col6: 'TX Hash' },

    // Enhancements
    enhanceTitle: 'Future Enhancements (Planned)',
    enhanceCols: { col1: 'Feature', col2: 'Description', col3: 'ETA' },
    enhanceFeature1: 'Dynamic Reward Scaling',
    enhanceFeature1Desc: 'Adjust reward rates based on idea quality (AI rating > 85%).',
    enhanceFeature1Eta: '2026 Q2',
    enhanceFeature2: 'Staking / Liquidity Pools',
    enhanceFeature2Desc: 'Allow users to stake IDN tokens or provide liquidity to earn rewards.',
    enhanceFeature2Eta: '2028',
    enhanceFeature3: 'DAO Governance Integration',
    enhanceFeature3Desc: 'Enable treasury management decisions (e.g., changing reward rates) to be controlled via DAO voting.',
    enhanceFeature3Eta: '2027',

    // Smart Contracts
    contractTitle: 'Smart Contract Integration',
    contractCols: { col1: 'Component', col2: 'Address', col3: 'Function' },
    contractComp1: 'Treasury Contract',
    contractAddr1: '0x981eDEe0A3721d049D7343C04363fb38402F4BeC',
    contractFunc1: 'Holds and distributes IDN tokens.',
    contractComp2: 'AI Proof Validation Contract',
    contractAddr2: '(connected via event listener)',
    contractFunc2: 'Triggers reward distribution.',
    contractComp3: 'DAO Treasury Governance (future)',
    contractAddr3: '(TBD — post-2027)',
    contractFunc3: 'Community oversight and proposal voting.',

    // Summary
    summaryTitle: 'Summary',
    summaryIntro: 'The Platform Treasury serves as the economic backbone of MindVaultIP — ensuring that creativity is continuously rewarded, transparently and sustainably.',
    summaryGuarantees: 'It guarantees:',
    summaryPoint1: 'Complete transparency and on-chain accountability',
    summaryPoint2: 'Automatic, traceable rewards for verified innovators',
    summaryPoint3: 'Real-time monitoring of platform reserves',
    summaryPoint4: 'Seamless transition to DAO-based governance in 2027',

    // Tagline
    tagline: 'MindVaultIP Treasury System — Powering the Economy of Human Creativity.'
  },
  fa: {
    title: 'مدیریت خزانه‌داری پلتفرم',
    subtitle: 'نظارت بر توزیع توکن Ideon Cerebrum (IDN) و خزانه‌داری',
    note: 'توجه: این سند، داشبورد مدیریتی خزانه‌داری را توصیف می‌کند که توسط تیم اصلی MindVaultIP و حاکمیت DAO استفاده می‌شود. کاربران عادی به این کنترل‌ها دسترسی مستقیم ندارند.',

    overviewTitle: 'بررسی اجمالی',
    overviewCols: { col1: 'بخش', col2: 'توضیحات' },
    overviewPurpose: 'هدف',
    overviewPurposeDesc: 'مدیریت، نظارت و خودکارسازی توزیع پاداش‌های Ideon Cerebrum (IDN) و ذخایر پلتفرم. تمام تراکنش‌ها از طریق قراردادهای هوشمند روی شبکه Base برای تضمین شفافیت کامل و قابلیت تأیید اجرا می‌شوند.',
    overviewAccess: 'سطح دسترسی',
    overviewAccessDesc: 'فقط ادمین (کیف پول متصل باید با مالک قرارداد خزانه‌داری مطابقت داشته باشد).',
    overviewStatus: 'وضعیت',
    overviewStatusDesc: '✅ فعال',

    balanceTitle: 'خلاصه موجودی خزانه‌داری',
    balanceCols: { col1: 'معیار', col2: 'توضیحات', col3: 'مقدار نمونه' },
    balanceCurrent: 'موجودی فعلی خزانه‌داری',
    balanceCurrentDesc: 'مجموع توکن‌های IDN که در حال حاضر در کیف پول خزانه‌داری پلتفرم نگهداری می‌شود.',
    balanceCurrentVal: '۲۳,۰۰۰,۰۰۰ IDN',
    balanceDistributed: 'مجموع پاداش‌های توزیع‌شده',
    balanceDistributedDesc: 'مجموع توکن‌های توزیع‌شده به عنوان پاداش از زمان راه‌اندازی.',
    balanceDistributedVal: '۱۲,۳۵۰ IDN',
    balanceRewardRate: 'پاداش به ازای هر گواهی تأییدشده',
    balanceRewardRateDesc: 'پاداش ثابت برای هر گواهی تأییدشده توسط شورای هوش مصنوعی.',
    balanceRewardRateVal: '۱ IDN / گواهی',
    balanceThreshold: 'آستانه حداقل موجودی',
    balanceThresholdDesc: 'سطح هشدار خزانه‌داری برای فعال کردن اعلان‌ها یا پر کردن مجدد خودکار.',
    balanceThresholdVal: '۱۰,۰۰۰ IDN',
    balanceStatus: 'وضعیت موجودی',
    balanceStatusDesc: 'نشان می‌دهد که آیا توزیع در حال حاضر فعال است یا خیر.',
    balanceStatusVal: '🟢 فعال / 🔴 متوقف',

    fundTitle: 'کنترل‌های مدیریت صندوق',
    fundCols: { col1: 'اقدام', col2: 'عملکرد', col3: 'یادداشت‌ها' },
    fundAdd: 'افزودن وجوه',
    fundAddDesc: 'انتقال IDN از کیف پول پشتیبان یا ثانویه به خزانه‌داری.',
    fundAddNotes: 'نیاز به تأیید چندامضایی دارد.',
    fundRemove: 'برداشت وجوه',
    fundRemoveDesc: 'برداشت توکن‌ها برای توزیع مجدد دستی یا نقدینگی اضطراری.',
    fundRemoveNotes: 'تأیید ادمین + ثبت لاگ در DAO.',
    fundAuto: 'پر کردن مجدد خودکار',
    fundAutoDesc: 'فعال کردن پر کردن خودکار از کیف پول پشتیبان هنگامی که موجودی خزانه‌داری کمتر از آستانه باشد.',
    fundAutoNotes: 'اختیاری؛ به طور پیش‌فرض غیرفعال است.',

    rewardTitle: 'منطق توزیع پاداش',
    rewardCols: { col1: 'پارامتر', col2: 'عملکرد', col3: 'مثال' },
    rewardTrigger: 'محرک',
    rewardTriggerDesc: 'گواهی تأییدشده از شورای هوش مصنوعی ← رویداد منتشر می‌شود ← قرارداد پاداش را ارسال می‌کند.',
    rewardTriggerEg: 'فراخوانی خودکار قرارداد هوشمند',
    rewardAmount: 'مقدار پاداش',
    rewardAmountDesc: 'در تنظیمات خزانه‌داری تعریف شده است (پیش‌فرض: ۱ IDN / گواهی).',
    rewardAmountEg: 'قابل تنظیم',
    rewardCooldown: 'زمان خنک‌سازی',
    rewardCooldownDesc: 'از پاداش مضاعف برای یک شناسه گواهی جلوگیری می‌کند.',
    rewardCooldownEg: '۲۴ ساعت',
    rewardTxType: 'نوع تراکنش',
    rewardTxTypeDesc: 'روی زنجیره (شبکه Base)',
    rewardTxTypeEg: 'هش در رجیستری DAO ثبت می‌شود',

    notifTitle: 'تنظیمات اعلان و امنیت',
    notifSetting1: 'اعلان‌های ایمیل / کیف پول',
    notifSetting1Desc: 'هنگامی که موجودی کمتر از آستانه باشد، هشدار ادمین ارسال می‌کند.',
    notifSetting2: 'نیاز به 2FA برای برداشت وجوه',
    notifSetting2Desc: 'امنیت چندلایه‌ای اختیاری برای برداشت‌ها.',
    notifSetting3: 'ردیابی حسابرسی',
    notifSetting3Desc: 'تمام رویدادهای افزودن/حذف/پاداش در لاگ آن-چین با مهر زمانی و آدرس کیف پول ثبت می‌شود.',
    notifSetting4: 'شفافیت DAO',
    notifSetting4Desc: 'تمام تغییرات خزانه‌داری پس از فعال‌سازی حاکمیت (۲۰۲۷) برای DAO قابل مشاهده است.',

    logTitle: 'لاگ فعالیت‌های اخیر',
    logNote: 'توجه: رکوردهای زیر نمونه‌های نمایشی برای تشریح ساختار داشبورد خزانه‌داری هستند. تراکنش‌های واقعی روی زنجیره (on-chain) پس از راه‌اندازی رسمی و یکپارچه‌سازی توکن Ideon Cerebrum (IDN) در سال ۲۰۲۶ آغاز خواهند شد.',
    logCols: { col1: 'مهر زمانی', col2: 'اقدام', col3: 'مقدار (IDN)', col4: 'کیف پول', col5: 'وضعیت', col6: 'هش تراکنش' },

    enhanceTitle: 'بهبودهای آینده (برنامه‌ریزی‌شده)',
    enhanceCols: { col1: 'ویژگی', col2: 'توضیحات', col3: 'زمان تخمینی' },
    enhanceFeature1: 'مقیاس‌بندی پویای پاداش',
    enhanceFeature1Desc: 'تنظیم نرخ پاداش بر اساس کیفیت ایده (رتبه هوش مصنوعی > ۸۵٪).',
    enhanceFeature1Eta: 'Q2 ۲۰۲۶',
    enhanceFeature2: 'خزانه‌داری متصل به DAO',
    enhanceFeature2Desc: 'رأی‌گیری DAO در مورد نرخ‌های پاداش و تخصیص بودجه.',
    enhanceFeature2Eta: '۲۰۲۷',
    enhanceFeature3: 'داشبورد تحلیلی لحظه‌ای',
    enhanceFeature3Desc: 'نمای گرافیکی از جریان پاداش، روندهای موجودی و تراکنش‌ها.',
    enhanceFeature3Eta: 'Q1 ۲۰۲۶',
    enhanceFeature4: 'اکسپلورر عمومی خزانه‌داری',
    enhanceFeature4Desc: 'نمای فقط-خواندنی برای شفافیت (برای کاربران).',
    enhanceFeature4Eta: 'Q3 ۲۰۲۶',

    contractTitle: 'یکپارچه‌سازی قرارداد هوشمند',
    contractCols: { col1: 'جزء', col2: 'آدرس', col3: 'عملکرد' },
    contractComp1: 'قرارداد خزانه‌داری',
    contractAddr1: '0x981eDEe0A3721d049D7343C04363fb38402F4BeC',
    contractFunc1: 'نگهداری و توزیع توکن‌های IDN.',
    contractComp2: 'قرارداد اعتبارسنجی گواهی توسط هوش مصنوعی',
    contractAddr2: '(از طریق شنونده رویداد متصل است)',
    contractFunc2: 'توزیع پاداش را فعال می‌کند.',
    contractComp3: 'حاکمیت خزانه‌داری DAO (آینده)',
    contractAddr3: '(متعاقباً اعلام می‌شود — پس از ۲۰۲۷)',
    contractFunc3: 'نظارت جامعه و رأی‌گیری پیشنهادات.',

    summaryTitle: 'ملخص',
    summaryIntro: 'خزانه‌داری پلتفرم به عنوان ستون فقرات اقتصادی MindVaultIP عمل می‌کند — تضمین می‌کند که خلاقیت به طور مداوم، شفاف و پایدار پاداش داده می‌شود.',
    summaryGuarantees: 'این سیستم تضمین می‌کند:',
    summaryPoint1: 'شفافیت کامل و پاسخگویی آن-چین',
    summaryPoint2: 'پاداش‌های خودکار و قابل ردیابی برای نوآوران تأییدشده',
    summaryPoint3: 'نظارت لحظه‌ای بر ذخایر پلتفرم',
    summaryPoint4: 'انتقال یکپارچه به حاکمیت مبتنی بر DAO در سال ۲۰۲۷',

    tagline: 'سیستم خزانه‌داری MindVaultIP — قدرت‌بخش اقتصاد خلاقیت انسان.'
  },
  ru: {
    title: "Управление Казначейством Платформы",
    subtitle: "Этот документ описывает, как Казначейство Платформы MindVaultIP управляет распределением токенов Ideon Cerebrum (IDN).",
    note: "Это технический обзор для прозрачности. Конечные пользователи напрямую не взаимодействуют с этим кошельком. Вознаграждения автоматически зачисляются на кошельки пользователей после утверждения.",
    overviewTitle: "1. Обзор Казначейства",
    overviewCols: { col1: "Компонент", col2: "Описание" },
    overviewPurpose: "Цель",
    overviewPurposeDesc: "Для автоматического вознаграждения создателей за утвержденные Доказательства и компенсации экспертам за обзоры.",
    overviewAccess: "Доступ",
    overviewAccessDesc: "Контролируется исключительно автоматизированными смарт-контрактами. Ни один человек не имеет прямого доступа к выводу средств.",
    overviewStatus: "Текущий статус",
    overviewStatusDesc: "Активно и полностью профинансировано.",
    balanceTitle: "2. Баланс Казначейства и Распределение",
    balanceCols: { col1: "Метрика", col2: "Описание", col3: "Текущее значение" },
    balanceCurrent: "Текущий баланс",
    balanceCurrentDesc: "Общее количество токенов IDN, находящихся в кошельке Казначейства.",
    balanceCurrentVal: "5 000 000 IDN",
    balanceDistributed: "Всего распределено",
    balanceDistributedDesc: "Совокупное количество токенов IDN, выданных в качестве вознаграждений.",
    balanceDistributedVal: "100 000 IDN (приблизительно)",
    balanceRewardRate: "Ставка вознаграждения за Доказательство",
    balanceRewardRateDesc: "Количество токенов IDN, выданных за каждое успешно утвержденное Доказательство.",
    balanceRewardRateVal: "1 IDN",
    balanceThreshold: "Порог низкого баланса",
    balanceThresholdDesc: "Баланс, при котором срабатывает оповещение о необходимости пополнения.",
    balanceThresholdVal: "100 000 IDN",
    balanceStatus: "Статус баланса",
    balanceStatusDesc: "Текущее состояние баланса относительно порога.",
    balanceStatusVal: "✅ Здоровый",
    fundTitle: "3. Управление средствами",
    fundCols: { col1: "Действие", col2: "Описание", col3: "Примечания" },
    fundAdd: "Добавление средств",
    fundAddDesc: "Средства могут быть добавлены только из Резервного кошелька MindVaultIP.",
    fundAddNotes: "Транзакции требуют мультиподписи от основных разработчиков.",
    fundRemove: "Снятие средств",
    fundRemoveDesc: "Снятие средств невозможно, кроме как через автоматизированные выплаты вознаграждений.",
    fundRemoveNotes: "Это обеспечивает защиту средств от несанкционированного доступа.",
    fundAuto: "Автоматическое пополнение",
    fundAutoDesc: "В настоящее время не реализовано, но запланировано на 2028 год, когда будет активирован механизм управления DAO.",
    fundAutoNotes: "DAO будет голосовать за пополнение Казначейства из Резерва.",
    rewardTitle: "4. Механизм вознаграждения",
    rewardCols: { col1: "Процесс", col2: "Описание", col3: "Пример" },
    rewardTrigger: "Триггер транзакции",
    rewardTriggerDesc: "Смарт-контракт инициирует транзакцию, когда Доказательство помечается как 'ai_approved' или 'expert_approved'.",
    rewardTriggerEg: "Пользователь представляет Доказательство → ИИ одобряет → Транзакция вознаграждения инициирована.",
    rewardAmount: "Сумма вознаграждения",
    rewardAmountDesc: "Фиксированная сумма (в настоящее время 1 IDN) отправляется на кошелек владельца Доказательства.",
    rewardAmountEg: "1 IDN переводится на `0xabc...`",
    rewardCooldown: "Период охлаждения",
    rewardCooldownDesc: "Чтобы предотвратить спам, на один кошелек можно получить только одно вознаграждение за 24 часа.",
    rewardCooldownEg: "Второе утвержденное Доказательство в тот же день не получит немедленного вознаграждения.",
    rewardTxType: "Тип транзакции",
    rewardTxTypeDesc: "Внутренняя транзакция смарт-контракта в сети Base. Экономично и быстро.",
    rewardTxTypeEg: "Низкие затраты на газ, подтверждение за ~2 секунды.",
    notifTitle: "5. Уведомления и оповещения",
    notifSetting1: "Успешное вознаграждение",
    notifSetting1Desc: "Пользователь получает уведомление в приложении о получении вознаграждения.",
    notifSetting2: "Низкий баланс Казначейства",
    notifSetting2Desc: "Внутреннее оповещение отправляется команде разработчиков, когда баланс опускается ниже порога.",
    notifSetting3: "Сбой транзакции",
    notifSetting3Desc: "Если транзакция вознаграждения не удается, она ставится в очередь на повторную попытку, и отправляется внутреннее оповещение.",
    notifSetting4: "Пополнение Казначейства",
    notifSetting4Desc: "Публичное объявление делается в Discord и X при пополнении Казначейства.",
    logTitle: "6. Журнал транзакций",
    logNote: "Это смоделированный журнал для демонстрационных целей. Фактические транзакции можно просмотреть в обозревателе блоков сети Base.",
    logCols: { col1: "Временная метка", col2: "Действие", col3: "Сумма (IDN)", col4: "Адрес кошелька", col5: "Статус", col6: "Хэш транзакции" },
    enhanceTitle: "7. Будущие улучшения",
    enhanceCols: { col1: "Функция", col2: "Описание", col3: "Ожидается" },
    enhanceFeature1: "Динамические вознаграждения",
    enhanceFeature1Desc: "Суммы вознаграждений будут варьироваться в зависимости от оценки ИИ и категории Доказательства.",
    enhanceFeature1Eta: "Q2 2026",
    enhanceFeature2: "Вознаграждения за стейкинг",
    enhanceFeature2Desc: "Пользователи смогут размещать IDN для получения части сборов платформы.",
    enhanceFeature2Eta: "Q4 2026",
    enhanceFeature3: "Управление через DAO",
    enhanceFeature3Desc: "Держатели IDN будут голосовать за изменения в механизме вознаграждений.",
    enhanceFeature3Eta: "2027",
    enhanceFeature4: "Вознаграждения для экспертов",
    enhanceFeature4Desc: "Автоматизированные выплаты экспертам за завершенные обзоры.",
    enhanceFeature4Eta: "Q1 2026",
    contractTitle: "8. Задействованные смарт-контракты",
    contractCols: { col1: "Компонент", col2: "Адрес контракта (сокращенный)", col3: "Основная функция" },
    contractComp1: "Кошелек Казначейства",
    contractAddr1: "0x5A9...dC4",
    contractFunc1: "Хранение и распределение средств",
    contractComp2: "Контракт вознаграждений",
    contractAddr2: "0xB3F...7a1",
    contractFunc2: "Проверка утверждений и инициирование переводов",
    contractComp3: "Контракт управления",
    contractAddr3: "Скоро",
    contractFunc3: "Управление пороговыми значениями и ставками",
    summaryTitle: "9. Резюме и гарантии",
    summaryIntro: "Казначейство Платформы MindVaultIP разработано как прозрачный, автоматизированный и безопасный механизм для поощрения инноваций. Его работа полностью регулируется смарт-контрактами, что минимизирует человеческие ошибки и неправомерное использование.",
    summaryGuarantees: "Наши гарантии:",
    summaryPoint1: "**Безопасность:** Средства не могут быть выведены вручную.",
    summaryPoint2: "**Прозрачность:** Все транзакции вознаграждений публично проверяемы.",
    summaryPoint3: "**Справедливость:** Вознаграждения распределяются последовательно на основе заранее определенных правил.",
    summaryPoint4: "**Надежность:** Система включает механизмы отказоустойчивости и оповещения для обеспечения бесперебойной работы.",
    tagline: "Стимулирование следующего поколения идей."
  },
  ar: {
    title: 'إدارة خزانة المنصة',
    subtitle: 'الإشراف على توزيع رمز Ideon Cerebrum (IDN) وخزانة المنصة',
    note: 'ملاحظة: تصف هذه الوثيقة لوحة تحكم الخزانة الإدارية التي يستخدمها الفريق الأساسي لـ MindVaultIP وحوكمة DAO. لا يمتلك المستخدمون العامون وصولاً مباشرًا إلى هذه الضوابط.',

    overviewTitle: 'نظرة عامة',
    overviewCols: { col1: 'القسم', col2: 'الوصف' },
    overviewPurpose: 'الغرض',
    overviewPurposeDesc: 'إدارة ومراقبة وأتمتة توزيع مكافآت Ideon Cerebrum (IDN) واحتياطيات المنصة. يتم تنفيذ جميع المعاملات عبر عقود ذكية على شبكة Base لضمان الشفافية الكاملة والقابلية للتحقق.',
    overviewAccess: 'مستوى الوصول',
    overviewAccessDesc: 'للمسؤول فقط (يجب أن تتطابق المحفظة المتصلة مع مالك عقد الخزانة).',
    overviewStatus: 'الحالة',
    overviewStatusDesc: '✅ نشط',

    balanceTitle: 'ملخص رصيد الخزانة',
    balanceCols: { col1: 'المقياس', col2: 'الوصف', col3: 'قيمة مثال' },
    balanceCurrent: 'رصيد الخزانة الحالي',
    balanceCurrentDesc: 'إجمالي رموز IDN المحتفظ بها حاليًا في محفظة خزانة المنصة.',
    balanceCurrentVal: '23,000,000 IDN',
    balanceDistributed: 'إجمالي المكافآت الموزعة',
    balanceDistributedDesc: 'إجمالي الرموز الموزعة كمكافآt منذ الإطلاق.',
    balanceDistributedVal: '12,350 IDN',
    balanceRewardRate: 'المكافأة لكل إثبات معتمد',
    balanceRewardRateDesc: 'مكافأة ثابتة لكل إثبات يعتمده مجلس الذكاء الاصطناعي.',
    balanceRewardRateVal: '1 IDN / إثبات',
    balanceThreshold: 'الحد الأدنى للرصيد',
    balanceThresholdDesc: 'مستوى تنبيه الخزانة لتشغيل الإشعارات أو إعادة التعبئة التلقائية.',
    balanceThresholdVal: '10,000 IDN',
    balanceStatus: 'حالة الرصيد',
    balanceStatusDesc: 'يشير إلى ما إذا كان التوزيع نشطًا حاليًا.',
    balanceStatusVal: '🟢 نشط / 🔴 متوقف مؤقتًا',

    fundTitle: 'ضوابط إدارة الأموال',
    fundCols: { col1: 'الإجراء', col2: 'الوظيفة', col3: 'ملاحظات' },
    fundAdd: 'إضافة أموال',
    fundAddDesc: 'تحويل IDN من محفظة احتياطية أو ثانوية إلى الخزانة.',
    fundAddNotes: 'يتطلب تأكيدًا متعدد التوقيعات.',
    fundRemove: 'سحب أموال',
    fundRemoveDesc: 'سحب الرموز لإعادة التوزيع اليدوي أو السيولة الطارئة.',
    fundRemoveNotes: 'تأكيد المسؤول + سجل DAO.',
    fundAuto: 'إعادة التعبئة التلقائية',
    fundAutoDesc: 'تمكين التعبئة التلقائية من المحفظة الاحتياطية عندما يكون رصيد الخزانة < الحد الأدنى.',
    fundAutoNotes: 'اختياري؛ معطل بشكل افتراضي.',

    rewardTitle: 'منطق توزيع المكافآت',
    rewardCols: { col1: 'المعلمة', col2: 'الوظيفة', col3: 'مثال' },
    rewardTrigger: 'المُشغّل',
    rewardTriggerDesc: 'إثبات معتمد من مجلس الذكاء الاصطناعي ← يتم إصدار حدث ← يرسل العقد مكافأة.',
    rewardTriggerEg: 'استدعاء تلقائي للعقد الذكي',
    rewardAmount: 'مبلغ المكافأة',
    rewardAmountDesc: 'محدد في إعدادات الخزانة (الافتراضي: 1 IDN / إثبات).',
    rewardAmountEg: 'قابل للتعديل',
    rewardCooldown: 'مؤقت التهدئة',
    rewardCooldownDesc: 'يمنع المكافآت المزدوجة لنفس معرف الإثبات.',
    rewardCooldownEg: '24 ساعة',
    rewardTxType: 'نوع المعاملة',
    rewardTxTypeDesc: 'على السلسلة (شبكة Base)',
    rewardTxTypeEg: 'يتم تسجيل التجزئة في سجل DAO',

    notifTitle: 'إعدادات الإشعارات والأمان',
    notifSetting1: 'إشعارات البريد الإلكتروني / المحفظة',
    notifSetting1Desc: 'هنگامی که موجودی کمتر از آستانه باشد، هشدار ادمین ارسال می‌کند.',
    notifSetting2: 'المصادقة الثنائية (2FA) مطلوبة لسحب الأموال',
    notifSetting2Desc: 'أمان اختياري متعدد الطبقات لعمليات السحب.',
    notifSetting3: 'سجل التدقيق',
    notifSetting3Desc: 'يتم تسجيل جميع أحداث الإضافة/الإزالة/المكافأة في سجل على السلسلة مع الطابع الزمني وعنوان المحفظة.',
    notifSetting4: 'شفافية DAO',
    notifSetting4Desc: 'تكون جميع تغييرات الخزانة مرئية لـ DAO بمجرد تنشيط الحوكمة (2027).',

    logTitle: 'سجل النشاط الأخير',
    logNote: 'ملاحظة: السجلات التالية هي عينات توضيحية لتوضيح هيكل داشبورد الخزانة. ستبدأ المعاملات الفعلية على السلسلة بعد الإطلاق الرسمي وتكامل رمز Ideon Cerebrum (IDN) في عام 2026.',
    logCols: { col1: 'مهر زمانی', col2: 'اقدام', col3: 'مقدار (IDN)', col4: 'کیف پول', col5: 'وضعیت', col6: 'هش تراکنش' },

    enhanceTitle: 'التحسينات المستقبلية (المخطط لها)',
    enhanceCols: { col1: 'الميزة', col2: 'الوصف', col3: 'الوقت المتوقع' },
    enhanceFeature1: 'تحجيم المكافآت الديناميكي',
    enhanceFeature1Desc: 'تنظیم معدلات المكافأة بناءً على جودة الفكرة (تقييم الذكاء الاصطناعي > 85%).',
    enhanceFeature1Eta: 'الربع الثاني 2026',
    enhanceFeature2: 'خزانة مرتبطة بـ DAO',
    enhanceFeature2Desc: 'يصوت DAO على معدلات المكافآت وتخصيصات الميزانية.',
    enhanceFeature2Eta: '2027',
    enhanceFeature3: 'لوحة تحكم تحليلية في الوقت الفعلي',
    enhanceFeature3Desc: 'عرض رسومي لتدفق المكافآت واتجاهات الرصيد والمعاملات.',
    enhanceFeature3Eta: 'الربع الأول 2026',
    enhanceFeature4: 'مستكشف الخزانة العام',
    enhanceFeature4Desc: 'نمای فقط-خواندنی برای شفافیت (برای کاربران).',
    enhanceFeature4Eta: 'الربع الثالث 2026',

    contractTitle: 'تكامل العقود الذكية',
    contractCols: { col1: 'المكون', col2: 'العنوان', col3: 'الوظيفة' },
    contractComp1: 'عقد الخزانة',
    contractAddr1: '0x981eDEe0A3721d049D7343C04363fb38402F4BeC',
    contractFunc1: 'يحتفظ ويوزع رموز IDN.',
    contractComp2: 'عقد التحقق من الإثبات بالذكاء الاصطناعي',
    contractAddr2: '(متصل عبر مستمع الأحداث)',
    contractFunc2: 'يشغل توزيع المكافآت.',
    contractComp3: 'حوكمة خزانة DAO (مستقبلاً)',
    contractAddr3: '(سيتم تحديده لاحقًا - بعد 2027)',
    contractFunc3: 'إشراف المجتمع وتصويت المقترحات.',

    summaryTitle: 'ملخص',
    summaryIntro: 'تعمل خزانة المنصة كعمود فقري اقتصادي لـ MindVaultIP - مما يضمن مكافأة الإبداع باستمرار وبشفافية واستدامة.',
    summaryGuarantees: 'إنها تضمن:',
    summaryPoint1: 'شفافية كاملة ومساءلة على السلسلة',
    summaryPoint2: 'مكافآت تلقائية يمكن تتبعها للمبتكرين المعتمدين',
    summaryPoint3: 'مراقبة لحظية لاحتياطيات المنصة',
    summaryPoint4: 'انتقال سلس إلى حوكمة قائمة على DAO في عام 2027',

    tagline: 'نظام خزانة MindVaultIP - تشغيل اقتصاد الإبداع البشري.'
  },
  de: {
    title: 'Plattform-Treasury-Management',
    subtitle: 'Ideon Cerebrum (IDN) Token-Verteilung & Treasury-Aufsicht',
    note: 'Hinweis: Dieses Dokument beschreibt das administrative Treasury-Dashboard, das vom Kernteam von MindVaultIP und der DAO-Governance verwendet wird. Allgemeine Benutzer haben keinen direkten Zugriff auf diese Kontrollen.',
    overviewTitle: 'Überblick',
    overviewCols: { col1: 'Abschnitt', col2: 'Beschreibung' },
    overviewPurpose: 'Zweck',
    overviewPurposeDesc: 'Verwaltung, Überwachung und Automatisierung der Verteilung von Ideon Cerebrum (IDN)-Belohnungen und Plattformreserven. Alle Transaktionen werden über Smart Contracts im Base-Netzwerk ausgeführt, um volle Transparenz und Überprüfbarkeit zu gewährleisten.',
    overviewAccess: 'Zugriffsebene',
    overviewAccessDesc: 'Nur für Administratoren (verbundene Wallet muss mit dem Eigentümer des Treasury-Vertrags übereinstimmen).',
    overviewStatus: 'Status',
    overviewStatusDesc: '✅ Aktiv',
    balanceTitle: 'Zusammenfassung des Treasury-Guthabens',
    balanceCols: { col1: 'Metrik', col2: 'Beschreibung', col3: 'Beispielwert' },
    balanceCurrent: 'Aktuelles Treasury-Guthaben',
    balanceCurrentDesc: 'Gesamtzahl der IDN-Token, die sich derzeit im Treasury-Wallet der Plattform befinden.',
    balanceCurrentVal: '23.000.000 IDN',
    balanceDistributed: 'Insgesamt verteilte Belohnungen',
    balanceDistributedDesc: 'Gesamtzahl der seit dem Start als Belohnungen verteilten Token.',
    balanceDistributedVal: '12.350 IDN',
    balanceRewardRate: 'Belohnung pro genehmigtem Nachweis',
    balanceRewardRateDesc: 'Feste Belohnung für jeden vom AI Council genehmigten Nachweis.',
    balanceRewardRateVal: '1 IDN / Nachweis',
    balanceThreshold: 'Mindestguthabenschwelle',
    balanceThresholdDesc: 'Treasury-Warnstufe zur Auslösung von Benachrichtigungen oder automatischer Wiederauffüllung.',
    balanceThresholdVal: '10.000 IDN',
    balanceStatus: 'Guthabenstatus',
    balanceStatusDesc: 'Zeigt an, ob die Verteilung derzeit aktiv ist.',
    balanceStatusVal: '🟢 Aktiv / 🔴 Pausiert',
    fundTitle: 'Kontrollen der Fondsverwaltung',
    fundCols: { col1: 'Aktion', col2: 'Funktion', col3: 'Anmerkungen' },
    fundAdd: 'Mittel hinzufügen',
    fundAddDesc: 'Übertragen Sie IDN von einer Backup- oder sekundären Wallet in die Treasury.',
    fundAddNotes: 'Erfordert eine Multi-Signatur-Bestätigung.',
    fundRemove: 'Mittel entnehmen',
    fundRemoveDesc: 'Entnehmen Sie Token für die manuelle Umverteilung oder Notfallliquidität.',
    fundRemoveNotes: 'Admin-Bestätigung + DAO-Protokolleintrag.',
    fundAuto: 'Automatische Wiederauffüllung',
    fundAutoDesc: 'Aktivieren Sie die automatische Auffüllung von einer Backup-Wallet, wenn das Treasury < Schwelle ist.',
    fundAutoNotes: 'Opcional; standardmäßig deaktiviert.',
    rewardTitle: 'Logik der Belohnungsverteilung',
    rewardCols: { col1: 'Parametros', col2: 'Funktion', col3: 'Beispiel' },
    rewardTrigger: 'Auslöser',
    rewardTriggerDesc: 'Genehmigter Nachweis vom AI Council → Ereignis wird ausgegeben → Vertrag sendet Belohnung.',
    rewardTriggerEg: 'Automatischer Smart-Contract-Aufruf',
    rewardAmount: 'Belohnungsbetrag',
    rewardAmountDesc: 'In den Treasury-Einstellungen definiert (Standard: 1 IDN / Nachweis).',
    rewardAmountEg: 'Anpassbar',
    rewardCooldown: 'Abklingzeit-Timer',
    rewardCooldownDesc: 'Verhindert doppelte Belohnungen für dieselbe Nachweis-ID.',
    rewardCooldownEg: '24h',
    rewardTxType: 'Transaktionstyp',
    rewardTxTypeDesc: 'On-Chain (Base-Netzwerk)',
    rewardTxTypeEg: 'Hash im DAO-Register protokolliert',
    notifTitle: 'Benachrichtigungs- & Sicherheitseinstellungen',
    notifSetting1: 'E-Mail- / Wallet-Benachrichtigungen',
    notifSetting1Desc: 'Sendet eine Admin-Warnung, wenn das Guthaben < Schwelle ist.',
    notifSetting2: '2FA für Mittelentnahme erforderlich',
    notifSetting2Desc: 'Optionale mehrschichtige Sicherheit für Abhebungen.',
    notifSetting3: 'Audit-Trail',
    notifSetting3Desc: 'Alle Hinzufügungs-/Entfernungs-/Belohnungsereignisse werden im On-Chain-Protokoll mit Zeitstempel und Wallet-Adresse aufgezeichnet.',
    notifSetting4: 'DAO-Transparenz',
    notifSetting4Desc: 'Alle Treasury-Änderungen sind für die DAO sichtbar, sobald die Governance aktiviert ist (2027).',
    logTitle: 'Aktuelles Aktivitätsprotokoll',
    logNote: 'Hinweis: Die folgenden Protokolle sind Demo-Einträge, um das Layout des Treasury Dashboards zu veranschaulichen. Echte On-Chain-Transaktionen beginnen nach dem offiziellen Start und der Integration der DAO.',
    logCols: { col1: 'Zeitstempel', col2: 'Aktion', col3: 'Betrag (IDN)', col4: 'Wallet', col5: 'Status', col6: 'TX Hash' },
    enhanceTitle: 'Zukünftige Erweiterungen (geplant)',
    enhanceCols: { col1: 'Feature', col2: 'Beschreibung', col3: 'ETA' },
    enhanceFeature1: 'Dynamische Belohnungsskalierung',
    enhanceFeature1Desc: 'Passen Sie die Belohnungsraten basierend auf der Ideenqualität an (AI-Bewertung > 85%).',
    enhanceFeature1Eta: '2026 Q2',
    enhanceFeature2: 'Staking / Liquiditätspools',
    enhanceFeature2Desc: 'Ermöglichen Sie Benutzern, IDN-Token zu staken oder Liquidität bereitzustellen, um Belohnungen zu verdienen.',
    enhanceFeature2Eta: '2028',
    enhanceFeature3: 'DAO-Governance-Integration',
    enhanceFeature3Desc: 'Ermöglichen Sie, dass Treasury-Management-Entscheidungen (z. B. Änderung der Belohnungsraten) über DAO-Abstimmungen gesteuert werden.',
    enhanceFeature3Eta: '2027',
    contractTitle: 'Smart-Contract-Integration',
    contractCols: { col1: 'Komponente', col2: 'Adresse', col3: 'Funktion' },
    contractComp1: 'Treasury-Vertrag',
    contractAddr1: '0x981eDEe0A3721d049D7343C04363fb38402F4BeC',
    contractFunc1: 'Hält und verteilt IDN-Token.',
    contractComp2: 'AI-Nachweisvalidierungsvertrag',
    contractAddr2: '(über Ereignis-Listener verbunden)',
    contractFunc2: 'Löst die Belohnungsverteilung aus.',
    contractComp3: 'DAO-Treasury-Governance (zukünftig)',
    contractAddr3: '(TBD — nach 2027)',
    contractFunc3: 'Community-Aufsicht und Vorschlagsabstimmung.',
    summaryTitle: 'Zusammenfassung',
    summaryIntro: 'Die Plattform-Treasury dient als wirtschaftliches Rückgrat von MindVaultIP – und stellt sicher, dass Kreativität kontinuierlich, transparent und nachhaltig belohnt wird.',
    summaryGuarantees: 'Es garantiert:',
    summaryPoint1: 'Vollständige Transparenz und On-Chain-Rechenschaftspflicht',
    summaryPoint2: 'Automatische, nachverfolgbare Belohnungen für verifizierte Innovatoren',
    summaryPoint3: 'Echtzeitüberwachung der Plattformreserven',
    summaryPoint4: 'Nahtloser Übergang zu einer DAO-basierten Governance im Jahr 2027',
    tagline: 'MindVaultIP-Treasury-System – Die Wirtschaft der menschlichen Kreativität antreiben.'
  },
  zh: {
    title: "平台金库管理",
    subtitle: "Ideon Cerebrum (IDN) 代币分配与金库监管",
    note: "注意：本文件描述了MindVaultIP核心团队和DAO治理使用的行政金库仪表板。普通用户无法直接访问这些控制功能。",
    overviewTitle: "概览",
    overviewCols: { col1: "部分", col2: "描述" },
    overviewPurpose: "目的",
    overviewPurposeDesc: "管理、监控和自动化Ideon Cerebrum (IDN) 奖励和平台储备的分配。所有交易均通过Base网络上的智能合约执行，以确保完全的透明度和可验证性。",
    overviewAccess: "访问级别",
    overviewAccessDesc: "仅限管理员（连接的钱包必须与金库合约所有者匹配）。",
    overviewStatus: "状态",
    overviewStatusDesc: "✅ 活跃",
    balanceTitle: "金库余额摘要",
    balanceCols: { col1: "指标", col2: "描述", col3: "示例值" },
    balanceCurrent: "当前金库余额",
    balanceCurrentDesc: "平台金库钱包中当前持有的IDN代币总数。",
    balanceCurrentVal: "23,000,000 IDN",
    balanceDistributed: "已分配奖励总额",
    balanceDistributedDesc: "自启动以来作为奖励分配的代币总数。",
    balanceDistributedVal: "12,350 IDN",
    balanceRewardRate: "每个已批准证明的奖励",
    balanceRewardRateDesc: "AI理事会批准的每个证明的固定奖励。",
    balanceRewardRateVal: "1 IDN / 证明",
    balanceThreshold: "最低余额阈值",
    balanceThresholdDesc: "触发通知或自动补充的金库警报级别。",
    balanceThresholdVal: "10,000 IDN",
    balanceStatus: "余额状态",
    balanceStatusDesc: "指示分配当前是否活跃。",
    balanceStatusVal: "🟢 活跃 / 🔴 暂停",
    fundTitle: "资金管理控制",
    fundCols: { col1: "操作", col2: "功能", col3: "备注" },
    fundAdd: "增加资金",
    fundAddDesc: "从备用或二级钱包向金库转移IDN。",
    fundAddNotes: "需要多重签名确认。",
    fundRemove: "提取资金",
    fundRemoveDesc: "为手动再分配或紧急流动性提取代币。",
    fundRemoveNotes: "管理员确认 + DAO日志记录。",
    fundAuto: "自动补充",
    fundAutoDesc: "当金库余额低于阈值时，启用从备用钱包自动充值。",
    fundAutoNotes: "可选；默认禁用。",
    rewardTitle: "奖励分配逻辑",
    rewardCols: { col1: "参数", col2: "功能", col3: "示例" },
    rewardTrigger: "触发器",
    rewardTriggerDesc: "AI理事会批准的证明 → 事件发出 → 合约发送奖励。",
    rewardTriggerEg: "智能合约自动调用",
    rewardAmount: "奖励金额",
    rewardAmountDesc: "在金库设置中定义（默认：1 IDN / 证明）。",
    rewardAmountEg: "可调整",
    rewardCooldown: "冷却计时器",
    rewardCooldownDesc: "防止对同一证明ID的双重奖励。",
    rewardCooldownEg: "24小时",
    rewardTxType: "交易类型",
    rewardTxTypeDesc: "链上（Base网络）",
    rewardTxTypeEg: "哈希记录在DAO注册表中",
    notifTitle: "通知与安全设置",
    notifSetting1: "电子邮件/钱包通知",
    notifSetting1Desc: "当余额低于阈值时向管理员发送警报。",
    notifSetting2: "提取资金需要2FA",
    notifSetting2Desc: "为提款提供可选的多层安全保护。",
    notifSetting3: "审计追踪",
    notifSetting3Desc: "所有添加/提取/奖励事件都记录在带有时间戳和钱包地址的链上日志中。",
    notifSetting4: "DAO透明度",
    notifSetting4Desc: "一旦治理激活（2027年），所有金库变更对DAO可见。",
    logTitle: "近期活动日志",
    logNote: "注意：以下记录是用于说明金库仪表板结构的演示条目。实际的链上交易将在2026年Ideon Cerebrum (IDN)代币正式启动和集成后开始。",
    logCols: { col1: "时间戳", col2: "操作", col3: "金额 (IDN)", col4: "钱包", col5: "状态", col6: "交易哈希" },
    enhanceTitle: "未来增强功能（计划中）",
    enhanceCols: { col1: "功能", col2: "描述", col3: "预计时间" },
    enhanceFeature1: "动态奖励扩展",
    enhanceFeature1Desc: "根据创意质量调整奖励率（AI评分 > 85%）。",
    enhanceFeature1Eta: "2026年第二季度",
    enhanceFeature2: "质押/流动性池",
    enhanceFeature2Desc: "允许用户质押IDN代币或提供流动性以赚取奖励。",
    enhanceFeature2Eta: "2028年",
    enhanceFeature3: "DAO治理整合",
    enhanceFeature3Desc: "使金库管理决策（例如更改奖励率）能够通过DAO投票来控制。",
    enhanceFeature3Eta: "2027年",
    contractTitle: "智能合约集成",
    contractCols: { col1: "组件", col2: "地址", col3: "功能" },
    contractComp1: "金库合约",
    contractAddr1: "0x981eDEe0A3721d049D7343C04363fb38402F4BeC",
    contractFunc1: "持有和分配IDN代币。",
    contractComp2: "AI证明验证合约",
    contractAddr2: "（通过事件监听器连接）",
    contractFunc2: "触发奖励分配。",
    contractComp3: "DAO金库治理（未来）",
    contractAddr3: "（待定 — 2027年后）",
    contractFunc3: "社区监督和提案投票。",
    summaryTitle: "总结",
    summaryIntro: "平台金库是MindVaultIP的经济支柱——确保创造力得到持续、透明和可持续的奖励。",
    summaryGuarantees: "它保证：",
    summaryPoint1: "完全的透明度和链上问责制",
    summaryPoint2: "为经过验证的创新者提供自动、可追溯的奖励",
    summaryPoint3: "实时监控平台储备",
    summaryPoint4: "在2027年无缝过渡到基于DAO的治理",
    tagline: "MindVaultIP金库系统——为人类创造力的经济提供动力。"
  },
  ur: {
    title: 'پلیٹ فارم ٹریژری مینجمنٹ',
    subtitle: 'آئیڈیون سیریبرم (IDN) ٹوکن کی تقسیم اور ٹریژری کی نگرانی',
    note: 'نوٹ: یہ دستاویز انتظامی ٹریژری ڈیش بورڈ کی وضاحت کرتی ہے جسے MindVaultIP کی بنیادی ٹیم اور DAO گورننس استعمال کرتی ہے۔ عام صارفین کو ان کنٹرولز تک براہ راست رسائی حاصل نہیں ہے۔',
    overviewTitle: 'جائزہ',
    overviewCols: { col1: 'سیکشن', col2: 'تفصیل' },
    overviewPurpose: 'مقصد',
    overviewPurposeDesc: 'آئیڈیون سیریبرم (IDN) انعامات اور پلیٹ فارم کے ذخائر کی تقسیم کا انتظام، نگرانی اور خودکار بنانا۔ تمام لین دین بیس نیٹ ورک پر سمارٹ معاہدوں کے ذریعے انجام دیے جاتے ہیں تاکہ مکمل شفافیت اور تصدیق کو یقینی بنایا جا سکے۔',
    overviewAccess: 'رسائی کی سطح',
    overviewAccessDesc: 'صرف ایڈمن (منسلک والیٹ کو ٹریژری معاہدے کے مالک سے مماثل ہونا چاہیے)۔',
    overviewStatus: 'حیثیت',
    overviewStatusDesc: '✅ فعال',
    balanceTitle: 'ٹریژری بیلنس کا خلاصہ',
    balanceCols: { col1: 'میٹرک', col2: 'تفصیل', col3: 'مثالی قدر' },
    balanceCurrent: 'موجودہ ٹریژری بیلنس',
    balanceCurrentDesc: 'پلیٹ فارم ٹریژری والیٹ میں موجود کل IDN ٹوکنز۔',
    balanceCurrentVal: '23,000,000 IDN',
    balanceDistributed: 'تقسیم شدہ کل انعامات',
    balanceDistributedDesc: 'لانچ کے بعد سے انعامات کے طور پر تقسیم کیے گئے کل ٹوکنز۔',
    balanceDistributedVal: '12,350 IDN',
    balanceRewardRate: 'فی منظور شدہ ثبوت پر انعام',
    balanceRewardRateDesc: 'AI کونسل کی طرف سے منظور شدہ ہر ثبوت کے لیے مقررہ انعام۔',
    balanceRewardRateVal: '1 IDN / ثبوت',
    balanceThreshold: 'کم از کم بیلنس کی حد',
    balanceThresholdDesc: 'اطلاعات کو متحرک کرنے یا خودکار دوبارہ بھرنے کے لیے ٹریژری الرٹ کی سطح۔',
    balanceThresholdVal: '10,000 IDN',
    balanceStatus: 'بیلنس کی حیثیت',
    balanceStatusDesc: 'اس بات کی نشاندہی کرتا ہے کہ آیا تقسیم فی الحال فعال ہے۔',
    balanceStatusVal: '🟢 فعال / 🔴 موقوف',
    fundTitle: 'فنڈ مینجمنٹ کنٹرولز',
    fundCols: { col1: 'کارروائی', col2: 'فنکشن', col3: 'نوٹس' },
    fundAdd: 'فنڈز شامل کریں',
    fundAddDesc: 'بیک اپ یا سیکنڈری والیٹ سے IDN کو ٹریژری میں منتقل کریں۔',
    fundAddNotes: 'ملٹی سگنیچر تصدیق کی ضرورت ہے۔',
    fundRemove: 'فنڈز نکالیں',
    fundRemoveDesc: 'دستی دوبارہ تقسیم یا ہنگامی لیکویڈیٹی کے لیے ٹوکن نکالیں۔',
    fundRemoveNotes: 'ایڈمن کی تصدیق + DAO لاگ ریکارڈ۔',
    fundAuto: 'خودکار دوبارہ بھرنا',
    fundAutoDesc: 'جب ٹریژری < حد ہو تو بیک اپ والیٹ سے خودکار ٹاپ اپ کو فعال کریں۔',
    fundAutoNotes: 'اختیاری؛ پہلے سے طے شدہ طور پر غیر فعال ہے۔',
    rewardTitle: 'انعام کی تقسیم کی منطق',
    rewardCols: { col1: 'پیرامیٹر', col2: 'فنکشن', col3: 'مثال' },
    rewardTrigger: 'ٹرگر',
    rewardTriggerDesc: 'AI کونسل سے منظور شدہ ثبوت ← ایونٹ خارج ہوتا ہے ← معاہدہ انعام بھیجتا ہے۔',
    rewardTriggerEg: 'سمارٹ معاہدے کی خودکار کال',
    rewardAmount: 'انعام کی رقم',
    rewardAmountDesc: 'ٹریژری کی ترتیبات میں بیان کیا گیا ہے (پہلے سے طے شدہ: 1 IDN / ثبوت)۔',
    rewardAmountEg: 'ایڈجسٹ ایبل',
    rewardCooldown: 'کول ڈاؤن ٹائمر',
    rewardCooldownDesc: 'ایک ہی ثبوت ID کے لیے دوہرے انعامات کو روکتا ہے۔',
    rewardCooldownEg: '24 گھنٹے',
    rewardTxType: 'لین دین کی قسم',
    rewardTxTypeDesc: 'آن چین (بیس نیٹ ورک)',
    rewardTxTypeEg: 'ہیش DAO رجسٹری میں لاگ ان ہے',
    notifTitle: 'اطلاع اور سیکیورٹی کی ترتیبات',
    notifSetting1: 'ای میل / والیٹ اطلاعات',
    notifSetting1Desc: 'جب بیلنس < حد ہو تو ایڈمن کو الرٹ بھیجتا ہے۔',
    notifSetting2: 'فنڈ نکالنے کے لیے 2FA درکار ہے',
    notifSetting2Desc: 'نکالنے کے لیے اختیاری ملٹی لیئر سیکیورٹی۔',
    notifSetting3: 'آڈٹ ٹریل',
    notifSetting3Desc: 'تمام شامل/نکالنے/انعام کے واقعات آن چین لاگ میں ٹائم اسٹیمپ اور والیٹ ایڈریس کے ساتھ ریکارڈ کیے جاتے ہیں۔',
    notifSetting4: 'DAO شفافیت',
    notifSetting4Desc: 'گورننس فعال ہونے کے بعد (2027) تمام ٹریژری تبدیلیاں DAO کو نظر آئیں گی۔',
    logTitle: 'حالیہ سرگرمی لاگ',
    logNote: 'نوٹ: مندرجہ ذیل ریکارڈز ٹریژری ڈیش بورڈ کی ساخت کو واضح کرنے کے لیے نمونہ کے اندراجات ہیں۔ اصل آن چین لین دین 2026 میں آئیڈیون سیریبرم (IDN) ٹوکن کے سرکاری آغاز اور انضمام کے بعد شروع ہوں گے۔',
    logCols: { col1: 'ٹائم اسٹیمپ', col2: 'کارروائی', col3: 'رقم (IDN)', col4: 'والیٹ', col5: 'حیثیت', col6: 'TX ہیش' },
    enhanceTitle: 'مستقبل کی اضافہ (منصوبہ بند)',
    enhanceCols: { col1: 'فیچر', col2: 'تفصیل', col3: 'ETA' },
    enhanceFeature1: 'متحرک انعام کی اسکیلنگ',
    enhanceFeature1Desc: 'خیال کے معیار کی بنیاد پر انعام کی شرحوں کو ایڈجسٹ کریں (AI درجہ بندی > 85%)۔',
    enhanceFeature1Eta: '2026 Q2',
    enhanceFeature2: 'DAO-منسلک ٹریژری',
    enhanceFeature2Desc: 'DAO انعام کی شرحوں اور بجٹ کی تخصیص پر ووٹ دیتا ہے۔',
    enhanceFeature2Eta: '2027',
    enhanceFeature3: 'ریئل ٹائم تجزیاتی ڈیش بورڈ',
    enhanceFeature3Desc: 'انعام کے بہاؤ، بیلنس کے رجحانات اور لین دین کا گرافیکل نظارہ۔',
    enhanceFeature3Eta: '2026 Q1',
    enhanceFeature4: 'عوامی ٹریژری ایکسپلورر',
    enhanceFeature4Desc: 'شفافیت کے لیے صرف پڑھنے کے لیے نظارہ (صارفین کے لیے)۔',
    enhanceFeature4Eta: '2026 Q3',
    contractTitle: 'سمارٹ معاہدے کا انضمام',
    contractCols: { col1: 'جز', col2: 'پتہ', col3: 'فنکشن' },
    contractComp1: 'ٹریژری معاہدہ',
    contractAddr1: '0x981eDEe0A3721d049D7343C04363fb38402F4BeC',
    contractFunc1: 'IDN ٹوکنز رکھتا اور تقسیم کرتا ہے۔',
    contractComp2: 'AI ثبوت کی توثیق کا معاہدہ',
    contractAddr2: '(ایونٹ لسنر کے ذریعے منسلک)',
    contractFunc2: 'انعام کی تقسیم کو متحرک کرتا ہے۔',
    contractComp3: 'DAO ٹریژری گورننس (مستقبل)',
    contractAddr3: '(TBD — 2027 کے بعد)',
    contractFunc3: 'کمیونٹی کی نگرانی اور تجاویز پر ووٹنگ۔',

    summaryTitle: 'خلاصہ',
    summaryIntro: 'پلیٹ فارم ٹریژری MindVaultIP کی معاشی ریڑھ کی ہڈی کے طور پر کام کرتی ہے — اس بات کو یقینی بناتی ہے کہ تخلیقی صلاحیتوں کو مسلسل، شفاف اور پائیدار طریقے سے انعام دیا جائے۔',
    summaryGuarantees: 'یہ ضمانت دیتا ہے:',
    summaryPoint1: 'مکمل شفافیت اور آن چین جوابدہی',
    summaryPoint2: 'تصدیق شدہ اختراع کاروں کے لیے خودکار، قابل ٹریک انعامات',
    summaryPoint3: 'پلیٹ فارم کے ذخائر کی ریئل ٹائم نگرانی',
    summaryPoint4: '2027 میں DAO پر مبنی گورننس میں ہموار منتقلی',

    tagline: 'MindVaultIP ٹریژری سسٹم — انسانی تخلیقی صلاحیتوں کی معیشت کو طاقت دیتا ہے۔'
  },
  hi: {
    title: 'प्लेटफ़ॉर्म ट्रेजरी प्रबंधन',
    subtitle: 'आइडियन सेरिब्रम (IDN) टोकन वितरण और ट्रेजरी निरीक्षण',
    note: 'नोट: यह दस्तावेज़ MindVaultIP की कोर टीम और DAO गवर्नेंस द्वारा उपयोग किए जाने वाले प्रशासनिक ट्रेजरी डैशबोर्ड का वर्णन करता है। सामान्य उपयोगकर्ताओं को इन नियंत्रणों तक सीधी पहुंच नहीं है।',
    overviewTitle: 'अवलोकन',
    overviewCols: { col1: 'अनुभाग', col2: 'विवरण' },
    overviewPurpose: 'उद्देश्य',
    overviewPurposeDesc: 'आइडियन सेरिब्रम (IDN) पुरस्कारों और प्लेटफ़ॉर्म भंडारों के वितरण का प्रबंधन, निगरानी और स्वचालन करें। पूर्ण पारदर्शिता और सत्यापन सुनिश्चित करने के लिए सभी लेनदेन बेस नेटवर्क पर स्मार्ट अनुबंधों के माध्यम से निष्पादित किए जाते हैं।',
    overviewAccess: 'पहुंच स्तर',
    overviewAccessDesc: 'केवल एडमिन (कनेक्टेड वॉलेट ट्रेजरी अनुबंध के मालिक से मेल खाना चाहिए)।',
    overviewStatus: 'स्थिति',
    overviewStatusDesc: '✅ सक्रिय',
    balanceTitle: 'ट्रेजरी बैलेंस सारांश',
    balanceCols: { col1: 'मीट्रिक', col2: 'विवरण', col3: 'उदाहरण मान' },
    balanceCurrent: 'वर्तमान ट्रेजरी बैलेंस',
    balanceCurrentDesc: 'वर्तमान में प्लेटफ़ॉर्म ट्रेजरी वॉलेट में रखे गए कुल IDN टोकन।',
    balanceCurrentVal: '23,000,000 IDN',
    balanceDistributed: 'वितरित कुल पुरस्कार',
    balanceDistributedDesc: 'लॉन्च के बाद से पुरस्कार के रूप में वितरित कुल टोकन।',
    balanceDistributedVal: '12,350 IDN',
    balanceRewardRate: 'प्रति स्वीकृत प्रमाण पर पुरस्कार',
    balanceRewardRateDesc: 'AI परिषद द्वारा अनुमोदित प्रत्येक प्रमाण के लिए निश्चित पुरस्कार।',
    balanceRewardRateVal: '1 IDN / प्रमाण',
    balanceThreshold: 'न्यूनतम बैलेंस थ्रेसहोल्ड',
    balanceThresholdDesc: 'अधिसूचनाओं या ऑटो-पुनःपूर्ति को ट्रिगर करने के लिए ट्रेजरी अलर्ट स्तर।',
    balanceThresholdVal: '10,000 IDN',
    balanceStatus: 'बैलेंस स्थिति',
    balanceStatusDesc: 'यह इंगित करता है कि वितरण वर्तमान में सक्रिय है या नहीं।',
    balanceStatusVal: '🟢 सक्रिय / 🔴 रुका हुआ',
    fundTitle: 'फंड प्रबंधन नियंत्रण',
    fundCols: { col1: 'कार्रवाई', col2: 'फ़ंक्शन', col3: 'नोट्स' },
    fundAdd: 'फंड जोड़ें',
    fundAddDesc: 'बैकअप या सेकेंडरी वॉलेट से IDN को ट्रेजरी में स्थानांतरित करें।',
    fundAddNotes: 'बहु-हस्ताक्षर पुष्टि की आवश्यकता है।',
    fundRemove: 'फंड निकालें',
    fundRemoveDesc: 'मैनुअल पुनर्वितरण या आपातकालीन तरलता के लिए टोकन निकालें।',
    fundRemoveNotes: 'एडमिन पुष्टि + DAO लॉग रिकॉर्ड।',
    fundAuto: 'ऑटो-पुनःपूर्ति',
    fundAutoDesc: 'जब ट्रेजरी < थ्रेसहोल्ड हो तो बैकअप वॉलेट से स्वचालित टॉप-अप सक्षम करें।',
    fundAutoNotes: 'वैकल्पिक; डिफ़ॉल्ट रूप से अक्षम।',
    rewardTitle: 'पुरस्कार वितरण तर्क',
    rewardCols: { col1: 'पैरामीटर', col2: 'फ़ंक्शन', col3: 'उदाहरण' },
    rewardTrigger: 'ट्रिगर',
    rewardTriggerDesc: 'AI परिषद से स्वीकृत प्रमाण → ईवेंट उत्सर्जित → अनुबंध पुरस्कार भेजता है।',
    rewardTriggerEg: 'स्मार्ट अनुबंध ऑटो-कॉल',
    rewardAmount: 'पुरस्कार राशि',
    rewardAmountDesc: 'ट्रेजरी सेटिंग्स में परिभाषित (डिफ़ॉल्ट: 1 IDN / प्रमाण)।',
    rewardAmountEg: 'समायोज्य',
    rewardCooldown: 'कूलडाउन टाइमर',
    rewardCooldownDesc: 'एक ही प्रूफ आईडी के लिए दोहरे पुरस्कार को रोकता है।',
    rewardCooldownEg: '24 घंटे',
    rewardTxType: 'लेन-देन का प्रकार',
    rewardTxTypeDesc: 'ऑन-चेन (बेस नेटवर्क)',
    rewardTxTypeEg: 'हैश DAO रजिस्ट्री में लॉग किया गया',
    notifTitle: 'अधिसूचना और सुरक्षा सेटिंग्स',
    notifSetting1: 'ईमेल / वॉलेट सूचनाएं',
    notifSetting1Desc: 'जब बैलेंस < थ्रेसहोल्ड हो तो एडमिन को अलर्ट भेजता है।',
    notifSetting2: 'फंड हटाने के लिए 2FA आवश्यक है',
    notifSetting2Desc: 'निकासी के लिए वैकल्पिक बहु-परत सुरक्षा।',
    notifSetting3: 'ऑडिट ट्रेल',
    notifSetting3Desc: 'सभी जोड़ने/हटाने/पुरस्कार की घटनाएं टाइमस्टैम्प और वॉलेट पते के साथ ऑन-चेन लॉग में दर्ज की जाती हैं।',
    notifSetting4: 'DAO पारदर्शिता',
    notifSetting4Desc: 'गवर्नेंस सक्रिय होने के बाद (2027) सभी ट्रेजरी परिवर्तन DAO को दिखाई देंगे।',
    logTitle: 'हाल की गतिविधि लॉग',
    logNote: 'नोट: निम्नलिखित रिकॉर्ड ट्रेजरी डैशबोर्ड संरचना को स्पष्ट करने के लिए नमूना प्रदर्शन प्रविष्टियाँ हैं। वास्तविक ऑन-चेन लेनदेन 2026 में आइडियन सेरिब्रम (IDN) टोकन के आधिकारिक लॉन्च और एकीकरण के बाद शुरू होंगे।',
    logCols: { col1: 'टाइमस्टैम्प', col2: 'कार्रवाई', col3: 'राशि (IDN)', col4: 'वॉलेट', col5: 'स्थिति', col6: 'TX हैश' },
    enhanceTitle: 'भविष्य के संवर्द्धन (योजनाबद्ध)',
    enhanceCols: { col1: 'सुविधा', col2: 'विवरण', col3: 'ETA' },
    enhanceFeature1: 'गतिशील पुरस्कार स्केलिंग',
    enhanceFeature1Desc: 'विचार की गुणवत्ता के आधार पर पुरस्कार दरों को समायोजित करें (AI रेटिंग > 85%)।',
    enhanceFeature1Eta: '2026 Q2',
    enhanceFeature2: 'DAO-लिंक्ड ट्रेजरी',
    enhanceFeature2Desc: 'DAO पुरस्कार दरों और बजट आवंटन पर वोट देता है।',
    enhanceFeature2Eta: '2027',
    enhanceFeature3: 'वास्तविक समय एनालिटिक्स डैशबोर्ड',
    enhanceFeature3Desc: 'पुरस्कार प्रवाह, बैलेंस रुझानों और लेनदेन का ग्राफिकल दृश्य।',
    enhanceFeature3Eta: '2026 Q1',
    enhanceFeature4: 'सार्वजनिक ट्रेजरी एक्सप्लोरर',
    enhanceFeature4Desc: 'पारदर्शिता के लिए केवल-पढ़ने के लिए दृश्य (उपयोगकर्ताओं के लिए)।',
    enhanceFeature4Eta: '2026 Q3',
    contractTitle: 'स्मार्ट अनुबंध एकीकरण',
    contractCols: { col1: 'घटक', col2: 'पता', col3: 'फ़ंक्शन' },
    contractComp1: 'ट्रेजरी अनुबंध',
    contractAddr1: '0x981eDEe0A3721d049D7343C04363fb38402F4BeC',
    contractFunc1: 'IDN टोकन रखता और वितरित करता है।',
    contractComp2: 'AI प्रमाण सत्यापन अनुबंध',
    contractAddr2: '(ईवेंट श्रोता के माध्यम से जुड़ा हुआ)',
    contractFunc2: 'पुरस्कार वितरण को ट्रिगर करता है।',
    contractComp3: 'DAO ट्रेजरी गवर्नेंस (भविष्य)',
    contractAddr3: '(TBD — 2027 के बाद)',
    contractFunc3: 'सामुदायिक निरीक्षण और प्रस्ताव मतदान।',
    summaryTitle: 'सारांश',
    summaryIntro: 'प्लेटफ़ॉर्म ट्रेजरी MindVaultIP की आर्थिक रीढ़ के रूप में कार्य करती है - यह सुनिश्चित करती है कि रचनात्मकता को लगातार, पारदर्शी और स्थायी रूप से पुरस्कृत किया जाए।',
    summaryGuarantees: 'यह गारंटी देता है:',
    summaryPoint1: 'पूर्ण पारदर्शिता और ऑन-चेन जवाबदेही',
    summaryPoint2: 'सत्यापित नवप्रवर्तकों के लिए स्वचालित, ट्रेस करने योग्य पुरस्कार',
    summaryPoint3: 'प्लेटफ़ॉर्म भंडारों की वास्तविक समय की निगरानी',
    summaryPoint4: '2027 में DAO-आधारित शासन में निर्बाध संक्रमण',
    tagline: 'MindVaultIP ट्रेजरी सिस्टम — मानव रचनात्मकता की अर्थव्यवस्था को शक्ति प्रदान करता है।'
  },
  tr: {
    title: "Platform Hazine Yönetimi",
    subtitle: "Ideon Cerebrum (IDN) Token Dağıtımı ve Hazine Gözetimi",
    note: "Not: Bu belge, MindVaultIP çekirdek ekibi ve DAO yönetimi tarafından kullanılan idari hazine panosunu açıklamaktadır. Normal kullanıcıların bu kontrollere doğrudan erişimi yoktur.",
    overviewTitle: "Genel Bakış",
    overviewCols: { col1: "Bölüm", col2: "Açıklama" },
    overviewPurpose: "Amaç",
    overviewPurposeDesc: "Ideon Cerebrum (IDN) ödüllerinin ve platform rezervlerinin dağıtımını yönetmek, izlemek ve otomatikleştirmek. Tüm işlemler, tam şeffaflık ve doğrulanabilirlik sağlamak için Base Network üzerindeki akıllı sözleşme aracılığıyla yürütülür.",
    overviewAccess: "Erişim Seviyesi",
    overviewAccessDesc: "Yalnızca Yönetici (Bağlı cüzdan, hazine sözleşmesi sahibiyle eşleşmelidir).",
    overviewStatus: "Durum",
    overviewStatusDesc: "✅ Aktif",
    balanceTitle: "Hazine Bakiye Özeti",
    balanceCols: { col1: "Metrik", col2: "Açıklama", col3: "Örnek Değer" },
    balanceCurrent: "Mevcut Hazine Bakiyesi",
    balanceCurrentDesc: "Şu anda platform hazine cüzdanında tutulan toplam IDN tokenleri.",
    balanceCurrentVal: "23.000.000 IDN",
    balanceDistributed: "Dağıtılan Toplam Ödüller",
    balanceDistributedDesc: "Lansmandan bu yana ödül olarak dağıtılan toplam tokenler.",
    balanceDistributedVal: "12.350 IDN",
    balanceRewardRate: "Onaylanmış Kanıt Başına Ödül",
    balanceRewardRateDesc: "AI Konseyi tarafından onaylanan her kanıt için sabit ödül.",
    balanceRewardRateVal: "1 IDN / Kanıt",
    balanceThreshold: "Minimum Bakiye Eşiği",
    balanceThresholdDesc: "Bildirimleri veya otomatik yeniden doldurmayı tetiklemek için hazine uyarı seviyesi.",
    balanceThresholdVal: "10.000 IDN",
    balanceStatus: "Bakiye Durumu",
    balanceStatusDesc: "Dağıtımın şu anda aktif olup olmadığını gösterir.",
    balanceStatusVal: "🟢 Aktif / 🔴 Duraklatıldı",
    fundTitle: "Fon Yönetim Kontrolleri",
    fundCols: { col1: "Eylem", col2: "İşlev", col3: "Notlar" },
    fundAdd: "Fon Ekle",
    fundAddDesc: "Yedek veya ikincil bir cüzdandan hazineye IDN aktarın.",
    fundAddNotes: "Çoklu imza onayı gerektirir.",
    fundRemove: "Fon Çek",
    fundRemoveDesc: "Manuel yeniden dağıtım veya acil durum likiditesi için tokenleri çekin.",
    fundRemoveNotes: "Yönetici onayı + DAO günlük kaydı.",
    fundAuto: "Otomatik Yeniden Doldurma",
    fundAutoDesc: "Hazine < eşik olduğunda yedek cüzdandan otomatik doldurmayı etkinleştirin.",
    fundAutoNotes: "İsteğe bağlı; varsayılan olarak devre dışı.",
    rewardTitle: "Ödül Dağıtım Mantığı",
    rewardCols: { col1: "Parametre", col2: "İşlev", col3: "Örnek" },
    rewardTrigger: "Tetikleyici",
    rewardTriggerDesc: "AI Konseyinden onaylanan kanıt → Olay yayınlanır → Sözleşme ödül gönderir.",
    rewardTriggerEg: "Akıllı sözleşme otomatik çağrısı",
    rewardAmount: "Ödül Miktarı",
    rewardAmountDesc: "Hazine ayarlarında tanımlanmıştır (varsayılan: 1 IDN / kanıt).",
    rewardAmountEg: "Ayarlanabilir",
    rewardCooldown: "Bekleme Süresi",
    rewardCooldownDesc: "Aynı kanıt ID'si için çift ödülü önler.",
    rewardCooldownEg: "24 saat",
    rewardTxType: "İşlem Türü",
    rewardTxTypeDesc: "Zincir Üstü (Base Network)",
    rewardTxTypeEg: "Hash, DAO kaydına kaydedilir",
    notifTitle: "Bildirim ve Güvenlik Ayarları",
    notifSetting1: "E-posta / Cüzdan Bildirimleri",
    notifSetting1Desc: "Bakiye < eşik olduğunda yöneticiye uyarı gönderir.",
    notifSetting2: "Fon Çekme için 2FA Gerekli",
    notifSetting2Desc: "Çekimler için isteğe bağlı çok katmanlı güvenlik.",
    notifSetting3: "Denetim İzi",
    notifSetting3Desc: "Tüm ekleme/çekme/ödül olayları, zaman damgası ve cüzdan adresi ile zincir üstü günlüğe kaydedilir.",
    notifSetting4: "DAO Şeffaflığı",
    notifSetting4Desc: "Yönetişim etkinleştirildiğinde (2027) tüm hazine değişiklikleri DAO tarafından görülebilir olacaktır.",
    logTitle: "Son Etkinlik Günlüğü",
    logNote: "Not: Aşağıdaki kayıtlar, hazine panosu yapısını göstermek için örnek gösterim girişleridir. Gerçek zincir üstü işlemler, Ideon Cerebrum (IDN) tokeninin resmi lansmanı ve entegrasyonu ile 2026'da başlayacaktır.",
    logCols: { col1: "Zaman Damgası", col2: "Eylem", col3: "Miktar (IDN)", col4: "Cüzdan", col5: "Durum", col6: "TX Hash" },
    enhanceTitle: "Gelecekteki Geliştirmeler (Planlanan)",
    enhanceCols: { col1: "Özellik", col2: "Açıklama", col3: "Tahmini Bitiş Tarihi" },
    enhanceFeature1: "Dinamik Ödül Ölçeklendirme",
    enhanceFeature1Desc: "Kanıtın kategorisine veya AI skoruna göre ödülleri otomatik olarak ayarlayın (örneğin, buluşlar > fikirler).",
    enhanceFeature1Eta: "2027",
    enhanceFeature2: "Staking / Likidite Havuzları",
    enhanceFeature2Desc: "Kullanıcıların ödül kazanmak için IDN tokenlerini stake etmelerine veya likidite sağlamalarına izin verin.",
    enhanceFeature2Eta: "2028",
    enhanceFeature3: "DAO Yönetim Entegrasyonu",
    enhanceFeature3Desc: "Hazine yönetimi kararlarının (örneğin, ödül oranlarını değiştirme) DAO oylaması yoluyla kontrol edilmesini sağlayın.",
    enhanceFeature3Eta: "2027",
    contractTitle: "Akıllı Sözleşme Entegrasyonu",
    contractCols: { col1: "Bileşen", col2: "Adres", col3: "İşlev" },
    contractComp1: "Hazine Sözleşmesi",
    contractAddr1: "0x981eDEe0A3721d049D7343C04363fb38402F4BeC",
    contractFunc1: "IDN tokenlerini tutar ve dağıtır.",
    contractComp2: "AI Kanıt Doğrulama Sözleşmesi",
    contractAddr2: "(olay dinleyicisi aracılığıyla bağlı)",
    contractFunc2: "Ödül dağıtımını tetikler.",
    contractComp3: "DAO Hazine Yönetimi (gelecek)",
    contractAddr3: "(Belirlenecek — 2027 sonrası)",
    contractFunc3: "Topluluk denetimi ve teklif oylaması.",
    summaryTitle: "Özet",
    summaryIntro: "Platform Hazinesi, MindVaultIP'nin ekonomik omurgası olarak hizmet vermektedir — yaratıcılığın şeffaf ve sürdürülebilir bir şekilde sürekli ödüllendirilmesini sağlar.",
    summaryGuarantees: "Şunları garanti eder:",
    summaryPoint1: "Tam şeffaflık ve zincir üstü hesap verebilirlik",
    summaryPoint2: "Doğrulanmış yenilikçiler için otomatik, izlenebilir ödüller",
    summaryPoint3: "Platform rezervlerinin gerçek zamanlı izlenmesi",
    summaryPoint4: "2027'de DAO tabanlı yönetime sorunsuz geçiş",
    tagline: "MindVaultIP Hazine Sistemi — İnsan Yaratıcılığının Ekonomisini Güçlendiriyor."
  },
  ja: {
    // Header
    title: 'プラットフォーム財務管理',
    subtitle: 'Ideon Cerebrum (IDN) トークン配布と財務監督',
    note: '注：このドキュメントは、MindVaultIPのコアチームとDAOガバナンスが使用する管理財務ダッシュボードについて説明しています。一般ユーザーはこれらの制御に直接アクセスできません。',

    // Overview
    overviewTitle: '概要',
    overviewCols: { col1: 'セクション', col2: '説明' },
    overviewPurpose: '目的',
    overviewPurposeDesc: 'Ideon Cerebrum (IDN) 報酬とプラットフォーム準備金の配布を管理、監視、自動化します。すべての取引は、完全な透明性と検証可能性を確保するために、Baseネットワーク上のスマートコントラクトを介して実行されます。',
    overviewAccess: 'アクセスレベル',
    overviewAccessDesc: '管理者のみ（接続されたウォレットは財務契約の所有者と一致する必要があります）。',
    overviewStatus: 'ステータス',
    overviewStatusDesc: '✅ アクティブ',

    // Balance Summary
    balanceTitle: '財務残高概要',
    balanceCols: { col1: '指標', col2: '説明', col3: '例の値' },
    balanceCurrent: '現在の財務残高',
    balanceCurrentDesc: 'プラットフォーム財務ウォレットに現在保持されている合計IDNトークン。',
    balanceCurrentVal: '23,000,000 IDN',
    balanceDistributed: '配布済み総報酬',
    balanceDistributedDesc: 'ローンチ以来、報酬として配布された合計トークン。',
    balanceDistributedVal: '12,350 IDN',
    balanceRewardRate: '承認済み証明あたりの報酬',
    balanceRewardRateDesc: 'AI評議会によって承認された各証明に対する固定報酬。',
    balanceRewardRateVal: '1 IDN / 証明',
    balanceThreshold: '最低残高しきい値',
    balanceThresholdDesc: '通知または自動補充をトリガーするための財務アラートレベル。',
    balanceThresholdVal: '10,000 IDN',
    balanceStatus: '残高ステータス',
    balanceStatusDesc: '配布が現在アクティブであるかどうかを示します。',
    balanceStatusVal: '🟢 アクティブ / 🔴 一時停止',

    // Fund Management
    fundTitle: '資金管理コントロール',
    fundCols: { col1: 'アクション', col2: '機能', col3: 'メモ' },
    fundAdd: '資金を追加',
    fundAddDesc: 'バックアップまたはセカンダリウォレットから財務にIDNを転送します。',
    fundAddNotes: 'マルチシグネチャによる確認が必要です。',
    fundRemove: '資金を削除',
    fundRemoveDesc: '手動での再配布または緊急流動性のためにトークンを引き出します。',
    fundRemoveNotes: '管理者確認 + DAOログ記録。',
    fundAuto: '自動補充',
    fundAutoDesc: '財務がしきい値未満の場合、バックアップウォレットからの自動補充を有効にします。',
    fundAutoNotes: 'オプション；デフォルトでは無効。',

    // Reward Logic
    rewardTitle: '報酬配布ロジック',
    rewardCols: { col1: 'パラメータ', col2: '機能', col3: '例' },
    rewardTrigger: 'トリガー',
    rewardTriggerDesc: 'AI評議会からの承認済み証明 → イベントが発行される → コントラクトが報酬を送信します。',
    rewardTriggerEg: 'スマートコントラクトの自動呼び出し',
    rewardAmount: '報酬額',
    rewardAmountDesc: '財務設定で定義されています（デフォルト：1 IDN / 証明）。',
    rewardAmountEg: '調整可能',
    rewardCooldown: 'クールダウンタイマー',
    rewardCooldownDesc: '同じ証明IDに対する二重報酬を防ぎます。',
    rewardCooldownEg: '24時間',
    rewardTxType: 'トランザクションタイプ',
    rewardTxTypeDesc: 'オンチェーン (Baseネットワーク)',
    rewardTxTypeEg: 'ハッシュはDAOレジストリに記録されます',

    // Notifications
    notifTitle: '通知とセキュリティ設定',
    notifSetting1: 'メール / ウォレット通知',
    notifSetting1Desc: '残高がしきい値未満の場合、管理者アラートを送信します。',
    notifSetting2: '資金引き出しには2FAが必要',
    notifSetting2Desc: '引き出しのためのオプションの多層セキュリティ。',
    notifSetting3: '監査証跡',
    notifSetting3Desc: 'すべての追加/削除/報酬イベントは、タイムスタンプとウォレットアドレスとともにオンチェーンログに記録されます。',
    notifSetting4: 'DAO透明性',
    notifSetting4Desc: 'ガバナンスが有効になると（2027年）、すべての財務変更はDAOに表示されます。',

    // Activity Log
    logTitle: '最近のアクティビティログ',
    logNote: '注：以下の記録は、財務ダッシュボードの構造を示すためのサンプルデモンストレーションエントリです。実際のオンチェーントランザクションは、2026年にIdeon Cerebrum (IDN)トークンの公式ローンチと統合後に開始されます。',
    logCols: { col1: 'タイムスタンプ', col2: 'アクション', col3: '金額 (IDN)', col4: 'ウォレット', col5: 'ステータス', col6: 'TXハッシュ' },

    // Enhancements
    enhanceTitle: '将来の機能強化（計画済み）',
    enhanceCols: { col1: '機能', col2: '説明', col3: '予定時期' },
    enhanceFeature1: '動的報酬スケーリング',
    enhanceFeature1Desc: 'アイデアの品質に基づいて報酬率を調整します（AI評価 > 85％）。',
    enhanceFeature1Eta: '2026年第2四半期',
    enhanceFeature2: 'ステーキング / 流動性プール',
    enhanceFeature2Desc: 'ユーザーが報酬を得るためにIDNトークンをステーキングしたり、流動性を提供したりできるようにします。',
    enhanceFeature2Eta: '2028',
    enhanceFeature3: 'DAOガバナンス統合',
    enhanceFeature3Desc: '財務管理の決定（例：報酬率の変更）をDAO投票によって制御できるようにします。',
    enhanceFeature3Eta: '2027',

    // Smart Contracts
    contractTitle: 'スマートコントラクト統合',
    contractCols: { col1: 'コンポーネント', col2: 'アドレス', col3: '機能' },
    contractComp1: '財務契約',
    contractAddr1: '0x981eDEe0A3721d049D7343C04363fb38402F4BeC',
    contractFunc1: 'IDNトークンを保持および配布します。',
    contractComp2: 'AI証明検証契約',
    contractAddr2: '(イベントリスナー経由で接続)',
    contractFunc2: '報酬配布をトリガーします。',
    contractComp3: 'DAO財務ガバナンス（将来）',
    contractAddr3: '(TBD — 2027年以降)',
    contractFunc3: 'コミュニティの監視と提案の投票。',

    // Summary
    summaryTitle: 'まとめ',
    summaryIntro: 'プラットフォームの財務は、MindVaultIPの経済的なバックボーンとして機能し、創造性が継続的、透明、かつ持続可能な方法で報われることを保証します。',
    summaryGuarantees: 'それは保証します：',
    summaryPoint1: '完全な透明性とオンチェーンでの説明責任',
    summaryPoint2: '検証されたイノベーターに対する自動的で追跡可能な報酬',
    summaryPoint3: 'プラットフォーム準備金のリアルタイム監視',
    summaryPoint4: '2027年のDAOベースのガバナンスへのシームレスな移行',

    // Tagline
    tagline: 'MindVaultIP財務システム — 人間の創造性の経済を動かす。'
  },
  ko: {
    title: "플랫폼 재무 관리",
    subtitle: "Ideon Cerebrum (IDN) 토큰 분배 및 재무 감독",
    note: "참고: 이 문서는 MindVaultIP 핵심 팀과 DAO 거버넌스가 사용하는 관리용 재무 대시보드에 대해 설명합니다. 일반 사용자는 이러한 제어 기능에 직접 접근할 수 없습니다.",
    overviewTitle: "개요",
    overviewCols: { col1: "섹션", col2: "설명" },
    overviewPurpose: "목적",
    overviewPurposeDesc: "Ideon Cerebrum (IDN) 보상 및 플랫폼 준비금 분배를 관리, 모니터링 및 자동화합니다. 모든 거래는 완전한 투명성과 검증 가능성을 보장하기 위해 Base 네트워크의 스마트 계약을 통해 실행됩니다.",
    overviewAccess: "접근 수준",
    overviewAccessDesc: "관리자 전용 (연결된 지갑은 재무 계약 소유자와 일치해야 함).",
    overviewStatus: "상태",
    overviewStatusDesc: "✅ 활성",
    balanceTitle: "재무 잔액 요약",
    balanceCols: { col1: "지표", col2: "설명", col3: "예시 값" },
    balanceCurrent: "현재 재무 잔액",
    balanceCurrentDesc: "현재 플랫폼 재무 지갑에 보관된 총 IDN 토큰 수.",
    balanceCurrentVal: "23,000,000 IDN",
    balanceDistributed: "총 분배된 보상",
    balanceDistributedDesc: "출시 이후 보상으로 분배된 총 토큰 수.",
    balanceDistributedVal: "12,350 IDN",
    balanceRewardRate: "승인된 증명당 보상",
    balanceRewardRateDesc: "AI 위원회에서 승인한 각 증명에 대한 고정 보상.",
    balanceRewardRateVal: "1 IDN / 증명",
    balanceThreshold: "최소 잔액 임계값",
    balanceThresholdDesc: "알림 또는 자동 보충을 트리거하는 재무 경고 수준.",
    balanceThresholdVal: "10,000 IDN",
    balanceStatus: "잔액 상태",
    balanceStatusDesc: "현재 분배가 활성 상태인지 여부를 나타냅니다.",
    balanceStatusVal: "🟢 활성 / 🔴 일시 중지",
    fundTitle: "자금 관리 제어",
    fundCols: { col1: "작업", col2: "기능", col3: "참고" },
    fundAdd: "자금 추가",
    fundAddDesc: "백업 또는 보조 지갑에서 재무부로 IDN을 전송합니다.",
    fundAddNotes: "다중 서명 확인 필요.",
    fundRemove: "자금 인출",
    fundRemoveDesc: "수동 재분배 또는 비상 유동성을 위해 토큰을 인출합니다.",
    fundRemoveNotes: "관리자 확인 + DAO 로그 기록.",
    fundAuto: "자동 보충",
    fundAutoDesc: "재무 잔액이 임계값 아래로 떨어질 때 백업 지갑에서 자동 충전을 활성화합니다.",
    fundAutoNotes: "선택 사항; 기본적으로 비활성화됨.",
    rewardTitle: "보상 분배 로직",
    rewardCols: { col1: "매개변수", col2: "기능", col3: "예시" },
    rewardTrigger: "트리거",
    rewardTriggerDesc: "AI 위원회의 승인된 증명 → 이벤트 발행 → 계약이 보상 전송.",
    rewardTriggerEg: "스마트 계약 자동 호출",
    rewardAmount: "보상 금액",
    rewardAmountDesc: "재무 설정에서 정의 (기본값: 1 IDN / 증명).",
    rewardAmountEg: "조정 가능",
    rewardCooldown: "쿨다운 타이머",
    rewardCooldownDesc: "동일한 증명 ID에 대한 이중 보상을 방지합니다.",
    rewardCooldownEg: "24시간",
    rewardTxType: "거래 유형",
    rewardTxTypeDesc: "온체인 (Base 네트워크)",
    rewardTxTypeEg: "해시는 DAO 레지스트리에 기록됨",
    notifTitle: "알림 및 보안 설정",
    notifSetting1: "이메일/지갑 알림",
    notifSetting1Desc: "잔액이 임계값 아래로 떨어지면 관리자에게 경고를 보냅니다.",
    notifSetting2: "자금 인출에 2FA 필요",
    notifSetting2Desc: "인출을 위한 선택적 다중 계층 보안.",
    notifSetting3: "감사 추적",
    notifSetting3Desc: "모든 추가/제거/보상 이벤트는 타임스탬프와 지갑 주소와 함께 온체인 로그에 기록됩니다.",
    notifSetting4: "DAO 투명성",
    notifSetting4Desc: "거버넌스가 활성화되면(2027년), 모든 재무 변경 사항이 DAO에 표시됩니다.",
    logTitle: "최근 활동 로그",
    logNote: "참고: 아래 기록은 재무 대시보드의 구조를 설명하기 위한 데모 항목입니다. 실제 온체인 거래는 2026년 Ideon Cerebrum (IDN) 토큰의 공식 출시 및 통합 후에 시작됩니다.",
    logCols: { col1: "타임스탬프", col2: "작업", col3: "금액 (IDN)", col4: "지갑", col5: "상태", col6: "TX 해시" },
    enhanceTitle: "향후 개선 사항 (계획됨)",
    enhanceCols: { col1: "기능", col2: "설명", col3: "예상 시기" },
    enhanceFeature1: "동적 보상 스케일링",
    enhanceFeature1Desc: "아이디어 품질에 따라 보상률을 조정합니다 (AI 점수 > 85%).",
    enhanceFeature1Eta: "2026년 2분기",
    enhanceFeature2: "스테이킹/유동성 풀",
    enhanceFeature2Desc: "사용자가 IDN 토큰을 스테이킹하거나 유동성을 제공하여 보상을 받을 수 있도록 합니다.",
    enhanceFeature2Eta: "2028년",
    enhanceFeature3: "DAO 거버넌스 통합",
    enhanceFeature3Desc: "재무 관리 결정(예: 보상률 변경)을 DAO 투표를 통해 제어할 수 있도록 합니다。",
    enhanceFeature3Eta: "2027년",
    contractTitle: "스마트 계약 통합",
    contractCols: { col1: "구성 요소", col2: "주소", col3: "기능" },
    contractComp1: "재무 계약",
    contractAddr1: "0x981eDEe0A3721d049D7343C04363fb38402F4BeC",
    contractFunc1: "IDN 토큰을 보유하고 분배합니다.",
    contractComp2: "AI 증명 검증 계약",
    contractAddr2: "(이벤트 리스너를 통해 연결)",
    contractFunc2: "보상 분배를 트리거합니다.",
    contractComp3: "DAO 재무 거버넌스 (미래)",
    contractAddr3: "(미정 — 2027년 이후)",
    contractFunc3: "커뮤니티 감독 및 제안 투표.",
    summaryTitle: "요약",
    summaryIntro: "플랫폼 재무부는 MindVaultIP의 경제적 중추 역할을 하며, 창의성이 지속적이고 투명하며 지속 가능한 방식으로 보상받도록 보장합니다.",
    summaryGuarantees: "이를 통해 다음을 보장합니다:",
    summaryPoint1: "완전한 투명성과 온체인 책임성",
    summaryPoint2: "검증된 혁신가에 대한 자동화되고 추적 가능한 보상",
    summaryPoint3: "플랫폼 준비금의 실시간 모니터링",
    summaryPoint4: "2027년 DAO 기반 거버넌스로의 원활한 전환",
    tagline: "MindVaultIP 재무 시스템 — 인류 창의성의 경제를 강화합니다."
  },
  bal: {
    title: "پلیٹ فارم ءِ خزانہ ءِ مدیریت",
    subtitle: "آئیڈیون سیریبرم (IDN) ٹوکن ءِ تقسیم ءُ خزانہ ءِ نگرانی",
    note: "نوٹ: اے دستاویز، انتظامی خزانہ ءِ ڈیش بورڈ ءَ بیان کنت کہ MindVaultIP ءِ بنکی ٹیم ءُ DAO ءِ حکمرانی ءِ وسیلہ ءَ کارمرز بیت. عام یوزر آ کنٹرول آں راست کنٹیکٹ کت نہ کنت.",

    overviewTitle: "سربندی",
    overviewCols: { col1: "بخش", col2: "شرح" },
    overviewPurpose: "مقصد",
    overviewPurposeDesc: "آئیڈیون سیریبرم (IDN) پاداش ءُ پلیٹ فارم ءِ ریزرو ءِ تقسیم ءِ مدیریت، چارگ ءُ آٹومیٹک کنگ. مٹ ءُ پٹل ءِ سرا شفافیت ءُ تصدیق کنگ ءِ واست ءَ تمام ٹرانزیکشن Base نیٹ ورک ءِ سرا اسمارٹ کنٹریکٹانی وسیلہ ءَ کارمرز بنت.",
    overviewAccess: "رسائی ءِ تِر",
    overviewAccessDesc: "تہنا ایڈمن (کنیکٹڈ والیٹ ءَ خزانہ ءِ کنٹریکٹ ءِ مالک ءَ ہمگرنچ بہ بیت).",
    overviewStatus: "حالت",
    overviewStatusDesc: "✅ فعال",

    balanceTitle: "خزانہ ءِ بیلنس ءِ خلاصه",
    balanceCols: { col1: "میٹرک", col2: "شرح", col3: "مثال ءِ قدر" },
    balanceCurrent: "موجودہ خزانہ ءِ بیلنس",
    balanceCurrentDesc: "کل IDN ٹوکن کہ اِشک ءَ پلیٹ فارم ءِ خزانہ ءِ والیٹ ءَ دارگ بوتگ اَنت.",
    balanceCurrentVal: "23,000,000 IDN",
    balanceDistributed: "کل پاداش کہ تقسیم بوتگ اَنت",
    balanceDistributedDesc: "لانچ ءِ رند ءَ پاداش ءِ درگت ءَ تقسیم بوتگیں کل ٹوکن.",
    balanceDistributedVal: "12,350 IDN",
    balanceRewardRate: "ہر منظور شدہ ثبوت ءِ سرا پاداش",
    balanceRewardRateDesc: "AI کونسل ءِ وسیلہ ءَ منظور شدہ ہر ثبوت ءِ واست ءَ مقررہ پاداش.",
    balanceRewardRateVal: "1 IDN / ثبوت",
    balanceThreshold: "کم از کم بیلنس ءِ حد",
    balanceThresholdDesc: "خزانہ ءِ الرٹ لیول کہ نوٹیفیکیشن یا آٹومیٹک ری فل کنگ ءِ واست ءَ کارمرز بیت.",
    balanceThresholdVal: "10,000 IDN",
    balanceStatus: "بیلنس ءِ حالت",
    balanceStatusDesc: "اشارہ کنت کہ تقسیم اِشک ءَ فعال اِنت یا نہ.",
    balanceStatusVal: "🟢 فعال / 🔴 موقوف",

    fundTitle: "فنڈ مینجمنٹ کنٹرولز",
    fundCols: { col1: "کاروائی", col2: "فنگشن", col3: "یادداشت" },
    fundAdd: "فنڈز شامل بکن",
    fundAddDesc: "IDN ءَ بیک اپ یا سیکنڈری والیٹ ءَ چہ خزانہ ءَ منتقل بکن.",
    fundAddNotes: "ملٹی سگنیچر تصدیق ءِ ضرورت اِنت.",
    fundRemove: "فنڈز ڈِلیٹ بکن",
    fundRemoveDesc: "ٹوکن ڈِلیٹ بکن گوں دستی ری ڈسٹری بیوشن یا ایمرجنسی لیکویڈیٹی ءِ واست ءَ.",
    fundRemoveNotes: "ایڈمن ءِ تصدیق + DAO لاگ ریکارڈ.",
    fundAuto: "آٹومیٹک ری فل کنگ",
    fundAutoDesc: "جب خزانہ < حد بوتگ، بیک اپ والیٹ ءَ چہ آٹومیٹک ٹاپ اپ ءَ فعال بکن.",
    fundAutoNotes: "آپشنل؛ بائی ڈیفالٹ غیر فعال اِنت.",

    rewardTitle: "پاداش ءِ تقسیم ءِ منطق",
    rewardCols: { col1: "پیرامیٹر", col2: "فنگشن", col3: "مثال" },
    rewardTrigger: "ٹرگر",
    rewardTriggerDesc: "AI کونسل ءَ چہ منظور شدہ ثبوت ← ایونٹ خارج بیت ← کنٹریکٹ پاداش ءَ دنت.",
    rewardTriggerEg: "اسمارٹ کنٹریکٹ آٹو کال",
    rewardAmount: "پاداش ءِ مقدار",
    rewardAmountDesc: "خزانہ ءِ سیٹنگز ءَ بیان بوتگ (بائی ڈیفالٹ: 1 IDN / ثبوت).",
    rewardAmountEg: "اِڈجسٹ ایبل",
    rewardCooldown: "کول ڈاؤن ٹائمر",
    rewardCooldownDesc: "یک ہی ثبوت ID ءِ واست ءَ دوہری پاداش ءَ اِشکار کنت.",
    rewardCooldownEg: "24 گنٹ",
    rewardTxType: "ٹرانزیکشن ءِ قسم",
    rewardTxTypeDesc: "آن چین (Base نیٹ ورک)",
    rewardTxTypeEg: "ہیش DAO رجسٹری ءَ لاگ اِنت",

    notifTitle: "نوٹیفیکیشن ءُ سیکیورٹی سیٹنگز",
    notifSetting1: "ای میل / والیٹ نوٹیفیکیشن",
    notifSetting1Desc: "جب بیلنس < حد بوتگ، ایڈمن ءَ الرٹ دنت.",
    notifSetting2: "فنڈ ڈِلیٹ کنگ ءِ واست ءَ 2FA ءِ ضرورت اِنت",
    notifSetting2Desc: "ڈِلیٹ کنگ ءِ واست ءَ آپشنل ملٹی لیئر سیکیورٹی.",
    notifSetting3: "آڈٹ ٹریل",
    notifSetting3Desc: "تمام ایڈ/ڈِلیٹ/پاداش ءِ ایونٹ آن چین لاگ ءَ ٹائم اسٹیمپ ءُ والیٹ ایڈریس ءِ ہمراہ ریکارڈ بنت.",
    notifSetting4: "DAO شفافیت",
    notifSetting4Desc: "حکمرانی فعال کنگ ءِ رند ءَ (2027) تمام خزانہ ءِ تبدیلی DAO ءَ ظاہر بنت.",

    logTitle: "تازه تریں سرگرمی لاگ",
    logNote: "نوٹ: جہل ءِ لاگ ڈیمو انٹری اَنت کہ خزانہ ءِ ڈیش بورڈ ءِ لے آؤٹ ءَ پیش دارگ ءِ واست ءَ اَنت. اصل آن چین ٹرانزیکشن سرکاری لانچ ءُ DAO ءِ انٹیگریشن ءِ رند ءَ بناء بنت.",
    logCols: { col1: "ٹائم اسٹیمپ", col2: "کاروائی", col3: "مقدار (IDN)", col4: "والیٹ", col5: "حالت", col6: "TX ہیش" },

    enhanceTitle: "آؤکیں سِلہ بندی (پلینڈ)",
    enhanceCols: { col1: "فیچر", col2: "شرح", col3: "ETA" },
    enhanceFeature1: "متحرک پاداش ءِ سکیلنگ",
    enhanceFeature1Desc: "خیال ءِ کوالٹی ءِ بنیاد ءَ پاداش ءِ ریٹس ءَ اِڈجسٹ بکن (AI ریٹنگ > 85%).",
    enhanceFeature1Eta: "2026 Q2",
    enhanceFeature2: "DAO ءَ ہمگرنچ خزانہ",
    enhanceFeature2Desc: "DAO پاداش ءِ ریٹس ءُ بجٹ ءِ تخصیص ءِ سرا ووٹ دنت.",
    enhanceFeature2Eta: "2027",
    enhanceFeature3: "ریئل ٹائم انالیٹک ڈیش بورڈ",
    enhanceFeature3Desc: "پاداش ءِ بہاؤ، بیلنس ءِ رجحان ءُ ٹرانزیکشن ءِ گرافیکل دیدار.",
    enhanceFeature3Eta: "2026 Q1",
    enhanceFeature4: "عوامی خزانہ ءِ اِکسپلورر",
    enhanceFeature4Desc: "شفافیت ءِ واست ءَ صرف ریڈ اونلی دیدار (یوزران ءِ واست ءَ).",
    enhanceFeature4Eta: "2026 Q3",

    contractTitle: "اسمارٹ کنٹریکٹ اِنتگریشن",
    contractCols: { col1: "جز", col2: "ایڈریس", col3: "فنگشن" },
    contractComp1: "خزانہ ءِ کنٹریکٹ",
    contractAddr1: "0x981eDEe0A3721d049D7343C04363fb38402F4BeC",
    contractFunc1: "IDN ٹوکن ءَ دارت ءُ تقسیم کنت.",
    contractComp2: "AI ثبوت ءِ تصدیق ءِ کنٹریکٹ",
    contractAddr2: "(ایونٹ لسنر ءِ وسیلہ ءَ کنیکٹڈ)",
    contractFunc2: "پاداش ءِ تقسیم ءَ ٹرگر کنت.",
    contractComp3: "DAO خزانہ ءِ حکمرانی (آؤکیں)",
    contractAddr3: "(TBD — 2027 ءِ رند ءَ)",
    contractFunc3: "کمیونٹی ءِ چارگ ءُ تجویزانی سرا ووٹ دنت.",

    summaryTitle: "خلاصه",
    summaryIntro: "پلیٹ فارم خزانہ MindVaultIP ءِ اِکنامک بنکی ہڈی ءِ درگت ءَ کار کنت — اے یقین دنت کہ تخلیقی کار مسلسل، شفاف ءُ پائیدار وڑ ءَ پاداش داتگ بیت.",
    summaryGuarantees: "اے یقین دنت کہ:",
    summaryPoint1: "مکمل شفافیت ءُ آن چین جواب دہی",
    summaryPoint2: "تصدیق شدہ اِینوویٹران ءِ واست ءَ آٹومیٹک، ٹریس ایبل پاداش",
    summaryPoint3: "پلیٹ فارم ءِ ریزرو ءِ ریئل ٹائم چارگ",
    summaryPoint4: "2027 ءَ DAO ءِ بنیاد ءَ حکمرانی ءَ سِرتیں منتقل کنگ",

    tagline: "MindVaultIP خزانہ سسٹم — انسانی تخلیقی کار ءِ اِکنامی ءَ طاقت دنت."
  },
  fr: {
    title: "Gestion de la Trésorerie de la Plateforme",
    subtitle: "Distribution de Jetons Ideon Cerebrum (IDN) & Supervision de la Trésorerie",
    note: "Note : Ce document décrit le tableau de bord administratif de la trésorerie utilisé par l'équipe principale de MindVaultIP et la gouvernance de la DAO. Les utilisateurs généraux n'ont pas d'accès direct à ces contrôles.",
    overviewTitle: "Vue d'ensemble",
    overviewCols: { col1: "Section", col2: "Description" },
    overviewPurpose: "Objectif",
    overviewPurposeDesc: "Gérer, surveiller et automatiser la distribution des récompenses Ideon Cerebrum (IDN) et des réserves de la plateforme. Toutes les transactions sont exécutées via des contrats intelligents sur le réseau Base pour garantir une transparence et une vérifiabilité totales.",
    overviewAccess: "Niveau d'Accès",
    overviewAccessDesc: "Administrateurs uniquement (le portefeuille connecté doit correspondre au propriétaire du contrat de trésorerie).",
    overviewStatus: "Statut",
    overviewStatusDesc: "✅ Actif",
    balanceTitle: "Résumé du Solde de la Trésorerie",
    balanceCols: { col1: "Métrique", col2: "Description", col3: "Exemple de Valeur" },
    balanceCurrent: "Solde Actuel de la Trésorerie",
    balanceCurrentDesc: "Total des jetons IDN actuellement détenus dans le portefeuille de la trésorerie de la plateforme.",
    balanceCurrentVal: "23 000 000 IDN",
    balanceDistributed: "Total des Récompenses Distribuées",
    balanceDistributedDesc: "Total des jetons distribués en récompenses depuis le lancement.",
    balanceDistributedVal: "12 350 IDN",
    balanceRewardRate: "Récompense par Preuve Approuvée",
    balanceRewardRateDesc: "Récompense fixe pour chaque preuve approuvée par le Conseil IA.",
    balanceRewardRateVal: "1 IDN / Preuve",
    balanceThreshold: "Seuil de Solde Minimum",
    balanceThresholdDesc: "Niveau d'alerte de la trésorerie pour déclencher des notifications ou un réapprovisionnement automatique.",
    balanceThresholdVal: "10 000 IDN",
    balanceStatus: "Statut du Solde",
    balanceStatusDesc: "Indique si la distribution est actuellement active.",
    balanceStatusVal: "🟢 Actif / 🔴 En pause",
    fundTitle: "Contrôles de Gestion des Fonds",
    fundCols: { col1: "Action", col2: "Fonction", col3: "Notes" },
    fundAdd: "Ajouter des Fonds",
    fundAddDesc: "Transférer des IDN d'un portefeuille de sauvegarde ou secondaire vers la Trésorerie.",
    fundAddNotes: "Nécessite une confirmation multi-signature.",
    fundRemove: "Retirer des Fonds",
    fundRemoveDesc: "Retirer des jetons pour une redistribution manuelle ou une liquidité d'urgence.",
    fundRemoveNotes: "Confirmation de l'administrateur + journalisation de la DAO.",
    fundAuto: "Réapprovisionnement Automatique",
    fundAutoDesc: "Activer le remplissage automatique depuis le portefeuille de sauvegarde lorsque la trésorerie < seuil.",
    fundAutoNotes: "Optionnel ; désactivé par défaut.",
    rewardTitle: "Logique de Distribution des Récompenses",
    rewardCols: { col1: "Paramètre", col2: "Fonction", col3: "Exemple" },
    rewardTrigger: "Déclencheur",
    rewardTriggerDesc: "Preuve approuvée par le Conseil IA → événement émis → le contrat envoie la récompense.",
    rewardTriggerEg: "Appel automatique du contrat intelligent",
    rewardAmount: "Montant de la Récompense",
    rewardAmountDesc: "Défini dans les paramètres de la Trésorerie (par défaut : 1 IDN / preuve).",
    rewardAmountEg: "Ajustable",
    rewardCooldown: "Délai de Récupération",
    rewardCooldownDesc: "Empêche les doubles récompenses pour le même ID de preuve.",
    rewardCooldownEg: "24h",
    rewardTxType: "Type de Transaction",
    rewardTxTypeDesc: "Sur la chaîne (Réseau Base)",
    rewardTxTypeEg: "Hash enregistré dans le registre de la DAO",
    notifTitle: "Paramètres de Notification & Sécurité",
    notifSetting1: "Notifications par E-mail / Portefeuille",
    notifSetting1Desc: "Envoie une alerte à l'administrateur lorsque le solde < seuil.",
    notifSetting2: "2FA Requis pour le Retrait de Fonds",
    notifSetting2Desc: "Sécurité multicouche optionnelle pour les retraits.",
    notifSetting3: "Piste d'Audit",
    notifSetting3Desc: "Tous les événements d'ajout/retrait/récompense sont consignés dans un journal sur la chaîne avec horodatage et adresse de portefeuille.",
    notifSetting4: "Transparence de la DAO",
    notifSetting4Desc: "Tous les changements de trésorerie visibles par la DAO une fois la gouvernance activée (2027).",
    logTitle: "Journal des Transactions Récentes",
    logNote: "Note : Les journaux suivants sont des entrées de démonstration pour illustrer la disposition du tableau de bord de la trésorerie. Les transactions réelles sur la chaîne commenceront après le lancement officiel et l'intégration de la DAO.",
    tagline: "MindVaultIP: Sécuriser les Idées du Futur.",
    enhanceTitle: "Améliorations Futures",
    enhanceCols: { col1: "Fonctionnalité", col2: "Description", col3: "Date Prévue" },
    enhanceFeature1: "Gouvernance de la DAO",
    enhanceFeature1Desc: "Permettre aux détenteurs de jetons de voter sur les changements de paramètres de la trésorerie.",
    enhanceFeature1Eta: "T4 2026",
    enhanceFeature2: "Récompenses Échelonnées",
    enhanceFeature2Desc: "Ajuster les montants des récompenses en fonction du score IA final d'une preuve.",
    enhanceFeature2Eta: "T1 2027",
    enhanceFeature3: "Staking",
    enhanceFeature3Desc: "Permettre le staking de jetons IDN pour des rendements supplémentaires.",
    enhanceFeature3Eta: "T2 2027",
    enhanceFeature4: "Pont Cross-Chain",
    enhanceFeature4Desc: "Activer le transfert de jetons IDN vers/depuis d'autres réseaux.",
    enhanceFeature4Eta: "T3 2027",
    contractTitle: "Adresses de Contrats Pertinentes",
    contractCols: { col1: "Composant", col2: "Adresse du Contrat", col3: "Fonction" },
    contractComp1: "Contrat de Trésorerie",
    contractAddr1: "0xTreasury...",
    contractFunc1: "Gère les soldes et les distributions",
    contractComp2: "Contrat de Récompense",
    contractAddr2: "0xReward...",
    contractFunc2: "Exécute les transferts de récompenses",
    contractComp3: "Contrat de Gouvernance DAO",
    contractAddr3: "0xDAO...",
    contractFunc3: "Contrôle les mises à jour des paramètres",
    summaryTitle: "Résumé & Garantie",
    summaryIntro: "Ce tableau de bord fournit un aperçu transparent et vérifiable de la trésorerie qui alimente l'écosystème de récompenses de MindVaultIP.",
    summaryGuarantees: "Il garantit :",
    summaryPoint1: "Transparence : Toutes les transactions sont sur la chaîne.",
    summaryPoint2: "Automatisation : Élimine les erreurs humaines dans la distribution des récompenses.",
    summaryPoint3: "Sécurité : Les fonds sont détenus dans un contrat multi-signature.",
    summaryPoint4: "Gouvernance : Les changements futurs seront pilotés par la communauté.",
    logCols: { col1: "Horodatage", col2: "Action", col3: "Montant", col4: "Portefeuille", col5: "Statut", col6: "Transaction" }
  },
  sw: {
    title: "Usimamizi wa Hazina ya Jukwaa",
    subtitle: "Usambazaji wa Tokeni za Ideon Cerebrum (IDN) & Usimamizi wa Hazina",
    note: "Kumbuka: Hati hii inaelezea Dashibodi ya Utawala ya Hazina inayotumiwa na timu kuu ya MindVaultIP na Utawala wa DAO. Watumiaji wa jumla hawana ufikiaji wa moja kwa moja kwa vidhibiti hivi.",
    overviewTitle: "Muhtasari",
    overviewCols: { col1: "Sehemu", col2: "Maelezo" },
    overviewPurpose: "Kusudi",
    overviewPurposeDesc: "Kusimamia, kufuatilia, na kuendesha usambazaji wa zawadi za Ideon Cerebrum (IDN) na akiba ya jukwaa. Shughuli zote hufanywa kupitia mikataba janja kwenye Mtandao wa Base ili kuhakikisha uwazi kamili na uhakikishaji.",
    overviewAccess: "Kiwango cha Ufikiaji",
    overviewAccessDesc: "Wasimamizi pekee (pochi iliyounganishwa lazima ilingane na mmiliki wa Mkataba wa Hazina).",
    overviewStatus: "Hali",
    overviewStatusDesc: "✅ Inatumika",
    balanceTitle: "Muhtasari wa Salio la Hazina",
    balanceCols: { col1: "Kipimo", col2: "Maelezo", col3: "Thamani ya Mfano" },
    balanceCurrent: "Salio la Sasa la Hazina",
    balanceCurrentDesc: "Jumla ya tokeni za IDN zilizopo sasa kwenye pochi ya hazina ya jukwaa.",
    balanceCurrentVal: "23,000,000 IDN",
    balanceDistributed: "Jumla ya Zawadi Zilizosambazwa",
    balanceDistributedDesc: "Jumla ya tokeni zilizosambazwa kama zawadi tangu kuzinduliwa.",
    balanceDistributedVal: "12,350 IDN",
    balanceRewardRate: "Zawadi kwa Kila Uthibitisho Ulioidhinishwa",
    balanceRewardRateDesc: "Zawadi isiyobadilika kwa kila uthibitisho ulioidhinishwa na Baraza la AI.",
    balanceRewardRateVal: "1 IDN / Uthibitisho",
    balanceThreshold: "Kiwango cha Chini cha Salio",
    balanceThresholdDesc: "Kiwango cha tahadhari cha hazina ili kuanzisha arifa au kujaza upya kiotomatiki.",
    balanceThresholdVal: "10,000 IDN",
    balanceStatus: "Hali ya Salio",
    balanceStatusDesc: "Inaonyesha kama usambazaji unaendelea kwa sasa.",
    balanceStatusVal: "🟢 Inatumika / 🔴 Imesitishwa",
    fundTitle: "Vidhibiti vya Usimamizi wa Fedha",
    fundCols: { col1: "Kitendo", col2: "Kazi", col3: "Maelezo" },
    fundAdd: "Ongeza Fedha",
    fundAddDesc: "Hamisha IDN kutoka pochi ya akiba au ya pili kwenda kwenye Hazina.",
    fundAddNotes: "Inahitaji uthibitisho wa saini-nyingi.",
    fundRemove: "Toa Fedha",
    fundRemoveDesc: "Toa tokeni kwa ajili ya usambazaji wa mikono au ukwasi wa dharura.",
    fundRemoveNotes: "Uthibitisho wa msimamizi + kumbukumbu ya DAO.",
    fundAuto: "Jaza Upya Kiotomatiki",
    fundAutoDesc: "Washa kujaza kiotomatiki kutoka pochi ya akiba wakati hazina < kiwango cha chini.",
    fundAutoNotes: "Hiari; imezimwa kwa chaguo-msingi.",
    rewardTitle: "Mantiki ya Usambazaji wa Zawadi",
    rewardCols: { col1: "Kigezo", col2: "Kazi", col3: "Mfano" },
    rewardTrigger: "Kianzilishi",
    rewardTriggerDesc: "Uthibitisho umeidhinishwa na Baraza la AI → tukio limetolewa → mkataba unatoa zawadi.",
    rewardTriggerEg: "Wito wa mkataba janja wa kiotomatiki",
    rewardAmount: "Kiasi cha Zawadi",
    rewardAmountDesc: "Imebainishwa katika mipangilio ya Hazina (chaguo-msingi: 1 IDN / uthibitisho).",
    rewardAmountEg: "Inaweza kubadilishwa",
    rewardCooldown: "Kipima Muda cha Kupoa",
    rewardCooldownDesc: "Inazuia zawadi mara mbili kwa ID ya uthibitisho sawa.",
    rewardCooldownEg: "Saa 24",
    rewardTxType: "Aina ya Muamala",
    rewardTxTypeDesc: "Kwenye mnyororo (Mtandao wa Base)",
    rewardTxTypeEg: "Hashi imerekodiwa kwenye kumbukumbu ya DAO",
    notifTitle: "Mipangilio ya Arifa na Usalama",
    notifSetting1: "Arifa za Barua Pepe / Pochi",
    notifSetting1Desc: "Hutuma tahadhari kwa msimamizi wakati salio < kiwango cha chini.",
    notifSetting2: "2FA Inahitajika kwa Utoaji wa Fedha",
    notifSetting2Desc: "Usalama wa hiari wa tabaka nyingi kwa utoaji.",
    notifSetting3: "Njia ya Ukaguzi",
    notifSetting3Desc: "Matukio yote ya kuongeza/kutoa/zawadi hurekodiwa kwenye kumbukumbu ya mnyororo na muhuri wa muda na anwani ya pochi.",
    notifSetting4: "Uwazi wa DAO",
    notifSetting4Desc: "Mabadiliko yote ya hazina yanaonekana na DAO mara utawala utakapowashwa (2027).",
    logTitle: "Kumbukumbu ya Shughuli za Hivi Karibuni",
    logNote: "Kumbuka: Kumbukumbu zifuatazo ni maingizo ya onyesho ili kuonyesha muundo wa Dashibodi ya Hazina. Shughuli halisi za mnyororo zitaanza baada ya uzinduzi rasmi na ujumuishaji wa DAO.",
    tagline: "MindVaultIP: Kulinda Mawazo ya Baadaye.",
    enhanceTitle: "Maboresho ya Baadaye",
    enhanceCols: { col1: "Kipengele", col2: "Maelezo", col3: "Tarehe ya Kukamilika" },
    enhanceFeature1: "Utawala wa DAO",
    enhanceFeature1Desc: "Kuwezesha wamiliki wa tokeni kupiga kura juu ya mabadiliko ya vigezo vya hazina.",
    enhanceFeature1Eta: "Q4 2026",
    enhanceFeature2: "Zawadi za Ngazi",
    enhanceFeature2Desc: "Kurekebisha kiasi cha zawadi kulingana na alama ya mwisho ya AI ya uthibitisho.",
    enhanceFeature2Eta: "Q1 2027",
    enhanceFeature3: "Kuweka Hisa (Staking)",
    enhanceFeature3Desc: "Kuwezesha kuweka hisa tokeni za IDN kwa mapato ya ziada.",
    enhanceFeature3Eta: "Q2 2027",
    enhanceFeature4: "Daraja la Mitandao-Mingi (Cross-Chain Bridge)",
    enhanceFeature4Desc: "Kuwezesha uhamisho wa tokeni za IDN kwenda/kutoka mitandao mingine.",
    enhanceFeature4Eta: "Q3 2027",
    contractTitle: "Anwani za Mikataba Husika",
    contractCols: { col1: "Sehemu", col2: "Anwani ya Mkataba", col3: "Kazi" },
    contractComp1: "Mkataba wa Hazina",
    contractAddr1: "0xTreasury...",
    contractFunc1: "Husimamia salio na usambazaji",
    contractComp2: "Mkataba wa Zawadi",
    contractAddr2: "0xReward...",
    contractFunc2: "Hutekeleza uhamisho wa zawadi",
    contractComp3: "Mkataba wa Utawala wa DAO",
    contractAddr3: "0xDAO...",
    contractFunc3: "Hudhibiti sasisho za vigezo",
    summaryTitle: "Muhtasari na Dhamana",
    summaryIntro: "Dashibodi hii inatoa muhtasari wa uwazi na unaoweza kuthibitishwa wa hazina inayoendesha mfumo wa zawadi wa MindVaultIP.",
    summaryGuarantees: "Inahakikisha:",
    summaryPoint1: "Uwazi: Shughuli zote ziko kwenye mnyororo.",
    summaryPoint2: "Otomatiki: Huondoa makosa ya kibinadamu katika usambazaji wa zawadi.",
    summaryPoint3: "Usalama: Fedha huhifadhiwa katika mkataba wa saini-nyingi.",
    summaryPoint4: "Utawala: Mabadiliko ya baadaye yataendeshwa na jamii.",
    logCols: { col1: "Muda", col2: "Kitendo", col3: "Kiasi", col4: "Pochi", col5: "Hali", col6: "Muamala" }
  },
    yo: {
        title: "Isakoso Iṣura Syeed",
        subtitle: "Pipin Token Ideon Cerebrum (IDN) & Isakoso Iṣura",
        note: "Akiyesi: Iwe yii n ṣalaye Igbimọ Isakoso Iṣura ti a lo nipasẹ ẹgbẹ mojuto MindVaultIP ati Isakoso DAO. Awọn olumulo gbogbogbo ko ni iwọle taara si awọn iṣakoso wọnyi.",

        overviewTitle: "Akopọ Iṣura",
        overviewCols: { col1: "Apakan", col2: "Apejuwe" },
        overviewPurpose: "Idi",
        overviewPurposeDesc: "Lati ṣakoso, ṣe abojuto, ati ṣe adaṣe pinpin awọn ere Ideon Cerebrum (IDN) ati awọn ifiṣura pẹpẹ. Gbogbo awọn iṣowo ni a ṣe nipasẹ awọn adehun smati lori Nẹtiwọọki Base lati rii daju akoyawo ni kikun ati ijẹrisi.",
        overviewAccess: "Ipele Wiwọle",
        overviewAccessDesc: "Alakoso nikan (apamọwọ ti a sopọ gbọdọ baramu pẹlu oniwun adehun iṣura).",
        overviewStatus: "Ipo",
        overviewStatusDesc: "✅ Nṣiṣe lọwọ",

        balanceTitle: "Akopọ Iwọntunwọnsi Iṣura",
        balanceCols: { col1: "Metiriki", col2: "Apejuwe", col3: "Iye Apẹẹrẹ" },
        balanceCurrent: "Iwọntunwọnsi Iṣura lọwọlọwọ",
        balanceCurrentDesc: "Apapọ awọn ami IDN ti o wa lọwọlọwọ ninu apamọwọ iṣura pẹpẹ.",
        balanceCurrentVal: "23,000,000 IDN",
        balanceDistributed: "Apapọ Awọn ere ti a pin",
        balanceDistributedDesc: "Lapapọ awọn ami ti a pin gẹgẹbi awọn ere lati igba ifilọlẹ.",
        balanceDistributedVal: "12,350 IDN",
        balanceRewardRate: "Ẹsan fun Ẹri Ti a fọwọsi",
        balanceRewardRateDesc: "Ẹsan ti o wa titi fun gbogbo ẹri ti Igbimọ AI fọwọsi.",
        balanceRewardRateVal: "1 IDN / Ẹri",
        balanceThreshold: "Ifilelẹ Iwọntunwọnsi Kere julọ",
        balanceThresholdDesc: "Ipele itaniji iṣura lati fa awọn iwifunni tabi atunṣe aifọwọyi.",
        balanceThresholdVal: "10,000 IDN",
        balanceStatus: "Ipo Iwọntunwọnsi",
        balanceStatusDesc: "Ṣe afihan boya pinpin nṣiṣe lọwọ lọwọlọwọ.",
        balanceStatusVal: "🟢 Nṣiṣe lọwọ / 🔴 Ti daduro",

        fundTitle: "Awọn Iṣẹ Isakoso Fund",
        fundCols: { col1: "Iṣẹ", col2: "Apejuwe", col3: "Awọn Akọsilẹ" },
        fundAdd: "Ṣafikun Awọn Owo",
        fundAddDesc: "Gbe IDN tabi ETH lọ si adirẹsi iṣura lati ṣafikun awọn owo fun awọn ere ati awọn iṣẹ ṣiṣe.",
        fundAddNotes: "Nilo ifọwọsi ibuwọlu-pupọ.",
        fundRemove: "Yọ Awọn Owo kuro",
        fundRemoveDesc: "Fun lilo DAO nikan. Yiyọkuro awọn owo nilo ibo iṣakoso.",
        fundRemoveNotes: "Ifọwọsi Alakoso + igbasilẹ igbasilẹ DAO.",
        fundAuto: "Atunṣe Aifọwọyi",
        fundAutoDesc: "Mu atunṣe aifọwọyi ṣiṣẹ lati apamọwọ afẹyinti nigbati iṣura < ifilelẹ.",
        fundAutoNotes: "Iyan; alaabo nipasẹ aiyipada.",

        rewardTitle: "Awọn Ilana Isanwo Ẹsan",
        rewardCols: { col1: "Paramita", col2: "Iṣẹ", col3: "Apẹẹrẹ" },
        rewardTrigger: "Okunfa",
        rewardTriggerDesc: "Ẹri ti a fọwọsi lati Igbimọ AI → iṣẹlẹ ti a tu silẹ → adehun nfi ere ranṣẹ.",
        rewardTriggerEg: "Ipe adehun smati aifọwọyi",
        rewardAmount: "Iye Ẹsan",
        rewardAmountDesc: "Ti asọye ni awọn eto Iṣura (aiyipada: 1 IDN / ẹri).",
        rewardAmountEg: "1 - 3 IDN (da lori ẹka)",
        rewardCooldown: "Aago isinmi",
        rewardCooldownDesc: "Ṣe idilọwọ awọn ere ilọpo meji fun ID ẹri kanna.",
        rewardCooldownEg: "Wakati 24",
        rewardTxType: "Iru Iṣowo",
        rewardTxTypeDesc: "Lori-ẹwọn (Nẹtiwọọki Base)",
        rewardTxTypeEg: "Hash ti a gbasilẹ ninu iforukọsilẹ DAO",

        notifTitle: "Awọn eto Iwifunni & Aabo",
        notifSetting1: "Iwifunni Imeeli / Apamọwọ",
        notifSetting1Desc: "Nfi itaniji alakoso ranṣẹ nigbati iwọntunwọnsi < ifilelẹ.",
        notifSetting2: "2FA Ti beere fun Yiyọ Fund",
        notifSetting2Desc: "Aabo-ipele pupọ aṣayan fun awọn yiyọ kuro.",
        notifSetting3: "Ọna ayewo",
        notifSetting3Desc: "Gbogbo awọn iṣẹlẹ fifi / yiyọ / ere ti a gbasilẹ ninu log lori-ẹwọn pẹlu akoko ati adirẹsi apamọwọ.",
        notifSetting4: "Akoyawo DAO",
        notifSetting4Desc: "Gbogbo awọn iyipada iṣura ti o han si DAO ni kete ti ijọba ti muu ṣiṣẹ (2027).",

        logTitle: "Iwe Akọọlẹ Iṣowo Iṣura",
        logNote: "Akiyesi: Awọn igbasilẹ wọnyi jẹ awọn titẹsi ifihan apẹẹrẹ lati ṣe afihan eto Dashibodi Iṣura. Awọn iṣowo lori-ẹwọn gidi yoo bẹrẹ lẹhin ifilọlẹ osise ati isọpọ ti ami Ideon Cerebrum (IDN) ni ọdun 2026.",
        logCols: { col1: "Akoko", col2: "Iru", col3: "Iye", col4: "Lati/Si", col5: "Ipo", col6: "Hash iṣowo" },

        enhanceTitle: "Awọn imudara ọjọ iwaju (Ti gbero)",
        enhanceCols: { col1: "Ẹya", col2: "Apejuwe", col3: "ETA" },
        enhanceFeature1: "Staking IDN",
        enhanceFeature1Desc: "Gba awọn ere nipa titiipa awọn tokeni IDN rẹ.",
        enhanceFeature1Eta: "Ti gbero",
        enhanceFeature2: "Awọn ipele Ẹsan Yiyi",
        enhanceFeature2Desc: "Awọn iye ẹsan ti a ṣatunṣe ni agbara ti o da lori ilera nẹtiwọọki.",
        enhanceFeature2Eta: "Ni Atunyẹwo",
        enhanceFeature3: "Ijẹrisi Isakoso DAO",
        enhanceFeature3Desc: "Gba awọn ipinnu iṣakoso iṣura laaye (fun apẹẹrẹ, iyipada awọn oṣuwọn ere) lati ṣakoso nipasẹ idibo DAO.",
        enhanceFeature3Eta: "Ọdun 2027",

        contractTitle: "Ijẹrisi Adehun Smart",
        contractCols: { col1: "Paati", col2: "Adirẹsi", col3: "Iṣẹ" },
        contractComp1: "Adehun Iṣura",
        contractAddr1: "0x981eDEe0A3721d049D7343C04363fb38402F4BeC", // Placeholder from EN
        contractFunc1: "Dimu ati pinpin awọn ami IDN.",
        contractComp2: "Adehun Ifọwọsi AI Proof",
        contractAddr2: "(ti a sopọ nipasẹ olutẹtisi iṣẹlẹ)",
        contractFunc2: "Ṣe okunfa pinpin ere.",
        contractComp3: "Isakoso Iṣura DAO (ọjọ iwaju)",
        contractAddr3: "(TBD — lẹhin 2027)", // Placeholder from EN
        contractFunc3: "Abojuto agbegbe ati idibo igbero.",

        summaryTitle: "Akopọ",
        summaryIntro: "Iṣura MindVaultIP jẹ apakan pataki ti o ṣe iwuri fun ilowosi ati ṣe idaniloju idagbasoke igba pipẹ ti pẹpẹ. Gbogbo awọn iṣẹ ṣiṣe ni a ṣe ni gbangba lori blockchain, ni ibamu pẹlu ifaramo wa si akoyawo.",
        summaryGuarantees: "O ṣe iṣeduro:",
        summaryPoint1: "Akoyawo pipe ati iṣiro lori-ẹwọn",
        summaryPoint2: "Aifọwọyi, awọn ere ti o le tọpa fun awọn oludasile ti a fọwọsi",
        summaryPoint3: "Abojuto akoko gidi ti awọn ifiṣura pẹpẹ",
        summaryPoint4: "Iyipada laisiyonu si ijọba ti o da lori DAO ni ọdun 2027",

        tagline: "MindVaultIP Treasury System — Agbara Iṣowo ti Ṣiṣẹda Eniyan."
    },
    ha: {
        title: "Gudanar da Taskar Ajiya ta Dandalin",
        subtitle: "Rarraba Alamar Ideon Cerebrum (IDN) & Gudanar da Taskar Ajiya",
        note: "Lura: Wannan takarda tana bayanin Kwamitin Gudanarwa na Taskar Ajiya da ƙungiyar MindVaultIP da Gudanarwar DAO ke amfani da ita. Masu amfani na yau da kullun ba su da damar shiga waɗannan sarrafawa kai tsaye.",
        overviewTitle: "Bayanin Taskar Ajiya",
        overviewCols: { col1: "Abu", col2: "Matsayin Yanzu" },
        overviewRows: {
            row1: "Adireshin Taskar Ajiya na Farko",
            row2: "Jimlar Kayayyakin Cerebrum (IDN)",
            row3: "Cerebrum da aka Rarraba",
            row4: "Cerebrum da ya Rage don Lada",
            row5: "Matsayin Taskar Ajiya"
        },
        balanceTitle: "Ma'aunan Taskar Ajiya na Yanzu",
        balanceCols: { col1: "Kadara", col2: "Ma'auni", col3: "Daraja (USD)" },
        balanceRows: {
            row1: "Ideon Cerebrum (IDN)",
            row2: "ETH (don kuɗaɗen gas)",
            row3: "Jimlar Darajar Taskar Ajiya"
        },
        fundTitle: "Ayyukan Gudanar da Asusun",
        fundCols: { col1: "Aiki", col2: "Bayani", col3: "Aiki" },
        fundRows: {
            row1: { title: "Ƙara Kuɗi", desc: "Canja wurin IDN ko ETH zuwa adireshin taskar ajiya don sake cika kuɗaɗe don lada da ayyuka." },
            row2: { title: "Cire Kuɗi", desc: "Don amfanin DAO kawai. Cire kuɗaɗe yana buƙatar kuri'ar gudanarwa." }
        },
        rewardTitle: "Dokokin Biyan Lada",
        rewardCols: { col1: "Mai Jawo", col2: "Adadin Lada (IDN)", col3: "Matsayi" },
        rewardRows: {
            row1: { trigger: "Amincewa da Sabon Tabbaci", desc: "Ana biya kai tsaye lokacin da tabbaci ya wuce bita na AI ko na ƙwararru.", amount: "1 - 3 IDN (ya danganta da rukuni)", status: "Mai Aiki" },
            row2: { trigger: "Bita na Ƙwararru", desc: "Ana biyan ƙwararru don bitar abubuwan da aka gabatar.", amount: "DAO ta saita", status: "Mai Aiki" }
        },
        logTitle: "Littafin Lissafin Ma'amala na Taskar Ajiya",
        logCols: { col1: "Lokaci", col2: "Nau'i", col3: "Adadin", col4: "Daga/Zuwa", col5: "Matsayi", col6: "Hash na ma'amala" },
        enhanceTitle: "Ingantawa na DAO & Ayyukan Gaba",
        enhanceCols: { col1: "Siffa", col2: "Bayani", col3: "Matsayi" },
        enhanceRows: {
            row1: { feature: "Staking IDN", desc: "Sami lada ta hanyar kulle alamun IDN ɗinku.", status: "An Shirya" },
            row2: { feature: "Matakan Lada Masu Sauyawa", desc: "Ana daidaita adadin lada da kuzari dangane da lafiyar hanyar sadarwa.", status: "A Bita" }
        },
        contractTitle: "Bayanin Kwangilar Wayo ta Taskar Ajiya",
        contractCols: { col1: "Kayan aiki", col2: "Adireshin Kwangila", col3: "Hanyar sadarwa" },
        contractRows: {
            row1: { property: "Kwangilar Taskar Ajiya", network: "Base Mainnet" },
            row2: { property: "Kwangilar Alamar IDN", network: "Base Mainnet" }
        },
        summaryTitle: "Taƙaitawa",
        summary: "Taskar ajiya ta MindVaultIP wani muhimmin sashi ne da ke ƙarfafa gudummawa da tabbatar da ci gaban dandalin na dogon lokaci. Duk ayyuka ana yin su a bayyane akan blockchain, daidai da alƙawarinmu na gaskiya."
    },
};
