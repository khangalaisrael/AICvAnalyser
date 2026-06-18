# TalentScan — Tool Stack & Migration Plan

## Why We're Migrating

TalentScan started on Streamlit — the right call for a prototype, now a hard ceiling:

| Problem | Impact |
|---------|--------|
| Invisible button overlays for sidebar cards | Breaks on any Streamlit version bump |
| Full page reruns on every widget interaction | Flickering, no partial updates, no modals |
| 800+ lines of inline HTML/CSS fighting defaults | Impossible to maintain or theme |
| Pipeline actions (hire/hold/reject) don't persist | Core feature is cosmetic only |
| File uploader reset requires key increment hack | No real API |
| Mobile delete = long-press JS timer in DOM | Fragile, non-native |
| Single spinner for 5–10s analysis wait | No progress feedback |

**Migration target:** Next.js 15 frontend + FastAPI backend, keeping Supabase auth + PostgreSQL untouched.

---

## Full Tool Stack

### Frontend

| Tool | Version | Role |
|------|---------|------|
| **Next.js** | 15 (App Router) | Framework — SSR, middleware auth, Vercel-native |
| **TypeScript** | 5.x | Type safety throughout |
| **Tailwind CSS** | v4 | Utility styling — CSS-first config, fast builds |
| **shadcn/ui** | Latest | Component primitives (Radix UI + Tailwind, copy-paste) |
| **@supabase/ssr** | Latest | Cookie-based auth in Next.js middleware |
| **@supabase/supabase-js** | v2 | Browser-side auth (sign-in, sign-up, sign-out) |
| **TanStack Query** | v5 | Server state — candidates cache, optimistic updates |
| **Zustand** | v5 | Client state — active candidate, selected role |
| **React Dropzone** | Latest | PDF drag-and-drop upload |
| **Framer Motion** | v11 | Sidebar transitions, result entrance animations |
| **Remotion** | v4 | Score reveal animations, exportable candidate report videos |

### Backend

| Tool | Version | Role |
|------|---------|------|
| **FastAPI** | 0.115+ | API framework — async, typed, auto-docs |
| **Uvicorn** | Latest | ASGI server |
| **python-multipart** | Latest | PDF file upload handling |
| **pdfplumber** | 0.11+ | PDF text extraction (unchanged from Streamlit) |
| **openai** | 1.x | GPT-4o-mini analysis (unchanged) |
| **supabase-py** | 2.x | Database reads/writes (unchanged) |
| **python-jose** | 3.x | Supabase JWT validation on protected routes |
| **python-dotenv** | 1.x | Environment management |

### Auth & Database

| Service | Role |
|---------|------|
| **Supabase Auth** | User management (no changes) |
| **Supabase PostgreSQL** | `analyses` table + add `pipeline_status` column |

### Infrastructure

| Service | Role |
|---------|------|
| **Vercel** | Next.js frontend — zero-config, preview URLs per PR |
| **Railway** | FastAPI backend — Python-native, GitHub deploy |
| **GitHub** | Monorepo: `/frontend` + `/backend` |

---

## Design Tooling

Three layers of design intelligence working together:

### 1. Taste-Skill (installed)
Anti-slop design rules for Claude — layout variance, typographic contrast, real design systems. Fires during component generation.

```
DESIGN_VARIANCE  = 6   # moderate experimentation
MOTION_INTENSITY = 4   # subtle entrances, no heavy effects
VISUAL_DENSITY   = 7   # data-dense recruiter tool, not a marketing page
```

| Skill | Command | Use for |
|-------|---------|---------|
| `design-taste-frontend` | `/design-taste-frontend` | Every component build pass |
| `high-end-visual-design` | `/high-end-visual-design` | Premium cards, result panels |
| `redesign-existing-projects` | `/redesign-existing-projects` | Porting Streamlit views to React |
| `minimalist-ui` | `/minimalist-ui` | Auth page, empty states |
| `stitch-design-taste` | `/stitch-design-taste` | Generating DESIGN.md |
| `imagegen-frontend-web` | `/imagegen-frontend-web` | Design references before building |

### 2. UI-UX Pro Max (installed)
67 UI styles · 161 industry-specific palettes · 57 font pairings. Auto-activates on any UI request. Will select the best pattern for a B2B recruiter SaaS.

### 3. Impeccable (installed globally)
Brand-aware design review CLI. Reads `PRODUCT.md` and `DESIGN.md` to give context-specific critique, polish, and audit passes.

```bash
/impeccable critique <component>   # design review against brand
/impeccable polish <page>          # tighten spacing, hierarchy, weight
/impeccable audit                  # accessibility + contrast check
/impeccable colorize               # palette consistency
/impeccable typeset                # typography hierarchy
```

### Remotion (installed globally)
React-based programmatic video/animation. Use cases for TalentScan:
- Animated score ring counting up from 0 → final score on result load
- Candidate report export as shareable MP4
- Animated onboarding walkthrough

---

## Architecture

```
Browser
  └── Next.js 15 (Vercel)
        ├── /app/auth         Signin / Signup / Reset (three-view state machine)
        ├── /app/dashboard    Main app — protected by middleware
        │     ├── Sidebar     Candidates list (TanStack Query cache)
        │     ├── Uploader    PDF drag-drop → POST /analyse
        │     └── Results     Score ring, bars, skill pills, pipeline actions
        └── middleware.ts     Supabase cookie check → redirect /auth if not signed in

FastAPI (Railway)
  ├── POST   /analyse           PDF → AI → score → save → return result
  ├── GET    /candidates        Fetch user's candidates
  ├── DELETE /candidates/{id}   Delete candidate
  ├── PATCH  /candidates/{id}   Update pipeline_status (HIRE/HOLD/REJECT)
  └── JWT middleware            Validate Supabase token, extract user_id

Supabase
  ├── auth.users                Managed — no changes
  └── public.analyses           Existing table + pipeline_status column
```

