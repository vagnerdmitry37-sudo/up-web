---
name: mobile-first-ui
description: Mobile-first UI rules for this Next.js app. The site must work perfectly on phones, tablets and desktops, and phones matter most. Use every time you create or change anything visual — a layout, page, component, Tailwind classes, CSS in globals.css, spacing, typography, images, navigation, forms, or any responsive behavior. Load it before writing the markup or styles, together with the nextjs-developer skill.
---

This app is **mobile first**. Most users are on phones. Design and build for a ~360px-wide phone screen first, then enhance for tablets and desktops. A change isn't done until it works well at every width in the "Check every width" table in section 6.

Styling uses **Tailwind CSS v4** with shadcn/ui theme tokens (`bg-background`, `text-muted-foreground`, `bg-card`, …) defined in `app/globals.css`. Use the tokens instead of raw colors, so dark mode keeps working.

## 1. Write mobile styles first, then add breakpoints

Tailwind classes without a prefix apply to **every** screen size, starting from the smallest. Prefixed classes apply **from that width up**:

| Prefix | Min width | Typical device                  |
| ------ | --------- | ------------------------------- |
| (none) | 0         | Phones (design for these first) |
| `sm:`  | 640px     | Large phones, landscape         |
| `md:`  | 768px     | Tablets                         |
| `lg:`  | 1024px    | Small laptops, landscape tablet |
| `xl:`  | 1280px    | Desktops                        |

```tsx
// ✅ Mobile first: one column on phones, more columns as space grows
<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

// ❌ Desktop first: hiding or undoing things for small screens
<ul className="grid grid-cols-3 max-md:grid-cols-1">
```

- Unprefixed classes are the phone design. Add `sm:`, `md:` or `lg:` only to *enhance* for bigger screens.
- Avoid `max-*:` variants. If you need them, the base styles are probably desktop-first.
- Don't hide important content or actions on mobile (`hidden md:block`). Rearrange it instead.

## 2. Layout

- **No horizontal scrolling at 320px.** Use flex/grid with wrapping, `min-w-0` on flex children that hold long text, and `break-words` for user content (product names and descriptions come from the database and can be long).
- **Page gutters:** `px-4` on phones, widening at larger sizes if needed (`px-4 md:px-6 lg:px-8`). Center content with `mx-auto w-full max-w-*`.
- **Never use fixed widths** for containers (`w-[600px]`). Use `w-full` plus `max-w-*`.
- **Stack first:** elements sit in a column on phones (`flex flex-col`) and move side by side from `sm:` or `md:` up (`sm:flex-row`).
- **Viewport height:** use `min-h-dvh` instead of `h-screen`/`100vh`, because mobile browser toolbars change the visible height.
- **Notches and home indicators:** add `pb-[env(safe-area-inset-bottom)]` to fixed or sticky bars at the bottom of the screen.
- Don't add a custom `viewport` export. Next.js already sets `width=device-width, initial-scale=1`. Never disable zoom (`maximum-scale=1`, `user-scalable=no`).

## 3. Touch and interaction

- **Touch targets are at least 44×44px:** `min-h-11` (44px) on buttons, links styled as buttons, inputs and icon buttons. Space neighbouring targets at least `gap-2` apart.
- **Never rely on hover.** Phones have no hover, so anything shown only on `hover:` (menus, actions, tooltips) must also be reachable by tap. Use `hover:` for decoration only.
- Make the whole card or row the link or tap area, not only a small text link inside it.
- Put primary actions where thumbs reach them on phones: full-width buttons (`w-full sm:w-auto`), placed near the content they act on.
- Always show a visible focus style (`focus-visible:ring-2 focus-visible:ring-ring`).

## 4. Typography and forms

- **Inputs, selects and textareas use at least 16px text** (`text-base`) on phones, otherwise iOS Safari zooms in when they get focus. To use smaller text on desktop, write `text-base sm:text-sm`, never plain `text-sm`.
- Body text is at least `text-sm` (14px). Prefer `text-base` for paragraphs people read.
- Scale headings up with breakpoints: `text-2xl sm:text-3xl`.
- Set the right `type` and `inputMode` on inputs (`type="search"`, `type="email"`, `inputMode="numeric"`), so phones show the right keyboard.
- Keep line length comfortable on large screens with `max-w-prose` for long text.

## 5. Images and media

- Always use `next/image` with a `sizes` prop that matches the mobile-first layout, so phones download small images, for example `sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"` for a 1/2/3-column grid.
- Give images a fixed aspect ratio (`aspect-square`, `aspect-video`) to prevent layout shift while they load.
- Use `priority` only for the main image above the fold.

## 6. Check every width

Before finishing, check the UI at these widths, for example in browser dev tools' device toolbar:

| Width  | Represents          |
| ------ | ------------------- |
| 320px  | Smallest phones     |
| 375px  | Typical phone       |
| 768px  | Tablet (portrait)   |
| 1024px | Tablet (landscape)  |
| 1280px | Desktop             |

At each width, confirm:

- There's no horizontal scroll and nothing is cut off or overlapping.
- Text is readable without zooming, and long names wrap.
- Every button, link and input is easy to tap (at least 44px) and not dependent on hover.
- Focusing an input doesn't zoom the page on iOS (inputs are at least 16px).
- Light and dark mode both look right (use theme tokens, not raw colors).
