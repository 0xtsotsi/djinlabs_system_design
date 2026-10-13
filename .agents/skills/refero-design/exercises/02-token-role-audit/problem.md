# Exercise 02 — Token Role Audit (Anti-Averaging)

A client hands you three style references that conflict. Your job is **not** to average
them. Your job is to choose one as the primary foundation, audit every borrowed detail
for token-role drift, and write a reference lock that survives synthesis.

This is the second exercise in the Refero Design series. It assumes you have done the
first exercise (style research + decision ledger) and now want to harden the failure
modes that anti-AI-slop rule #7 (reference averaging) and rule #8 (token role drift)
specifically target.

## The brief

> Designing the hero section of a developer-tool landing page for **Quill**, an
> internal docs platform used by platform teams.
> Goal: convince senior engineers that Quill respects their codebase the way Linear
> respects their sprint.
> Tone: precise, dry, confident, never decorative.
> Main objection: "yet another docs tool with fake polish."
> Constraints: must work on a code-heavy marketing site; no serif display; no card
> grid in the hero.
> Research needed: styles for visual language, screens for the hero pattern.
> Path: direct build after a single locked direction.

## The three references

The marketing lead dropped these three style extracts on your desk. They were chosen
on purpose because they conflict in canvas, accent, type, and radius.

### Style A — Dark infrastructure (acid green on near-black)

- canvas: `#0b0f0d` near-black
- text: `#e6eae7` cool off-white
- accent: `#a3ff3c` acid green
- accent role: **primary CTA only**
- syntax colors: `#ff7a59` `#5cc8ff` `#ffd866` — **inside code windows only**
- type: monospace UI (JetBrains Mono) for chrome, sans for prose
- radius: `0`
- borders: `1px #1c211e` lines, no shadows
- cards: never used; sections separated by rules
- imagery: terminal screenshots framed as evidence

### Style B — Calm editorial warm

- canvas: `#f6f1e8` warm ivory
- text: `#3b3328` deep brown
- accent: `#a98b4f` muted olive
- accent role: **section background tints, link color**
- type: serif display (Fraunces 600) for h1, italic swap on one word, sans for body
- radius: `12px`
- cards: rounded surface blocks around features
- imagery: full-bleed editorial photography of library shelves

### Style C — Monochrome data tool

- canvas: `#ffffff` white
- text: `#0f1115` near-black
- accent: `#1f6feb` restrained blue
- accent role: **primary CTA + selected state**
- type: sans (Inter), tight tracking, 14–15px body, 32–40px h1
- radius: `6px`
- borders: `1px #e6e8eb` hairlines
- cards: plan cards and feature rows only
- imagery: product screenshots in bordered panels

## What you must produce

Open `starter.md` and complete every `<!-- TODO -->` block. The deliverable is a
single audit + reference lock that argues, in order:

1. The primary foundation and why.
2. The 3–5 signature traits to preserve from the primary.
3. The 1–2 borrowed details from secondary references, each with a bounded job.
4. The role rules — what each token from each source is allowed to do, including
   tokens you explicitly **do not** import.
5. The averaging risks specific to this brief and how you rejected each one.
6. A token commitment table (canvas, type, accent, radius, border, media).
7. A short CSS block that demonstrates the locked tokens in use.

## Quality gates you must pass

- The primary direction is **not** an intersection of all three.
- No token is used outside the role its source assigned.
- The lock explicitly rejects at least one reference's signature trait.
- The CSS does not include a card unless it earns the card.
- The CSS does not use indigo or violet.
- The CSS does not include a decorative serif/italic word swap.

## Anti-AI-slop checks

- Card test: any rounded box must justify itself with interaction.
- Brand test: hiding the nav, can a reader still identify Quill?
- Editorial test: replacing the logo with a coffee-shop logo should break the page.
- Reference averaging test: the canvas must be one of `{dark, ivory, white}`, not a
  blend.

## Reference

- `.agents/skills/refero-design/references/anti-ai-slop.md` (tells #7 and #8)
- `.agents/skills/refero-design/references/example-workflow.md` (reference lock shape)
- `.agents/skills/refero-design/SKILL.md` (decision-ledger contract)
- `.agents/skills/refero-design/exercises/01-style-research-and-lock/` (prior exercise)