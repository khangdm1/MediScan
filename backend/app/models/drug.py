# app/models/drug.py
from sqlalchemy import Column, Integer, String, Text
from app.core.db import Base

class Drug(Base):
    __tablename__ = "drug"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    code = Column(String(100), unique=True, nullable=True)
    description = Column(Text, nullable=True)
    active_ingredient = Column(String(255), nullable=True)
    manufacturer = Column(String(255), nullable=True)
    image_url = Column(Text, nullable=True)
    drugbank_id = Column(String(100), nullable=True)
