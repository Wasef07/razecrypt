# 🔐 RazeCrypt

RazeCrypt is a secure, privacy-first password and card vault built with **Next.js App Router**, featuring **end-to-end encryption**, **modern authentication**, and **production-grade security patterns**.

It supports **credentials login**, **Google OAuth**, and **GitHub OAuth**, with unified user accounts and protected routes — all without requiring a paid domain.

---

## ✨ Features

### 🔑 Authentication
- Email & password authentication (bcrypt hashed)
- Google OAuth
- GitHub OAuth
- Unified accounts (same email → same user)
- JWT-based sessions (NextAuth / Auth.js)
- Clean redirects & polished auth UX

### 🧱 Security
- AES encryption for:
  - Stored passwords
  - Card numbers
  - CVV
- Secrets are **never stored in plain text**
- Server-side encryption & decryption only
- API protection via server sessions
- Route protection via Edge Middleware

### 🗄️ Vault Functionality
- Store and manage:
  - Passwords (website, username, password)
  - Credit/debit cards (name, number, expiry, CVV)
- Full CRUD operations
- Masked secrets with reveal / copy
- Auto-hide sensitive fields
- Per-user data isolation

### 🎨 UI / UX
- Modern, clean UI with Tailwind CSS + shadcn/ui
- Dark / light theme toggle
- Responsive layout
- OAuth buttons with official provider logos
- Clear signed-in vs signed-out states

---

## 🧠 Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React
- Tailwind CSS
- shadcn/ui
- Lucide Icons

**Backend**
- Next.js API Routes
- MongoDB + Mongoose
- AES encryption
- bcrypt

**Authentication**
- NextAuth (Auth.js)
- Credentials Provider
- Google OAuth
- GitHub OAuth
- JWT sessions

**Deployment**
- Vercel-ready

---

## 🏗️ Architecture Overview

            ┌──────────────┐
            │   Browser    │
            │ (Client UI)  │
            └──────┬───────┘
                │ HTTPS
                ▼
            ┌──────────────────────┐
            │ Next.js App Router   │
            │ (Server Components)  │
            ├──────────────────────┤
            │ Edge Middleware      │  ← Route protection
            ├──────────────────────┤
            │ Auth.js (NextAuth)   │  ← Session validation
            ├──────────────────────┤
            │ API Routes           │  ← Secure server logic
            │  - /api/cards        │
            │  - /api/passwords    │
            ├──────────────────────┤
            │ Encryption Layer     │  ← AES encrypt/decrypt
            ├──────────────────────┤
            │ MongoDB (Mongoose)   │
            └──────────────────────┘

---

## 🔐 Security Model

- Passwords & card data are encrypted using AES **before** being stored
- Decryption happens **only on the server**
- Authentication state is verified on:
  - UI level (session)
  - Route level (middleware)
  - API level (server session)
- OAuth users are automatically linked by email to prevent duplicate accounts

---

## 🧪 Route Protection

- Public routes:
  - `/sign-in`
  - `/sign-up`
  - `/api/auth/*`
- Protected routes:
  - `/`
  - `/api/cards`
  - `/api/passwords`

Edge Middleware blocks unauthorized access and redirects users to `/sign-in`.

---

## 🔧 Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

---

## 🚀 Getting Started

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# App runs at:
http://localhost:3000