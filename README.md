# Child Welfare AI Tracker

An interactive map tracking how artificial intelligence is being used in child welfare systems across the United States.

**Live site:** https://saaiello.github.io/childwelfareaitracker/

---

## What it tracks

This tracker documents AI tools deployed by state child welfare agencies across five categories:

| Use type | What it means |
|---|---|
| Risk screening | Algorithms that score families for likelihood of future maltreatment or foster care entry |
| Case management | AI embedded in case management systems to support caseworker workflows |
| Documentation / admin | AI that assists with case notes, reports, transcription, or policy navigation |
| Family matching | AI used to match children with foster or adoptive families, or locate kin |
| Prevention targeting | AI used to identify families for prevention services before a report is made |
| AI governance policy | State has issued a formal written policy governing AI use in child welfare |

---

## Map legend

| Color | Meaning |
|---|---|
| Teal | Active AI tool(s) confirmed in use |
| Gray | Tool was used but has been discontinued |
| Yellow-green | Tool referenced in research or pilot phase — not yet operational |
| Warm gray | Referenced in sources but deployment cannot be confirmed |
| Light gray | No tool identified in public records |
| Diagonal stripes | State has signed onto ACF's A Home for Every Child initiative |

States marked with diagonal stripes have signed onto ACF's A Home for Every Child initiative, 
a bipartisan federal program working to close the national foster home gap. Signing on requires 
states to modernize their child welfare IT infrastructure and data systems — the same foundation 
that makes AI adoption viable. These states represent active partnership opportunities for 
technical assistance and innovation in child welfare technology.

---

## How to update state data

All data lives in `data/states.json`. Each state entry looks like this:

```json
"Ohio": {
  "status": "active",
  "significance": "Confirmed RSF user since ~2015.",
  "acf_home_for_every_child": true,
  "tools": [
    {
      "name": "Rapid Safety Feedback (RSF)",
      "use_type": "Risk screening",
      "vendor": "Eckerd Connects + Mindshare Technology",
      "year": "~2015",
      "status": "active",
      "notes": "Confirmed user per Eckerd Connects.",
      "source_label": "The Imprint",
      "source_url": "https://imprintnews.org/..."
    }
  ]
}
```

### Status values

**State-level status (`status`)**
- `active` — confirmed AI tool(s) in use
- `discontinued` — had a tool, no longer in use
- `exploring` — in research, pilot, or planning phase
- `unconfirmed` — referenced in sources but deployment cannot be verified
- `none` — researched, nothing found

**Tool-level status (`tools[].status`)**
Same vocabulary — each individual tool carries its own status.

### Other fields

- `significance` — one-sentence summary of what makes this state's story notable. Displays as a callout in the detail panel.
- `acf_home_for_every_child` — set to `true` if the state has signed onto ACF's A Home for Every Child initiative. Displays diagonal stripes on the map and a badge in the detail panel.

### States with no tools
```json
"Vermont": { "status": "none", "significance": "...", "tools": [] }
```

---

## How to run locally

This project loads a local JSON file, so you need a simple local server — you can't just open `index.html` directly in a browser.

**Python (easiest):**
```bash
cd childwelfareaitracker
python3 -m http.server 8000
```
Then open `http://localhost:8000`

**VS Code:** Right-click `index.html` → Open with Live Server

---

## File structure

```
index.html        — HTML shell
style.css         — All styles, CWN-branded
app.js            — Map logic, state rendering, D3
data/
  states.json     — All state data (edit this to update the map)
SOURCES.md        — All sources used in research, organized by state
README.md         — This file
```

---

## Deploying to GitHub Pages

1. Push repo to GitHub
2. Settings → Pages → Source: `main` branch, root folder
3. Save — live at `https://saaiello.github.io/childwelfareaitracker/`

---

## Planned updates

- Multi-source citations per state — collapsible Sources section in the detail panel
- Filter bar by tool type, status, and use category
- Integration into Child Welfare News (childwelfarenews.com)
- Additional states and tool verification as new sources emerge

---

## Data sources

Primary sources used in research are documented in `SOURCES.md`.

Key outlets and resources:
- [The Markup — Child Welfare Surveillance](https://themarkup.org)
- [The Imprint](https://imprintnews.org)
- [NCCPR Child Welfare Blog](https://www.nccprblog.org)
- [ACF issue briefs and guidance](https://acf.gov)
- [StateScoop](https://statescoop.com)
- State agency websites and legislative records

**Data represents research estimates from public sources — not official state determinations.** Always verify with the state agency before use in formal contexts.

---

## Tech stack

- D3.js v7 — map rendering and state interaction
- TopoJSON — US state boundaries
- Vanilla HTML / CSS / JS — no build step, no framework
- GitHub Pages — free hosting
- Google Fonts — DM Sans, Playfair Display (matching Child Welfare News branding)

---

A project by [Sam Aiello](https://childwelfarenews.com). Built in the open.
