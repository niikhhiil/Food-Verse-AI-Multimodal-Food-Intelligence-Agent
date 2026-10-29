"""
Unit & Functional Tests for Epic 5: Personalized Meal Planner Module
"""

import pytest
from modules.meal_planner import meal_planner, UserProfile

def test_bmr_and_tdee_calculation():
    profile = UserProfile(
        name="Rahul",
        age=25,
        gender="male",
        height_cm=175.0,
        weight_kg=70.0,
        activity_level="moderately_active",
        health_goal="weight_loss",
        dietary_preference="omnivore"
    )
    metrics = meal_planner.compute_bmr_and_tdee(profile)
    # Expected BMR for male 25yo 70kg 175cm: (10*70) + (6.25*175) - (5*25) + 5 = 700 + 1093.75 - 125 + 5 = 1673.75
    assert 1600 <= metrics["bmr_kcal"] <= 1750
    assert metrics["tdee_kcal"] > metrics["bmr_kcal"]
    # Caloric deficit for weight loss
    assert metrics["target_calories_daily"] < metrics["tdee_kcal"]
    assert metrics["bmi"] == round(70 / (1.75 ** 2), 1)

def test_meal_plan_generation():
    profile = UserProfile(
        name="Priya",
        age=28,
        gender="female",
        height_cm=165.0,
        weight_kg=60.0,
        activity_level="lightly_active",
        health_goal="maintenance",
        dietary_preference="vegetarian"
    )
    plan = meal_planner.generate_daily_meal_plan(profile)
    assert plan["status"] == "success"
    assert len(plan["daily_meal_plan"]) == 4
    assert len(plan["weekly_overview"]) == 7
    # Verify vegetarian meal swap options are provided
    for meal in plan["daily_meal_plan"]:
        assert "swap_alternative" in meal
        assert "calories" in meal
