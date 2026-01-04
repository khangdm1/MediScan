import os
from dotenv import load_dotenv

# 1. Load biến môi trường
# load_dotenv sẽ tìm file .env. Nếu chạy trong Docker mà không mount file .env
# thì cũng không sao, nó sẽ lấy trực tiếp từ Environment Variables của Docker.
load_dotenv()


class Settings:
    PROJECT_NAME: str = "DrugScan API"

    # --- CẤU HÌNH DATABASE (Code của bạn giữ nguyên) ---
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "drugdb")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASS = os.getenv("DB_PASS", "")

    # Chuỗi kết nối (Giữ nguyên driver postgresql+psycopg2)
    DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

    # --- CẤU HÌNH ĐƯỜNG DẪN AI MODEL ---
    # Logic này giúp tìm file đúng vị trí dù bạn chạy lệnh ở folder nào
    # Giải thích: File này là app/core/config.py -> đi ngược lên 3 cấp là ra thư mục gốc (backend)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    # Giả sử file model bạn để ngay ngoài cùng folder backend (ngang hàng dockerfile)
    MODEL_PATH = os.path.join(BASE_DIR, "resnet_drug_model_final.h5")
    LABEL_PATH = os.path.join(BASE_DIR, "label_map.txt")


# Khởi tạo object settings để dùng ở các file khác
settings = Settings()