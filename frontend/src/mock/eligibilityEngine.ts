export interface EligibilityResult {
  is_eligible: boolean;
  status_text: string;
  matching_rules: string[];
  violations: string[];
}

export class EligibilityEngine {
  static evaluate(
    citizenProfile: { annual_income?: number; occupation?: string; dob?: string; age?: number },
    service: { eligibility_criteria?: { max_income?: number; occupations?: string[]; min_age?: number; max_age?: number } }
  ): EligibilityResult {
    const criteria = service.eligibility_criteria || {};
    const matching_rules: string[] = [];
    const violations: string[] = [];

    // 1. Income Check
    const maxIncome = criteria.max_income;
    const userIncome = citizenProfile.annual_income ?? 0;
    if (maxIncome !== undefined && maxIncome !== null) {
      if (userIncome <= maxIncome) {
        matching_rules.push(`Annual income ₹${userIncome.toLocaleString("en-IN")} is within limit (₹${maxIncome.toLocaleString("en-IN")})`);
      } else {
        violations.push(`Annual income ₹${userIncome.toLocaleString("en-IN")} exceeds ₹${maxIncome.toLocaleString("en-IN")}`);
      }
    }

    // 2. Occupation Check
    const allowedOccupations = criteria.occupations || [];
    const userOcc = citizenProfile.occupation || "";
    if (allowedOccupations.length > 0) {
      const isAllowed =
        allowedOccupations.some((o) => o.toLowerCase() === userOcc.toLowerCase()) ||
        allowedOccupations.includes("All");
      if (isAllowed) {
        matching_rules.push(`Occupation (${userOcc}) meets target criteria`);
      } else {
        violations.push(`Occupation (${userOcc}) is not eligible (Requires: ${allowedOccupations.join(", ")})`);
      }
    }

    // 3. Age Check
    let userAge = citizenProfile.age;
    if (userAge === undefined && citizenProfile.dob) {
      const birthYear = new Date(citizenProfile.dob).getFullYear();
      const currentYear = new Date().getFullYear();
      userAge = currentYear - birthYear;
    }
    if (userAge === undefined) userAge = 22; // default fallback

    const minAge = criteria.min_age;
    const maxAge = criteria.max_age;
    if (minAge && userAge < minAge) {
      violations.push(`Age (${userAge}) is below minimum requirement (${minAge})`);
    } else if (maxAge && userAge > maxAge) {
      violations.push(`Age (${userAge}) exceeds maximum limit (${maxAge})`);
    } else if (minAge || maxAge) {
      matching_rules.push(`Age (${userAge}) meets target range`);
    }

    let isEligible = false;
    let statusText = "Not Eligible";

    if (violations.length === 0) {
      isEligible = true;
      statusText = "Eligible";
    } else if (matching_rules.length > 0) {
      isEligible = false;
      statusText = "Partially Eligible";
    }

    return {
      is_eligible: isEligible,
      status_text: statusText,
      matching_rules,
      violations,
    };
  }
}
