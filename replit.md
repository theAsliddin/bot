# Telegram Bot - Superadmin Message Forwarder

## Loyiha haqida
Ushbu loyiha Telegram bot orqali yangi foydalanuvchilarning xabarlarini superadminga avtomatik yuborish uchun yaratilgan. Bot Node.js va node-telegram-bot-api kutubxonasi yordamida ishlab chiqilgan.

## Asosiy xususiyatlar
- Barcha foydalanuvchi xabarlarini superadminga yuboradi
- Foydalanuvchi ma'lumotlarini (ism, username, user ID) bilan birga yuboradi
- /start buyrug'i orqali yangi foydalanuvchilarni kutib oladi
- Rasm, video, hujjat va boshqa media fayllarni ham yuboradi
- Foydalanuvchiga xabar yuborilganini tasdiqlaydi
- **Admin bot orqali foydalanuvchilarga javob berishi mumkin** (/reply buyrug'i)

## Texnologiyalar
- **Backend**: Node.js
- **Bot Library**: node-telegram-bot-api
- **Environment**: dotenv

## Muhim sozlamalar
Bot ishlashi uchun quyidagi muhim sozlamalar kerak:

### 1. Telegram Bot Token
- Telegram'da @BotFather botiga /newbot buyrug'ini yuboring
- Bot uchun nom va username tanlang
- BotFather sizga bot token beradi

### 2. Admin Chat ID
- Telegram'da @userinfobot yoki @getidsbot ga /start yuboring
- Bu botlar sizga Chat ID ni beradi
- Yoki shunchaki botingizga xabar yozing va bot konsol logida chat ID ko'rsatadi

## O'rnatish
1. Telegram bot yarating (@BotFather orqali)
2. Bot tokenini va admin chat ID ni kiriting
3. Bot avtomatik ishga tushadi

## Qanday ishlaydi
1. Foydalanuvchi botga xabar yuboradi
2. Bot xabarni qabul qiladi va foydalanuvchiga tasdiqlash xabarini yuboradi
3. Bot xabarni foydalanuvchi ma'lumotlari bilan birga adminga yuboradi
4. Admin javob beradi (2 ta usul):
   - **1-usul (tavsiya etiladi):** Admin yuborilgan xabarga to'g'ridan-to'g'ri reply qiladi
   - **2-usul:** Admin `/reply <chat_id> <javob>` buyrug'idan foydalanadi
5. Foydalanuvchi adminning javobini oladi

### Admin javob berish usullari:

**1-usul (Oson va tavsiya etiladi):**
- Admin Telegram'da botdan kelgan xabarga oddiy reply qiladi
- Bot avtomatik ravishda javobni to'g'ri foydalanuvchiga yuboradi
- Rasm, video, hujjat ham yuborish mumkin

**2-usul (Buyruq orqali):**
```
/reply 123456789 Salom! Sizning savolingizga javob...
```

**Muhim:** Agar foydalanuvchi bir nechta xabar yuborsa, admin har bir xabarga alohida reply qila oladi.

## Loyiha tuzilishi
```
.
├── bot.js              # Asosiy bot kodi
├── package.json        # Loyiha bog'liqliklari
├── .env.example        # Environment o'zgaruvchilar namunasi
├── .gitignore          # Git e'tiborsiz fayllar
└── replit.md          # Loyiha hujjati
```

## Oxirgi o'zgarishlar
- 2025-10-27: Dastlabki loyiha yaratildi
- Node.js va node-telegram-bot-api o'rnatildi
- Xabar yuborish funksiyasi qo'shildi
- Media fayl yuborish qo'llab-quvvatlandi
- Admin javob berish funksiyasi qo'shildi (/reply buyrug'i)
- Xabar tracking tizimi qo'shildi (har bir xabarga alohida reply)
- Reply-to-message funksiyasi qo'shildi (admin oddiy reply qilishi mumkin)
- Chat ID konvertatsiya muammosi tuzatildi
- Memory management qo'shildi (max 1000 xabar)

## Foydalanuvchi sozlamalari
- Til: O'zbekcha
- Framework: Node.js + Telegram Bot API
