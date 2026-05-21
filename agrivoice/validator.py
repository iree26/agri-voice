from dataclasses import dataclass, field, asdict
from typing import Optional
from .exceptions import ValidationError


KNOWN_CROPS = {
    "rice", "maize", "cassava", "yam", "cocoa", "palm oil", "groundnut",
    "tomato", "pepper", "okra", "cowpea", "soybean", "sorghum", "millet",
    "ginger", "cashew", "coconut", "plantain", "banana", "pineapple",
    "mango", "orange", "poultry", "fish", "cattle", "goat", "sheep",
    "vegetable", "cucumber", "watermelon", "onion", "garlic", "cabbage",
    "lettuce", "carrot", "beans", "sweet potato", "cocoyam", "coffee",
    "tea", "sugarcane", "cotton", "rubber", "tobacco", "sesame",
}

KNOWN_LOCATIONS = {
    # North Central (Middle Belt)
    "benue", "kogi", "kwara", "nasarawa", "niger", "plateau",
    "fct", "abuja",
    # North East
    "adamawa", "bauchi", "borno", "gombe", "taraba", "yobe",
    # North West
    "kaduna", "kano", "katsina", "kebbi", "jigawa", "sokoto", "zamfara",
    # South East
    "abia", "anambra", "ebonyi", "enugu", "imo",
    # South South (Niger Delta)
    "akwa ibom", "bayelsa", "cross river", "delta", "edo", "rivers",
    # South West
    "ekiti", "lagos", "ogun", "ondo", "osun", "oyo",
}

LOCATION_REGIONS = {
    "benue": "North Central", "kogi": "North Central", "kwara": "North Central",
    "nasarawa": "North Central", "niger": "North Central", "plateau": "North Central",
    "fct": "North Central", "abuja": "North Central",
    "adamawa": "North East", "bauchi": "North East", "borno": "North East",
    "gombe": "North East", "taraba": "North East", "yobe": "North East",
    "kaduna": "North West", "kano": "North West", "katsina": "North West",
    "kebbi": "North West", "jigawa": "North West", "sokoto": "North West",
    "zamfara": "North West",
    "abia": "South East", "anambra": "South East", "ebonyi": "South East",
    "enugu": "South East", "imo": "South East",
    "akwa ibom": "South South", "bayelsa": "South South", "cross river": "South South",
    "delta": "South South", "edo": "South South", "rivers": "South South",
    "ekiti": "South West", "lagos": "South West", "ogun": "South West",
    "ondo": "South West", "osun": "South West", "oyo": "South West",
}

LOCATION_DISPLAY = {
    "fct": "Abuja", "abuja": "Abuja",
    "akwa ibom": "Akwa Ibom", "cross river": "Cross River",
    "nasarawa": "Nasarawa", "kaduna": "Kaduna",
    "kano": "Kano", "katsina": "Katsina",
    "kebbi": "Kebbi", "jigawa": "Jigawa",
    "sokoto": "Sokoto", "zamfara": "Zamfara",
    "benue": "Benue", "kogi": "Kogi",
    "kwara": "Kwara", "niger": "Niger",
    "plateau": "Plateau", "adamawa": "Adamawa",
    "bauchi": "Bauchi", "borno": "Borno",
    "gombe": "Gombe", "taraba": "Taraba",
    "yobe": "Yobe", "abia": "Abia",
    "anambra": "Anambra", "ebonyi": "Ebonyi",
    "enugu": "Enugu", "imo": "Imo",
    "delta": "Delta", "edo": "Edo",
    "rivers": "Rivers", "bayelsa": "Bayelsa",
    "ekiti": "Ekiti", "lagos": "Lagos",
    "ogun": "Ogun", "ondo": "Ondo",
    "osun": "Osun", "oyo": "Oyo",
}

VALID_SCALES = {"small", "medium", "large", "small-scale", "medium-scale", "large-scale"}
VALID_CONFIDENCE = {"low", "medium", "high"}
VALID_RATING_RANGE = (1, 5)


