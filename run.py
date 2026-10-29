"""
FoodVerse AI - Multimodal Food Intelligence Agent Launcher
Runs FastAPI backend, serves React 18 dashboard, and opens browser automatically.
"""

import os
import sys
import webbrowser
import threading
import time

def check_dependencies():
    print("[*] Checking FoodVerse AI runtime environment...")
    required = ["fastapi", "uvicorn", "cv2", "torch", "torchvision", "PIL", "numpy"]
    missing = []
    for pkg in required:
        try:
            __import__(pkg)
        except ImportError:
            missing.append(pkg)

    if missing:
        print(f"[!] Warning: Missing packages detected: {missing}")
        print("[!] Install using: pip install -r requirements.txt")
    else:
        print("[✓] All core ML and web frameworks verified.")

def ensure_sample_assets():
    sample_dir = os.path.join(os.path.dirname(__file__), "backend", "data")
    apple_path = os.path.join(sample_dir, "sample_fresh_apple.jpg")
    if not os.path.exists(apple_path):
        print("[*] Generating reference sample assets...")
        from backend.data.sample_data import generate_sample_assets
        generate_sample_assets()
    else:
        print("[✓] Reference sample assets present.")

def open_browser():
    time.sleep(1.5)
    print("\n[🚀] Launching FoodVerse AI React Dashboard in your browser: http://localhost:8000\n")
    try:
        webbrowser.open("http://localhost:8000")
    except Exception:
        pass

def main():
    check_dependencies()
    ensure_sample_assets()

    # Add backend directory to sys.path
    backend_path = os.path.join(os.path.dirname(__file__), "backend")
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)

    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    from backend.main import app

    print("[*] Starting FoodVerse AI Uvicorn server on http://localhost:8000 ...")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

if __name__ == "__main__":
    main()
