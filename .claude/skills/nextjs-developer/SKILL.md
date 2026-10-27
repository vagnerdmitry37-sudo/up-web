---
name: nextjs-developer
description: Rules for writing code in this Next.js (App Router) app, starting with where files go — folder structure, routes, pages, layouts, components, lib, hooks — following the official Next.js docs. Use every time before writing new code or adding files in this project: a new page, route, layout, component, API route handler, hook, utility, server action, or any refactor that moves files. Read it before creating the first file, not after.
---

Follow the official Next.js documentation for the version installed in this project. This app runs **Next.js 16 with the App Router**, React 19, TypeScript, Tailwind v4 and shadcn/ui.

## 0. Check the docs first

The docs that match the installed version ship in `node_modules/next/dist/docs/`. They override what you remember, since APIs and conventions change between versions. Before writing code, read the guide for what you are building:

| Building…                          | Read (under `node_modules/next/dist/docs/01-app/01-getting-started/`) |
| ---------------------------------- | ------------------------------------------------------------------- |
| Any new file or folder             | `02-project-structure.md`                                           |
| Pages and layouts                  | `03-layouts-and-pages.md`                                           |
| Links and navigation               | `04-linking-and-navigating.md`                                      |
| Interactivity, `"use client"`      | `05-server-and-client-components.md`                                |
| Data fetching                      | `06-fetching-data.md`                                               |
| Forms and server actions           | `07-mutating-data.md`                                               |
| Caching and revalidation           | `08-caching.md`, `09-revalidating.md`                               |
| `error`, `not-found`               | `10-error-handling.md`                                              |
| Images, fonts, metadata, SEO       | `12-images.md`, `13-fonts.md`, `14-metadata-and-og-images.md`       |
| API endpoints                      | `15-route-handlers.md`                                              |
| Request interception (`proxy.ts`)  | `16-proxy.md`                                                       |

For details, see `02-guides/` and `03-api-reference/` in the same folder. If `node_modules` is missing, use https://nextjs.org/docs/app. Pay attention to deprecation notices. For example, `middleware.ts` is now `proxy.ts`.

## 1. Folder structure

This project stores **shared code at the root, outside `app/`**, and **colocates route-specific code inside the route** in private folders. The Next.js docs call this "split project files by feature or route." Keep to it and don't mix in other strategies.

```
UPWeb/
├── app/                      # Routing only, plus code used by a single route
│   ├── layout.tsx            # Root layout (<html>, <body>). Required.
│   ├── page.tsx              # /
│   ├── globals.css
│   ├── not-found.tsx         # Optional global 404
│   ├── global-error.tsx      # Optional root error boundary
│   ├── (marketing)/          # Route group: organizes routes, not part of the URL
│   │   ├── layout.tsx        # Layout shared by this group only
│   │   └── about/page.tsx    # /about
│   ├── blog/
│   │   ├── page.tsx          # /blog
│   │   ├── loading.tsx       # Suspense skeleton for /blog
│   │   ├── error.tsx         # Error boundary for /blog ("use client")
│   │   ├── [slug]/page.tsx   # /blog/:slug
│   │   ├── _components/      # Private: UI used ONLY by /blog routes
│   │   └── _lib/             # Private: data/helpers used ONLY by /blog routes
│   └── api/
│       └── health/route.ts   # GET /api/health (route handler)
├── components/               # Shared UI used by 2+ routes
│   └── ui/                   # shadcn/ui primitives. Add via the shadcn CLI, don't hand-edit
├── hooks/                    # Shared client hooks (useXxx.ts)
├── lib/                      # Shared non-UI code: utils.ts (cn), data access, types
└── public/                   # Static assets served from /
```

These match the `components.json` aliases: `@/components`, `@/components/ui`, `@/lib`, `@/hooks`, `@/lib/utils`. Always import with the `@/` alias, not long relative paths.

### Where does new code go?

