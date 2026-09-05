import { dbState } from "./dbState";
import { IntentClassifier } from "./intentClassifier";
import { EligibilityEngine } from "./eligibilityEngine";

export interface AIRecommendation {
  service_id: number;
  title: string;
  department_name: string;
  category: string;
  match_percentage: number;
  eligibility_status: string;
  explanation: string;
  required_documents: string[];
}

export interface AIChatResponse {
  reply: string;
  intent: string;
  detected_language: string;
  recommendations: AIRecommendation[];
}

export class AIAssistant {
  static processQuery(userMessage: string, citizenProfile: any = {}): AIChatResponse {
    const analysis = IntentClassifier.detectIntentAndLanguage(userMessage);
    const { intent, detected_language: lang } = analysis;

    const services = dbState.getServices();
    const departments = dbState.getDepartments();
    const deptMap = new Map<number, string>(departments.map((d) => [d.id, d.name]));

    const recommendations: AIRecommendation[] = [];

    for (const service of services) {
      const deptName = deptMap.get(service.department_id) || "Government Department";
      const evalRes = EligibilityEngine.evaluate(citizenProfile, service);

      let score = 60;
      if (intent === "EDUCATION_SCHOLARSHIP" && service.category === "Education") score += 30;
      else if (intent === "AGRICULTURE_ASSISTANCE" && service.category === "Agriculture") score += 30;
      else if (intent === "HEALTH_INSURANCE" && service.category === "Health") score += 30;
      else if (intent === "CERTIFICATE_SERVICES" && service.category === "Revenue") score += 30;
      else if (intent === "SOCIAL_WELFARE" && service.category === "Welfare") score += 30;

      if (evalRes.is_eligible) score += 10;
      score = Math.min(score, 98);

      if (score >= 70) {
        const matchingDesc =
          evalRes.matching_rules.length > 0 ? evalRes.matching_rules.slice(0, 2).join(", ") : "Matches citizen demographic";

        const explanation = `Recommended based on your query regarding ${service.category.toLowerCase()} schemes. Matching criteria: ${matchingDesc}. Department: ${deptName}.`;

        recommendations.push({
          service_id: service.id,
          title: service.title,
          department_name: deptName,
          category: service.category,
          match_percentage: score,
          eligibility_status: evalRes.status_text,
          explanation,
          required_documents: service.required_documents,
        });
      }
    }

    recommendations.sort((a, b) => b.match_percentage - a.match_percentage);
    const topRecs = recommendations.slice(0, 4);

    let reply = "";
    if (lang === "hi") {
      reply = `आपकी '<b>${userMessage}</b>' की क्वेरी के आधार पर, GovConnect AI ने आपके लिए ${topRecs.length} सबसे उपयुक्त सरकारी योजनाओं की पहचान की है:`;
    } else if (lang === "ta") {
      reply = `உங்கள் '<b>${userMessage}</b>' கோரிக்கையின் அடிப்படையில், GovConnect AI உங்களுக்கு ${topRecs.length} தகுதியான அரசு திட்டங்களை பரிந்துரைக்கிறது:`;
    } else {
      reply = `Based on your request regarding '<b>${userMessage}</b>', GovConnect AI identified ${topRecs.length} relevant government schemes for which you appear eligible:`;
    }

    return {
      reply,
      intent,
      detected_language: lang,
      recommendations: topRecs,
    };
  }
}
