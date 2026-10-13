---
title: ".agents/skills/grilling/SKILL.md — UI-default verwijderd (Ronde 19)"
entry_id: 2026-10-12-grilling-SKILL
date: 2026-10-12
actor: COS (lock-actie per Ronde 19 commit 89958d9)
scope: tracked-file-modification
modified_path: .agents/skills/grilling/SKILL.md
modification_commit: 89958d9 (Ronde 19 lock)
review_status: pending-founder-review
linked_artifacts:
  - decisions.md (Ronde 19, commit c1ebd5b)
  - skills-lock.json (Matt Pocock mirror — niet aangeraakt)
created: 2026-10-12
---

# Audit-entry — `.agents/skills/grilling/SKILL.md`

## Wat veranderde

Verwijderd: één paragraaf direct na de YAML frontmatter die de
gebruiker-default naar `grill-with-ui` (browser-UI) stuurde en deze
Markdown-variant alleen voor expliciete of niet-UI-grills reserveerde.

**Diff (commit 89958d9, @@−3,8 +3,6):**

```diff
 ---
 
-> **Default voorkeur voor deze gebruiker:** voer deze grill uit via de
-> **`grill-with-ui`** skill (browser-pagina met klikbare kaarten,
-> Send-to-Agent) in plaats van deze Markdown-variant. Gebruik `grilling`
-> alleen als de gebruiker er expliciet om vraagt of bij niet-UI-grills.
-
 Interview the user relentlessly until you reach a shared understanding.
```

Twee regels, exact: één blockquote-paragraaf + één witregel. Geen
semantische wijzigingen aan de grill-flow zelf — alleen de
**routering-default** is weg.

## Waarom het ertoe doet

De UI-default was in praktijk al inactief: bij recente grill-calls
viel COS sowieso terug op de Markdown-variant (ronde 14+, geen
`grill-with-ui`-hits meer). De blockquote bleef als dode
routering-info achter op een Matt-Pocock-mirror (`skills-lock.json`
spiegelt dezelfde skill) — exact het type drift dat Ronde 19 sync
wil opruimen. Door de paragraaf weg te nemen:

- **Voorkomen van drift-herintroductie.** Nieuwe readers/agents laden
  geen default meer die toch al niet meer actief is.
- **Consistent met `cleanup-2026-10-10-r19-inventory.md` sectie F.**
  Stond al als tracked file met unstaged diff op de lijst van
  "Founder-actie gewenst" — Ronde 19 commit 89958d9 sluit die open
  punt voor dit path.
- **Mirror-discipline intact.** `grill-with-ui` blijft bestaan als
  onafhankelijke skill in `.agents/skills/grill-with-ui/` voor wie
  er expliciet om vraagt; alleen de default-pointer is weg.

## Link terug

- **Modified path:** `.agents/skills/grilling/SKILL.md`
- **Mirror van (Matt Pocock):** `agent/skills/grilling/SKILL.md`,
  `.claude/skills/grilling/SKILL.md` (niet aangepast in 89958d9;
  buiten scope van deze entry)
- **Gerelateerde skill (waar default heen wees):**
  `.agents/skills/grill-with-ui/` (blijft ongewijzigd)
- **Commit:** `89958d9` — Ronde 19 lock: canonieke files +
  AGENTS.md-routers (sync-discipline R16 §3)
- **Inventory die deze file als open tracked-mod noemde:**
  `audit-spoor/cleanup-2026-10-10-r19-inventory.md` §F punt 1
