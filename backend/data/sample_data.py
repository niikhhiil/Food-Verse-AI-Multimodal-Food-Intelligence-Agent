"""
Generates synthetic sample images and video files for test execution,
demos, and verification of FoodVerse AI multimodal pipelines.
"""

import os
import cv2
import numpy as np

SAMPLE_DIR = os.path.dirname(__file__)

def generate_sample_assets():
    print("Generating FoodVerse AI sample assets...")

    # 1. Vibrant Red Apple (Fresh)
    apple = np.zeros((400, 400, 3), dtype=np.uint8)
    apple[:] = (245, 245, 245)  # Light gray background
    cv2.circle(apple, (200, 210), 130, (30, 30, 220), -1)  # BGR Red
    cv2.ellipse(apple, (180, 180), (40, 20), -30, 0, 360, (50, 50, 250), -1)  # Specular shine
    cv2.line(apple, (200, 80), (200, 110), (19, 69, 139), 8)  # Stem
    cv2.ellipse(apple, (220, 95), (25, 12), 40, 0, 360, (34, 139, 34), -1)  # Leaf
    apple_path = os.path.join(SAMPLE_DIR, "sample_fresh_apple.jpg")
    cv2.imwrite(apple_path, apple)

    # 2. Spoiled Fruit (Discolored with dark decay patches and mold spots)
    spoiled = np.zeros((400, 400, 3), dtype=np.uint8)
    spoiled[:] = (240, 240, 240)
    cv2.circle(spoiled, (200, 210), 130, (20, 60, 90), -1)  # Brownish decay base
    # Add dark necrotic patches
    for pt in [(160, 180), (220, 240), (180, 260), (240, 180), (190, 210)]:
        cv2.circle(spoiled, pt, 25, (10, 20, 35), -1)
    # Add fuzzy mold speckles
    noise = np.random.randint(0, 80, (400, 400, 3), dtype=np.uint8)
    spoiled = cv2.addWeighted(spoiled, 0.85, noise, 0.15, 0)
    spoiled_path = os.path.join(SAMPLE_DIR, "sample_spoiled_fruit.jpg")
    cv2.imwrite(spoiled_path, spoiled)

    # 3. Golden Chicken Biryani
    biryani = np.zeros((400, 400, 3), dtype=np.uint8)
    biryani[:] = (250, 250, 250)
    # Rice bowl rim
    cv2.circle(biryani, (200, 200), 150, (220, 220, 220), -1)
    # Saffron yellow golden rice bed
    cv2.circle(biryani, (200, 200), 140, (30, 180, 230), -1)
    # Spices & meat textures
    for _ in range(80):
        rx, ry = np.random.randint(100, 300), np.random.randint(100, 300)
        if (rx - 200)**2 + (ry - 200)**2 < 120**2:
            color = (20, 80, 180) if np.random.rand() > 0.5 else (20, 140, 40)
            cv2.ellipse(biryani, (rx, ry), (10, 4), np.random.randint(0, 180), 0, 360, color, -1)
    biryani_path = os.path.join(SAMPLE_DIR, "sample_biryani.jpg")
    cv2.imwrite(biryani_path, biryani)

    # 4. Fresh Garden Green Salad
    salad = np.zeros((400, 400, 3), dtype=np.uint8)
    salad[:] = (255, 255, 255)
    cv2.circle(salad, (200, 200), 140, (40, 160, 40), -1)
    for _ in range(50):
        rx, ry = np.random.randint(90, 310), np.random.randint(90, 310)
        if (rx - 200)**2 + (ry - 200)**2 < 120**2:
            cv2.circle(salad, (rx, ry), 18, (30, 200, 80), -1)
            if np.random.rand() > 0.7:
                cv2.circle(salad, (rx, ry), 10, (20, 20, 220), -1)  # Cherry tomato
    salad_path = os.path.join(SAMPLE_DIR, "sample_salad.jpg")
    cv2.imwrite(salad_path, salad)

    # 5. Synthetic Restaurant Kitchen Video Clip (30 frames, MP4)
    video_path = os.path.join(SAMPLE_DIR, "sample_kitchen_clip.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path, fourcc, 10.0, (640, 360))

    for i in range(30):
        frame = np.zeros((360, 640, 3), dtype=np.uint8)
        # Stainless steel prep counter (lower 40%)
        frame[210:360, :] = (180, 185, 190)
        # Kitchen wall (upper 60%)
        frame[0:210, :] = (230, 235, 240)
        # Chef figure
        cv2.circle(frame, (320, 110), 45, (160, 190, 210), -1)  # Face
        cv2.rectangle(frame, (280, 50), (360, 95), (250, 250, 250), -1)  # White chef toque/hairnet
        cv2.rectangle(frame, (250, 155), (390, 280), (245, 245, 245), -1)  # White chef jacket
        # Prep hands moving with blue nitrile gloves
        hand_x = 310 + int(np.sin(i * 0.3) * 20)
        cv2.circle(frame, (hand_x, 260), 16, (220, 120, 20), -1)  # Blue nitrile glove BGR
        cv2.circle(frame, (hand_x + 60, 260), 16, (220, 120, 20), -1)  # Blue nitrile glove BGR
        # Cutting board with fresh vegetables
        cv2.rectangle(frame, (240, 270), (420, 320), (50, 130, 200), -1)
        cv2.circle(frame, (330, 295), 14, (30, 190, 40), -1)

        out.write(frame)

    out.release()
    print("Sample assets generated successfully!")

if __name__ == "__main__":
    generate_sample_assets()
