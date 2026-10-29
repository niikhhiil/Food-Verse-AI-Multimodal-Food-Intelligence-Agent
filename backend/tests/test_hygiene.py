"""
Unit & Functional Tests for Epic 4: Restaurant Hygiene & Smart Kitchen
"""

import os
import pytest
from modules.hygiene_monitor import hygiene_monitor
from modules.smart_kitchen import smart_kitchen_assistant

SAMPLE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def test_evaluate_kitchen_video():
    video_path = os.path.join(SAMPLE_DIR, "sample_kitchen_clip.mp4")
    assert os.path.exists(video_path), "Sample kitchen video must exist"

    with open(video_path, "rb") as f:
        video_bytes = f.read()

    result = hygiene_monitor.evaluate_kitchen_video(video_bytes)
    assert result["status"] == "success"
    assert "overall_compliance_score" in result
    assert 0 <= result["overall_compliance_score"] <= 100
    assert "hygiene_grade" in result
    assert result["total_frames_audited"] > 0
    assert "actionable_remediations" in result

def test_smart_kitchen_recipe_generation():
    guide = smart_kitchen_assistant.generate_cooking_guide(dish_name="Chicken Dum Biryani")
    assert guide["status"] == "success"
    assert "Biryani" in guide["recipe_title"]
    assert len(guide["ingredients"]) > 0
    assert len(guide["step_by_step_instructions"]) > 0
    assert guide["total_time_minutes"] > 0

def test_smart_kitchen_interactive_qa():
    ans = smart_kitchen_assistant.answer_cooking_query("What can I substitute for heavy cream?")
    assert "Greek yogurt" in ans["response"] or "tofu" in ans["response"] or "coconut" in ans["response"]
