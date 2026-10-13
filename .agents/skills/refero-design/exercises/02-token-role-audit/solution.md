# Reference solution — Token Role Audit

This solution picks **Style C (Monochrome data tool)** as the primary foundation. The
choice is grounded in the brief — a senior-engineer audience needs precision over
warmth, and the developer-tool category already has saturated dark precedents that
look like Style A. Style C wins because it lets Quill borrow Style A's
terminal-screenshot treatment (a strong asset the brief explicitly allows) without
dragging in Style A's dark canvas or Style B's editorial warmth, both of which would
dilute the brand.

## 1. Primary foundation

**Style C (Monochrome data tool)** — white canvas, restrained blue accent, sans-led
type, hairline borders. It matches the brief's "precise, dry, confident" tone and
matches the developer-tool category better than Style A's dark infrastructure (which
is already over-saturated in the dev-tool space) or Style B's calm editorial warmth
(which would mismatch a CLI-adjacent product).

## 2. Signature traits to preserve

- White canvas (`#ffffff`).
- Restrained blue accent reserved for primary CTA + selected state.
- Hairline `1px` borders in `#e6e8eb`.
- Sans-led typography (Inter) with tight tracking.
- Product screenshots as evidence, not decoration.

## 3. Borrowed details

- **From Style A**: terminal-screenshot framing — borrow only the bordered panel
  treatment, **not** the acid-green accent or the near-black canvas.
- **From Style B**: section rhythm — borrow only the generous vertical spacing
  between sections, **not** the serif headline, the rounded card system, or the
  italic word swap.

## 4. Role rules

| Source | Token | Allowed role |
|--------|-------|--------------|
| Style C | `#ffffff` | canvas only |
| Style C | `#0f1115` | text only |
| Style C | `#1f6feb` | primary CTA + selected state only |
| Style C | `#e6e8eb` | hairline borders, divider rules |
| Style C | `6px` radius | buttons, plan cards, evidence panels |
| Style A | bordered terminal panels | evidence containers only |
| Style A | `#a3ff3c` acid green | **do not import** (out of role) |
| Style A | `#0b0f0d` near-black | **do not import** (out of role) |
| Style A | monospace chrome UI | **do not import** (out of role) |
| Style B | `64px` section rhythm | section spacing only |
| Style B | `#f6f1e8` ivory canvas | **do not import** (out of role) |
| Style B | `#a98b4f` olive | **do not import** (out of role) |
| Style B | serif display | **do not import** (out of role) |
| Style B | italic word swap | **do not import** (out of role) |

## 5. Averaging risks rejected

1. **Cream blend**: averaging Style B's ivory with Style C's white → warm off-white.
   Rejected; canvas stays `#ffffff`.
2. **Green-blue average**: Style A's acid green and Style C's restrained blue →
   muted teal. Rejected; accent stays `#1f6feb` and only the panel border is borrowed
   from Style A.
3. **Softened radius**: Style A's zero radius and Style B's `12px` → `6px` with
   shadows on every surface. Rejected; section dividers stay sharp, only interactive
   surfaces use `6px`.
4. **Universal card**: Style B's rounded surfaces and Style C's plan cards → feature
   card grid in the hero. Rejected; sections separated by rules, the hero copy is
   never wrapped in a card.
5. **Italic word swap**: Style B's italic display word picked up as a "tasteful"
   detail. Rejected; serif/italic swap has no role in this product, and would violate
   the brief's "no serif display" constraint.

## 6. Token commitments

| Token | Value | Role |
|-------|-------|------|
| canvas | `#ffffff` | page only |
| text | `#0f1115` | prose, headlines, non-primary links |
| accent | `#1f6feb` | primary CTA, selected state, value proof |
| line | `#e6e8eb` | hairlines, dividers, card borders |
| surface | `#fafbfc` | evidence panel fill (slightly off-white) |
| radius-btn | `6px` | buttons only |
| radius-card | `8px` | plan cards, evidence panels |
| radius-rule | `0px` | section dividers, hero rule |
| font-display | `Inter 600` | h1, h2 |
| font-body | `Inter 400` | body |
| font-mono | `JetBrains Mono` | code, terminal screenshots |
| tracking-caps | `0.04em` | ALL CAPS labels |
| media | product screenshot, terminal panel | evidence containers only |

## 7. CSS demonstration

```css
:root {
  --color-canvas: #ffffff;
  --color-text: #0f1115;
  --color-accent: #1f6feb;
  --color-line: #e6e8eb;
  --color-surface: #fafbfc;
  --radius-btn: 6px;
  --radius-card: 8px;
  --radius-rule: 0px;
  --font-display: "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --tracking-caps: 0.04em;
  --space-section: 64px;
}

.hero {
  background: var(--color-canvas);
  color: var(--color-text);
  padding-block: var(--space-section);
  border-block-end: 1px solid var(--color-line);
}

.hero__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(32px, 4vw, 40px);
  letter-spacing: -0.01em;
  text-wrap: balance;
  margin: 0;
}

.hero__lede {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  max-width: 56ch;
  margin-block-start: 16px;
  text-wrap: pretty;
}

.hero__cta {
  display: inline-block;
  margin-block-start: 32px;
  padding: 12px 20px;
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-btn);
  background: var(--color-accent);
  color: var(--color-canvas);
  font-family: var(--font-body);
  font-weight: 500;
  text-decoration: none;
  /* accent role: primary CTA — used exactly once on this surface */
}

.hero__divider {
  border: 0;
  border-block-start: 1px solid var(--color-line);
  border-radius: var(--radius-rule);
  margin-block: 0;
}

/* Evidence panel: Style A borrowed detail. Never decorative. */
.evidence-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-line);
  border-radius: var(--radius-card);
  padding: 24px;
}

/* Anti-pattern guard: do not introduce a card around the hero copy. */
.hero__copy {
  /* no border, no shadow, no background — section rhythm only */
}
```

## 8. Self-check

- [x] The canvas is `#ffffff` (Style C), not a blend.
- [x] The accent (`#1f6feb`) appears exactly once, as the CTA fill.
- [x] No decorative card wraps the hero copy.
- [x] Style A's acid green and dark canvas are explicitly listed as out-of-role.
- [x] Style B's ivory, olive, and serif are explicitly listed as out-of-role.
- [x] The reference averaging test fails — the canvas is white, not cream.
- [x] Card test: the only `border-radius: var(--radius-card)` is on the evidence
      panel and plan card, both interactive surfaces.
- [x] Brand test: hiding the nav, the hero, divider, and evidence panel still read
      as a precise developer-tool page.
- [x] Editorial test: replacing the logo with a coffee-shop logo makes the page
      feel wrong (no warm ivory, no serif, no rounded card grid).