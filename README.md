# FoodVerse AI — Multimodal Food Intelligence Agent

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fniikhhiil%2FFood-Verse-AI-Multimodal-Food-Intelligence-Agent)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![OpenCV](https://img.shields.io/badge/OpenCV-Serverless-5c3ee8.svg)](https://opencv.org/)
[![Tests](https://img.shields.io/badge/tests-18%20passed-brightgreen.svg)]()

FoodVerse AI is a unified, multimodal artificial intelligence platform that integrates computer vision, temporal video analysis, and LLM-driven reasoning to deliver real-time, actionable insights across food recognition, freshness and spoilage assessment, restaurant hygiene compliance monitoring, intelligent cooking guidance, and personalized adaptive meal planning. Fully optimized for instant deployment on **Vercel** serverless cloud.

---

## 🌟 System Overview & Architecture

```
                                +-----------------------------+
                                |  Multimodal Ingestion Hub   |
                                |  (Images, Video, Voice/Text)|
                                +--------------+--------------+
                                               |
                  +----------------------------+----------------------------+
                  |                            |                            |
       [Computer Vision & CNN]       [Temporal Video Stream]      [Reasoning & LLM Engine]
                  |                            |                            |
       +----------v----------+      +----------v----------+      +----------v----------+
       |   Epic 2: Food &    |      |  Epic 4: Restaurant |      |   Epic 4 & 5: Smart |
       | Nutrition Analyzer  |      |   Hygiene Monitor   |      |  Kitchen & Planner  |
       +----------+----------+      +----------+----------+      +----------+----------+
                  |                            |                            |
       +----------v----------+                 |                 +----------v----------+
       |   Epic 3: Freshness |                 |                 | Adaptive Dietary &  |
       |  & Spoilage Engine  |                 |                 | Recipe Intelligence |
       +----------+----------+                 |                 +----------+----------+
                  |                            |                            |
                  +----------------------------+----------------------------+
                                               |
                                    +----------v----------+
                                    | FastAPI REST API    |
                                    | OpenAPI / Swagger   |
                                    +----------+----------+
                                               |
                                    +----------v----------+
                                    | React 18 Dashboard  |
                                    | Glassmorphic UI/CSS |
                                    +---------------------+
```

---

## 🚀 Key Modules & Epics

### Epic 1: Requirements Specification and Environment Setup
- **Activity 1.1: Dependency Specification (`requirements.txt`)**
  - Configured core dependencies: FastAPI, Uvicorn, PyTorch, TorchVision, OpenCV, NumPy, Pillow, Pydantic, and Pytest.
- **Activity 1.2: Environment Setup**
  - Verified Python 3.9+ runtime, PyTorch CPU/CUDA acceleration, OpenCV image processing libraries, and modular folder packaging.

### Epic 2: Food Recognition & Nutrition Module Development
- **Activity 2.1: Food Image Detection and Classification**
  - Ingests food imagery, standardizes resolution ($224 \times 224$), and applies ImageNet normalization.
  - Leverages deep learning feature extractors (PyTorch MobileNetV2) and color space chromatic analysis.
  - Generates top prediction, multi-candidate probability rankings, and confidence metrics.
- **Activity 2.2: Nutrition Estimation and Health Scoring Logic**
  - Maps detected dishes to standard USDA and NIN nutritional reference profiles.
  - Computes calories, macronutrient distributions (protein, carbohydrates, healthy fats), and micronutrients (fiber, sodium, sugar).
  - Health Scoring algorithm (0–100 scale) based on macronutrient balance, caloric density, and cardiovascular impact tags.

### Epic 3: Food Freshness & Spoilage Detection Module
- **Activity 3.1: Food Image Preprocessing and Feature Extraction**
  - Standardizes images to $400 \times 400$ and applies Gaussian noise filtering.
  - Decomposes images into HSV and LAB color spaces to measure hue degradation and yellow-brown oxidation.
  - Computes Laplacian variance for surface roughness and texture irregularity (detecting mold colonization).
  - Performs adaptive thresholding and contour segmentation to calculate surface defect ratios.
- **Activity 3.2: Freshness Classification and Safety Recommendation Logic**
  - Classifies items into **Fresh** ($\ge 75$), **Moderately Fresh** ($45-74$), or **Spoiled** ($< 45$).
  - Produces confidence ratings, risk level flags, estimated shelf-life, and mandatory food safety protocols.

### Epic 4: Restaurant Hygiene & Smart Kitchen Modules
- **Activity 4.1: Restaurant Hygiene Detection and Compliance Scoring**
  - Ingests kitchen video footage and extracts temporal frames at regular intervals.
  - Evaluates blue nitrile glove compliance on food preparation lines.
  - Inspects hair-cap and head restraint coverage in cooking zones.
  - Measures prep counter surface sanitation and identifies liquid spills or debris.
  - Computes overall compliance score ($0-100\%$), assigns certified hygiene grades (Grade A/B/C/F), and flags timestamped violation alerts.
- **Activity 4.2: Smart Kitchen Cooking Guidance and Recipe Generation Logic**
  - Ingests dish names or available ingredients to synthesize structured culinary recipes.
  - Produces ordered step-by-step cooking timelines with active timer countdowns and safety milestones (e.g. minimum internal poultry temperature $>74^\circ\text{C}$).
  - Integrates an interactive contextual culinary Q&A assistant for instant ingredient substitutions and technique tips.

### Epic 5: Personalized Meal Planner Development
- **Activity 5.1: User Profile, Goal, and Preference Processing**
  - Collects biometrics (age, gender, height, weight, activity multiplier, health goal, dietary restrictions).
  - Computes scientific Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) via the Mifflin-St Jeor formula:
    $$\text{BMR}_{\text{male}} = 10 \times \text{weight} + 6.25 \times \text{height} - 5 \times \text{age} + 5$$
    $$\text{BMR}_{\text{female}} = 10 \times \text{weight} + 6.25 \times \text{height} - 5 \times \text{age} - 161$$
  - Applies goal-oriented adjustments (deficit for weight loss, surplus for hypertrophy, keto, diabetic-friendly).
- **Activity 5.2: Meal Plan Generation and Adaptive Recommendation Logic**
  - Formulates daily meal schedules (Breakfast, Lunch, Snacks, Dinner) with precise caloric and macronutrient targets.
  - Embeds flexible meal swap alternatives for every meal.
  - Synthesizes 7-day adaptive schedules and hydration requirements.

### Epic 6: Interface, Testing, and Deployment
- **Activity 6.1: Frontend Interface Integration and System Execution**
  - Built with React 18, Tailwind CSS, custom CSS keyframe animations, and glassmorphic aesthetics.
  - Connects seamlessly to FastAPI REST endpoints with zero compilation lag.
- **Activity 6.2: Functional Testing and Edge Case Validation**
  - Pytest automated test suite covering all modules with 18 comprehensive tests.
  - Validates corrupted image bytes, edge-case BMIs, video streams, and API response structures.
- **Activity 6.3: Final Validation and Deployment Readiness**
  - Single-command launcher (`python run.py`), ready for live demonstration and production deployment.

---

## 🛠️ Tech Stack & Skills

- **Frontend**: HTML5, React.js 18, Tailwind CSS, Modern CSS Keyframe Animations
- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pydantic
- **Computer Vision & ML**: OpenCV, PyTorch, TorchVision, Pillow, NumPy, SciPy
- **Reasoning**: Meta LLaMA-inspired Multimodal Coordinator
- **Testing**: Pytest, Pytest-Asyncio, Starlette TestClient

---

## 💻 Quickstart & Execution

### 1. Clone the Repository
```bash
git clone https://github.com/niikhhiil/Food-Verse-AI-Multimodal-Food-Intelligence-Agent.git
cd Food-Verse-AI-Multimodal-Food-Intelligence-Agent
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Platform
Launch the complete full-stack platform (FastAPI backend + React frontend):
```bash
python run.py
```
*Or on Windows, simply double-click `start.bat` or run `./start.ps1`.*

The interactive dashboard will automatically open in your browser at:
👉 **`http://localhost:8000`**

Interactive OpenAPI / Swagger documentation is available at:
👉 **`http://localhost:8000/docs`**

---

## 🧪 Running Automated Tests

Run the full automated test suite:
```bash
python -m pytest backend/tests -v
```

All 18 unit and integration tests validate:
- System health & diagnostics
- Food classification & USDA nutrition matching
- Spoilage feature extraction & classification
- CCTV hygiene video auditing & compliance scoring
- Smart Kitchen procedural step generation & Q&A
- Mifflin-St Jeor BMR/TDEE calculations & meal planning
- REST API response schemas

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & diagnostic report |
| `POST` | `/api/food/recognize` | Upload image to detect dish and get nutrition & health score |
| `GET` | `/api/food/database` | Retrieve standard nutrition database |
| `POST` | `/api/freshness/detect` | Upload image for freshness/spoilage analysis |
| `POST` | `/api/hygiene/analyze-video` | Upload kitchen video to audit hygiene compliance |
| `POST` | `/api/kitchen/recipe-guide` | Request recipe & procedural cooking guide |
| `POST` | `/api/kitchen/ask-assistant` | Contextual culinary assistant Q&A |
| `POST` | `/api/meal-planner/generate` | Generate personalized meal plan from biometric profile |
| `POST` | `/api/multimodal/reason` | Multimodal inference (Vision + Voice/Audio + Text prompt) |

---

## 📄 License
This project is licensed under the MIT License.
