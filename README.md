# AgriVoice

> Reviews in the voice of the farmer who would write them.

AgriVoice is a user-modeling tool that simulates authentic Nigerian farmer product reviews. Build a rich persona, pick an agricultural product, and the system generates a review in that farmer's voice — code-switching naturally between Hausa, Yoruba, Igbo, Nigerian Pidgin, and English.

Built for researchers, agritech product teams, and developers who need synthetic but plausible farmer feedback for testing, training data, or demo content.

---

## Live demo

| Layer | URL |
|---|---|
| Frontend | Netlify (`netlify.toml` included) |
| Backend  | `https://agri-voice-production.up.railway.app` |

---

## Architecture

AgriVoice is split across three branches, each deployable independently. The system uses a **two-tier AI strategy**: Claude as the primary generator, with an OpenAI-backed Python service as the fallback.

```
                    ┌───────────────┐
                    │    Browser    │
                    └───────┬───────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   frontend (React SPA)  │   Netlify
              │   Vite · Tailwind       │
              └────────────┬────────────┘
                           │  POST /api/generate-review
                           ▼
              ┌─────────────────────────┐
              │  backend (Node/Express) │   Railway
              │  cache · rate-limit     │
              └────────────┬────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
   ┌──────────────────┐      ┌──────────────────────┐
   │  Claude          │      │ ai-agent (FastAPI)   │
   │  (Anthropic SDK) │      │ OpenAI + rule-based  │
   │  PRIMARY         │      │ template fallback    │
   └──────────────────┘      │ FALLBACK             │
                             └──────────────────────┘
```

**Request flow:**
1. Frontend sends `{farmer_profile, product_name, optional_context}` to the backend
2. Backend checks its in-memory cache → returns cached response on hit
3. On miss, backend calls Claude (`claude-sonnet-4-6`) first
4. If Claude fails, backend calls the Python `ai-agent` service
5. If OpenAI fails inside `ai-agent`, it falls back to deterministic templates

---

## Repository branches

### `frontend` — React SPA

The user-facing app: a journal-themed landing page and a persona/product builder that calls the backend.

| | |
|---|---|
| **Stack** | React 19, React Router 7, Vite, Tailwind CSS 3, Framer Motion, Lucide React |
| **Deploy** | Netlify |
| **Entrypoint** | `frontend/src/App.jsx` |

**Highlights**
- 5 pre-loaded sample personas (Amina, Chinedu, Bola, Grace, Mallam Sani) for one-click demos
- Persona builder covering all 36 Nigerian states + FCT, 10 crops, 6 soil types, 4 languages
- Animated review output card with star-pop and typed-text effects
- Comparison mode (compare reviews from two personas side by side)
- Recent reviews log (last 5 entries, in-memory)
- Mobile responsive

**Run locally**
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
```

---

### `backend` — Express proxy with Claude

The orchestration layer: validates requests, caches responses, calls Claude, and falls back to the Python service.

| | |
|---|---|
| **Stack** | Node.js 18+, Express 4, `@anthropic-ai/sdk`, `express-rate-limit`, `cors` |
| **AI provider** | **Claude** (`claude-sonnet-4-6`) with prompt caching |
| **Deploy** | Railway |
| **Entrypoint** | `backend/server.js` |

**Endpoints**
- `POST /api/generate-review` — accepts either `{persona, product}` objects or flat `{farmer_profile, product_name}` strings
- `POST /api/recommend` — product recommendation endpoint
- `GET /health` — service status + ML fallback ping

**Features**
- In-memory cache keyed by farmer profile + product name
- Rate limiting middleware
- Word-count enforcement (caps reviews at 60 words)
- Confidence normalization (Low / Medium / High)
- Request ID tracing for log correlation

**Run locally**
```bash
cd backend
npm install
cp .env.example .env   # fill in keys below
npm run dev
```

**Environment**
```env
ANTHROPIC_API_KEY=sk-ant-...           # required — Claude API key
ML_SERVICE_URL=http://localhost:8000   # required — ai-agent fallback URL
FRONTEND_URL=http://localhost:5173     # CORS allowlist
PORT=3000
```

---

### `ai-agent` — Python FastAPI fallback service

The ML fallback service. The backend calls this when Claude is unavailable or rate-limited. Internally uses **OpenAI** for generation, with deterministic templates as a third-tier safety net.

| | |
|---|---|
| **Stack** | Python 3, FastAPI, Uvicorn, OpenAI SDK, Pydantic, python-dotenv |
| **AI provider** | **OpenAI** (with rule-based template fallback) |
| **Deploy** | Render / Railway (`Procfile` included) |
| **Entrypoint** | `main.py` |

**Endpoints**
- `POST /generate-review` — accepts `farmer_profile`, `product_name`, `optional_context`, `prefer_fallback`

**Features**
- Pydantic input validation (`agrivoice/validator.py`)
- Word-count enforcement (15–60 words)
- Language-aware prompt templates for Hausa, Yoruba, Igbo, English
- Rule-based fallback (`agrivoice/fallback.py`) when OpenAI is unreachable
- CORS open for cross-origin calls from the backend
- Async generation via `asyncio.to_thread`

**Run locally**
```bash
pip install -r requirements.txt
echo "OPENAI_API_KEY=sk-..." > .env
uvicorn main:app --reload --port 8000
```

**Environment**
```env
OPENAI_API_KEY=sk-...   # required — OpenAI API key
```

---

## API contract

All three services agree on this response shape:

```json
{
  "rating": 4,
  "review": "This NPK na correct one for rice. I use am for my 2 hectares last season for Kebbi, the result good but price don go up too much this year. Wallahi, ₦35,000 is heavy o.",
  "confidence": "High",
  "reasoning": "Farmer from Kebbi (Hausa region), small-scale rice, price-sensitive given 2ha.",
  "location": "Kebbi, Nigeria"
}
```

---

## Sample personas (shipped with the frontend)

| Persona | Crop | State | Farm size | Language |
|---|---|---|---|---|
| Amina, 38 | Rice | Kebbi | 2 ha | Hausa |
| Chinedu, 45 | Cassava | Anambra | 5 ha | Igbo |
| Bola, 52 | Maize | Oyo | 12 ha | Yoruba |
| Grace, 29 | Tomato | Plateau | 1.5 ha | English |
| Mallam Sani, 61 | Sorghum | Sokoto | 4 ha | Hausa |

---

## Product categories

Fertilizer · Seed / Seedling · Tool / Equipment · Service · Loan / Finance · Pesticide

---

## Why two AI providers?

- **Claude** (primary) gives stronger results for nuanced code-switching and culturally-grounded writing, which is what AgriVoice is optimized for.
- **OpenAI** (in `ai-agent`) provides redundancy — if the Anthropic API is down, rate-limited, or out of budget, the backend silently routes to the Python service.
- **Rule-based templates** (inside `ai-agent`) provide a final fallback so the user never sees a hard failure, only a less-polished review.

---

## Status

**v0.1 · BETA** — actively developed across three feature branches. The `main` branch tracks `frontend` for the Netlify deploy.
