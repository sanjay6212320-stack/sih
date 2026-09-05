export interface IntentAnalysis {
  intent: string;
  detected_language: "en" | "hi" | "ta";
  entities: {
    occupation: string | null;
    category: string | null;
    target_keywords: string[];
  };
}

export class IntentClassifier {
  static detectIntentAndLanguage(text: string): IntentAnalysis {
    const textLower = text.toLowerCase().trim();

    // Multilingual Language Detection
    let detectedLanguage: "en" | "hi" | "ta" = "en";
    if (/[\u0900-\u097F]/.test(text)) {
      detectedLanguage = "hi";
    } else if (/[\u0B80-\u0BFF]/.test(text)) {
      detectedLanguage = "ta";
    }

    let intent = "GENERAL_DISCOVERY";
    const entities = {
      occupation: null as string | null,
      category: null as string | null,
      target_keywords: [] as string[],
    };

    // Education / Scholarship
    if (
      ["scholarship", "student", "college", "school", "education", "fee", "छात्रवृत्ति", "छात्र", "கல்வி", "உதவித்தொகை"].some((w) =>
        textLower.includes(w)
      )
    ) {
      intent = "EDUCATION_SCHOLARSHIP";
      entities.occupation = "Student";
      entities.target_keywords.push("scholarship");
    }
    // Agriculture / Farmer
    else if (
      ["farmer", "kisan", "crop", "land", "seed", "subsidy", "किसान", "खेती", "விவசாயி", "பயிர்"].some((w) => textLower.includes(w))
    ) {
      intent = "AGRICULTURE_ASSISTANCE";
      entities.occupation = "Farmer";
      entities.target_keywords.push("farmer");
    }
    // Income / Revenue Certificate
    else if (
      ["income", "certificate", "caste", "residence", "revenue", "प्रमाण पत्र", "आय", "சான்றிதழ்", "வருமானம்"].some((w) => textLower.includes(w))
    ) {
      intent = "CERTIFICATE_SERVICES";
      entities.target_keywords.push("certificate");
    }
    // Health Insurance
    else if (
      ["health", "hospital", "medical", "insurance", "swasthya", "स्वास्थ्य", "மருத்துவம்", "காப்பீடு"].some((w) => textLower.includes(w))
    ) {
      intent = "HEALTH_INSURANCE";
      entities.target_keywords.push("health");
    }
    // Pension / Welfare
    else if (["pension", "senior", "elderly", "welfare", "पेंशन", "வயோதிகர்", "ஓய்வூதியம்"].some((w) => textLower.includes(w))) {
      intent = "SOCIAL_WELFARE";
      entities.target_keywords.push("welfare");
    }

    return {
      intent,
      detected_language: detectedLanguage,
      entities,
    };
  }
}
