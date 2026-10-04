# KostKu

SaaS platform for managing boarding houses (kost). Owners handle properties, rooms, tenants, and monthly billing in one dashboard. Tenants pay invoices online and chat with the owner.

**Live:** [kostku-app-zeta.vercel.app](https://kostku-app-zeta.vercel.app)

## Features

**For owners**
- Multi-property and room management with image upload and primary photo selection
- AI-generated room descriptions (Groq, LLaMA 3.3 70B)
- Tenancy management: start, update, and end a tenancy
- One-click monthly invoice generation for all active tenants
- Revenue dashboard with monthly charts
- CSV export for invoices and payments, plus a printable invoice view

**For tenants**
- Personal dashboard with active tenancy and invoice status
- Online payment through Midtrans Snap, confirmed by webhook
- In-app messaging with the owner and read receipts
- Email notifications

**General**
- Token-based auth (Laravel Sanctum) with separate owner and tenant areas
- Profile and password management

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, TanStack Query, Axios, Recharts |
| Backend | Laravel, Laravel Sanctum, REST API |
| Database | PostgreSQL (Neon) |
| Payments | Midtrans Snap with webhook handling |
| AI | Groq API (llama-3.3-70b-versatile) |
| Messaging | SMTP email, Fonnte WhatsApp gateway |
| Deployment | Vercel (frontend), Render with Docker (backend) |

## Architecture

```
kostku-app/
├── frontend/          Next.js app
│   └── app/
│       ├── (auth)/    login and register
│       ├── owner/     owner dashboard
│       └── tenant/    tenant dashboard
├── backend/           Laravel API
│   ├── app/Http/Controllers/Api/
│   ├── database/      migrations and seeders
│   └── routes/api.php
└── render.yaml        Render deployment blueprint
```

The API exposes 40+ endpoints grouped by resource: auth, dashboard, properties, rooms, room images, tenancies, invoices, payments, messages, AI, and export. Routes under `auth:sanctum` are protected; only register, login, and the Midtrans webhook are public.

## Run Locally

**Backend**

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Set the API URL in the frontend environment file and add your own Midtrans sandbox keys, Groq API key, and SMTP credentials in `backend/.env`.

## Deployment

- **Backend:** Docker service on Render, configured in `render.yaml` (health check at `/up`, PostgreSQL on Neon)
- **Frontend:** Vercel, with `vercel.json` in `frontend/`

## Status

Actively developed. Core owner and tenant flows are live; features are still being added.

## Author

Built by [Saifudin Reza](https://github.com/saifudinreza). Open to Junior Software Engineer roles: [portfolio](https://zare-world-portofolio.vercel.app/) · [LinkedIn](https://linkedin.com/in/saifudin-reza-y2003)
