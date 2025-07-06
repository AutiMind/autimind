# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

| Command | Action |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally |
| `npm run astro ...` | Run Astro CLI commands |

## Tech Stack & Architecture

This is a static marketing website built with:
- **Astro 5.11.0** - Static site generator with React integration
- **React 19.1.0** - For interactive components
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Framer Motion 12.23.0** - Animation library
- **Lucide React 0.525.0** - Icon library

### Key Architecture Patterns

1. **Hybrid Astro/React Architecture**: Astro components (`.astro`) handle static content and layouts, while React components (`.tsx`) handle interactivity. React components use `client:load` directive for hydration.

2. **SEO-Optimized Structure**: The `Layout.astro` component includes comprehensive SEO metadata, structured data (JSON-LD), and social media meta tags. All pages inherit from this base layout.

3. **Gradient Design System**: Consistent use of gradient backgrounds and text effects throughout the site using Tailwind's custom color palette (primary teal/cyan, accent orange/red).

4. **Animation Strategy**: Framer Motion is used for micro-interactions and page transitions, with custom Tailwind keyframes for CSS animations.

## File Structure

```
src/
├── components/
│   ├── *.astro         # Static components (Header, Hero, About)
│   └── *.tsx           # Interactive React components (ContactForm, AnimatedText)
├── layouts/
│   └── Layout.astro    # Base layout with SEO and meta tags
├── pages/
│   └── index.astro     # Main page - imports all components
└── styles/
    └── global.css      # Global styles, imports Tailwind
```

## Important Configuration

- **Node Version**: Uses Node 18 (specified in `.nvmrc`)
- **Legacy Peer Deps**: Uses `legacy-peer-deps=true` in `.npmrc` for Tailwind CSS 4.x compatibility
- **Static Output**: Configured for static site generation (`output: 'static'`)
- **Deployment**: Optimized for Cloudflare Pages

## Contact Form Implementation

The contact form uses a simple mailto: approach - it opens the user's email client with pre-populated fields rather than handling form submission server-side. This maintains the static nature of the site while providing functional contact capability.

## SEO & Performance

The site includes comprehensive SEO optimization:
- Structured data for organization and website
- Complete Open Graph and Twitter meta tags
- Canonical URLs and sitemap
- Performance-optimized with Astro's static generation
- Mobile-first responsive design