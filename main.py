import asyncio
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from agrivoice import generate_review, FarmerProfile, ReviewResult
from agrivoice.exceptions import AgriVoiceError, ValidationError, ConfigError

app = FastAPI(title="AgriVoice API", version="1.0.0")


class GenerateReviewRequest(BaseModel):
    farmer_profile: str
    product_name: str
    optional_context: Optional[str] = None
    prefer_fallback: bool = False


class GenerateReviewResponse(BaseModel):
    location: str
    review: str
    rating: int
    confidence: str
    reasoning: str


@app.post("/generate-review", response_model=GenerateReviewResponse)
async def generate_review_endpoint(request: GenerateReviewRequest):
    try:
        result = await asyncio.to_thread(
            generate_review,
            farmer_profile=request.farmer_profile,
            product_name=request.product_name,
            optional_context=request.optional_context,
            prefer_fallback=request.prefer_fallback,
        )
        return GenerateReviewResponse(**result.to_dict())
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ConfigError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except AgriVoiceError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
