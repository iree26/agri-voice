import json
import os
import re
from typing import Optional

from dotenv import load_dotenv

from .exceptions import ConfigError, GenerationError
from .fallback import generate_fallback_review
from .validator import (
    FarmerProfile,
    ReviewResult,
    validate_profile,
    validate_product_name,
    validate_context,
)

load_dotenv()

MIN_REVIEW_WORDS = 30
MAX_REVIEW_WORDS = 100


def _word_count(text: str) -> int:
    return len(text.split())


def _ensure_review_length(text: str) -> str:
    words = text.split()
    if len(words) > MAX_REVIEW_WORDS:
        words = words[:MAX_REVIEW_WORDS]
        text = " ".join(words)
        if text and not text[-1] in ".!?":
            text += "."
    return text


def _build_prompt(profile: FarmerProfile, product_name: str, context: Optional[str]) -> str:
    parts = [
        f"farmer_profile: {profile.farmer_type} farmer in {profile.location}, "
        f"{profile.scale}, {profile.experience} years experience",
        f"product_name: {product_name}",
    ]
    if context:
        parts.append(f"optional_context: {context}")

    return (
        "You are AgriVoice, an AI that generates realistic Nigerian farmer reviews "
        "for agricultural products.\n\n"
        f"Input:\n- " + "\n- ".join(parts) + "\n\n"
        "Task: Generate a realistic farmer-style review of the product.\n\n"
        "Rules:\n"
        "- Review must be medium length (40-80 words, no shorter, no longer)\n"
        "- Sound natural and conversational, like a real Nigerian farmer\n"
        "- Always assume the farmer is located somewhere in Nigeria (North, South, East, West, or Middle Belt)\n"
        "- Use any Nigerian state or region (e.g., Kano, Kaduna, Lagos, Oyo, Benue, Enugu, Rivers, Ogun, Kebbi, etc.)\n"
        "- Reflect local farming conditions (weather, cost, soil, availability, transport issues)\n"
        "- Include at least one benefit and one limitation or concern in the review\n"
        "- Do not be overly formal or robotic\n"
        "- Avoid repeating phrases across responses\n\n"
        "Output ONLY valid JSON with these exact keys (no markdown, no backticks):\n"
        '{\n'
        '  "location": "Nigerian state or region used",\n'
        '  "review": "string (40-80 words)",\n'
        '  "rating": number (1-5),\n'
        '  "confidence": "Low | Medium | High",\n'
        '  "reasoning": "short explanation of rating"\n'
        '}'
    )


def _parse_json_response(text: str) -> dict:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    if not cleaned.startswith("{"):
        raise GenerationError("Response did not contain valid JSON")

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise GenerationError(f"Failed to parse JSON response: {e}")

    required = {"location", "review", "rating", "confidence", "reasoning"}
    missing = required - set(data.keys())
    if missing:
        raise GenerationError(f"Missing required fields: {', '.join(sorted(missing))}")

    for key in ("location", "review", "confidence", "reasoning"):
        if not isinstance(data[key], str):
            raise GenerationError(f"Field '{key}' must be a string")

    if not isinstance(data["rating"], int):
        if isinstance(data["rating"], float) and data["rating"].is_integer():
            data["rating"] = int(data["rating"])
        else:
            raise GenerationError(f"Field 'rating' must be an integer, got {type(data['rating']).__name__}")

    if data["rating"] < 1 or data["rating"] > 5:
        raise GenerationError(f"Rating must be between 1 and 5, got {data['rating']}")

    valid_confidence = {"low", "medium", "high"}
    if data["confidence"].strip().lower() not in valid_confidence:
        raise GenerationError(
            f"Confidence must be one of {valid_confidence}, got '{data['confidence']}'"
        )

    return data


def _call_openai(prompt: str, api_key: str) -> str:
    from openai import OpenAI

    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are AgriVoice. Generate realistic Nigerian farmer reviews "
                           "in strict JSON format with location. No markdown, no backticks.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.8,
        max_tokens=300,
    )

    content = response.choices[0].message.content
    if not content:
        raise GenerationError("OpenAI returned empty response")

    return content


def _normalize_text(text: str) -> str:
    replacements = {
        "\u2018": "'", "\u2019": "'",
        "\u201c": '"', "\u201d": '"',
        "\u2013": "-", "\u2014": "--",
        "\u2026": "...",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def generate_review(
    farmer_profile: str | FarmerProfile,
    product_name: str,
    optional_context: Optional[str] = None,
    prefer_fallback: bool = False,
) -> ReviewResult:
    if isinstance(farmer_profile, str):
        profile = FarmerProfile.from_string(farmer_profile)
    else:
        profile = farmer_profile

    profile = validate_profile(profile)
    product_name = validate_product_name(product_name)
    context = validate_context(optional_context)

    if prefer_fallback:
        result = generate_fallback_review(profile, product_name, context)
        result.review = _ensure_review_length(result.review)
        return result

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ConfigError("OPENAI_API_KEY not found in environment or .env file")

    prompt = _build_prompt(profile, product_name, context)

    try:
        raw_response = _call_openai(prompt, api_key)
        raw_response = _normalize_text(raw_response)
        parsed = _parse_json_response(raw_response)
        result = ReviewResult.from_dict(parsed)
        result.review = _normalize_text(result.review)
        result.review = _ensure_review_length(result.review)
        if _word_count(result.review) < MIN_REVIEW_WORDS:
            result = generate_fallback_review(profile, product_name, context)
            result.review = _ensure_review_length(result.review)
        result.reasoning = _normalize_text(result.reasoning)
        confidence = result.confidence.strip().lower().capitalize()
        if confidence not in ("Low", "Medium", "High"):
            confidence = "Medium"
        result.confidence = confidence
        return result
    except Exception as e:
        if isinstance(e, GenerationError | ConfigError):
            raise
        raise GenerationError(f"AI generation failed: {e}", original=e)