@dataclass
class FarmerProfile:
    farmer_type: str = ""
    location: str = ""
    scale: str = ""
    experience: int = 0

    @classmethod
    def from_string(cls, raw: str) -> "FarmerProfile":
        raw_lower = raw.lower().strip()
        parts = [p.strip() for p in raw_lower.replace(",", "").split()]

        farmer_type = ""
        location = ""
        scale = ""
        experience = 0

        for word in parts:
            if word in KNOWN_CROPS:
                farmer_type = word
            elif word in KNOWN_LOCATIONS:
                location = word
            elif word in VALID_SCALES:
                scale = word
            elif word.isdigit():
                experience = int(word)

        if not farmer_type:
            for phrase_len in (2, 3):
                for i in range(len(parts) - phrase_len + 1):
                    phrase = " ".join(parts[i:i + phrase_len])
                    if phrase in KNOWN_CROPS:
                        farmer_type = phrase
                        break
                if farmer_type:
                    break

        if not farmer_type and "farmer" in raw_lower:
            idx = raw_lower.index("farmer")
            before = raw_lower[:idx].strip().split()
            if before and before[-1] not in KNOWN_LOCATIONS:
                farmer_type = before[-1]

        return cls(
            farmer_type=farmer_type or "farmer",
            location=location or "nigeria",
            scale=scale or "small-scale",
            experience=experience,
        )


@dataclass
class ReviewResult:
    location: str
    review: str
    rating: int
    confidence: str
    reasoning: str

    def to_dict(self) -> dict:
        return {"location": self.location, "review": self.review, "rating": self.rating, "confidence": self.confidence, "reasoning": self.reasoning}

    def to_json(self) -> str:
        import json
        return json.dumps(self.to_dict(), ensure_ascii=False, indent=2)

    @classmethod
    def from_dict(cls, data: dict) -> "ReviewResult":
        return cls(
            location=str(data.get("location", "Nigeria")),
            review=str(data.get("review", "")),
            rating=int(data.get("rating", 3)),
            confidence=str(data.get("confidence", "Low")),
            reasoning=str(data.get("reasoning", "")),
        )


def validate_profile(profile: FarmerProfile) -> FarmerProfile:
    sanitized = FarmerProfile(
        farmer_type=profile.farmer_type.strip().lower() if profile.farmer_type else "farmer",
        location=profile.location.strip().lower() if profile.location else "nigeria",
        scale=profile.scale.strip().lower() if profile.scale else "small-scale",
        experience=max(0, profile.experience),
    )

    if not sanitized.farmer_type or sanitized.farmer_type == "farmer":
        sanitized.farmer_type = "farmer"
    if not sanitized.location:
        sanitized.location = "nigeria"
    if sanitized.scale not in VALID_SCALES and "scale" not in sanitized.scale:
        sanitized.scale = "small-scale"

    return sanitized


def format_location_name(location_key: str) -> str:
    key = location_key.strip().lower()
    if key in LOCATION_DISPLAY:
        name = LOCATION_DISPLAY[key]
        if key == "fct" or key == "abuja":
            return f"{name} (FCT)"
        return f"{name} State"
    return location_key.strip().title()


def pick_random_location() -> str:
    import random
    return random.choice(sorted(KNOWN_LOCATIONS))


def validate_product_name(name: str) -> str:
    name = name.strip()
    if not name:
        raise ValidationError("product_name", "Product name cannot be empty")
    if len(name) > 200:
        raise ValidationError("product_name", "Product name too long (max 200 characters)")
    return name


def validate_context(ctx: Optional[str]) -> Optional[str]:
    if ctx is None:
        return None
    ctx = ctx.strip()
    if len(ctx) > 500:
        raise ValidationError("optional_context", "Context too long (max 500 characters)")
    return ctx if ctx else None


def validate_rating(rating: int) -> int:
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        raise ValidationError("rating", "Must be an integer between 1 and 5")
    return rating


def validate_confidence(confidence: str) -> str:
    c = confidence.strip().lower().capitalize()
    if c not in VALID_CONFIDENCE:
        raise ValidationError("confidence", f"Must be one of: {', '.join(VALID_CONFIDENCE)}")
    return c
