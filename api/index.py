"""
Vercel Serverless Function Entry Point for FoodVerse AI
Exposes the FastAPI application as the ASGI handler.
"""

import os
import sys

# Ensure project root and backend are in Python search path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

for path in [ROOT_DIR, BACKEND_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

from backend.main import app
