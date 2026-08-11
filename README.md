# BLOGZ

A personal blogging site built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, **Firebase (Firestore + Auth)**, **Zustand**, and **TanStack Query**. Live essays on finance and computer science, a single-admin publishing workflow with a rich text editor, and a contact inbox — all in one lightweight stack.

---

## Features

- **Home** — landing page with intro copy and a floating banner image.
- **Posts** (`/posts`) — card grid of all posts, with search and category filtering (All / Finance / Computer Science).
- **Individual post** (`/blog/[slug]`) — full post view with a hero banner behind the title and the rich text content rendered as HTML.
- **Admin console** (`/admin`) — protected dashboard featuring two access tiers (Admin vs. Demo Mode):
  - Google sign-in via Firebase Auth.
  - **Create/Edit** — TipTap rich text editor, auto-generated slugs, category selector, banner image URL with live preview.
  - **Manage Posts** — list of all posts with edit and delete capabilities.
  - **Messages** — inbox of contact form submissions.
  - Active tab persists across navigation (sessionStorage-backed).
- **Contact** (`/contact`) — form (name, email, subject, message) that writes directly to Firestore, plus contact details.
- Shared **Navbar** and **Footer** across every page.

---

## What's New in V2: Demo Mode

To allow safe public exploration of the administrative panel without exposing underlying databases or configurations, V2 introduces a global **Demo Mode** constraint for unauthorized accounts:

- **Gated Write Actions** — Disables core write events including saving changes, editing data, and deleting entities.
- **Protected Data Privacy** — Hides sensitive assets, including user inquiries and message text, from unauthorized view.
- **Full Interface Browsing** — Users can navigate the entire dashboard, open creation menus, and configure fields up to the final execution step.
- **Interactive Safeguards** — Attempting a final save or destructive action triggers a modal notification explaining that the action is locked, prompting the user to contact the primary admin for full clearance.

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

### `posts` collection

| Field | Type |
|---|---|
| `title` | `string` |
| `slug` | `string` — auto-generated from title |
| `description` | `string` |
| `content` | `string` — HTML from TipTap |
| `category` | `"finance" \| "compsci"` |
| `bannerImage` | `string` — image URL |
| `createdAt` | `Date` |

### `messages` collection

| Field | Type |
|---|---|
| `name` | `string` |
| `email` | `string` |
| `subject` | `string` |
| `message` | `string` |
| `createdAt` | `Date` |

---

## Auth Flow

The administrative system runs on a strict single-owner validation protocol using Google Sign-In (Firebase Auth):

1. **Email Check** — After a login attempt, the user's email is evaluated against `NEXT_PUBLIC_ADMIN_EMAIL`.
2. **Admin Access** — A matching email grants full read/write authority across all dashboard tabs, configuration updates, and message logs.
3. **Demo Mode Dropback** — Any non-matching authenticated email falls back to **Demo Mode**. This authorizes the user to view UI workflows safely while blockading mutations and data leaks.

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
Get the Firebase values from **Firebase Console → Project Settings → General → Your apps → SDK config**. `NEXT_PUBLIC_ADMIN_EMAIL` is the primary Google account granted full administrative access.

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

```src/
├── app/
│   ├── page.tsx                 # Home
│   ├── posts/page.tsx           # Posts grid
│   ├── blog/[slug]/page.tsx     # Individual post
│   ├── contact/page.tsx         # Contact form
│   └── admin/
│       ├── page.tsx             # Auth gate entry point
│       ├── AuthGate.tsx         # Sign-in handler and Demo fallback router
│       ├── AdminDashboard.tsx   # Header, tabs, panel switcher
│       ├── PostForm.tsx         # Loads post-to-edit, hands off to fields
│       ├── PostFormFields.tsx   # Create/edit form UI + validation (Demo gated)
│       ├── ManagePanel.tsx      # Post list, edit/delete (Demo gated)
│       ├── MessagesPanel.tsx    # Contact inbox (Hidden/Gated in Demo)
│       ├── schema.ts            # Zod schema, slugify, form types
│       └── useAdminTab.ts       # Persisted active-tab hook
├── components/                  # Navbar, Footer, PostCard, CategoryFilter, SearchBar, TipTapEditor, shadcn/ui primitives
├── hooks/                       # usePosts, useMessages, useAuth
├── lib/                         # firebase.ts, posts.ts, utils.ts
└── store/                       # authStore.ts, filterStore.ts (Zustand)
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
- [x] Phase 6 — V2 Updates (Demo Mode integration, write-blocking UI, popup triggers)

All phases complete.

