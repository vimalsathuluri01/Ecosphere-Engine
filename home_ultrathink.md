# ULTRATHINK: Homepage Architecture (Zen-Eco Production Grade)

## Context & Mandate

The homepage is currently running an outdated UI (serif fonts, heavy green backgrounds) from before the "Zen Eco" visual identity was established. The user has requested a professional, highly polished redesign that acts as the authoritative starting point for the entire Ecological Diagnostic System, applying the current Zen UI standards (`bg-[#FAF9F6]`, crisp white cards, `border-stone-100`, brutalist `font-mono` headers).

The wording requires "New York Times-level" professional climate intelligence tonality.

## Architectural Sections

### 1. Section 1: The Authority Hero (The Thesis)

**Objective:** Immediately establish credibility. No soft marketing copy.

- **Layout:** Asymmetrical split. Left side typography, right side abstract "Terminal" dataviz (to hint at the math powering the engine).
- **Wording:**
  - *Kicker:* "Ecological Diagnostic System v5.0"
  - *Headline:* "Radical Transparency Engine."
  - *Subheadline:* "Decoupling environmental reality from corporate marketing. A mathematically rigorous intelligence system quantifying the planetary boundaries of global commerce."
- **Actions (The Funnels):**
  - Primary: "Industry Analytics" (`/analytics`)
  - Secondary: "Algorithmic Validation" (`/validation`)

### 2. Section 2: Core Infrastructure (The Bento Capabilities)

**Objective:** Explain *what* the site does using the standard Zen Eco "Bento Box" grid layout.

- **Layout:** 3 distinct `ZenCard` components.
- **Card 1: Algorithmic Robustness (`/validation`)**
  - "Monte Carlo simulated scoring models resistant to PR manipulation."
- **Card 2: Macro Analytics (`/analytics`)**
  - "Top-down distribution analysis and physical threshold exposure of the global supply chain."
- **Card 3: Product Intelligence (`/products`)**
  - "Granular, SKU-level sustainability vetting powered by non-compensatory logic."

### 3. Section 3: The Intelligence Feed (Live Macro Stats)

**Objective:** Show the scale of the data in a minimalist, brutalist way.

- **Layout:** A full-width banner with 3-4 massive data points.
- **Data Points:**
  - "Total Brands Indexed" (e.g., 280)
  - "Average Ecosphere Score" (e.g., 32/100) -> *Wording: "Indicating severe systemic physical breaches."*
  - "Systemic Overload" (e.g., 68% of brands failing critical water/carbon barriers).
- **UI:** Massive thin typography for the numbers, overlaid with tiny Recharts sparklines.

### 4. Section 4: The Survivors Index (Top Brands)

**Objective:** Repurpose the existing "Top Performers" logic but render it in pristine Zen UI cards.

- **Wording:** "The Survivors Index" -> "Brands mathematically proven to operate within safe physical boundaries during the ecological transition."
- **UI:** A tight grid of cards (max 6) showing the Brand Name, Final Score (in an emerald badge), and their primary Carbon MT output.

### 5. Section 5: The Final Action (The Consumer Funnel)

**Objective:** Convert institutional reading into consumer action.

- **Layout:** High contrast block (`bg-stone-900 text-white`).
- **Wording:** "Intelligence demands action. Stop funding ecological destruction."
- **Action:** "Compare Products" button linking to `/compare`.

## The Visual Language

- **Backgrounds:** `#FAF9F6` for the main body, `#FFFFFF` for data cards.
- **Typography:** `font-sans font-black tracking-tighter` for main H1/H2s. `font-mono text-stone-500 uppercase tracking-widest text-[10px]` for metadata and kickers.
- **Border/Shadow:** `border border-stone-100`, `shadow-[0_8px_30px_rgb(0,0,0,0.04)]`.

This architecture transforms the homepage from a basic portfolio landing page into the command center of a professional SaaS/Intelligence platform.
