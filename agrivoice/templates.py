REVIEW_TEMPLATES = {
    "fertilizer": {
        "full": [
            "I applied this fertilizer on my {crop} farm in {location} and the difference was clear within two weeks. The yield improved noticeably at harvest time. My only concern is the cost is too high for a {scale} like me.",
            "Using this product on my {crop} fields in {location} gave me better results than the local alternatives. The plants responded well with fewer nutrient deficiency signs. But I had to travel to the city because it is not stocked in our local market.",
            "This fertilizer performed well on my {crop} farm in {location} this rainy season. The cobs were bigger than what I got last year with cheaper brands. The only problem is the quantity per bag seems smaller than before.",
            "I tried this fertilizer on my {crop} farm in {location} after hearing good reviews from neighbors. The yield was impressive and my crops looked healthier. But the effect wears off faster during heavy rainfall.",
        ],
    },
    "pesticide": {
        "full": [
            "The pests were destroying my {crop} farm in {location} before I used this product. After spraying, the insects disappeared within two days and my plants recovered well. My only concern is the strong smell and high price for regular application.",
            "I applied this pesticide on my {crop} in {location} and it controlled the pest problem effectively. My harvest would have been a total loss without it. The instruction label was not detailed enough for a {scale} to follow easily.",
            "This product saved my {crop} farm in {location} from a serious pest outbreak this season. The protection lasted through the critical growing period. But the price has gone up since I first bought it.",
            "My {crop} plants in {location} were struggling with leaf-eating insects until I used this pesticide. It cleared the pests effectively and my crops bounced back. However, it also killed some beneficial insects around the farm.",
        ],
    },
    "irrigation": {
        "full": [
            "I installed this irrigation system on my {crop} farm in {location} and it transformed my dry season farming. I no longer depend on uncertain rainfall to water my crops. The downside is the setup cost is too high for a {scale}.",
            "Farming in {location} during the dry season used to be impossible until I got this equipment. My {crop} survived the harsh weather while neighbors lost their farms. But maintaining the system is expensive because of fuel costs.",
            "This irrigation pump helped me water my {crop} farm in {location} consistently through the dry months. The water pressure is good and it covers a wide area. However, the pipes blocked after two months and I had to spend extra to clean them.",
            "I used this system on my {crop} fields in {location} and it kept my plants healthy when the rain stopped early. I was able to harvest while others counted losses from drought. But fuel consumption is higher than the seller promised.",
        ],
    },
    "tractor": {
        "full": [
            "Hiring this tractor to plough my {crop} farm in {location} saved me weeks of manual labour. I was able to expand my farm size this season. But the rental cost is too high for a {scale} to afford regularly.",
            "Using this tractor on my {crop} farm in {location} made a big difference in land preparation this season. The deep tillage helped my crops root better than with hoe ploughing. However, spare parts are difficult to find in {location}.",
            "This tractor did a great job on my {crop} field in {location} and reduced the labourers I needed to hire. Crop establishment was uniform across the field. My concern is there is no mechanic nearby when it breaks down.",
            "I used this tractor on my {crop} farm in {location} and the soil was well pulverized for planting. But I had to wait two weeks because many farmers in {location} were also requesting it.",
        ],
    },
    "seed": {
        "full": [
            "I planted this seed variety on my {crop} farm in {location} and the germination rate was excellent. The seedlings were strong and matured earlier than expected. But these seeds are not available in our local market.",
            "This hybrid seed performed very well on my {crop} farm in {location}. The plants grew uniformly with good disease resistance. The only problem is the cost is too high for a {scale}.",
            "My {crop} farm in {location} gave me the best harvest in years after I switched to this seed variety. The yield was almost double what I normally get. But they need more water than the local variety.",
            "I tried this improved seed on my {crop} plot in {location} and the crops grew faster than local varieties. I was able to harvest earlier than my neighbors. However, the seeds did not store well for next season.",
        ],
    },
    "poultry": {
        "full": [
            "I raised these birds in {location} and they performed very well compared to my previous stock. The mortality rate was low which saved me from losses. The only issue is feed cost is high and the supplier is not always reliable.",
            "My poultry farm in {location} has been more profitable since I started using this product. Fewer birds died compared to my experience with local breeds. The challenge is the initial investment is high for a {scale}.",
            "These birds in {location} grew well from the first week and reached market size faster than my previous stock. But some chicks were weak from the start. The supplier should improve quality control.",
            "The chickens I reared in {location} showed good growth and healthy feathers throughout. The feed conversion was efficient. I just have concerns about availability during peak farming season.",
        ],
    },
    "solar": {
        "full": [
            "I installed this solar system on my farm in {location} and it cut down fuel expenses significantly. My {crop} farm now gets regular irrigation without generator noise. The panels are durable but don't perform well on cloudy days.",
            "This solar pump has been a game changer for my farm in {location}. I no longer worry about fuel price increases. The only drawback is the battery doesn't hold charge long enough for my full needs.",
            "Using solar power for my farm in {location} has saved me a lot of money on diesel. The water flows well during sunny days. However, installation was complicated and I had to pay someone extra.",
            "I switched to this solar system for my farm in {location} and I'm happy with the reduced running costs. The panels are still working well after six months. But I wish it could store more power for days without sunlight.",
        ],
    },
    "general": {
        "full": [
            "I used this product on my {crop} farm in {location} and it did a decent job this season. The quality was acceptable for the price. But I feel there are better options available.",
            "This product served its purpose on my farm in {location} last planting season. The performance was fair but not outstanding. I may try another brand next season.",
            "I bought this product for my {crop} farm in {location} based on a recommendation and results were mixed. It helped in some areas but had limitations. The manufacturer needs to improve quality.",
            "My experience with this product on my farm in {location} has been okay but not remarkable. It did what it was supposed to do. I may continue using it until I find something more effective.",
        ],
    },
}

