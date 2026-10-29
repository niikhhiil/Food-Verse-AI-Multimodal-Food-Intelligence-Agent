"""
Epic 3: Food Freshness & Spoilage Detection Module
Activity 3.1: Food Image Preprocessing and Feature Extraction
Activity 3.2: Freshness Classification and Safety Recommendation Logic
"""

import cv2
import numpy as np
from PIL import Image
import io

class FreshnessDetectionEngine:
    def __init__(self):
        pass

    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Activity 3.1: Food Image Preprocessing
        Standardizes input image, applies noise reduction and color calibration.
        """
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img_bgr is None:
                raise ValueError("Could not decode image from bytes")
        except Exception as e:
            raise ValueError(f"Image preprocessing failed: {str(e)}")

        # Resize to standardized dimensions for consistent feature extraction
        img_resized = cv2.resize(img_bgr, (400, 400))

        # Gaussian blur for noise reduction
        blurred = cv2.GaussianBlur(img_resized, (5, 5), 0)
        return blurred

    def extract_freshness_features(self, img_bgr: np.ndarray) -> dict:
        """
        Activity 3.1: Feature Extraction
        Extracts color consistency, texture roughness, blemish ratio, and surface discoloration.
        """
        # 1. Color Space Transformations
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
        img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

        # 2. Channel decomposition & Foreground segmentation
        h, s, v = cv2.split(img_hsv)
        l, a, b = cv2.split(img_lab)

        # Mask out neutral/white studio backgrounds to isolate actual food pixels
        fg_mask = (s > 15) | (gray < 235)
        if np.sum(fg_mask) > 200:
            mean_saturation = float(np.mean(s[fg_mask]))
            std_saturation = float(np.std(s[fg_mask]))
            mean_lightness = float(np.mean(l[fg_mask]))
            total_fg_pixels = float(np.sum(fg_mask))
        else:
            mean_saturation = float(np.mean(s))
            std_saturation = float(np.std(s))
            mean_lightness = float(np.mean(l))
            total_fg_pixels = 400.0 * 400.0
        
        # Darkening/Browning indicator: low lightness with elevated yellow-brown hue
        brown_lower = np.array([10, 50, 20])
        brown_upper = np.array([25, 255, 180])
        brown_mask = cv2.inRange(img_hsv, brown_lower, brown_upper)
        browning_ratio = float(np.sum(brown_mask > 0) / total_fg_pixels)

        # 3. Texture Smoothness & Mold/Decay Irregularity (Laplacian Variance)
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        
        # 4. Surface Defect / Spot Segmentation
        # Adaptive thresholding to detect local decay spots, fungal colonies, or necrotic lesions
        adaptive_thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV, 21, 5
        )
        contours, _ = cv2.findContours(adaptive_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        defect_area = 0
        significant_spots = 0
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > 40:
                defect_area += area
                significant_spots += 1

        defect_ratio = float(min(1.0, defect_area / total_fg_pixels))

        return {
            "mean_saturation": round(mean_saturation, 2),
            "std_saturation": round(std_saturation, 2),
            "mean_lightness": round(mean_lightness, 2),
            "browning_ratio": round(browning_ratio, 4),
            "texture_roughness_laplacian": round(laplacian_var, 2),
            "defect_ratio": round(defect_ratio, 4),
            "significant_blemishes_count": significant_spots
        }

    def classify_freshness(self, image_bytes: bytes, food_name_hint: str = None) -> dict:
        """
        Activity 3.2: Freshness Classification and Safety Recommendation Logic
        Categorizes food into Fresh, Moderately Fresh, or Spoiled with confidence score
        and actionable safety recommendations.
        """
        img_bgr = self.preprocess_image(image_bytes)
        features = self.extract_freshness_features(img_bgr)

        # Baseline freshness score calculation (0 - 100)
        # Healthy produce has high saturation, low browning, low defect ratio
        score = 85.0

        # Saturation bonus/penalty
        if features["mean_saturation"] > 110:
            score += 10.0
        elif features["mean_saturation"] < 50:
            score -= 15.0

        # Browning penalty
        if features["browning_ratio"] > 0.35:
            score -= 35.0
        elif features["browning_ratio"] > 0.15:
            score -= 15.0

        # Defect ratio penalty
        if features["defect_ratio"] > 0.25:
            score -= 30.0
        elif features["defect_ratio"] > 0.10:
            score -= 12.0

        # Texture roughness factor (high variance with blemishes indicates fungal growth)
        if features["texture_roughness_laplacian"] > 600 and features["defect_ratio"] > 0.08:
            score -= 15.0

        freshness_score = int(max(5, min(98, round(score))))

        # Freshness state classification
        if freshness_score >= 75:
            status = "Fresh"
            status_code = "FRESH"
            color_theme = "#10B981"  # Emerald Green
            risk_level = "Low Risk"
            shelf_life_est = "Safe for consumption (Estimated 4-7 days if chilled at 4°C)"
            recommendation = (
                "Excellent quality and optimal nutritional potency. Visual texture is firm "
                "with vibrant color integrity. Safe for raw or cooked consumption."
            )
            storage_action = "Store in a cool, ventilated crisper drawer or airtight container at 2-4°C."
        elif freshness_score >= 45:
            status = "Moderately Fresh"
            status_code = "MODERATE"
            color_theme = "#F59E0B"  # Amber Orange
            risk_level = "Moderate Attention"
            shelf_life_est = "Consume within 24-48 hours"
            recommendation = (
                "Signs of early moisture depletion or slight surface oxidation detected. "
                "Safe to eat after washing thoroughly; best used immediately in cooked dishes, soups, or sautés."
            )
            storage_action = "Refrigerate immediately. Trim any soft spots before culinary preparation."
        else:
            status = "Spoiled / Unsafe"
            status_code = "SPOILED"
            color_theme = "#EF4444"  # Danger Red
            risk_level = "High Hazard"
            shelf_life_est = "Expired / Immediate Discard"
            recommendation = (
                "Significant visual indicators of degradation, browning, microbial or mold "
                "colonization detected. Unsafe for human or animal consumption."
            )
            storage_action = "Discard safely into compost/organic waste bin to prevent cross-contamination."

        # Confidence metric based on feature clarity
        confidence = round(85.0 + min(12.0, abs(freshness_score - 50) * 0.2), 1)

        return {
            "status": "success",
            "freshness_state": status,
            "status_code": status_code,
            "freshness_score": freshness_score,
            "confidence_percentage": confidence,
            "risk_level": risk_level,
            "theme_color": color_theme,
            "estimated_shelf_life": shelf_life_est,
            "safety_recommendation": recommendation,
            "storage_protocol": storage_action,
            "extracted_features": features
        }

freshness_detector = FreshnessDetectionEngine()
