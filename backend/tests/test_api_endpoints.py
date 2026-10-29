"""
Integration Tests for FastAPI Endpoints (Activity 6.1 & 6.2)
"""

import os
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
SAMPLE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["modules_active"]["epic_2_food_recognition"] is True

def test_api_food_database():
    response = client.get("/api/food/database")
    assert response.status_code == 200
    data = response.json()
    assert data["items_count"] > 0

def test_api_food_recognition():
    sample_file = os.path.join(SAMPLE_DIR, "sample_biryani.jpg")
    with open(sample_file, "rb") as f:
        response = client.post(
            "/api/food/recognize",
            files={"file": ("sample_biryani.jpg", f, "image/jpeg")},
            data={"query_hint": "biryani"}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "nutrition" in data

def test_api_freshness_detection():
    sample_file = os.path.join(SAMPLE_DIR, "sample_fresh_apple.jpg")
    with open(sample_file, "rb") as f:
        response = client.post(
            "/api/freshness/detect",
            files={"file": ("sample_fresh_apple.jpg", f, "image/jpeg")},
            data={"food_name": "apple"}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["freshness_state"] in ["Fresh", "Moderately Fresh"]

def test_api_meal_planner():
    payload = {
        "name": "Test User",
        "age": 30,
        "gender": "male",
        "height_cm": 180.0,
        "weight_kg": 75.0,
        "activity_level": "moderately_active",
        "health_goal": "muscle_gain",
        "dietary_preference": "omnivore",
        "allergies": []
    }
    response = client.post("/api/meal-planner/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "profile_metrics" in data
    assert len(data["daily_meal_plan"]) == 4

def test_api_kitchen_guide():
    payload = {
        "dish_name": "Pan-Seared Salmon with Lemon Herb Garden Salad"
    }
    response = client.post("/api/kitchen/recipe-guide", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Salmon" in data["recipe_title"]
