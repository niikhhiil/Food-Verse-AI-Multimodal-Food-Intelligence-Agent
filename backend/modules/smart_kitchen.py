"""
Epic 4: Restaurant Hygiene & Smart Kitchen Modules
Activity 4.2: Smart Kitchen Cooking Guidance and Recipe Generation Logic
"""

import os
import json
from typing import List, Dict, Any, Optional

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
RECIPES_PATH = os.path.join(DATA_DIR, "recipes_db.json")

def load_recipes():
    if os.path.exists(RECIPES_PATH):
        with open(RECIPES_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("recipes", [])
    return []

ALL_RECIPES = load_recipes()

class SmartKitchenAssistant:
    def __init__(self):
        self.recipes = ALL_RECIPES

    def generate_cooking_guide(
        self,
        dish_name: Optional[str] = None,
        available_ingredients: Optional[List[str]] = None,
        cuisine_pref: Optional[str] = None,
        dietary_restriction: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Activity 4.2: Smart Kitchen Cooking Guidance and Recipe Generation Logic
        Synthesizes structured recipes, ordered procedural instructions, safety checks,
        and cooking timers.
        """
        matched_recipe = None

        # 1. Match by dish name if provided
        if dish_name:
            dish_lower = dish_name.lower()
            for r in self.recipes:
                if dish_lower in r["title"].lower() or dish_lower in r["id"].lower():
                    matched_recipe = r
                    break

        # 2. Match by ingredients if provided
        if not matched_recipe and available_ingredients:
            best_score = -1
            ing_lower = [i.lower() for i in available_ingredients]
            for r in self.recipes:
                r_ings = [item["item"].lower() for item in r["ingredients"]]
                overlap = sum(1 for user_ing in ing_lower if any(user_ing in ring for ring in r_ings))
                if overlap > best_score:
                    best_score = overlap
                    matched_recipe = r

        # 3. Fallback to default chef special if no match
        if not matched_recipe:
            matched_recipe = self.recipes[0] if self.recipes else self._create_fallback_recipe(dish_name or "Chef's Mediterranean Medley")

        # Contextual adaptations for dietary restrictions
        recipe_copy = json.loads(json.dumps(matched_recipe))
        if dietary_restriction:
            diet_lower = dietary_restriction.lower()
            if "vegan" in diet_lower or "dairy" in diet_lower:
                recipe_copy["dietary_adaptation_note"] = "Replace ghee/butter/curd with plant-based oils and coconut/almond milk alternatives."
            elif "gluten" in diet_lower:
                recipe_copy["dietary_adaptation_note"] = "Substitute regular flour with almond flour or certified gluten-free alternatives."

        return {
            "status": "success",
            "recipe_id": recipe_copy.get("id", "dynamic_recipe"),
            "recipe_title": recipe_copy["title"],
            "cuisine": recipe_copy.get("cuisine", "Fusion"),
            "difficulty": recipe_copy.get("difficulty", "Easy"),
            "prep_time_minutes": recipe_copy.get("prep_time_minutes", 15),
            "cook_time_minutes": recipe_copy.get("cook_time_minutes", 20),
            "total_time_minutes": recipe_copy.get("prep_time_minutes", 15) + recipe_copy.get("cook_time_minutes", 20),
            "servings": recipe_copy.get("servings", 2),
            "calories_per_serving": recipe_copy.get("calories_per_serving", 350),
            "ingredients": recipe_copy.get("ingredients", []),
            "step_by_step_instructions": recipe_copy.get("steps", []),
            "chef_pro_tips": [
                "Mise en place: chop and portion all spices and aromatics before starting heat.",
                "Taste at every step and adjust acidity with fresh lemon juice at the finish.",
                "Rest hot proteins for 5 minutes before slicing to lock in juiciness."
            ]
        }

    def answer_cooking_query(self, query: str, active_recipe_title: str = None) -> Dict[str, str]:
        """Provides interactive contextual cooking assistance during active preparation."""
        q = query.lower()
        if "substitute" in q or "replace" in q:
            if "cream" in q or "heavy cream" in q:
                ans = "Substitute heavy cream with full-fat Greek yogurt mixed with 1 tbsp olive oil, or blended silken tofu/coconut cream."
            elif "butter" in q:
                ans = "Replace butter with equal parts cold-pressed extra virgin olive oil or mashed avocado."
            elif "egg" in q:
                ans = "For baking or binding, use 1 tbsp ground chia or flaxseed soaked in 3 tbsp water (1 egg equivalent)."
            else:
                ans = "Common culinary substitutions: unsweetened Greek yogurt for sour cream; lemon zest/juice for white wine; tamari for soy sauce."
        elif "done" in q or "temperature" in q or "thermometer" in q:
            ans = "Chicken & poultry is safely cooked when internal temp reaches 74°C (165°F). Salmon is tender at 52-57°C (125-135°F)."
        elif "salt" in q or "too salty" in q:
            ans = "If your dish is too salty, add raw potato wedges to absorb excess salt during simmering, or dilute with a splash of water/unsalted broth and lemon juice."
        else:
            ans = f"Great cooking question! When preparing {active_recipe_title or 'your dish'}, maintain medium-steady heat, keep pan surfaces dry before searing, and allow rested steam flavors to integrate before final seasoning."

        return {
            "query": query,
            "response": ans
        }

    def _create_fallback_recipe(self, title: str) -> Dict[str, Any]:
        return {
            "id": "recipe_custom",
            "title": title,
            "cuisine": "Modern Healthy",
            "difficulty": "Easy",
            "prep_time_minutes": 10,
            "cook_time_minutes": 15,
            "servings": 2,
            "calories_per_serving": 310,
            "ingredients": [
                {"item": "Primary protein (chicken, paneer, or tofu)", "quantity": "250g"},
                {"item": "Assorted colorful vegetables", "quantity": "2 cups diced"},
                {"item": "Olive oil or cold-pressed oil", "quantity": "1 tbsp"},
                {"item": "Aromatic spices (garlic, herbs, pepper)", "quantity": "To taste"}
            ],
            "steps": [
                {"step_number": 1, "action": "Prep", "instruction": "Wash and cube vegetables and protein into uniform bite-sized pieces.", "safety_tip": "Use separate cutting boards for raw poultry and produce.", "timer_seconds": 300},
                {"step_number": 2, "action": "Sauté", "instruction": "Heat oil in a skillet over medium heat. Sauté aromatics and protein for 6-8 minutes.", "safety_tip": "Avoid touching hot skillet rim.", "timer_seconds": 420},
                {"step_number": 3, "action": "Season & Plate", "instruction": "Add vegetables, cover for 4 minutes until crisp-tender. Season with herbs and serve.", "safety_tip": "Serve warm immediately.", "timer_seconds": 240}
            ]
        }

smart_kitchen_assistant = SmartKitchenAssistant()
