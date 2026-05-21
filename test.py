import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from agrivoice import generate_review
    from agrivoice.validator import ReviewResult
    MOCK_MODE = False
except ImportError:
    MOCK_MODE = True
    ReviewResult = None

    def generate_review(farmer_profile, product_name, optional_context=None, prefer_fallback=False):
        import random
        locations = ["Kano State", "Oyo State", "Benue State", "Enugu State", "Kaduna State", "Rivers State", "Kebbi State", "Abuja (FCT)"]
        location = random.choice(locations)
        review = (
            f"Ah, this {product_name} wey I use for my {farmer_profile} for {location} "
            f"don really help me. My crops dey grow well and the yield increase "
            f"small small. But e cost plenty, I no fit lie. If dem reduce price, "
            f"many farmers go buy am."
        )
        rating = random.randint(3, 5)
        confidence = random.choice(["Low", "Medium", "High"])
        reasoning = f"{product_name} performed well for {farmer_profile} based on yield and cost considerations."
        return type("MockResult", (), {
            "location": location,
            "review": review,
            "rating": rating,
            "confidence": confidence,
            "reasoning": reasoning,
        })()


def print_result(result):
    print()
    print("=" * 60)
    print("  A G R I V O I C E   R E V I E W")
    print("=" * 60)
    print(f"  Location:   {result.location}")
    print(f"  Rating:     {'*' * result.rating}{'.' * (5 - result.rating)} ({result.rating}/5)")
    print(f"  Confidence: {result.confidence}")
    print(f"  Reasoning:  {result.reasoning}")
    print("-" * 60)
    word_count = len(result.review.split())
    print(f"  Review ({word_count} words):")
    print(f"  {result.review}")
    print("=" * 60)
    print()


def main():
    print("AgriVoice Test Harness")
    print("Type 'quit' at any prompt to exit.")
    print(f"Mode: {'MOCK (AI package not found)' if MOCK_MODE else 'LIVE (using agrivoice package)'}")
    print()

    while True:
        print("--- New Review ---")
        farmer_profile = input("Farmer profile:  ").strip()
        if farmer_profile.lower() == "quit":
            break

        product_name = input("Product name:    ").strip()
        if product_name.lower() == "quit":
            break

        optional_context = input("Context (opt):   ").strip()
        if optional_context.lower() == "quit":
            break

        if not optional_context:
            optional_context = None

        print()
        print("Generating review...")

        try:
            result = generate_review(
                farmer_profile=farmer_profile,
                product_name=product_name,
                optional_context=optional_context,
                prefer_fallback=True,
            )
            print_result(result)
        except Exception as e:
            print(f"  ERROR: {e}")
            print()


if __name__ == "__main__":
    main()
