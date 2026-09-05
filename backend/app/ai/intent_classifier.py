import re
from typing import Dict, Any

class IntentClassifier:
    @staticmethod
    def detect_intent_and_language(text: str) -> Dict[str, Any]:
        text_lower = text.lower().strip()
        
        # Multilingual Language Detection
        detected_language = "en"
        # Hindi unicode check (0900-097F)
        if re.search(r'[\u0900-\u097F]', text):
            detected_language = "hi"
        # Tamil unicode check (0B80-0BFF)
        elif re.search(r'[\u0B80-\u0BFF]', text):
            detected_language = "ta"

        # Intent Detection Keywords
        intent = "GENERAL_DISCOVERY"
        entities = {
            "occupation": None,
            "category": None,
            "target_keywords": []
        }

        # Education / Scholarship
        if any(w in text_lower for w in ["scholarship", "student", "college", "school", "education", "fee", "छात्रवृत्ति", "छात्र", "கல்வி", "உதவித்தொகை"]):
            intent = "EDUCATION_SCHOLARSHIP"
            entities["occupation"] = "Student"
            entities["target_keywords"].append("scholarship")

        # Agriculture / Farmer
        elif any(w in text_lower for w in ["farmer", "kisan", "crop", "land", "seed", "subsidy", "किसान", "खेती", "விவசாயி", "பயிர்"]):
            intent = "AGRICULTURE_ASSISTANCE"
            entities["occupation"] = "Farmer"
            entities["target_keywords"].append("farmer")

        # Income / Revenue Certificate
        elif any(w in text_lower for w in ["income", "certificate", "caste", "residence", "revenue", "प्रमाण पत्र", "आय", "சான்றிதழ்", "வருமானம்"]):
            intent = "CERTIFICATE_SERVICES"
            entities["target_keywords"].append("certificate")

        # Health Insurance
        elif any(w in text_lower for w in ["health", "hospital", "medical", "insurance", "swasthya", "स्वास्थ्य", "மருத்துவம்", "காப்பீடு"]):
            intent = "HEALTH_INSURANCE"
            entities["target_keywords"].append("health")

        # Pension / Welfare
        elif any(w in text_lower for w in ["pension", "senior", "elderly", "welfare", "पेंशन", "வயோதிகர்", "ஓய்வூதியம்"]):
            intent = "SOCIAL_WELFARE"
            entities["target_keywords"].append("welfare")

        return {
            "intent": intent,
            "detected_language": detected_language,
            "entities": entities
        }

intent_classifier = IntentClassifier()