---

## Database Migration

Run once in Supabase SQL editor:

```sql
ALTER TABLE analyses
ADD COLUMN pipeline_status TEXT
  CHECK (pipeline_status IN ('HIRE', 'HOLD', 'REJECT'))
  DEFAULT NULL;
```

No RLS changes needed — existing policies cover the new column.

---

## Project Structure

```
talentscan/
├── TOOL.md                        ← this file
├── PRODUCT.md                     ← generated by /impeccable init
├── DESIGN.md                      ← generated by /impeccable document
├── .impeccable/design.json        ← auto-generated, do not hand-edit
│
├── frontend/                      Next.js 15
│   ├── app/
│   │   ├── auth/page.tsx          Auth page (signin/signup/reset)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx         Sidebar + main panel shell
│   │   │   └── page.tsx           Upload + results
│   │   ├── layout.tsx             Root layout, fonts, QueryProvider
│   │   └── middleware.ts          Supabase session gate
│   ├── components/
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── CandidateCard.tsx  Native right-click + long-press (no hack)
│   │   │   └── CandidateList.tsx
│   │   ├── results/
│   │   │   ├── ScoreRing.tsx      SVG ring (ported from _ring())
│   │   │   ├── ScoreBar.tsx       Horizontal bar (ported from _bar())
│   │   │   ├── SkillPill.tsx      Matched / missing pill
│   │   │   ├── ReportView.tsx
│   │   │   └── DashboardView.tsx
│   │   ├── upload/
│   │   │   ├── RoleSelector.tsx
│   │   │   ├── PdfDropzone.tsx
│   │   │   └── AnalyseButton.tsx
│   │   └── ui/                    shadcn/ui components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          Browser client
│   │   │   └── server.ts          SSR client (cookies)
│   │   ├── api.ts                 Typed fetch wrappers for FastAPI
│   │   └── types.ts               Candidate, AnalysisResult, ComponentScores
│   ├── hooks/
│   │   ├── useCandidates.ts       TanStack Query — candidates list
│   │   └── useAnalyse.ts          Mutation — run analysis
│   ├── store/appStore.ts          Zustand — activeCandidate, selectedRole
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
└── backend/                       FastAPI
    ├── main.py                    App init, CORS, router mounts
    ├── routers/
    │   ├── analyse.py             POST /analyse
    │   └── candidates.py          GET / DELETE / PATCH /candidates
    ├── middleware/
    │   └── auth.py                JWT validation
    ├── services/                  All existing Python files moved here
    │   ├── pdf_processor.py       UNCHANGED
    │   ├── ai_client.py           UNCHANGED
    │   ├── scoring_engine.py      UNCHANGED (+ fix Data Scientist bug)
    │   ├── role_profiles.py       UNCHANGED
    │   └── database.py            UNCHANGED + add update_pipeline_status()
    ├── config.py                  UNCHANGED
    ├── supabase_client.py         UNCHANGED
    └── requirements.txt           Remove streamlit, add fastapi uvicorn python-multipart python-jose
```

---

## Implementation Phases

| Phase | What | Status |
|-------|------|--------|
| **0** | Impeccable setup: `npx impeccable install` → `/impeccable init` → `PRODUCT.md` | ⬜ |
| **1** | FastAPI backend scaffold + all routers + JWT middleware | ⬜ |
| **2** | Next.js scaffold + Tailwind tokens + Supabase SSR setup | ⬜ |
| **3** | Auth page (signin/signup/reset) | ⬜ |
| **4** | Dashboard layout + sidebar + store wiring | ⬜ |
| **5** | Analysis flow: dropzone → API call → loading steps | ⬜ |
| **6** | Results display: ScoreRing, ScoreBar, SkillPill, views | ⬜ |
| **7** | Pipeline actions (hire/hold/reject) with DB persistence | ⬜ |
| **7b** | Impeccable passes: critique → audit → polish | ⬜ |
| **8** | Deploy: Vercel (frontend) + Railway (backend) | ⬜ |

---

## Environment Variables

### Frontend (`.env.local` / Vercel dashboard)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://talentscan-api.railway.app
```

### Backend (`.env` / Railway dashboard)
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJ...           # service role key
OPENAI_API_KEY=sk-...
SUPABASE_JWT_SECRET=...       # Supabase Settings → API → JWT Secret
```

---

## TalentScan Design Tokens (for Tailwind + DESIGN.md)

```
Background:    #faf9f5   (warm cream)
Sidebar:       #fbfaf6
Border:        #ecebe3
Text primary:  #22272f
Text muted:    #7c818b
Text subtle:   #a7a99f
Accent:        #f25c54   (coral red)

Verdict HIRE:  #5f8b2e text  /  #e4efd2 bg
Verdict MAYBE: #c5811c text  /  #f6ecd2 bg
Verdict REJECT:#e84a45 text  /  #f8dcd7 bg

Font display:  Source Serif 4 (500/600, opsz 8–60)
Font ui:       Source Sans 3 (400/500/600/700)

Radius sm:     10px
Radius md:     16px
Radius lg:     20px
Radius pill:   999px

Shadow accent: 0 3px 10px rgba(242,92,84,.32)
```

---

## Known Bugs to Fix During Migration

1. **Data Scientist role** in `role_profiles.py` — `must_have` lists `"Machine Learning"` twice instead of `["Python", "Machine Learning", "Statistics"]`
2. **Pipeline actions** in current app are cosmetic only — migration adds real DB persistence
