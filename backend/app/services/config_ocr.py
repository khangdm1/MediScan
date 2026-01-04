# =============================================================================
# FILE: config_ocr.py
# =============================================================================
from thefuzz import fuzz

# Danh sách từ khóa (Viết thường hết)
DRUG_KEYWORDS = {
    "Dopagan_650mg": ["dopagan", "paracetamol", "giam dau"],
    "Hapacol_Csday": ["hapacol", "day", "csday", "thuoc bot"],
    "Vistamin_B1": ["vistamin", "mekophar"]
}


def check_ocr_match(class_name, ocr_text_list):
    """
    Kiểm tra xem OCR có tìm thấy từ khóa nào không (Dùng Fuzzy Matching)
    """
    target_keywords = DRUG_KEYWORDS.get(class_name, [])
    if not target_keywords: return 0, []

    found_keywords = set()  # Dùng set để tránh trùng lặp

    # Duyệt qua từng từ mà OCR đọc được
    for ocr_word in ocr_text_list:
        ocr_word = ocr_word.lower().strip()

        # Bỏ qua các từ quá ngắn (dưới 2 ký tự) để tránh nhiễu
        if len(ocr_word) < 2: continue

        for kw in target_keywords:
            # 1. Kiểm tra chứa trong (Dành cho trường hợp dính chữ: "Dopagan650")
            if kw in ocr_word:
                found_keywords.add(kw)
                continue

            # 2. Kiểm tra Fuzzy (Dành cho sai chính tả: "Dopagqn" vs "Dopagan")
            # Tỉ lệ giống nhau > 80% là chấp nhận
            score = fuzz.ratio(kw, ocr_word)
            if score >= 80:
                found_keywords.add(kw)  # Lưu từ khóa gốc để dễ báo cáo

    return len(found_keywords), list(found_keywords)


# Hàm tìm ngược (để cứu khi ResNet đoán sai)
def find_drug_by_ocr(ocr_text_list):
    best_match_drug = None
    max_matches = 0

    for drug_name, keywords in DRUG_KEYWORDS.items():
        # Tái sử dụng logic fuzzy ở trên
        count = 0
        for ocr_word in ocr_text_list:
            ocr_word = ocr_word.lower()
            for kw in keywords:
                if fuzz.ratio(kw, ocr_word) >= 80:
                    count += 1

        if count >= 1 and count > max_matches:  # Tìm thấy ít nhất 1 từ
            max_matches = count
            best_match_drug = drug_name

    return best_match_drug