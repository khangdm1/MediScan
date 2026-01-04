# app/models/prediction_log.py
from sqlalchemy import Column, Integer, DateTime, Float, Text, String, ForeignKey
from sqlalchemy.sql import func
from app.core.db import Base

class PredictionLog(Base):
    __tablename__ = "prediction_log"

    id = Column(Integer, primary_key=True, index=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Kết quả từ AI
    predicted_drug_name = Column(String(255), nullable=True)  # Lưu tên text (VD: "Panadol")
    confidence = Column(Float, nullable=True)  # Độ tin cậy (VD: 95.5)
    status = Column(String(50), nullable=True)  # success/warning/fail

    image_path = Column(Text, nullable=True)  # Đường dẫn ảnh