1. **Is it a URL?** It goes in a folder under `app/`, with a `page.tsx` for UI or a `route.ts` for an API. Never put `page.tsx` and `route.ts` in the same segment.
2. **Is it used by one route or one section?** Colocate it in that segment's `_components/` or `_lib/`.
3. **Is it used by two or more unrelated routes?** Put it in `components/`, `hooks/` or `lib/` at the root.
4. **Is it a shadcn primitive?** Put it in `components/ui/`, added with `npx shadcn@latest add <name>`.
5. **Is it a static file (images, robots, etc.)?** Use `public/`, or a metadata file convention in `app/` (`icon`, `opengraph-image`, `sitemap.ts`, `robots.ts`).

If route-specific code later gets shared, move it up to the root folders. Don't import one route's `_components` into another route.

## 2. Routing file conventions

A folder is a URL segment. It becomes public only when it contains `page.tsx` or `route.ts`. Other files in it are safe to colocate.

| File               | Purpose                                                         |
| ------------------ | --------------------------------------------------------------- |
| `layout.tsx`       | Shared UI that persists across child routes (header, nav)       |
| `page.tsx`         | The route's UI. Makes the segment public                        |
| `loading.tsx`      | Suspense fallback (skeleton) for the segment                    |
| `error.tsx`        | Error boundary for the segment. Must be a Client Component      |
| `global-error.tsx` | Root-level error boundary. Includes its own `<html>`/`<body>`   |
| `not-found.tsx`    | UI for `notFound()` and unmatched URLs                          |
| `route.ts`         | API endpoint (`GET`, `POST`, … exports)                         |
| `template.tsx`     | Like a layout, but re-mounts on every navigation                |
| `default.tsx`      | Fallback for parallel route slots                               |

Render order: `layout` → `template` → `error` → `loading` → `not-found` → `page`. Each one nests inside its parent segment's components.

Folder naming patterns:

| Pattern            | Meaning                                       | Example                          |
| ------------------ | --------------------------------------------- | -------------------------------- |
| `[slug]`           | Dynamic segment (read via `params`)           | `app/blog/[slug]/page.tsx`       |
| `[...slug]`        | Catch-all                                     | `app/shop/[...slug]/page.tsx`    |
| `[[...slug]]`      | Optional catch-all                            | `app/docs/[[...slug]]/page.tsx`  |
| `(group)`          | Route group, not part of the URL              | `app/(shop)/cart/page.tsx` → `/cart` |
| `_folder`          | Private folder, excluded from routing         | `app/blog/_components/`          |
| `@slot`            | Parallel route slot passed to parent layout   | `app/dashboard/@sidebar/`        |
| `(.)x` `(..)x` `(...)x` | Intercepting route (e.g. modal over list) | `app/feed/(..)photo/[id]/`       |

Use route groups to give a subset of routes their own layout or `loading.tsx` without changing URLs. Multiple root layouts are allowed only through route groups, and each one renders `<html>`/`<body>`.

## 3. Components

- **Server Components by default.** Add `"use client"` only to the smallest leaf that needs state, effects, event handlers or browser APIs. Keep pages and layouts as server components, and pass server data down as props.
- Fetch data in server components or in `_lib`/`lib` functions, not in client `useEffect`, unless it is truly client-only.
- Code that must never reach the browser (secrets, DB access) goes in `lib/` and imports `server-only`.
- Use `next/link` for internal navigation, `next/image` for images, `next/font` for fonts, and the `metadata` export or `generateMetadata` for `<head>` tags.
- `params` and `searchParams` are Promises. `await` them, and check the page/layout API reference for the current typing helpers.

## 4. Naming

- Routing files use the exact lowercase names from the table above (`page.tsx`, `layout.tsx`, …).
- Route folders use lowercase kebab-case (`app/user-settings/`), since they become URLs.
- Component files use PascalCase (`PostCard.tsx`) and export a component of the same name. shadcn files in `components/ui/` keep shadcn's kebab-case names.
- Hooks are named `useThing.ts`. Utilities and other modules use camelCase or kebab-case. Use one style per folder.
- Prefer named exports for shared components. Routing files use `export default`, which Next.js requires.

## 5. Before you finish

- Did every new file land where section 1 says it should?
- Is `"use client"` only where it's needed?
- Did you avoid deprecated APIs from the version-matched docs?
- Run `npm run lint`. For larger changes, also run `npm run build`.
