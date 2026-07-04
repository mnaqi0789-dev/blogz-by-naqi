# BLOGZ

A personal blogging site built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Firebase (Firestore + Auth)**, **Zustand**, and **TanStack Query**.

Live essays on finance and computer science, a single-admin publishing workflow with a rich text editor, and a contact inbox — all in one lightweight stack.

---

## Features

- **Home** — landing page with intro copy and a floating banner image.
- **Posts** (`/posts`) — card grid of all posts, with search and category filtering (All / Finance / Computer Science).
- **Individual post** (`/blog/[slug]`) — full post view with a hero banner behind the title and the rich text content rendered as HTML.
- **Admin console** (`/admin`) — protected, single-owner dashboard:
  - Google sign-in via Firebase Auth, gated to one hardcoded owner email
  - **Create/Edit** — TipTap rich text editor, auto-generated slugs, category selector, banner image URL with live preview
  - **Manage Posts** — list of all posts with edit and delete (delete requires confirmation)
  - **Messages** — inbox of contact form submissions, with delete
  - Active tab persists across navigation (sessionStorage-backed)
- **Contact** (`/contact`) — form (name, email, subject, message) that writes directly to Firestore, plus contact details.
- Shared **Navbar** and **Footer** across every page.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Firebase Firestore + Firebase Auth |
| Client state | Zustand |
| Server state / caching | TanStack Query |
| Rich text editor | TipTap |
| Validation | Zod |
| Hosting | Netlify (`@netlify/plugin-nextjs`) |

---

## Data Model

**`posts` collection**

| Field | Type |
|---|---|
| `title` | `string` |
| `slug` | `string` — auto-generated from title |
| `description` | `string` |
| `content` | `string` — HTML from TipTap |
| `category` | `"finance" \| "compsci"` |
| `bannerImage` | `string` — image URL |
| `createdAt` | `Date` |

**`messages` collection**

| Field | Type |
|---|---|
| `name` | `string` |
| `email` | `string` |
| `subject` | `string` |
| `message` | `string` |
| `createdAt` | `Date` |

---

## Auth Flow

Single admin only. Sign-in is via Google (Firebase Auth). After login, the signed-in email is checked against `NEXT_PUBLIC_ADMIN_EMAIL`. A match grants access to `/admin`; anything else is shown a "Not Authorized" screen. No one else can create, edit, or delete posts.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_ADMIN_EMAIL=
```

Get the Firebase values from **Firebase Console → Project Settings → General → Your apps → SDK config**. `NEXT_PUBLIC_ADMIN_EMAIL` is the Google account allowed into `/admin`.

### 3. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 4. Build for production

```bash
npm run build
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                Home
│   ├── posts/page.tsx          Posts grid
│   ├── blog/[slug]/page.tsx    Individual post
│   ├── contact/page.tsx        Contact form
│   └── admin/
│       ├── page.tsx            Auth gate entry point
│       ├── AuthGate.tsx        Sign-in / unauthorized states
│       ├── AdminDashboard.tsx  Header, tabs, panel switcher
│       ├── PostForm.tsx        Loads post-to-edit, hands off to fields
│       ├── PostFormFields.tsx  Create/edit form UI + validation
│       ├── ManagePanel.tsx     Post list, edit/delete
│       ├── MessagesPanel.tsx   Contact inbox, delete
│       ├── schema.ts           Zod schema, slugify, form types
│       └── useAdminTab.ts      Persisted active-tab hook
├── components/                 Navbar, Footer, PostCard, CategoryFilter, SearchBar, TipTapEditor, shadcn/ui primitives
├── hooks/                      usePosts, useMessages, useAuth
├── lib/                        firebase.ts, posts.ts, utils.ts
└── store/                      authStore.ts, filterStore.ts (Zustand)
```

---

## Deployment (Netlify)

The repo includes a `netlify.toml` that wires up `@netlify/plugin-nextjs`, required because `/blog/[slug]` is server-rendered on demand.

1. Push to GitHub.
2. Netlify → **Add new site → Import an existing project** → select the repo.
3. Build command and publish directory are picked up from `netlify.toml` automatically.
4. Add the same seven environment variables from `.env.local` under **Site configuration → Environment variables**.
5. Deploy.
6. In **Firebase Console → Authentication → Settings → Authorized domains**, add your Netlify domain — otherwise Google sign-in will be rejected in production.

---

## Roadmap Status

- [x] Phase 1 — Setup
- [x] Phase 2 — Data layer (Firestore queries, Zustand stores, TanStack Query hooks)
- [x] Phase 3 — Shared components
- [x] Phase 4 — Pages (Home, Posts, Individual post, Admin, TipTap editor, Contact)
- [x] Phase 5 — Auth listener, protected admin route, slug generator, deploy

All phases complete.
