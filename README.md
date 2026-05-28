# Child Welfare AI Tracker

An interactive map tracking the use of predictive risk models (PRMs) and AI tools in child welfare systems across the United States.

**Live site:** [your GitHub Pages URL here]

---

## What it tracks

Predictive risk models are algorithms used by child welfare agencies to score the likelihood of future maltreatment, foster care entry, or case escalation. This tracker documents:

- Which states and jurisdictions have adopted these tools
- What the tools are called and who built them
- Whether they are currently active, discontinued, or unconfirmed
- Primary sources for each entry

---

## Map legend

| Color | Meaning |
|---|---|
| Red | Active PRM in use |
| Gray | Tool was used but has been discontinued |
| Yellow | Tool referenced in public sources but status unconfirmed |
| Light neutral | No tool identified in public records |

---

## How to update state data

All data lives in `data/states.json`. Each state entry looks like this:

```json
"Ohio": {
  "status": "active",
  "tools": [
    {
      "name": "Rapid Safety Feedback (RSF)",
      "use_type": "Risk screening",
      "vendor": "Eckerd Connects + Mindshare Technology",
      "year": "~2015",
      "status": "active",
      "notes": "Confirmed user per Eckerd Connects. Ohio funded its own RSF development.",
      "source_label": "The Imprint",
      "source_url": "https://imprintnews.org/..."
    }
  ]
}
```

### Status values
- `active` — tool is currently in use
- `discontinued` — tool was used but has been ended
- `unknown` — referenced in sources but current status unconfirmed
- `none` — no tool identified in public records (use empty tools array)

### States with no tool
```json
"Vermont": { "tools": [], "status": "none" }
```

---

## How to run locally

This project loads a local JSON file, so you need a simple local server.

**Python:**
```bash
cd cw-ai-tracker
python3 -m http.server 8000
```
Open `http://localhost:8000`

**VS Code:** Right-click `index.html` → Open with Live Server

---

## Deploying to GitHub Pages

1. Push repo to GitHub
2. Settings → Pages → Source: `main` branch, root folder
3. Save — live at `https://[username].github.io/[repo-name]`

---

## Data sources

- [The Markup — Child Welfare Surveillance](https://themarkup.org)
- [The Imprint](https://imprintnews.org)
- [NCCPR Child Welfare Blog](https://www.nccprblog.org)
- [Allegheny County Analytics](https://alleghenycountyanalytics.us)
- [ACF issue briefs](https://acf.gov)
- State agency websites and legislative records

**Data represents research estimates from public sources — not official state determinations.** Always verify with the state agency before use in formal contexts.

---

## Tech stack

- D3.js v7 — map rendering
- TopoJSON — US state boundaries
- Vanilla HTML / CSS / JS — no build step
- GitHub Pages — free hosting
