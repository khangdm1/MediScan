# app/services/crud.py
from sqlalchemy.orm import Session
from app.models.drug import Drug
from app.models.prediction_log import PredictionLog

def get_drugs(db: Session, name: str = None):
    q = db.query(Drug)
    if name:
        q = q.filter(Drug.name.ilike(f"%{name}%"))
    return q.limit(100).all()

# Hàm tạo log đầy đủ thông tin
def create_prediction_log(db: Session, drug_name: str, confidence: float, status: str, image_path: str):
    log = PredictionLog(
        predicted_drug_name=drug_name,
        confidence=confidence,
        status=status,
        image_path=image_path
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log