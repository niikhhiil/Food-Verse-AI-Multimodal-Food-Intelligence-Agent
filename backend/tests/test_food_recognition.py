"""
Unit & Functional Tests for Epic 2: Food Recognition & Nutrition Module
"""

import os
import pytest
from modules.food_recognition import food_recognizer, NUTRITION_DB

SAMPLE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def test_nutrition_db_loaded():
    assert len(NUTRITION_DB) > 0
    assert "chicken_biryani" in NUTRITION_DB
    assert "fresh_apple" in NUTRITION_DB

def test_predict_food_with_valid_image():
    sample_path = os.path.join(SAMPLE_DIR, "sample_biryani.jpg")
    assert os.path.exists(sample_path), "Sample biryani image must exist"

    with open(sample_path, "rb") as f:
        img_bytes = f.read()

    result = food_recognizer.predict_food(img_bytes, user_query="chicken biryani")
    assert result["status"] == "success"
    assert "Chicken Biryani" in result["detected_food"]
    assert result["confidence"] > 70
    assert "nutrition" in result
    assert result["nutrition"]["calories"] == 480
    assert 0 <= result["nutrition"]["health_score"] <= 100

def test_health_scoring_logic():
    # Test high health score item (Salmon Salad)
    salmon_profile = NUTRITION_DB["grilled_salmon_salad"]
    res = food_recognizer.compute_nutrition_and_health_score(salmon_profile)
    assert res["health_score"] >= 80
    assert res["health_tier"] == "Optimal / Highly Nutritious"

    # Test indulgent food item (Cheeseburger)
    burger_profile = NUTRITION_DB["cheeseburger"]
    res_b = food_recognizer.compute_nutrition_and_health_score(burger_profile)
    assert res_b["health_score"] <= 60

def test_invalid_image_bytes():
    with pytest.raises(ValueError):
        food_recognizer.predict_food(b"not an image byte stream")
