# Bahar & Firat — Wedding Invitation

A wedding invitation website built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
app/              # Pages and global styles
components/       # Reusable UI components
lib/site-config.ts # Wedding details (names, date, venue)
public/           # Static assets (photos, favicon)
```

Update wedding details in `lib/site-config.ts`.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will auto-detect Next.js — no extra configuration needed.
4. Click **Deploy**.

Your site will be live at a `*.vercel.app` URL. You can add a custom domain in the Vercel project settings.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Run production build     |
| `npm run lint`  | Run ESLint               |
