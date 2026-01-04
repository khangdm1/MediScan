import json
import sys
import os

# Thêm đường dẫn project vào sys.path để import được app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.db import SessionLocal
from app.models.drug_info import DrugInfo


def import_data():
    db = SessionLocal()

    try:
        # Đọc file JSON
        with open("drugs_data.json", "r", encoding="utf-8") as f:
            drugs = json.load(f)

        print(f"📦 Đang import {len(drugs)} thuốc vào Database...")

        count = 0
        for item in drugs:
            # Kiểm tra xem thuốc đã có chưa để tránh trùng lặp
            exists = db.query(DrugInfo).filter(DrugInfo.source_url == item['source_url']).first()
            if exists:
                print(f"⏩ Bỏ qua (đã có): {item['name']}")
                continue

            new_drug = DrugInfo(
                name=item['name'],
                active_ingredient=item.get('active_ingredient', ''),
                dosage=item.get('dosage', ''),
                usage=item.get('usage', ''),
                manufacturer=item.get('manufacturer', ''),
                image_url=item.get('image_url', ''),
                source_url=item['source_url']
            )
            db.add(new_drug)
            count += 1

        db.commit()
        print(f"✅ Import thành công {count} thuốc mới!")

    except Exception as e:
        print(f"❌ Lỗi: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    import_data()