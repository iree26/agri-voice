import random
from .validator import FarmerProfile, format_location_name, pick_random_location
from .templates import (
    REVIEW_TEMPLATES,
    get_product_category,
    get_experience_level,
    SCALE_ADJECTIVES,
    CROP_PATTERNS,
)
from .validator import ReviewResult


def generate_fallback_review(
    profile: FarmerProfile,
    product_name: str,
    context: str | None = None,
) -> ReviewResult:
    category = get_product_category(product_name)
    templates = REVIEW_TEMPLATES.get(category, REVIEW_TEMPLATES["general"])

    crop = profile.farmer_type if profile.farmer_type != "farmer" else random.choice(CROP_PATTERNS)
    scale_label = SCALE_ADJECTIVES.get(profile.scale, "farmer")

    location_key = profile.location if profile.location and profile.location != "nigeria" else pick_random_location()
    location_name = format_location_name(location_key)

    full_review = random.choice(templates["full"])
    review = full_review.format(crop=crop, scale=scale_label, location=location_name)

    if context:
        context_lower = context.strip().lower()
        first_char = review[0]
        rest = review[1:]
        if first_char == "I" and (not rest or rest[0] == " "):
            review = f"During {context_lower}, {review}"
        else:
            review = f"During {context_lower}, {first_char.lower()}{rest}"

    review = review[:500].strip()
    if review and not review[-1] in ".!?":
        review += "."

    rating = _compute_rating(category, profile)
    reasoning = _compute_reasoning(rating, category, crop, scale_label)
    confidence = _compute_confidence(profile)

    return ReviewResult(
        location=location_name,
        review=review,
        rating=rating,
        confidence=confidence,
        reasoning=reasoning,
    )


def _compute_rating(category: str, profile: FarmerProfile) -> int:
    base = 4 if category != "general" else 3
    if profile.experience > 10:
        base -= 1
    if profile.scale in ("small-scale", "small"):
        base -= 1
    base += random.choice([-1, 0, 0, 1])
    return max(1, min(5, base))


def _compute_reasoning(rating: int, category: str, crop: str, scale: str) -> str:
    if rating >= 4:
        return f"{category.title()} worked well for {crop} farming and met expectations for a {scale}"
    elif rating >= 3:
        return f"{category.title()} was decent for {crop} but had some drawbacks for a {scale}"
    else:
        return f"{category.title()} did not perform well enough for {crop} farming at {scale} level"


def _compute_confidence(profile: FarmerProfile) -> str:
    if profile.experience > 5:
        return "High"
    elif profile.experience > 2:
        return "Medium"
    return "Low"
