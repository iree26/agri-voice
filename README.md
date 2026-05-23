# AgriVoice

**Live site:** https://agrivoice.netlify.app

**AgriVoice** simulates authentic Nigerian farmer product reviews using rich persona modeling and AI. Build a farmer profile, pick an agricultural product, and generate a review that sounds like it came from that specific person — in their language, in their context.

Supports Hausa, Yoruba, Igbo, and Nigerian Pidgin/English, with natural code-switching between languages.

---

## How it works

1. **Build a farmer persona** — name, age, state, crop, farm size, soil type, fertilizer habits, language
2. **Describe a product** — fertilizer, seed, tool, service, loan, or pesticide, with optional price and brand
3. **Generate a review** — the AI returns a star rating, written review, confidence level, and reasoning

---

## Repository branches

### `frontend`
React single-page app built with Vite, Tailwind CSS, and Framer Motion.

**Key features:**
- Landing page with animated sample review card and stats
- Farmer persona builder with 5 pre-loaded sample personas (Amina, Chinedu, Bola, Grace, Mallam Sani)
- Product form covering 6 categories across all 36 Nigerian states + FCT
- Animated review output card with star pop animation and typed text effect
- Comparison mode and recent reviews log (up to 5 entries)
- Fully mobile responsive

**Stack:** React 19, React Router 7, Vite, Tailwind CSS 3, Framer Motion, Lucide React

**Deploy target:** Netlify — [agrivoice.netlify.app](https://agrivoice.netlify.app)

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `.env` to point at the backend (defaults to `http://localhost:8000`):

```
VITE_API_URL=https://your-backend-url
```

---

### `backend`
Express.js proxy and caching layer that sits between the frontend and the AI/ML service.

**Key features:**
- `POST /api/generate-review` — accepts either structured `{persona, product}` objects or flat profile strings
- `POST /api/recommend` — product recommendation endpoint
- In-memory response cache with cache key derived from farmer profile + product
- Rate limiting middleware
- Claude AI integration via `@anthropic-ai/sdk` as primary generator, ML service as fallback
- Health check endpoint at `GET /health`

**Stack:** Node.js 18+, Express 4, `@anthropic-ai/sdk`, `express-rate-limit`, `cors`

```bash
cd backend
npm install
npm run dev       # nodemon, watches for changes
npm start         # production
```

Required environment variables (see `backend/.env.example`):

```
ANTHROPIC_API_KEY=your_key
ML_SERVICE_URL=https://your-ml-service-url
FRONTEND_URL=https://agrivoice.netlify.app
PORT=3000
```

---

### `ai-agent`
Python FastAPI ML service — the core review generator. Called by the backend as a fallback when Claude is unavailable.

**Key features:**
- `POST /generate-review` — accepts `farmer_profile` string, `product_name`, optional context, and `prefer_fallback` flag
- OpenAI-powered generation with a 15–60 word review length cap
- Rule-based template fallback (`agrivoice/fallback.py`) for when OpenAI is unavailable
- Input validation with Pydantic models
- Language-aware prompt templates for Hausa, Yoruba, Igbo, and English
- CORS enabled for all origins

**Stack:** Python, FastAPI, Uvicorn, OpenAI SDK, Pydantic, python-dotenv

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Required environment variable:

```
OPENAI_API_KEY=your_key
```

**Deploy target:** Render / Railway (includes `Procfile`)

---

## Architecture

```
[Browser]
    │
    ▼
[frontend]  ──────────────────────────────────►  agrivoice.netlify.app
    │
    │  POST /api/generate-review
    ▼
[backend]   ──── cache hit? ──► return cached response
    │
    │  miss → try Claude (Anthropic SDK)  ← PRIMARY
    │          on failure → call ML service
    ▼
[ai-agent]  ──── OpenAI call ──► return review  ← FALLBACK
                  on failure → rule-based fallback templates
```

---

## Sample personas

| Persona | Crop | State | Language |
|---|---|---|---|
| Amina, 38 | Rice | Kebbi | Hausa |
| Chinedu, 45 | Cassava | Anambra | Igbo |
| Bola, 52 | Maize | Oyo | Yoruba |
| Grace, 29 | Tomato | Plateau | English |
| Mallam Sani, 61 | Sorghum | Sokoto | Hausa |

---

## Product categories

Fertilizer · Seed/Seedling · Tool/Equipment · Service · Loan/Finance · Pesticide

---

## Languages supported

Hausa · Yoruba · Igbo · Nigerian Pidgin · English (with natural code-switching)
