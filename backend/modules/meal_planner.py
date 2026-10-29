"""
Epic 5: Personalized Meal Planner Development
Activity 5.1: User Profile, Goal, and Preference Processing
Activity 5.2: Meal Plan Generation and Adaptive Recommendation Logic
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    name: str = "Rahul Giri"
    age: int = Field(25, ge=12, le=100)
    gender: str = Field("male", pattern="^(male|female|other)$")
    height_cm: float = Field(175.0, ge=100, le=250)
    weight_kg: float = Field(70.0, ge=30, le=250)
    activity_level: str = Field(
        "moderately_active",
        pattern="^(sedentary|lightly_active|moderately_active|very_active|extremely_active)$"
    )
    health_goal: str = Field(
        "weight_loss",
        pattern="^(weight_loss|muscle_gain|maintenance|keto|diabetic_friendly)$"
    )
    dietary_preference: str = Field(
        "omnivore",
        pattern="^(omnivore|vegetarian|vegan|pescatarian)$"
    )
    allergies: List[str] = Field(default_factory=list)

class MealPlannerEngine:
    def __init__(self):
        self.activity_multipliers = {
            "sedentary": 1.2,
            "lightly_active": 1.375,
            "moderately_active": 1.55,
            "very_active": 1.725,
            "extremely_active": 1.9
        }

    def compute_bmr_and_tdee(self, profile: UserProfile) -> Dict[str, float]:
        """
        Activity 5.1: Mifflin-St Jeor formula for BMR and TDEE.
        """
        # Mifflin-St Jeor
        if profile.gender.lower() == "male":
            bmr = (10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age) + 5
        elif profile.gender.lower() == "female":
            bmr = (10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age) - 161
        else:
            bmr = (10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age) - 78

        factor = self.activity_multipliers.get(profile.activity_level, 1.4)
        tdee = bmr * factor

        # Goal Adjustment
        goal = profile.health_goal
        if goal == "weight_loss":
            target_cals = max(1200, tdee - 500)
            p_ratio, c_ratio, f_ratio = 0.35, 0.35, 0.30
        elif goal == "muscle_gain":
            target_cals = tdee + 350
            p_ratio, c_ratio, f_ratio = 0.30, 0.45, 0.25
        elif goal == "keto":
            target_cals = max(1300, tdee - 250)
            p_ratio, c_ratio, f_ratio = 0.25, 0.05, 0.70
        elif goal == "diabetic_friendly":
            target_cals = max(1300, tdee - 300)
            p_ratio, c_ratio, f_ratio = 0.30, 0.40, 0.30
        else:  # maintenance
            target_cals = tdee
            p_ratio, c_ratio, f_ratio = 0.25, 0.50, 0.25

        target_cals = round(target_cals)
        protein_g = round((target_cals * p_ratio) / 4)
        carbs_g = round((target_cals * c_ratio) / 4)
        fats_g = round((target_cals * f_ratio) / 9)

        # Hydration formula: 35ml per kg body weight
        water_liters = round((profile.weight_kg * 0.035), 1)

        # Body Mass Index (BMI)
        height_m = profile.height_cm / 100.0
        bmi = round(profile.weight_kg / (height_m * height_m), 1)

        return {
            "bmr_kcal": round(bmr),
            "tdee_kcal": round(tdee),
            "target_calories_daily": target_cals,
            "macronutrient_targets": {
                "protein_g": protein_g,
                "carbs_g": carbs_g,
                "fats_g": fats_g
            },
            "recommended_water_liters": water_liters,
            "bmi": bmi
        }

    def generate_daily_meal_plan(self, profile: UserProfile) -> Dict[str, Any]:
        """
        Activity 5.2: Generates customized daily meals with macros, portions,
        and alternative flexible swaps.
        """
        metrics = self.compute_bmr_and_tdee(profile)
        cals = metrics["target_calories_daily"]
        is_veg = profile.dietary_preference in ["vegetarian", "vegan"]
        is_vegan = profile.dietary_preference == "vegan"

        # Allocation: Breakfast 25%, Lunch 35%, Snacks 15%, Dinner 25%
        b_cals = round(cals * 0.25)
        l_cals = round(cals * 0.35)
        s_cals = round(cals * 0.15)
        d_cals = round(cals * 0.25)

        if is_vegan:
            breakfast = {
                "meal": "Breakfast",
                "time": "08:00 AM",
                "item": "Steel-cut Oats with Chia, Almond Butter & Fresh Berries",
                "portion": "1 large bowl (300g)",
                "calories": b_cals,
                "protein_g": 14,
                "carbs_g": 52,
                "fats_g": 12,
                "swap_alternative": "Tofu Scramble with Spinach & Avocado on Sourdough"
            }
            lunch = {
                "meal": "Lunch",
                "time": "01:00 PM",
                "item": "Crispy Tofu & Rainbow Veggie Stir Fry with Quinoa",
                "portion": "350g bowl",
                "calories": l_cals,
                "protein_g": 24,
                "carbs_g": 62,
                "fats_g": 15,
                "swap_alternative": "Chickpea & Avocado Mediterranean Buddha Bowl"
            }
            snack = {
                "meal": "Afternoon Refreshment",
                "time": "04:30 PM",
                "item": "Handful of Raw Walnuts & Green Apple Slices",
                "portion": "1 serving (80g)",
                "calories": s_cals,
                "protein_g": 5,
                "carbs_g": 22,
                "fats_g": 11,
                "swap_alternative": "Roasted Spiced Pumpkin Seeds & Herbal Tea"
            }
            dinner = {
                "meal": "Dinner",
                "time": "08:00 PM",
                "item": "Yellow Lentil Tadka (Dal) with Steamed Brown Rice & Sautéed Greens",
                "portion": "320g plate",
                "calories": d_cals,
                "protein_g": 18,
                "carbs_g": 54,
                "fats_g": 8,
                "swap_alternative": "Creamy Coconut Lentil Stew with Steamed Broccoli"
            }
        elif is_veg:
            breakfast = {
                "meal": "Breakfast",
                "time": "08:00 AM",
                "item": "High-Protein Paneer Bhurji with Multigrain Toast",
                "portion": "1 plate (250g)",
                "calories": b_cals,
                "protein_g": 22,
                "carbs_g": 34,
                "fats_g": 16,
                "swap_alternative": "Greek Yogurt Parfait with Mixed Nuts and Honey"
            }
            lunch = {
                "meal": "Lunch",
                "time": "01:00 PM",
                "item": "Paneer Tikka with Yellow Dal Tadka and Millet Rotis",
                "portion": "1 full platter",
                "calories": l_cals,
                "protein_g": 28,
                "carbs_g": 58,
                "fats_g": 18,
                "swap_alternative": "Mediterranean Greek Salad with Spiced Cottage Cheese"
            }
            snack = {
                "meal": "Evening Snack",
                "time": "04:30 PM",
                "item": "Roasted Spiced Makhana (Foxnuts) with Buttermilk",
                "portion": "1 bowl (150ml)",
                "calories": s_cals,
                "protein_g": 7,
                "carbs_g": 18,
                "fats_g": 4,
                "swap_alternative": "Boiled Sprouted Moong Salad with Lemon"
            }
            dinner = {
                "meal": "Dinner",
                "time": "08:00 PM",
                "item": "Mixed Vegetable Palak Paneer with Brown Rice",
                "portion": "300g plate",
                "calories": d_cals,
                "protein_g": 20,
                "carbs_g": 45,
                "fats_g": 14,
                "swap_alternative": "Tandoori Vegetable Medley with Hummus & Wholewheat Pita"
            }
        else:
            # Omnivore
            breakfast = {
                "meal": "Breakfast",
                "time": "08:00 AM",
                "item": "Avocado Toast with 2 Soft Poached Eggs & Cherry Tomatoes",
                "portion": "1 plate (250g)",
                "calories": b_cals,
                "protein_g": 22,
                "carbs_g": 28,
                "fats_g": 19,
                "swap_alternative": "Three Egg White & Veggie Omelet with Multigrain Sourdough"
            }
            lunch = {
                "meal": "Lunch",
                "time": "01:00 PM",
                "item": "Grilled Chicken Caesar Salad with Lemon Garlic Dressing",
                "portion": "350g bowl",
                "calories": l_cals,
                "protein_g": 42,
                "carbs_g": 38,
                "fats_g": 16,
                "swap_alternative": "Portioned Chicken Dum Biryani with Cucumber Mint Raita"
            }
            snack = {
                "meal": "Mid-Day Snack",
                "time": "04:30 PM",
                "item": "Greek Yogurt with Fresh Strawberries & Almonds",
                "portion": "1 cup (200g)",
                "calories": s_cals,
                "protein_g": 15,
                "carbs_g": 16,
                "fats_g": 6,
                "swap_alternative": "Boiled Egg with Paprika and Sliced Cucumber"
            }
            dinner = {
                "meal": "Dinner",
                "time": "08:00 PM",
                "item": "Pan-Seared Salmon with Steamed Asparagus & Sweet Potato Mash",
                "portion": "320g plate",
                "calories": d_cals,
                "protein_g": 38,
                "carbs_g": 32,
                "fats_g": 15,
                "swap_alternative": "Herb Roast Chicken Breast with Warm Quinoa Salad"
            }

        daily_meals = [breakfast, lunch, snack, dinner]

        # 7-Day High-Level Schedule
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        weekly_schedule = []
        for d in days:
            weekly_schedule.append({
                "day": d,
                "calorie_target": cals,
                "focus": "High Protein & Fiber Balance" if d in ["Monday", "Wednesday", "Friday"] else "Hydration & Nutrient Density",
                "signature_dish": lunch["item"] if d in ["Monday", "Thursday"] else dinner["item"]
            })

        adaptive_guidance = [
            f"Daily Hydration: Consume minimum {metrics['recommended_water_liters']}L of pure water throughout the day.",
            "Meal Timing: Maintain a 12-hour overnight digestive rest window (8:00 PM to 8:00 AM) to boost insulin sensitivity.",
            f"Goal Specifics: Your plan provides a customized macronutrient profile ({metrics['macronutrient_targets']['protein_g']}g Protein, {metrics['macronutrient_targets']['carbs_g']}g Carbs, {metrics['macronutrient_targets']['fats_g']}g Healthy Fats) tailored for {profile.health_goal.replace('_', ' ').title()}."
        ]

        return {
            "status": "success",
            "user_name": profile.name,
            "profile_metrics": metrics,
            "daily_meal_plan": daily_meals,
            "weekly_overview": weekly_schedule,
            "adaptive_guidance": adaptive_guidance
        }

meal_planner = MealPlannerEngine()
