# app/services/ai_engine.py
import numpy as np
import tensorflow as tf
import easyocr
import cv2
import io
from PIL import Image
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing import image as keras_image
from app.core.config import settings
from app.services import config_ocr


class DrugPredictor:
    def __init__(self):
        print("⏳ AI Engine: Đang tải Model ResNet & OCR...")
        # Load Model
        self.model = tf.keras.models.load_model(settings.MODEL_PATH, compile=False)

        # Load Labels
        self.labels = {}
        with open(settings.LABEL_PATH, "r", encoding="utf-8") as f:
            for line in f:
                if ":" in line:
                    k, v = line.strip().split(":", 1)
                    self.labels[int(k)] = v.strip()

        # Load EasyOCR
        self.reader = easyocr.Reader(['vi', 'en'], gpu=False)
        print("✅ AI Engine: Sẵn sàng!")

    def _preprocess(self, image_bytes):
        # 1. Cho ResNet (PIL Image)
        img_pil = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_resized = img_pil.resize((224, 224))
        img_arr = keras_image.img_to_array(img_resized)
        img_pre = preprocess_input(np.expand_dims(img_arr, axis=0))

        # 2. Cho OCR (OpenCV numpy)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img_pre, img_cv

    def predict(self, image_bytes):
        img_resnet, img_cv = self._preprocess(image_bytes)

        # --- BƯỚC 1: ResNet ---
        preds = self.model.predict(img_resnet, verbose=0)
        idx = np.argmax(preds)
        resnet_conf = float(preds[0][idx] * 100)
        resnet_name = self.labels.get(idx, "Unknown")

        # --- BƯỚC 2: OCR Check ---
        match_count = 0
        ocr_words = []

        # Chỉ xoay 0 và 90 độ để tối ưu tốc độ
        for angle in [0, 90]:
            if angle == 0:
                img_rot = img_cv
            else:
                img_rot = cv2.rotate(img_cv, cv2.ROTATE_90_CLOCKWISE)

            # Đọc text
            results = self.reader.readtext(img_rot, detail=0, paragraph=False)

            # Check khớp tên thuốc (Hàm của bạn trong config_ocr)
            c, words = config_ocr.check_ocr_match(resnet_name, results)
            if c > 0:
                match_count = c
                ocr_words = words
                break

        # --- BƯỚC 3: Hybrid Logic ---
        final_name = resnet_name
        status = "fail"
        msg = ""

        if resnet_conf > 85 and match_count >= 1:
            status = "success"
            msg = f"Độ tin cậy cao ({resnet_conf:.1f}%)"
        elif resnet_conf <= 85 and match_count >= 1:
            status = "warning"
            msg = "Ảnh mờ nhưng đọc được tên thuốc"
        elif resnet_conf > 90 and match_count == 0:
            # Reverse lookup (Tìm ngược)
            found = config_ocr.find_drug_by_ocr(results)  # Sửa hàm này trong config_ocr nhận list text
            if found:
                status = "success"
                final_name = found
                msg = "Phát hiện qua chữ viết (OCR)"
            else:
                status = "unknown"
                msg = "Hình ảnh giống thuốc nhưng không đọc được chữ"
        else:
            status = "fail"
            msg = "Không nhận diện được"

        return {
            "drug_name": final_name,
            "confidence": resnet_conf,
            "status": status,
            "message": msg,
            "ocr_debug": ocr_words
        }


# Khởi tạo singleton
ai_engine = DrugPredictor()