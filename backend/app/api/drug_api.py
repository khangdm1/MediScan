# app/api/drug_api.py
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.services import crud
from app.services.ai_engine import ai_engine  # Import bộ não AI
import os
import shutil
import uuid

router = APIRouter(prefix="/drugs", tags=["drugs"])
UPLOAD_FOLDER = "uploads"


@router.post("/predict", summary="Upload image & Predict Drug")
async def predict_drug(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 1. Validate file ảnh
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File phải là hình ảnh")

    try:
        # 2. Lưu file ảnh (đổi tên uuid để không trùng)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_ext = file.filename.split(".")[-1]
        new_filename = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_FOLDER, new_filename)

        # Đọc nội dung file để đưa vào AI
        contents = await file.read()

        # Lưu file xuống ổ cứng để đối chiếu sau này (Dashboard)
        with open(file_path, "wb") as f:
            f.write(contents)

        # 3. GỌI AI ENGINE
        result = ai_engine.predict(contents)

        # 4. Lưu Log vào Database (Cho Dashboard Admin)
        log = crud.create_prediction_log(
            db=db,
            drug_name=result["drug_name"],
            confidence=result["confidence"],
            status=result["status"],
            image_path=file_path
        )

        # 5. Tìm thêm thông tin thuốc từ Database (nếu có) để trả về link mua/mô tả
        # (Phần này optional, làm sau cũng được)
        # drug_info = crud.get_drug_by_name(db, result["drug_name"])

        # 6. Trả kết quả JSON cho React
        return {
            "scan_id": log.id,
            "prediction": result,
            "image_url": f"/uploads/{new_filename}"  # React sẽ dùng link này hiện ảnh
        }

    except Exception as e:
        print(f"Lỗi: {e}")
        raise HTTPException(500, "Lỗi xử lý hình ảnh bên phía server")