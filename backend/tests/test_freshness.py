"""
Unit & Functional Tests for Epic 3: Food Freshness & Spoilage Detection Module
"""

import os
import pytest
from modules.freshness_detection import freshness_detector

SAMPLE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def test_fresh_food_classification():
    sample_path = os.path.join(SAMPLE_DIR, "sample_fresh_apple.jpg")
    assert os.path.exists(sample_path)

    with open(sample_path, "rb") as f:
        img_bytes = f.read()

    result = freshness_detector.classify_freshness(img_bytes, food_name_hint="Apple")
    assert result["status"] == "success"
    assert result["freshness_state"] in ["Fresh", "Moderately Fresh"]
    assert result["freshness_score"] >= 65
    assert result["confidence_percentage"] > 70
    assert "storage_protocol" in result

def test_spoiled_food_classification():
    sample_path = os.path.join(SAMPLE_DIR, "sample_spoiled_fruit.jpg")
    assert os.path.exists(sample_path)

    with open(sample_path, "rb") as f:
        img_bytes = f.read()

    result = freshness_detector.classify_freshness(img_bytes)
    assert result["status"] == "success"
    # Spoiled item should have higher browning or defect ratio, lower freshness score
    assert result["freshness_score"] < 70
    assert "extracted_features" in result
    assert result["extracted_features"]["browning_ratio"] >= 0

def test_corrupted_image_handling():
    with pytest.raises(ValueError):
        freshness_detector.classify_freshness(b"corrupt")
