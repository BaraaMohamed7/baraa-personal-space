# Baraa — Personal Space (Next.js prototype)

Next.js 16 App Router + TypeScript. No database, CMS, or Tailwind required for this prototype.
This is the Next.js conversion of the earlier HTML/CSS/JS proof of concept, with a navy star-field background, geometric shapes and slow scroll parallax, a photo cutout, Arabic/English, projects, experience, about and connect sections.

## Run it locally

Requirements: Node.js 20.9+ (Node 22/24 LTS recommended) and npm.

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

For a production check:

```bash
npm run typecheck
npm run lint
npm run build
```

You can use `npm run start` after a successful build.

## Where to edit

- **`src/app/globals.css`**: colors in `:root`, typography, spacing, background textures, star density, geometry and mobile styling.
- **`src/components/HomePage.tsx`**: React components for every section, translation copy, typing effect, filtering, motion, and language toggle.
- **`src/data/site.ts`**: project details, stack, domains, visibility, experiences, and social links. Add a new `Project` object to add a card. Set `published: false` to hide it from the site entirely.
- **`src/components/HeroPortrait.tsx`**: a non-destructive SVG silhouette based on the untouched seated photo; no generative face/clothing changes.
- **`public/images/hero-original.png`**: original photo untouched for future retouching.
- **`src/app/layout.tsx`**: site metadata and font links.

## Functionality

- Bilingual English / Arabic UI; RTL flips the hero layout.
- Typing animation (respects `prefers-reduced-motion`).
- Navy/white-dot geometric star-field with light parallax motion (respects reduced motion).
- Projects filtering by technology and domain.
- "Manage visibility" is only a **local preview control**. Its hidden state is saved in your current browser's localStorage. **This is not an admin dashboard**, and visitor-side hides are not persistent site-wide. Use `published: false` to remove a project for everyone until a CMS is connected.
- Project links and experience details are editable sample content — verify before publishing.

## Notes / limitations

- This is a front-end prototype, not production-ready content management.
- Project status, dates and descriptions should be reviewed and improved before publishing.
- The hero displays the unchanged original image through an approximate, editable SVG silhouette. It avoids generated-text/face distortion but its outline may still need professional refinements, particularly at small hair/shoulder details.
- Google Fonts loads over the network with system fallbacks when offline.
- The package is intentionally distributed without `node_modules` or `.next` for a small download. `npm install` generates the `package-lock.json` on your computer; commit the lockfile to Git.
- The sandbox environment could not complete registry access, so dependencies/build have **not** been verified in a full Next.js compilation here. TypeScript/TSX syntax was checked locally. Run `npm run typecheck`, `npm run lint`, and `npm run build` after installing.

## Next step

Once it starts locally, we can polish image edges, tune mobile layout, project cards, metadata and animations, then move content into a CMS if needed.

## Pull requests and Vercel deployment

- GitHub Actions runs `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build` for pull requests and pushes to `main`.
- To enable deployments, import this GitHub repository into Vercel and select the Next.js framework. Vercel creates Preview Deployments for PRs and deploys Production on pushes to the production branch (`main` by default).
- No cron job is necessary for continuous integration or deployment.
