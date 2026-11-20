# TripCraft – Backend

## Requirements
- Node.js
- npm
- PostgreSQL Database Connection

## Installation

1. افتح Terminal داخل فولدر `Server`.
2. نفّذ الأمر:

```bash
npm install
```

3. أنشئ ملف `.env` باستخدام `.env.example`.
4. ضع رابط اتصال قاعدة بيانات Neon الحقيقي في `DATABASE_URL` داخل `.env`.

## Database Setup

تم تجهيز Prisma وربطه بقاعدة بيانات PostgreSQL المشتركة على Neon.

لتطبيق الـMigrations الموجودة:

```bash
npx prisma migrate deploy
```

**مهم:** لا تشغّل أو تنشئ Migrations جديدة إلا بالتنسيق مع مسؤول الـBackend.

## Run the Backend

لتشغيل السيرفر في وضع التطوير:

```bash
npm run dev
```

## Important Notes
- لا تنشئ مشروع Backend جديدًا.
- لا تشارك ملف `.env` أو بيانات الاتصال على GitHub.
- لا تعدّل Prisma Schema أو Migrations دون الرجوع لمسؤول الـBackend.