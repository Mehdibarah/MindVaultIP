
import React, { useState } from 'react';
import { ShieldCheck, Key, AlertTriangle, ClipboardCheck, Lock, RefreshCw, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const translations = {
    en: {
        title: "Wallet Security & Best Practices",
        intro: "Your wallet is your gateway to the MindVaultIP ecosystem — and you are your own bank. Protecting it is your responsibility. Follow these essential tips to keep your digital assets and intellectual property secure.",
        tip1Title: "1. Use a Hardware Wallet",
        tip1Desc: "For maximum security, store your assets in a hardware wallet (such as Ledger or Trezor). These devices keep your private keys offline, making them immune to most online attacks.",
        tip2Title: "2. Never Share Your Seed Phrase",
        tip2Desc: "Your 12 or 24-word seed phrase is the master key to your wallet. Anyone with this phrase has full control over your funds and registered assets. Never share it with anyone — not even MindVaultIP staff — and never type it into any website. Store it offline, in a secure physical location.",
        tip3Title: "3. Beware of Phishing Scams",
        tip3Desc: "MindVaultIP will NEVER ask for your private key, seed phrase, or passwords. Be cautious of fake websites, emails, or DMs asking you to “verify” or “connect your wallet.” Always ensure you are on the official domain: mindvaultip.com",
        tip4Title: "4. Verify Transactions Carefully",
        tip4Desc: "Before confirming a transaction, always review the wallet screen details — recipient address, token amount, and network fees. Fraudulent sites may attempt to trick you into signing malicious contracts.",
        tip5Title: "5. Use Strong, Unique Passwords",
        tip5Desc: "Protect your wallet and connected devices with strong, unique passwords. Enable two-factor authentication (2FA) wherever possible. Use a reputable password manager for convenience and safety.",
        tip6Title: "6. Keep Software Updated",
        tip6Desc: "Regularly update your browser, wallet extensions, and security software to patch vulnerabilities. Old software versions are prime targets for attackers.",
        tip7Title: "7. Double-Check Network Settings",
        tip7Desc: "Always ensure you are on the Base Network (Mainnet) when interacting with MindVaultIP. Connecting to the wrong network or fake RPC endpoints may result in loss of funds.",
        disclaimerTitle: "Disclaimer",
        disclaimer: "This information is for educational purposes only. MindVaultIP assumes no liability for any loss of funds resulting from user negligence or failure to follow best practices. Your wallet — your responsibility."
    },
    fa: {
        title: "امنیت کیف پول و بهترین شیوه‌ها",
        intro: "کیف پول شما دروازه‌ی ورود به اکوسیستم MindVaultIP است — و شما بانک خودتان هستید. حفاظت از آن مسئولیت شماست. این نکات ضروری را برای ایمن نگه داشتن دارایی‌های دیجیتال و مالکیت معنوی خود دنبال کنید.",
        tip1Title: "۱. از یک کیف پول سخت‌افزاری استفاده کنید",
        tip1Desc: "برای حداکثر امنیت، دارایی‌های خود را در یک کیف پول سخت‌افزاری (مانند Ledger یا Trezor) ذخیره کنید. این دستگاه‌ها کلیدهای خصوصی شما را آفلاین نگه می‌دارند و آن‌ها را در برابر اکثر حملات آنلاین مصون می‌سازند.",
        tip2Title: "۲. عبارت بازیابی خود را هرگز به اشتراک نگذارید",
        tip2Desc: "عبارت بازیابی ۱۲ یا ۲۴ کلمه‌ای شما، کلید اصلی کیف پول شماست. هر کسی که این عبارت را داشته باشد، کنترل کامل بر روی وجوه و دارایی‌های ثبت‌شده شما خواهد داشت. هرگز آن را با کسی — حتی کارمندان MindVaultIP — به اشتراک نگذارید و هرگز آن را در هیچ وب‌سایتی وارد نکنید. آن را به صورت آفلاین، در یک مکان فیزیکی امن، ذخیره کنید.",
        tip3Title: "۳. مراقب کلاهبرداری‌های فیشینگ باشید",
        tip3Desc: "MindVaultIP هرگز کلید خصوصی، عبارت بازیابی یا رمزهای عبور شما را درخواست نخواهد کرد. مراقب وب‌سایت‌ها، ایمیل‌ها یا پیام‌های مستقیم جعلی که از شما می‌خواهند «کیف پول خود را تأیید» یا «متصل کنید» باشید. همیشه اطمینان حاصل کنید که در دامنه رسمی هستید: mindvaultip.com",
        tip4Title: "۴. تراکنش‌ها را با دقت تأیید کنید",
        tip4Desc: "قبل از تأیید یک تراکنش، همیشه جزئیات صفحه نمایش کیف پول — آدرس گیرنده، مقدار توکن و هزینه‌های شبکه — را بررسی کنید. سایت‌های متقلب ممکن است تلاش کنند شما را فریب دهند تا قراردادهای مخرب را امضا کنید.",
        tip5Title: "۵. از رمزهای عبور قوی و منحصربه‌فرد استفاده کنید",
        tip5Desc: "از کیف پول و دستگاه‌های متصل خود با رمزهای عبور قوی و منحصربه‌فرد محافظت کنید. در هر جایی که ممکن است، احراز هویت دو مرحله‌ای (2FA) را فعال کنید. برای راحتی و ایمنی، از یک مدیر رمز عبور معتبر استفاده کنید.",
        tip6Title: "۶. نرم‌افزار را به‌روز نگه دارید",
        tip6Desc: "مرورگر، افزونه‌های کیف پول و نرم‌افزارهای امنیتی خود را به طور منظم به‌روزرسانی کنید تا آسیب‌پذیری‌ها برطرف شوند. نسخه‌های قدیمی نرم‌افزار اهداف اصلی مهاجمان هستند.",
        tip7Title: "۷. تنظیمات شبکه را دوباره بررسی کنید",
        tip7Desc: "همیشه هنگام تعامل با MindVaultIP اطمینان حاصل کنید که روی شبکه Base (شبکه اصلی) هستید. اتصال به شبکه اشتباه یا نقاط پایانی RPC جعلی ممکن است منجر به از دست رفتن وجوه شود.",
        disclaimerTitle: "سلب مسئولیت",
        disclaimer: "این اطلاعات فقط برای اهداف آموزشی است. MindVaultIP هیچ مسئولیتی در قبال از دست رفتن وجوه ناشی از سهل‌انگاری کاربر یا عدم رعایت بهترین شیوه‌ها بر عهده نمی‌گیرد. کیف پول شما — مسئولیت شماست."
    },
    fr: {
        title: "Sécurité du Portefeuille & Meilleures Pratiques",
        intro: "Votre portefeuille est votre passerelle vers l'écosystème MindVaultIP — et vous êtes votre propre banque. Le protéger est votre responsabilité. Suivez ces conseils essentiels pour garder vos actifs numériques et votre propriété intellectuelle en sécurité.",
        tip1Title: "1. Utilisez un Portefeuille Matériel",
        tip1Desc: "Pour une sécurité maximale, stockez vos actifs dans un portefeuille matériel (tel que Ledger ou Trezor). Ces appareils conservent vos clés privées hors ligne, les rendant immunisés contre la plupart des attaques en ligne.",
        tip2Title: "2. Ne Partagez Jamais Votre Phrase de Récupération",
        tip2Desc: "Votre phrase de récupération de 12 ou 24 mots est la clé maîtresse de votre portefeuille. Toute personne possédant cette phrase a un contrôle total sur vos fonds et vos actifs enregistrés. Ne la partagez jamais avec qui que ce soit — pas même le personnel de MindVaultIP — et ne la tapez jamais sur un site web. Conservez-la hors ligne, dans un endroit physique sécurisé.",
        tip3Title: "3. Méfiez-vous des Arnaques par Hameçonnage (Phishing)",
        tip3Desc: "MindVaultIP ne vous demandera JAMAIS votre clé privée, votre phrase de récupération ou vos mots de passe. Soyez prudent face aux faux sites web, e-mails ou messages directs vous demandant de « vérifier » ou de « connecter votre portefeuille ». Assurez-vous toujours d'être sur le domaine officiel : mindvaultip.com",
        tip4Title: "4. Vérifiez Soigneusement les Transactions",
        tip4Desc: "Avant de confirmer une transaction, examinez toujours les détails de l'écran du portefeuille — adresse du destinataire, montant du jeton et frais de réseau. Les sites frauduleux peuvent tenter de vous tromper pour vous faire signer des contrats malveillants.",
        tip5Title: "5. Utilisez des Mots de Passe Forts et Uniques",
        tip5Desc: "Protégez votre portefeuille et vos appareils connectés avec des mots de passe forts et uniques. Activez l'authentification à deux facteurs (2FA) partout où c'est possible. Utilisez un gestionnaire de mots de passe réputé pour plus de commodité et de sécurité.",
        tip6Title: "6. Maintenez les Logiciels à Jour",
        tip6Desc: "Mettez régulièrement à jour votre navigateur, vos extensions de portefeuille et vos logiciels de sécurité pour corriger les vulnérabilités. Les anciennes versions de logiciels sont des cibles de choix pour les attaquants.",
        tip7Title: "7. Vérifiez les Paramètres Réseau",
        tip7Desc: "Assurez-vous toujours d'être sur le réseau Base (Mainnet) lorsque vous interagissez avec MindVaultIP. Se connecter au mauvais réseau ou à de faux points de terminaison RPC peut entraîner une perte de fonds.",
        disclaimerTitle: "Avis de Non-responsabilité",
        disclaimer: "Ces informations sont fournies à des fins éducatives uniquement. MindVaultIP n'assume aucune responsabilité pour toute perte de fonds résultant de la négligence de l'utilisateur ou du non-respect des meilleures pratiques. Votre portefeuille — votre responsabilité."
    },
    ar: {
        title: "أمان المحفظة وأفضل الممارسات",
        intro: "محفظتك هي بوابتك إلى نظام MindVaultIP البيئي — وأنت مصرفك الخاص. حمايتها هي مسؤوليتك. اتبع هذه النصائح الأساسية للحفاظ على أصولك الرقمية وملكيتك الفكرية آمنة.",
        tip1Title: "١. استخدم محفظة أجهزة",
        tip1Desc: "للحصول على أقصى درجات الأمان، قم بتخزين أصولك في محفظة أجهزة (مثل Ledger أو Trezor). تحافظ هذه الأجهزة على مفاتيحك الخاصة في وضع عدم الاتصال، مما يجعلها محصنة ضد معظم الهجمات عبر الإنترنت.",
        tip2Title: "٢. لا تشارك عبارة الاسترداد الخاصة بك أبدًا",
        tip2Desc: "عبارة الاسترداد المكونة من 12 أو 24 كلمة هي المفتاح الرئيسي لمحفظتك. أي شخص لديه هذه العبارة لديه سيطرة كاملة على أموالك وأصولك المسجلة. لا تشاركها مع أي شخص أبدًا - ولا حتى مع موظفي MindVaultIP - ولا تكتبها أبدًا في أي موقع ويب. قم بتخزينها في وضع عدم الاتصال، في مكان مادي آمن.",
        tip3Title: "٣. احذر من عمليات التصيد الاحتيالي",
        tip3Desc: "لن يطلب منك MindVaultIP أبدًا مفتاحك الخاص أو عبارة الاسترداد أو كلمات المرور. كن حذرًا من المواقع الإلكترونية أو رسائل البريد الإلكتروني أو الرسائل المباشرة المزيفة التي تطلب منك \"التحقق\" أو \"توصيل محفظتك\". تأكد دائمًا من أنك على النطاق الرسمي: mindvaultip.com",
        tip4Title: "٤. تحقق من المعاملات بعناية",
        tip4Desc: "قبل تأكيد المعاملة، راجع دائمًا تفاصيل شاشة المحفظة - عنوان المستلم ومبلغ الرمز المميز ورسوم الشبكة. قد تحاول المواقع الاحتيالية خداعك لتوقيع عقود ضارة.",
        tip5Title: "٥. استخدم كلمات مرور قوية وفريدة",
        tip5Desc: "احمِ محفظتك والأجهزة المتصلة بكلمات مرور قوية وفريدة. قم بتمكين المصادقة الثنائية (2FA) حيثما أمكن. استخدم مدير كلمات مرور حسن السمعة للراحة والأمان.",
        tip6Title: "٦. حافظ على تحديث البرنامج",
        tip6Desc: "قم بتحديث متصفحك وملحقات المحفظة وبرامج الأمان بانتظام لإصلاح الثغرات الأمنية. تعد إصدارات البرامج القديمة أهدافًا رئيسيًا للمهاجمين.",
        tip7Title: "٧. تحقق مرة أخرى من إعدادات الشبكة",
        tip7Desc: "تأكد دائمًا من أنك على شبكة Base (الشبكة الرئيسية) عند التفاعل مع MindVaultIP. قد يؤدي الاتصال بالشبكة الخاطئة أو نقاط نهاية RPC المزيفة إلى فقدان الأموال.",
        disclaimerTitle: "إخلاء المسؤولية",
        disclaimer: "هذه المعلومات للأغراض التعليمية فقط. لا تتحمل MindVaultIP أي مسؤولية عن أي خسارة في الأموال ناتجة عن سهل‌انگاری المستخدم أو عدم اتباع أفضل الممارسات. محفظتك - مسؤوليتك."
    },
    tr: {
        title: "Cüzdan Güvenliği ve En İyi Uygulamalar",
        intro: "Cüzdanınız, MindVaultIP ekosistemine açılan kapınızdır ve siz kendi bankanızsınız. Onu korumak sizin sorumluluğunuzdadır. Dijital varlıklarınızı ve fikri mülkiyetinizi güvende tutmak için bu temel ipuçlarını izleyin.",
        tip1Title: "1. Donanım Cüzdanı Kullanın",
        tip1Desc: "Maksimum güvenlik için varlıklarınızı bir donanım cüzdanında (Ledger veya Trezor gibi) saklayın. Bu cihazlar özel anahtarlarınızı çevrimdışı tutar ve çoğu çevrimiçi saldırıya karşı bağışıklık kazandırır.",
        tip2Title: "2. Kurtarma İfadenizi Asla Paylaşmayın",
        tip2Desc: "12 veya 24 kelimelik kurtarma ifadeniz, cüzdanınızın ana anahtarıdır. Bu ifadeye sahip olan herkes, fonlarınız ve kayıtlı varlıklarınız üzerinde tam kontrole sahiptir. Asla kimseyle paylaşmayın - MindVaultIP personeliyle bile - ve asla herhangi bir web sitesine yazmayın. Çevrimdışı, güvenli bir fiziksel konumda saklayın.",
        tip3Title: "3. Kimlik Avı Dolandırıcılıklarına Dikkat Edin",
        tip3Desc: "MindVaultIP, ASLA özel anahtarınızı, kurtarma ifadenizi veya şifrelerinizi istemez. Sahte web sitelerine, e-postalara veya \"cüzdanınızı doğrulamanızı\" veya \"bağlamanızı\" isteyen DM'lere karşı dikkatli olun. Her zaman resmi alanda olduğunuzdan emin olun: mindvaultip.com",
        tip4Title: "4. İşlemleri Dikkatlice Doğrulayın",
        tip4Desc: "Bir işlemi onaylamadan önce daima cüzdan ekranı ayrıntılarını - alıcı adresi, jeton miktarı ve ağ ücretleri - gözden geçirin. Dolandırıcı siteler, sizi kötü niyetli sözleşmeler imzalamaya kandırmaya çalışabilir.",
        tip5Title: "5. Güçlü, Benzersiz Şifreler Kullanın",
        tip5Desc: "Cüzdanınızı ve bağlı cihazlarınızı güçlü, benzersiz şifrelerle koruyun. Mümkün olan her yerde iki faktörlü kimlik doğrulamayı (2FA) etkinleştirin. Kolaylık ve güvenlik için saygın bir şifre yöneticisi kullanın.",
        tip6Title: "6. Yazılımı Güncel Tutun",
        tip6Desc: "Güvenlik açıklarını düzeltmek için tarayıcınızı, cüzdan uzantılarınızı ve güvenlik yazılımınızı düzenli olarak güncelleyin. Eski yazılım sürümleri, saldırganlar için birincil hedeflerdir.",
        tip7Title: "7. Ağ Ayarlarını İki Kez Kontrol Edin",
        tip7Desc: "MindVaultIP ile etkileşimde bulunurken daima Base Ağı'nda (Ana Ağ) olduğunuzdan emin olun. Yanlış ağa veya sahte RPC uç noktalarına bağlanmak, fon kaybına neden olabilir.",
        disclaimerTitle: "Sorumluluk Reddi",
        disclaimer: "Bu bilgiler yalnızca eğitim amaçlıdır. MindVaultIP, kullanıcı ihmali veya en iyi uygulamalara uyulmamasından kaynaklanan herhangi bir fon kaybından sorumlu değildir. Cüzdanınız - sizin sorumluluğunuz."
    },
    de: {
        title: "Wallet-Sicherheit & Beste Praktiken",
        intro: "Ihre Wallet ist Ihr Tor zum MindVaultIP-Ökosystem – und Sie sind Ihre eigene Bank. Der Schutz liegt in Ihrer Verantwortung. Befolgen Sie diese wesentlichen Tipps, um Ihre digitalen Vermögenswerte und Ihr geistiges Eigentum zu sichern.",
        tip1Title: "1. Verwenden Sie ein Hardware-Wallet",
        tip1Desc: "Für maximale Sicherheit speichern Sie Ihre Vermögenswerte in einem Hardware-Wallet (wie Ledger oder Trezor). Diese Geräte halten Ihre privaten Schlüssel offline und machen sie immun gegen die meisten Online-Angriffe.",
        tip2Title: "2. Teilen Sie niemals Ihre Seed-Phrase",
        tip2Desc: "Ihre 12- oder 24-Wort-Seed-Phrase ist der Hauptschlüssel zu Ihrer Wallet. Jeder, der diese Phrase besitzt, hat die volle Kontrolle über Ihre Gelder und registrierten Vermögenswerte. Teilen Sie sie niemals mit jemandem – nicht einmal mit MindVaultIP-Mitarbeitern – und geben Sie sie niemals auf einer Website ein. Bewahren Sie sie offline an einem sicheren physischen Ort auf.",
        tip3Title: "3. Vorsicht vor Phishing-Betrug",
        tip3Desc: "MindVaultIP wird Sie NIEMALS nach Ihrem privaten Schlüssel, Ihrer Seed-Phrase oder Ihren Passwörtern fragen. Seien Sie vorsichtig bei gefälschten Websites, E-Mails oder DMs, die Sie auffordern, Ihr Wallet zu „verifizieren“ oder „zu verbinden“. Stellen Sie immer sicher, dass Sie sich auf der offiziellen Domain befinden: mindvaultip.com",
        tip4Title: "4. Überprüfen Sie Transaktionen sorgfältig",
        tip4Desc: "Überprüfen Sie vor der Bestätigung einer Transaktion immer die Details auf dem Wallet-Bildschirm – Empfängeradresse, Token-Betrag und Netzwerkgebühren. Betrügerische Websites können versuchen, Sie zum Unterzeichnen bösartiger Verträge zu verleiten.",
        tip5Title: "5. Verwenden Sie starke, einzigartige Passwörter",
        tip5Desc: "Schützen Sie Ihre Wallet und verbundene Geräte mit starken, einzigartigen Passwörtern. Aktivieren Sie nach Möglichkeit die Zwei-Faktor-Authentifizierung (2FA). Verwenden Sie zur Bequemlichkeit und Sicherheit einen seriösen Passwort-Manager.",
        tip6Title: "6. Halten Sie die Software auf dem neuesten Stand",
        tip6Desc: "Aktualisieren Sie regelmäßig Ihren Browser, Ihre Wallet-Erweiterungen und Ihre Sicherheitssoftware, um Schwachstellen zu beheben. Alte Softwareversionen sind Hauptziele für Angreifer.",
        tip7Title: "7. Überprüfen Sie die Netzwerkeinstellungen",
        tip7Desc: "Stellen Sie immer sicher, dass Sie sich im Base-Netzwerk (Mainnet) befinden, wenn Sie mit MindVaultIP interagieren. Eine Verbindung zum falschen Netzwerk oder zu gefälschten RPC-Endpunkten kann zum Verlust von Geldern führen.",
        disclaimerTitle: "Haftungsausschluss",
        disclaimer: "Dieses Informationsmaterial dient ausschließlich zu Bildungszwecken. MindVaultIP übernimmt keine Haftung für den Verlust von Geldern, der durch Fahrlässigkeit des Benutzers oder die Nichteinhaltung der besten Praktiken entsteht. Ihre Wallet – Ihre Verantwortung."
    },
    sw: {
        title: "Usalama wa Pochi & Mbinu Bora",
        intro: "Pochi yako ndiyo lango lako la kuingia katika mfumo wa MindVaultIP — na wewe ndiye benki yako mwenyewe. Kuilinda ni jukumu lako. Fuata vidokezo hivi muhimu ili kuweka mali zako za kidijitali na miliki yako ya kiakili salama.",
        tip1Title: "1. Tumia Pochi ya Vifaa",
        tip1Desc: "Kwa usalama wa hali ya juu, hifadhi mali zako kwenye pochi ya vifaa (kama vile Ledger au Trezor). Vifaa hivi huhifadhi funguo zako za siri nje ya mtandao, na kuzifanya zisiweze kushambuliwa na mashambulizi mengi ya mtandaoni.",
        tip2Title: "2. Kamwe Usishiriki Maneno Yako ya Siri",
        tip2Desc: "Maneno yako ya siri ya maneno 12 au 24 ndiyo ufunguo mkuu wa pochi yako. Mtu yeyote aliye na maneno haya ana udhibiti kamili wa pesa zako na mali zilizosajiliwa. Kamwe usimshirikishe mtu yeyote — hata wafanyakazi wa MindVaultIP — na kamwe usiyaandike kwenye tovuti yoyote. Yafiche nje ya mtandao, mahali salama kimwili.",
        tip3Title: "3. Jihadharini na Ulaghai wa Udukuzi (Phishing)",
        tip3Desc: "MindVaultIP KAMWE haitakuuliza ufunguo wako wa siri, maneno ya siri, au nywila. Kuwa mwangalifu na tovuti bandia, barua pepe, au ujumbe wa moja kwa moja unaokuomba “uthibitie” au “uunganishe pochi yako.” Hakikisha kila wakati uko kwenye kikoa rasmi: mindvaultip.com",
        tip4Title: "4. Thibitisha Miamala kwa Makini",
        tip4Desc: "Kabla ya kuthibitisha muamala, daima kagua maelezo ya skrini ya pochi — anwani ya mpokeaji, kiasi cha tokeni, na ada za mtandao. Tovuti za ulaghai zinaweza kujaribu kukudanganya ili utie saini mikataba hasidi.",
        tip5Title: "5. Tumia Nywila Imara na za Kipekee",
        tip5Desc: "Linda pochi yako na vifaa vilivyounganishwa na nywila imara na za kipekee. Washa uthibitishaji wa hatua mbili (2FA) popote inapowezekana. Tumia kidhibiti cha nywila kinachoaminika kwa urahisi na usalama.",
        tip6Title: "6. Sasisha Programu Zako",
        tip6Desc: "Sasisha kivinjari chako, viendelezi vya pochi, na programu za usalama mara kwa mara ili kurekebisha udhaifu. Matoleo ya zamani ya programu ni malengo makuu kwa washambuliaji.",
        tip7Title: "7. Hakiki Mipangilio ya Mtandao",
        tip7Desc: "Hakikisha kila wakati uko kwenye Mtandao wa Base (Mainnet) unaposhirikiana na MindVaultIP. Kuunganisha kwenye mtandao usio sahihi au vituo vya RPC bandia kunaweza kusababisha upotevu wa fedha.",
        disclaimerTitle: "Kanusho",
        disclaimer: "Taarifa hii ni kwa madhumuni ya kielimu pekee. MindVaultIP haichukui dhima yoyote kwa upotevu wowote wa fedha unaotokana na uzembe wa mtumiaji au kushindwa kufuata mbinu bora. Pochi yako — jukumu lako."
    },
    yo: {
        title: "Aabo Apamọwọ & Awọn Iṣe Ti o Dara Julọ",
        intro: "Apamọwọ rẹ ni ẹnu-ọna rẹ si ilolupo eda MindVaultIP — ati pe iwọ ni banki ti ara rẹ. Idaabobo rẹ jẹ ojuṣe rẹ. Tẹle awọn imọran pataki wọnyi lati jẹ ki awọn ohun-ini oni-nọmba rẹ ati ohun-ini ọgbọn rẹ ni aabo.",
        tip1Title: "1. Lo Apamọwọ Hardware kan",
        tip1Desc: "Fun aabo to pọ julọ, tọju awọn ohun-ini rẹ sinu apamọwọ hardware kan (gẹgẹbi Ledger tabi Trezor). Awọn ẹrọ wọnyi n pa awọn bọtini ikọkọ rẹ mọ ni aisinipo, ti o jẹ ki wọn ni ajesara si ọpọlọpọ awọn ikọlu ori ayelujara.",
        tip2Title: "2. Maṣe Pin Gbolohun Irugbin Rẹ rara",
        tip2Desc: "Gbolohun irugbin rẹ ti o ni ọrọ 12 tabi 24 ni bọtini akọkọ si apamọwọ rẹ. Ẹnikẹni ti o ba ni gbolohun yii ni iṣakoso ni kikun lori awọn owo rẹ ati awọn ohun-ini ti a forukọsilẹ. Maṣe pin pẹlu ẹnikẹni — paapaa awọn oṣiṣẹ MindVaultIP — ki o maṣe tẹ sinu oju opo wẹẹbu eyikeyi. Tọju rẹ ni aisinipo, ni ipo ti ara ti o ni aabo.",
        tip3Title: "3. Ṣọra fun Awọn Itanjẹ Phishing",
        tip3Desc: "MindVaultIP kii yoo beere fun bọtini ikọkọ rẹ, gbolohun irugbin, tabi awọn ọrọ igbaniwọle. Ṣọra fun awọn oju opo wẹẹbu iro, awọn imeeli, tabi awọn DM ti n beere lọwọ rẹ lati “ṣayẹwo” tabi “so apamọwọ rẹ pọ.” Rii daju nigbagbogbo pe o wa lori agbegbe osise: mindvaultip.com",
        tip4Title: "4. Ṣayẹwo Awọn iṣowo ni Iṣọra",
        tip4Desc: "Ṣaaju ki o to jẹrisi iṣowo kan, nigbagbogbo ṣe atunyẹwo awọn alaye iboju apamọwọ — adirẹsi olugba, iye àmi, ati awọn idiyele nẹtiwọọki. Awọn aaye arekereke le gbiyanju lati tan ọ jẹ lati fowo si awọn adehun irira.",
        tip5Title: "5. Lo Awọn ọrọ igbaniwọle Alagbara, Alailẹgbẹ",
        tip5Desc: "Dabobo apamọwọ rẹ ati awọn ẹrọ ti a ti sopọ pẹlu awọn ọrọ igbaniwọle alagbara, alailẹgbẹ. Jeki ìfàṣẹsí ifosiwewe-meji (2FA) ṣiṣẹ nibikibi ti o ba ṣeeṣe. Lo oluṣakoso ọrọ igbaniwọle ti o ni igbẹkẹle fun irọrun ati ailewu.",
        tip6Title: "6. Jeki Software ni Imudojuiwọn",
        tip6Desc: "Ṣe imudojuiwọn aṣawakiri rẹ nigbagbogbo, awọn amugbooro apamọwọ, ati sọfitiwia aabo lati pa awọn ailagbara. Awọn ẹya sọfitiwia atijọ jẹ awọn ibi-afẹde akọkọ fun awọn ikọlu.",
        tip7Title: "7. Ṣayẹwo Awọn Eto Nẹtiwọọki Lẹẹmeji",
        tip7Desc: "Rii daju nigbagbogbo pe o wa lori Nẹtiwọọki Base (Mainnet) nigbati o n ba MindVaultIP sọrọ. Asopọ si nẹtiwọọki ti ko tọ tabi awọn ipari RPC iro le ja si isonu ti owo.",
        disclaimerTitle: "AlAIgBA",
        disclaimer: "Alaye yii jẹ fun awọn idi eto-ẹkọ nikan. MindVaultIP ko gba gbese fun isonu eyikeyi ti awọn owo ti o waye lati aibikita olumulo tabi ikuna lati tẹle awọn iṣe ti o dara julọ. Apamọwọ rẹ — ojuṣe rẹ."
    },
    ha: {
        title: "Tsaron Wallet & Mafi Kyawun Ayyuka",
        intro: "Wallet ɗinku shine ƙofarku zuwa ga yanayin MindVaultIP — kuma ku ne bankin kanku. Kare shi alhakinku ne. Bi waɗannan mahimman shawarwari don kiyaye kadarorin ku na dijital da dukiyar ilimi lafiya.",
        tip1Title: "1. Yi Amfani da Wallet na Hardware",
        tip1Desc: "Don samun matsakaicin tsaro, adana kadarorin ku a cikin wallet na hardware (kamar Ledger ko Trezor). Waɗannan na'urori suna ajiye makullan ku na sirri a layi, wanda ke sa su zama masu kariya daga yawancin hare-haren kan layi.",
        tip2Title: "2. Kada Ka Taɓa Raba Kalmomin Tsaro naka",
        tip2Desc: "Kalmomin tsaro naka masu kalmomi 12 ko 24 sune babban makullin wallet ɗinka. Duk wanda ke da wannan jimlar yana da cikakken iko akan kuɗin ku da kadarorin da aka yiwa rijista. Kada ka taɓa raba shi da kowa — ko da ma'aikatan MindVaultIP — kuma kada ka taɓa buga shi a kowace gidan yanar gizo. Ajiye shi a layi, a wuri mai aminci na zahiri.",
        tip3Title: "3. Yi Hankali da Zamba na Phishing",
        tip3Desc: "MindVaultIP ba zai taɓa neman makullin sirri naka, kalmomin tsaro, ko kalmomin shiga ba. Yi hankali da gidajen yanar gizo na karya, imel, ko saƙonnin kai tsaye da ke neman ka 'tabbatar' ko 'haɗa wallet ɗinka'. Koyaushe tabbatar kana kan yankin hukuma: mindvaultip.com",
        tip4Title: "4. Tabbatar da Ma'amaloli a Hankali",
        tip4Desc: "Kafin tabbatar da ma'amala, koyaushe duba bayanan allon wallet — adireshin mai karɓa, adadin alama, da kuɗaɗen hanyar sadarwa. Shafukan yanar gizo na zamba na iya ƙoƙarin yaudarar ka don sanya hannu kan kwangiloli masu haɗari.",
        tip5Title: "5. Yi Amfani da Kalmomin Shiga Masu ƙarfi, na Musamman",
        tip5Desc: "Kare wallet ɗinka da na'urorin da aka haɗa da kalmomin shiga masu ƙarfi, na musamman. Kunna tantancewa ta abubuwa biyu (2FA) a duk inda zai yiwu. Yi amfani da manajan kalmar sirri mai daraja don sauƙi da aminci.",
        tip6Title: "6. Ci gaba da Sabunta Software",
        tip6Desc: "Sabunta burauzarka, kari na wallet, da software na tsaro a kai a kai don gyara raunin tsaro. Tsoffin nau'ikan software sune manyan maƙasudin maharan.",
        tip7Title: "7. Bincika Saitunan Hanyar Sadarwa Sau Biyu",
        tip7Desc: "Koyaushe tabbatar kana kan Hanyar Sadarwar Base (Mainnet) lokacin da kake hulɗa da MindVaultIP. Haɗawa da hanyar sadarwa mara kyau ko wuraren ƙarshe na RPC na karya na iya haifar da asarar kuɗi.",
        disclaimerTitle: "Sanarwa",
        disclaimer: "Wannan bayanin don dalilai ne na ilimi kawai. MindVaultIP ba ta ɗaukar alhakin kowane asarar kuɗi da ya samo asali daga sakacin mai amfani ko rashin bin mafi kyawun ayyuka. Wallet ɗinka — alhakinka."
    },
    zh: {
        title: "钱包安全与最佳实践",
        intro: "您的钱包是您通往MindVaultIP生态系统的门户——您就是您自己的银行。保护它是您的责任。请遵循以下基本提示，以确保您的数字资产和知识产权安全。",
        tip1Title: "1. 使用硬件钱包",
        tip1Desc: "为获得最高安全性，请将您的资产存储在硬件钱包（如Ledger或Trezor）中。这些设备使您的私钥保持离线状态，使其免受大多数在线攻击。",
        tip2Title: "2. 切勿分享您的助记词",
        tip2Desc: "您的12或24个单词的助记词是您钱包的主密钥。任何拥有此短语的人都对您的资金和注册资产拥有完全控制权。切勿与任何人分享——即使是MindVaultIP的员工也不行——也切勿在任何网站上输入它。请将其离线存储在安全的物理位置。",
        tip3Title: "3. 谨防网络钓鱼诈骗",
        tip3Desc: "MindVaultIP绝不会要求您提供私钥、助记词或密码。请警惕要求您“验证”或“连接钱包”的虚假网站、电子邮件或私信。始终确保您在官方域名上：mindvaultip.com",
        tip4Title: "4. 仔细验证交易",
        tip4Desc: "在确认交易之前，请务必查看钱包屏幕上的详细信息——接收方地址、代币数量和网络费用。欺诈性网站可能会试图诱骗您签署恶意合同。",
        tip5Title: "5. 使用强大、独特的密码",
        tip5Desc: "使用强大、独特的密码保护您的钱包和连接的设备。尽可能启用双重身份验证（2FA）。为方便和安全起见，请使用信誉良好的密码管理器。",
        tip6Title: "6. 保持软件更新",
        tip6Desc: "定期更新您的浏览器、钱包扩展和安全软件以修补漏洞。旧版本的软件是攻击者的主要目标。",
        tip7Title: "7. 仔细检查网络设置",
        tip7Desc: "与MindVaultIP交互时，请始终确保您在Base网络（主网）上。连接到错误的网络或虚假的RPC端点可能会导致资金损失。",
        disclaimerTitle: "免責聲明",
        disclaimer: "此信息仅用于教育目的。对于因用户疏忽或未能遵循最佳实践而导致的任何资金损失，MindVaultIP不承担任何责任。您的钱包——您的责任。"
    },
    es: {
        title: "Seguridad de la Billetera y Mejores Prácticas",
        intro: "Tu billetera es tu puerta de entrada al ecosistema de MindVaultIP, y tú eres tu propio banco. Protegerla es tu responsabilidad. Sigue estos consejos esenciales para mantener seguros tus activos digitales y tu propiedad intelectual.",
        tip1Title: "1. Usa una Billetera de Hardware",
        tip1Desc: "Para una máxima seguridad, almacena tus activos en una billetera de hardware (como Ledger o Trezor). Estos dispositivos mantienen tus claves privadas fuera de línea, haciéndolos inmunes a la mayoría de los ataques en línea.",
        tip2Title: "2. Nunca Compartas tu Frase Semilla",
        tip2Desc: "Tu frase semilla de 12 o 24 palabras es la clave maestra de tu billetera. Cualquiera con esta frase tiene control total sobre tus fondos y activos registrados. Nunca la compartas con nadie, ni siquiera con el personal de MindVaultIP, y nunca la escribas en ningún sitio web. Guárdala fuera de línea, en un lugar físico seguro.",
        tip3Title: "3. Cuidado con las Estafas de Phishing",
        tip3Desc: "MindVaultIP NUNCA te pedirá tu clave privada, frase semilla o contraseñas. Ten cuidado con sitios web, correos electrónicos o mensajes directos falsos que te pidan que 'verifiques' o 'conectes tu billetera'. Asegúrate siempre de estar en el dominio oficial: mindvaultip.com",
        tip4Title: "4. Verifica las Transacciones con Cuidado",
        tip4Desc: "Antes de confirmar una transacción, revisa siempre los detalles en la pantalla de la billetera: dirección del destinatario, cantidad de tokens y tarifas de red. Los sitios fraudulentos pueden intentar engañarte para que firmes contratos maliciosos.",
        tip5Title: "5. Usa Contraseñas Fuertes y Únicas",
        tip5Desc: "Protege tu billetera y los dispositivos conectados con contraseñas fuertes y únicas. Habilita la autenticación de dos factores (2FA) siempre que sea posible. Usa un gestor de contraseñas de buena reputación por conveniencia y seguridad.",
        tip6Title: "6. Mantén el Software Actualizado",
        tip6Desc: "Actualiza regularmente tu navegador, extensiones de billetera y software de seguridad para corregir vulnerabilidades. Las versiones de software antiguas son objetivos principales para los atacantes.",
        tip7Title: "7. Revisa la Configuración de la Red",
        tip7Desc: "Asegúrate siempre de estar en la Red Base (Mainnet) cuando interactúes con MindVaultIP. Conectarse a la red incorrecta o a puntos finales RPC falsos puede resultar en la pérdida de fondos.",
        disclaimerTitle: "Descargo de Responsabilidad",
        disclaimer: "Esta información es solo para fines educativos. MindVaultIP no asume ninguna responsabilidad por la pérdida de fondos resultante de la negligencia del usuario o de no seguir las mejores prácticas. Tu billetera, tu responsabilidad."
    },
    ru: {
        title: "Безопасность кошелька и лучшие практики",
        intro: "Ваш кошелек — это ваш доступ к экосистеме MindVaultIP, и вы — ваш собственный банк. Его защита — ваша ответственность. Следуйте этим важным советам, чтобы сохранить ваши цифровые активы и интеллектуальную собственность в безопасности.",
        tip1Title: "1. Используйте аппаратный кошелек",
        tip1Desc: "Для максимальной безопасности храните свои активы в аппаратном кошельке (например, Ledger или Trezor). Эти устройства хранят ваши приватные ключи в автономном режиме, что делает их неуязвимыми для большинства онлайн-атак.",
        tip2Title: "2. Никогда не делитесь своей сид-фразой",
        tip2Desc: "Ваша сид-фраза из 12 или 24 слов — это главный ключ к вашему кошельку. Любой, у кого есть эта фраза, имеет полный контроль над вашими средствами и зарегистрированными активами. Никогда не делитесь ею ни с кем — даже с сотрудниками MindVaultIP — и никогда не вводите ее ни на одном веб-сайте. Храните ее в автономном режиме, в надежном физическом месте.",
        tip3Title: "3. Остерегайтесь фишинговых атак",
        tip3Desc: "MindVaultIP НИКОГДА не будет запрашивать ваш приватный ключ, сид-фразу или пароли. Будьте осторожны с поддельными веб-сайтами, электронными письмами или личными сообщениями, которые просят вас «подтвердить» или «подключить ваш кошелек». Всегда убеждайтесь, что вы находитесь на официальном домене: mindvaultip.com",
        tip4Title: "4. Внимательно проверяйте транзакции",
        tip4Desc: "Перед подтверждением транзакции всегда проверяйте детали на экране кошелька — адрес получателя, сумму токенов и сетевые сборы. Мошеннические сайты могут попытаться обмануть вас, заставив подписать вредоносные контракты.",
        tip5Title: "5. Используйте надежные, уникальные пароли",
        tip5Desc: "Защищайте свой кошелек и подключенные устройства надежными, уникальными паролями. Включайте двухфакторную аутентификацию (2FA) везде, где это возможно. Используйте надежный менеджер паролей для удобства и безопасности.",
        tip6Title: "6. Обновляйте программное обеспечение",
        tip6Desc: "Регулярно обновляйте свой браузер, расширения кошелька и программное обеспечение безопасности, чтобы устранять уязвимости. Старые версии программного обеспечения — главная цель для злоумышленников.",
        tip7Title: "7. Дважды проверяйте настройки сети",
        tip7Desc: "Всегда убеждайтесь, что вы находитесь в сети Base (Mainnet) при взаимодействии с MindVaultIP. Подключение к неправильной сети или поддельным конечным точкам RPC может привести к потере средств.",
        disclaimerTitle: "Отказ от ответственности",
        disclaimer: "Эта информация предоставлена только в образовательных целях. MindVaultIP не несет ответственности за потерю средств в результате неосторожности пользователя или несоблюдения лучших практик. Ваш кошелек — ваша ответственность."
    },
    ja: {
        title: "ウォレットのセキュリティとベストプラクティス",
        intro: "あなたのウォレットはMindVaultIPエコシステムへのゲートウェイであり、あなた自身が銀行です。ウォレットを保護することはあなたの責任です。デジタル資産と知的財産を安全に保つために、これらの重要なヒントに従ってください。",
        tip1Title: "1. ハードウェアウォレットを使用する",
        tip1Desc: "最大限のセキュリティを確保するために、資産をハードウェアウォレット（LedgerやTrezorなど）に保管してください。これらのデバイスは秘密鍵をオフラインで保持し、ほとんどのオンライン攻撃から保護します。",
        tip2Title: "2. シードフレーズを絶対に共有しない",
        tip2Desc: "12または24単語のシードフレーズは、ウォレットのマスターキーです。このフレーズを知っている人は誰でも、あなたの資金と登録済み資産を完全に管理できます。誰とも共有しないでください — MindVaultIPのスタッフとも共有しないでください — そして、どのウェブサイトにも入力しないでください。安全な物理的な場所にオフラインで保管してください。",
        tip3Title: "3. フィッシング詐欺に注意する",
        tip3Desc: "MindVaultIPは、秘密鍵、シードフレーズ、またはパスワードを尋ねることは絶対にありません。ウォレットの「確認」や「接続」を求める偽のウェブサイト、メール、DMに注意してください。常に公式ドメイン mindvaultip.com にいることを確認してください。",
        tip4Title: "4. トランザクションを慎重に確認する",
        tip4Desc: "トランザクションを承認する前に、必ずウォレット画面の詳細（受信者アドレス、トークン量、ネットワーク手数料）を確認してください。詐欺サイトは、悪意のある契約に署名させようとすることがあります。",
        tip5Title: "5. 強力でユニークなパスワードを使用する",
        tip5Desc: "ウォレットと接続されたデバイスを、強力でユニークなパスワードで保護してください。可能な限り二要素認証（2FA）を有効にしてください。利便性と安全性のために、信頼できるパスワードマネージャーを使用してください。",
        tip6Title: "6. ソフトウェアを最新の状態に保つ",
        tip6Desc: "脆弱性を修正するために、ブラウザ、ウォレット拡張機能、およびセキュリティソフトウェアを定期的に更新してください。古いソフトウェアバージョンは、攻撃者の主要な標的です。",
        tip7Title: "7. ネットワーク設定を再確認する",
        tip7Desc: "MindVaultIPと対話する際は、常にBaseネットワーク（メインネット）上にいることを確認してください。間違ったネットワークや偽のRPCエンドポイントに接続すると、資金を失う可能性があります。",
        disclaimerTitle: "免責事項",
        disclaimer: "この情報は教育目的のみのものです。MindVaultIPは、ユーザーの過失やベストプラクティスに従わなかったことに起因する資金の損失について一切の責任を負いません。あなたのウォレット — あなたの責任です。"
    },
    ko: {
        title: "지갑 보안 및 모범 사례",
        intro: "지갑은 MindVaultIP 생태계로 들어가는 관문이며, 당신은 당신 자신의 은행입니다. 지갑을 보호하는 것은 당신의 책임입니다. 디지털 자산과 지적 재산을 안전하게 지키려면 다음 필수 팁을 따르십시오.",
        tip1Title: "1. 하드웨어 지갑 사용",
        tip1Desc: "최고의 보안을 위해 자산을 하드웨어 지갑(예: Ledger 또는 Trezor)에 보관하십시오. 이 장치들은 개인 키를 오프라인으로 유지하여 대부분의 온라인 공격으로부터 안전하게 보호합니다.",
        tip2Title: "2. 시드 구문 공유 금지",
        tip2Desc: "12개 또는 24개의 단어로 된 시드 구문은 지갑의 마스터 키입니다. 이 구문을 가진 사람은 누구나 귀하의 자금과 등록된 자산을 완전히 제어할 수 있습니다. MindVaultIP 직원을 포함하여 누구와도 공유하지 마십시오. 또한 어떤 웹사이트에도 입력하지 마십시오. 안전한 물리적 위치에 오프라인으로 보관하십시오.",
        tip3Title: "3. 피싱 사기 주의",
        tip3Desc: "MindVaultIP는 절대로 개인 키, 시드 구문 또는 비밀번호를 요구하지 않습니다. 지갑을 '확인'하거나 '연결'하라는 가짜 웹사이트, 이메일 또는 DM에 주의하십시오. 항상 공식 도메인인 mindvaultip.com에 있는지 확인하십시오.",
        tip4Title: "4. 거래 신중히 확인",
        tip4Desc: "거래를 확인하기 전에 항상 지갑 화면의 세부 정보(수신자 주소, 토큰 금액 및 네트워크 수수료)를 검토하십시오. 사기 사이트는 악성 계약에 서명하도록 유도할 수 있습니다.",
        tip5Title: "5. 강력하고 고유한 비밀번호 사용",
        tip5Desc: "강력하고 고유한 비밀번호로 지갑과 연결된 장치를 보호하십시오. 가능한 모든 곳에서 2단계 인증(2FA)을 활성화하십시오. 편리함과 안전을 위해 신뢰할 수 있는 비밀번호 관리자를 사용하십시오.",
        tip6Title: "6. 소프트웨어 최신 상태 유지",
        tip6Desc: "취약점을 패치하기 위해 브라우저, 지갑 확장 프로그램 및 보안 소프트웨어를 정기적으로 업데이트하십시오. 오래된 소프트웨어 버전은 공격자의 주요 대상입니다.",
        tip7Title: "7. 네트워크 설정 재확인",
        tip7Desc: "MindVaultIP와 상호 작용할 때는 항상 Base 네트워크(메인넷)에 있는지 확인하십시오. 잘못된 네트워크나 가짜 RPC 엔드포인트에 연결하면 자금을 잃을 수 있습니다.",
        disclaimerTitle: "면책 조항",
        disclaimer: "이 정보는 교육 목적으로만 제공됩니다. MindVaultIP는 사용자 과실 또는 모범 사례를 따르지 않아 발생하는 자금 손실에 대해 책임을 지지 않습니다. 당신의 지갑 — 당신의 책임입니다."
    },
    ur: {
        title: "والیٹ سیکیورٹی اور بہترین طریقہ کار",
        intro: "آپ کا والیٹ MindVaultIP ایکو سسٹم کا گیٹ وے ہے — اور آپ خود اپنے بینک ہیں۔ اس کی حفاظت آپ کی ذمہ داری ہے۔ اپنے ڈیجیٹل اثاثوں اور دانشورانہ املاک کو محفوظ رکھنے کے لیے ان ضروری تجاویز پر عمل کریں۔",
        tip1Title: "۱. ہارڈویئر والیٹ استعمال کریں",
        tip1Desc: "زیادہ سے زیادہ سیکیورٹی کے لیے، اپنے اثاثے ہارڈویئر والیٹ (جیسے لیجر یا ٹریزر) میں محفوظ کریں۔ یہ ڈیوائسز آپ کی نجی چابیاں آف لائن رکھتی ہیں، جس سے وہ زیادہ تر آن لائن حملوں سے محفوظ رہتی ہیں۔",
        tip2Title: "۲. اپنا سیڈ فریز کبھی شیئر نہ کریں",
        tip2Desc: "آپ کا 12 یا 24 الفاظ کا سیڈ فریز آپ کے والیٹ کی ماسٹر کلید ہے۔ جس کسی کے پاس یہ فریز ہو، اس کے پاس آپ کے فنڈز اور رجسٹرڈ اثاثوں پر مکمل کنٹرول ہوتا ہے۔ اسے کبھی کسی کے ساتھ شیئر نہ کریں — یہاں تک کہ MindVaultIP کے عملے کے ساتھ بھی نہیں — اور اسے کبھی کسی ویب سائٹ میں ٹائپ نہ کریں۔ اسے آف لائن، ایک محفوظ جسمانی جگہ پر اسٹور کریں۔",
        tip3Title: "۳. فشنگ اسکامز سے ہوشیار رہیں",
        tip3Desc: "MindVaultIP آپ سے کبھی بھی آپ کی نجی کلید، سیڈ فریز، یا پاس ورڈ نہیں پوچھے گا۔ جعلی ویب سائٹس، ای میلز، یا DMs سے محتاط رہیں جو آپ سے آپ کے والیٹ کی 'تصدیق' یا 'کنیکٹ' کرنے کو کہیں۔ ہمیشہ یقینی بنائیں کہ آپ آفیشل ڈومین پر ہیں: mindvaultip.com",
        tip4Title: "۴. ٹرانزیکشنز کو احتیاط سے تصدیق کریں",
        tip4Desc: "ٹرانزیکشن کی تصدیق کرنے سے پہلے، ہمیشہ والیٹ اسکرین کی تفصیلات کا جائزہ لیں — وصول کنندہ کا پتہ، ٹوکن کی رقم، اور نیٹ ورک فیس۔ دھوکہ دہی والی سائٹس آپ کو نقصان دہ معاہدوں پر دستخط کرنے کے لیے پھانسنے کی کوشش کر سکتی ہیں۔",
        tip5Title: "۵. مضبوط، منفرد پاس ورڈ استعمال کریں",
        tip5Desc: "اپنے والیٹ اور منسلک ڈیوائسز کو مضبوط، منفرد پاس ورڈز سے محفوظ بنائیں۔ جہاں بھی ممکن ہو، ٹو فیکٹر آتھنٹیکیشن (2FA) کو فعال کریں۔ سہولت اور حفاظت کے لیے ایک معتبر پاس ورڈ مینیجر استعمال کریں۔",
        tip6Title: "۶. سافٹ ویئر کو اپ ڈیٹ رکھیں",
        tip6Desc: "کمزوریوں کو دور کرنے کے لیے اپنے براؤزر، والیٹ ایکسٹینشنز، اور سیکیورٹی سافٹ ویئر کو باقاعدگی سے اپ ڈیٹ کریں۔ پرانے سافٹ ویئر ورژنز حملہ آوروں کے لیے اولین ہدف ہوتے ہیں۔",
        tip7Title: "۷. نیٹ ورک سیٹنگز کو دوبارہ چیک کریں",
        tip7Desc: "MindVaultIP کے ساتھ تعامل کرتے وقت ہمیشہ یقینی بنائیں کہ آپ بیس نیٹ ورک (مین نیٹ) پر ہیں۔ غلط نیٹ ورک یا جعلی RPC اینڈ پوائنٹس سے منسلک ہونے کے نتیجے میں فنڈز کا نقصان ہو سکتا ہے۔",
        disclaimerTitle: "دستبرداری",
        disclaimer: "یہ معلومات صرف تعلیمی مقاصد کے لیے ہیں۔ MindVaultIP صارف کی غفلت یا بہترین طریقوں پر عمل نہ کرنے کے نتیجے میں ہونے والے کسی بھی فنڈ کے نقصان کی کوئی ذمہ داری قبول نہیں کرتا ہے۔ آپ کا والیٹ — آپ کی ذمہ داری۔"
    },
    hi: {
        title: "वॉलेट सुरक्षा और सर्वोत्तम प्रथाएं",
        intro: "आपका वॉलेट MindVaultIP पारिस्थितिकी तंत्र का प्रवेश द्वार है — और आप अपने खुद के बैंक हैं। इसकी सुरक्षा करना आपकी ज़िम्मेदारी है। अपनी डिजिटल संपत्ति और बौद्धिक संपदा को सुरक्षित रखने के लिए इन आवश्यक सुझावों का पालन करें।",
        tip1Title: "१. हार्डवेयर वॉलेट का उपयोग करें",
        tip1Desc: "अधिकतम सुरक्षा के लिए, अपनी संपत्ति को हार्डवेयर वॉलेट (जैसे लेजर या ट्रेजर) में स्टोर करें। ये डिवाइस आपकी निजी चाबियों को ऑफ़लाइन रखते हैं, जिससे वे अधिकांश ऑनलाइन हमलों से सुरक्षित रहते हैं।",
        tip2Title: "२. अपना सीड वाक्यांश कभी साझा न करें",
        tip2Desc: "आपका 12 या 24-शब्दों का सीड वाक्यांश आपके वॉलेट की मास्टर कुंजी है। जिस किसी के पास यह वाक्यांश है, उसके पास आपके धन और पंजीकृत संपत्तियों पर पूरा नियंत्रण होता है। इसे कभी किसी के साथ साझा न करें — यहाँ तक कि MindVaultIP कर्मचारियों के साथ भी नहीं — और इसे कभी किसी वेबसाइट में टाइप न करें। इसे ऑफ़लाइन, एक सुरक्षित भौतिक स्थान पर संग्रहीत करें।",
        tip3Title: "३. फ़िशिंग घोटालों से सावधान रहें",
        tip3Desc: "MindVaultIP कभी भी आपकी निजी कुंजी, सीड वाक्यांश, या पासवर्ड नहीं मांगेगा। नकली वेबसाइटों, ईमेल, या डीएम से सावधान रहें जो आपसे 'सत्यापित' करने या 'अपना वॉलेट कनेक्ट' करने के लिए कहते हैं। हमेशा सुनिश्चित करें कि आप आधिकारिक डोमेन पर हैं: mindvaultip.com",
        tip4Title: "४. लेनदेन को ध्यान से सत्यापित करें",
        tip4Desc: "लेन-देन की पुष्टि करने से पहले, हमेशा वॉलेट स्क्रीन विवरण की समीक्षा करें — प्राप्तकर्ता का पता, टोकन की राशि, और नेटवर्क शुल्क। धोखाधड़ी वाली साइटें आपको दुर्भावनापूर्ण अनुबंधों पर हस्ताक्षर करने के लिए धोखा देने का प्रयास कर सकती हैं।",
        tip5Title: "५. मजबूत, अद्वितीय पासवर्ड का उपयोग करें",
        tip5Desc: "अपने वॉलेट और कनेक्टेड डिवाइस को मजबूत, अद्वितीय पासवर्ड से सुरक्षित रखें। जहाँ भी संभव हो, दो-कारक प्रमाणीकरण (2FA) सक्षम करें। सुविधा और सुरक्षा के लिए एक प्रतिष्ठित पासवर्ड मैनेजर का उपयोग करें।",
        tip6Title: "६. सॉफ्टवेयर को अपडेट रखें",
        tip6Desc: "कमजोरियों को पैच करने के लिए अपने ब्राउज़र, वॉलेट एक्सटेंशन और सुरक्षा सॉफ्टवेयर को नियमित रूप से अपडेट करें। पुराने सॉफ्टवेयर संस्करण हमलावरों के लिए प्रमुख लक्ष्य होते हैं।",
        tip7Title: "७. नेटवर्क सेटिंग्स की दोबारा जाँच करें",
        tip7Desc: "MindVaultIP के साथ बातचीत करते समय हमेशा सुनिश्चित करें कि आप बेस नेटवर्क (मेननेट) पर हैं। गलत नेटवर्क या नकली आरपीसी एंडपॉइंट से कनेक्ट होने पर धन की हानि हो सकती है।",
        disclaimerTitle: "अस्वीकरण",
        disclaimer: "यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है। MindVaultIP उपयोगकर्ता की लापरवाही या सर्वोत्तम प्रथाओं का पालन करने में विफलता के परिणामस्वरूप किसी भी धन की हानि के लिए कोई दायित्व नहीं लेता है। आपका वॉलेट — आपकी ज़िम्मेदारी।"
    },
    bal: {
        title: "والٹ سیکورٹی ءُ شرترین طریقہ کار",
        intro: "تئی والٹ مائنڈ والٹ آئی پی ءِ ایکو سسٹم ءِ دروازگ اِنت — ءُ تئو وتیگیں بینک ئے. آئی ءِ حفاظت کنگ تئی ذمہ داری اِنت. وتی ڈیجیٹل اثاثہ ءُ intelektuální ملکیت ءَ محفوظ دارگ ءِ واست ءَ اے ضروری ٹپسانی رند ءَ بگر ات.",
        tip1Title: "۱. یک ہارڈویئر والٹ ءِ کارمرزی ءَ کن ات",
        tip1Desc: "گیشترین حفاظت ءِ واست ءَ، وتی اثاثہ ءَ یک ہارڈویئر والٹ (لکه لیجر یا ٹریزر) ءِ تہ ءَ ذخیره کن ات. اے ڈیوائس تئی پرائیویٹ کیز ءَ آف لائن دارنت، ءُ آیان ءَ گیشتریں آنلائن حملہیانی خلاف ءَ محفوظ کننت.",
        tip2Title: "۲. وتی سیڈ فریز ءَ ہچبر شیئر مکن ات",
        tip2Desc: "تئی ۱۲ یا ۲۴ لفظی سیڈ فریز، تئی والٹ ءِ مستر کلید اِنت. هر کس کہ اے فریز ءَ داریت، آئی ءِ تئی فنڈز ءُ رجسٹرڈ اثاثہیانی سرا کامل کنٹرول بیت. آئی ءَ ہچبر کسے ءَ گوں شیئر مکن ات — حتی کہ مائنڈ والٹ آئی پی ءِ کارمندانی گوں ہم — ءُ آئی ءَ ہچبر هچ ویب سائٹ ءِ تہ ءَ ٹائپ مکن ات. آئی ءَ آف لائن، یک محفوظ فیزیکل جاگہ ءِ تہ ءَ ذخیره کن ات.",
        tip3Title: "۳. فشنگ ءِ فراڈانی ءَ چہ احتیاط کن ات",
        tip3Desc: "مائنڈ والٹ آئی پی ہچبر تئی پرائیویٹ کی، سیڈ فریز، یا پاس ورڈانی جست ءَ نہ کنت. جعلی ویب سائٹ، ای میل، یا ڈی ایم کہ تئو ءَ چہ لوٹنت کہ وتی والٹ ءَ 'تصدیق' یا 'کنکٹ' بکن ات، آیان ءَ چہ احتیاط کن ات. همیشه اطمینان کن ات کہ تئو سرکاری ڈومین ءِ سرا ئے: mindvaultip.com",
        tip4Title: "۴. ٹرانزیکشنز ءَ دقت ءَ گوں تصدیق کن ات",
        tip4Desc: "یک ٹرانزیکشن ءِ تصدیق کنگ ءَ پیش، همیشه والٹ اسکرین ءِ جزئیات ءَ بچار ات — وصول کنندہ ءِ ایڈریس، ٹوکن ءِ مقدار، ءُ نیٹ ورک فیس. فراڈی سائٹ شاید کوشش بکننت کہ تئو ءَ بدنیتی ءِ کنٹریکٹانی سرا دستخط کنگ ءِ واست ءَ فریب بدی انت.",
        tip5Title: "۵. مضبوط، منفرد پاس ورڈانی کارمرزی ءَ کن ات",
        tip5Desc: "وتی والٹ ءُ کنکٹ بوتگیں ڈیوائس ءَ مضبوط، منفرد پاس ورڈانی گوں محفوظ کن ات. هر جاگہ کہ ممکن بہ بیت، دو مرحله ای تصدیق (2FA) ءَ فعال کن ات. آسانی ءُ حفاظت ءِ واست ءَ یک معتبریں پاس ورڈ منیجر ءِ کارمرزی ءَ کن ات.",
        tip6Title: "۶. سافٹ ویئر ءَ اپ ٹو ڈیٹ بہ دار ات",
        tip6Desc: "وتی براؤزر، والٹ ایکسٹینشن، ءُ سیکورٹی سافٹ ویئر ءَ باقاعدگی ءَ اپ ڈیٹ کن ات تاں نقصانات دور بہ بنت. سافٹ ویئر ءِ پیشیگیں ورژن حملہ آورانی واست ءَ اولین ہدف اَنت.",
        tip7Title: "۷. نیٹ ورک سیٹنگز ءَ پدا بچار ات",
        tip7Desc: "ہمیشہ اطمینان کن ات کہ مائنڈ والٹ آئی پی ءِ گوں تعامل کنگ ءِ وخت ءَ تئو بیس نیٹ ورک (مین نیٹ) ءِ سرا ئے. غلط نیٹ ورک یا جعلی آر پی سی اینڈ پوائنٹس ءَ کنکٹ بیئگ شاید فنڈز ءِ گار بیئگ ءِ سبب بہ بیت.",
        disclaimerTitle: "دستبرداری",
        disclaimer: "اے معلومات فقط تعلیمی مقاصد ءِ واست ءَ اَنت. مائنڈ والٹ آئی پی کارمرز ءِ غفلت یا شرترین طریقہ کارانی رند ءَ نہ گرگ ءِ سبب ءَ بوتگیں فنڈز ءِ هچ نقصان ءِ ذمہ داری ءَ قبول نہ کنت. تئی والٹ — تئی ذمہ داری."
    }
};

const Tip = ({ icon: Icon, title, children }) => (
  <div className="glow-card p-6 rounded-2xl">
    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
      <Icon className="w-6 h-6 text-blue-400 flex-shrink-0"/>
      {title}
    </h3>
    <p className="text-gray-300 leading-relaxed">{children}</p>
  </div>
);

export default function WalletSecurityPage() {
  const [language] = useState(localStorage.getItem('lang') || 'en');
  const t = translations[language] || translations.en;

  return (
    <div className="bg-[#0B1220] text-white" dir={['fa', 'ar', 'ur', 'bal'].includes(language) ? 'rtl' : 'ltr'}>
      <div className="text-center py-16 px-4 bg-[#1a2332]/50">
        <ShieldCheck className="w-20 h-20 mx-auto text-[#00E5FF] mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
        <p className="text-lg text-center text-gray-300">{t.intro}</p>
        
        <div className="space-y-6">
          <Tip icon={ShieldCheck} title={t.tip1Title}>{t.tip1Desc}</Tip>
          <Tip icon={Key} title={t.tip2Title}>{t.tip2Desc}</Tip>
          <Tip icon={AlertTriangle} title={t.tip3Title}>{t.tip3Desc}</Tip>
          <Tip icon={ClipboardCheck} title={t.tip4Title}>{t.tip4Desc}</Tip>
          <Tip icon={Lock} title={t.tip5Title}>{t.tip5Desc}</Tip>
          <Tip icon={RefreshCw} title={t.tip6Title}>{t.tip6Desc}</Tip>
          <Tip icon={Network} title={t.tip7Title}>{t.tip7Desc}</Tip>
        </div>

        <div className="mt-12 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-yellow-300">{t.disclaimerTitle}</h3>
            <p className="text-yellow-400/80 mt-2">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