PRODUCT_CATEGORIES = {
    "fertilizer": ["fertilizer", "npk", "urea", "manure", "compost"],
    "pesticide": ["pesticide", "insecticide", "herbicide", "fungicide", "weedicide"],
    "irrigation": ["irrigation", "pump", "sprinkler", "drip", "hose"],
    "tractor": ["tractor", "tiller", "plough", "harvester", "cultivator"],
    "seed": ["seed", "seedling", "variety", "hybrid"],
    "poultry": ["poultry", "chick", "feed", "broiler", "layer"],
    "solar": ["solar", "panel", "inverter"],
}

CROP_PATTERNS = [
    "rice", "maize", "cassava", "yam", "cocoa", "tomato", "pepper",
    "okra", "cowpea", "soybean", "sorghum", "millet", "groundnut",
    "cashew", "coconut", "plantain", "banana", "pineapple", "mango",
    "orange", "vegetable", "cucumber", "watermelon", "onion",
    "cabbage", "carrot", "beans", "sweet potato", "cocoyam",
]

SCALE_ADJECTIVES = {
    "small-scale": "small-scale farmer",
    "small": "small-scale farmer",
    "medium-scale": "medium-scale farmer",
    "medium": "medium-scale farmer",
    "large-scale": "large-scale farmer",
    "large": "large-scale farmer",
}

EXPERIENCE_PHRASES = {
    0: "just starting",
    1: "new farmer",
    range(2, 4): "still learning",
    range(4, 8): "have some experience",
    range(8, 15): "experienced farmer",
}

CONCERN_TEMPLATES = [
    "but the price is still high for someone like me.",
    "though I wish it was more affordable for small farmers.",
    "however, I had difficulty finding it in my local market.",
    "but the instructions were not clear enough.",
    "though I needed help to set it up properly.",
    "but I am not sure if it will last beyond this season.",
    "however, the delivery took longer than promised.",
    "but I had to buy extra accessories separately.",
]


def get_product_category(product_name: str) -> str:
    name_lower = product_name.lower()
    for category, keywords in PRODUCT_CATEGORIES.items():
        for kw in keywords:
            if kw in name_lower:
                return category
    return "general"


def get_experience_level(years: int) -> str:
    for key, phrase in EXPERIENCE_PHRASES.items():
        if isinstance(key, range) and years in key:
            return phrase
        if isinstance(key, int) and years == key:
            return phrase
    return "experienced farmer"
