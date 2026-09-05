from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.ai.intent_classifier import intent_classifier
from app.ai.eligibility_engine import eligibility_engine
from app.models.service import GovernmentService
from app.models.department import Department

class AIAssistant:
    @staticmethod
    def process_query(db: Session, user_message: str, citizen_profile: Dict[str, Any]) -> Dict[str, Any]:
        analysis = intent_classifier.detect_intent_and_language(user_message)
        intent = analysis["intent"]
        lang = analysis["detected_language"]

        # Fetch services from DB
        services = db.query(GovernmentService).all()
        dept_map = {d.id: d.name for d in db.query(Department).all()}

        recommendations = []
        for service in services:
            dept_name = dept_map.get(service.department_id, "Government Department")
            serv_dict = {
                "id": service.id,
                "title": service.title,
                "category": service.category,
                "description": service.description,
                "eligibility_criteria": service.eligibility_criteria,
                "required_documents": service.required_documents
            }

            is_eligible, status_text, rules = eligibility_engine.evaluate(citizen_profile, serv_dict)

            # Score calculation
            score = 60
            if intent == "EDUCATION_SCHOLARSHIP" and service.category == "Education":
                score += 30
            elif intent == "AGRICULTURE_ASSISTANCE" and service.category == "Agriculture":
                score += 30
            elif intent == "HEALTH_INSURANCE" and service.category == "Health":
                score += 30
            elif intent == "CERTIFICATE_SERVICES" and service.category == "Revenue":
                score += 30
            elif intent == "SOCIAL_WELFARE" and service.category == "Welfare":
                score += 30

            if is_eligible:
                score += 10
            
            score = min(score, 98)

            if score >= 70:
                explanation = (
                    f"Recommended based on your query regarding {service.category.lower()} schemes. "
                    f"Matching criteria: {', '.join(rules[:2]) if rules else 'Matches citizen demographic'}. "
                    f"Department: {dept_name}."
                )

                recommendations.append({
                    "service_id": service.id,
                    "title": service.title,
                    "department_name": dept_name,
                    "category": service.category,
                    "match_percentage": score,
                    "eligibility_status": status_text,
                    "explanation": explanation,
                    "required_documents": service.required_documents
                })

        # Sort recommendations by match percentage
        recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
        top_recs = recommendations[:4]

        # Multilingual reply text
        reply = ""
        if lang == "hi":
            reply = f"आपकी '<b>{user_message}</b>' की क्वेरी के आधार पर, GovConnect AI ने आपके लिए {len(top_recs)} सबसे उपयुक्त सरकारी योजनाओं की पहचान की है:"
        elif lang == "ta":
            reply = f"உங்கள் '<b>{user_message}</b>' கோரிக்கையின் அடிப்படையில், GovConnect AI உங்களுக்கு {len(top_recs)} தகுதியான அரசு திட்டங்களை பரிந்துரைக்கிறது:"
        else:
            reply = f"Based on your request regarding '<b>{user_message}</b>', GovConnect AI identified {len(top_recs)} relevant government schemes for which you appear eligible:"

        return {
            "reply": reply,
            "intent": intent,
            "detected_language": lang,
            "recommendations": top_recs
        }

ai_assistant = AIAssistant()
