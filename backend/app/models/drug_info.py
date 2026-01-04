from sqlalchemy import Column, Integer, String, Text
from app.core.db import Base


class DrugInfo(Base):
    __tablename__ = "drug_infos"

    id = Column(Integer, primary_key=True, index=True)

    # Các trường thông tin quan trọng
    name = Column(String, index=True)  # Tên thuốc (VD: Panadol Extra)
    active_ingredient = Column(String)  # Hoạt chất (VD: Paracetamol, Caffeine)
    dosage = Column(String)  # Dạng bào chế (VD: Viên nén bao phim)
    usage = Column(Text)  # Chỉ định/Công dụng (Text để lưu đoạn văn dài)
    contraindication = Column(Text)  # Chống chỉ định
    manufacturer = Column(String)  # Nhà sản xuất
    image_url = Column(String)  # Link ảnh minh họa

    # Link gốc để user bấm xem chi tiết mua hàng
    source_url = Column(String)