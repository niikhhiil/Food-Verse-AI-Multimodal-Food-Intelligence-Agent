"""
FoodVerse AI - Multimodal Food Intelligence Agent
FastAPI Core Backend Engine (Epic 1 - Epic 6 Integration)
"""

import os
import sys
import io

# Ensure backend directory is in sys.path
BASE_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_BACKEND_DIR not in sys.path:
    sys.path.insert(0, BASE_BACKEND_DIR)

from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

# Import FoodVerse AI Domain Modules
from modules.food_recognition import food_recognizer, NUTRITION_DB
from modules.freshness_detection import freshness_detector
from modules.hygiene_monitor import hygiene_monitor
from modules.smart_kitchen import smart_kitchen_assistant
from modules.meal_planner import meal_planner, UserProfile
from modules.multimodal_llm import multimodal_coordinator

# Initialize FastAPI App
app = FastAPI(
    title="FoodVerse AI - Multimodal Food Intelligence Platform",
    description="Unified AI platform integrating vision, video, and LLM reasoning across food recognition, freshness, hygiene, and personalized nutrition.",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Mount Frontend Static Directories
app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")

# Mount Sample Data for direct testing/demo links
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
app.mount("/sample-data", StaticFiles(directory=DATA_DIR), name="sample-data")

# ----------------- Root & System Health Endpoints ----------------- #

@app.get("/")
async def serve_frontend_index():
    """Serves the interactive React-based frontend dashboard."""
    index_file = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "FoodVerse AI Core Backend is active. Frontend index.html not found."}

@app.get("/api/health")
async def health_check():
    """System diagnostic and environment verification."""
    return {
        "status": "healthy",
        "service": "FoodVerse AI - Multimodal Food Intelligence Agent",
        "version": "2.0.0",
        "modules_active": {
            "epic_2_food_recognition": True,
            "epic_3_freshness_detection": True,
            "epic_4_hygiene_and_kitchen": True,
            "epic_5_personalized_meal_planner": True,
            "epic_6_multimodal_reasoning": True
        }
    }

# ----------------- Epic 2: Food Recognition & Nutrition ----------------- #

@app.post("/api/food/recognize")
async def recognize_food(
    file: UploadFile = File(...),
    query_hint: Optional[str] = Form(None)
):
    """
    Activity 2.1: Food Image Detection and Classification
    Activity 2.2: Nutrition Estimation and Health Scoring Logic
    """
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        result = food_recognizer.predict_food(contents, user_query=query_hint)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Food recognition error: {str(e)}")

@app.get("/api/food/database")
async def get_nutrition_database():
    """Returns standard nutritional profiles from reference database."""
    return {"status": "success", "items_count": len(NUTRITION_DB), "foods": NUTRITION_DB}

# ----------------- Epic 3: Freshness & Spoilage Detection ----------------- #

@app.post("/api/freshness/detect")
async def detect_freshness(
    file: UploadFile = File(...),
    food_name: Optional[str] = Form(None)
):
    """
    Activity 3.1: Food Image Preprocessing & Feature Extraction
    Activity 3.2: Freshness Classification & Safety Recommendation Logic
    """
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        result = freshness_detector.classify_freshness(contents, food_name_hint=food_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Freshness analysis error: {str(e)}")

# ----------------- Epic 4: Restaurant Hygiene & Smart Kitchen ----------------- #

@app.post("/api/hygiene/analyze-video")
async def analyze_hygiene(file: UploadFile = File(...)):
    """
    Activity 4.1: Restaurant Hygiene Detection and Compliance Scoring
    Extracts frames, analyzes gloves, hairnet, surface cleanliness, and generates compliance audit.
    """
    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded video file is empty.")
        
        result = hygiene_monitor.evaluate_kitchen_video(contents, filename=file.filename or "kitchen.mp4")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hygiene evaluation error: {str(e)}")

class RecipeRequest(BaseModel):
    dish_name: Optional[str] = None
    ingredients: Optional[List[str]] = None
    cuisine: Optional[str] = None
    dietary_restriction: Optional[str] = None

@app.post("/api/kitchen/recipe-guide")
async def get_cooking_guide(payload: RecipeRequest):
    """
    Activity 4.2: Smart Kitchen Cooking Guidance and Recipe Generation Logic
    """
    try:
        guide = smart_kitchen_assistant.generate_cooking_guide(
            dish_name=payload.dish_name,
            available_ingredients=payload.ingredients,
            cuisine_pref=payload.cuisine,
            dietary_restriction=payload.dietary_restriction
        )
        return guide
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cooking guide generation error: {str(e)}")

class KitchenQuery(BaseModel):
    query: str
    active_dish: Optional[str] = None

@app.post("/api/kitchen/ask-assistant")
async def ask_kitchen_assistant(payload: KitchenQuery):
    """Contextual culinary Q&A during preparation."""
    return smart_kitchen_assistant.answer_cooking_query(payload.query, payload.active_dish)

# ----------------- Epic 5: Personalized Meal Planner ----------------- #

@app.post("/api/meal-planner/generate")
async def generate_meal_plan(profile: UserProfile):
    """
    Activity 5.1: User Profile, Goal, and Preference Processing
    Activity 5.2: Meal Plan Generation and Adaptive Recommendation Logic
    """
    try:
        plan = meal_planner.generate_daily_meal_plan(profile)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Meal planner error: {str(e)}")

# ----------------- Epic 6: Multimodal LLM Reasoning ----------------- #

@app.post("/api/multimodal/reason")
async def multimodal_reason(
    prompt: str = Form(""),
    audio_transcript: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """
    Unified multimodal reasoning engine combining vision, voice transcript, and text.
    """
    try:
        img_bytes = None
        if file:
            img_bytes = await file.read()
        
        result = multimodal_coordinator.process_multimodal_query(
            text_prompt=prompt,
            image_bytes=img_bytes,
            audio_transcript=audio_transcript
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multimodal reasoning error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
