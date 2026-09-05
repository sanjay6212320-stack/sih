from typing import Dict, Any, List, Tuple

class EligibilityEngine:
    @staticmethod
    def evaluate(citizen_profile: Dict[str, Any], service: Dict[str, Any]) -> Tuple[bool, str, List[str]]:
        """
        Evaluates preliminary eligibility deterministically.
        Returns: (is_eligible, status_text, matching_rules)
        """
        criteria = service.get("eligibility_criteria", {})
        matching_rules = []
        violations = []

        # 1. Income Check
        max_income = criteria.get("max_income")
        user_income = citizen_profile.get("annual_income", 0)
        if max_income is not None:
            if user_income <= max_income:
                matching_rules.append(f"Annual income ₹{user_income:,} is within limit (₹{max_income:,})")
            else:
                violations.append(f"Annual income ₹{user_income:,} exceeds ₹{max_income:,}")

        # 2. Occupation Check
        allowed_occupations = criteria.get("occupations", [])
        user_occ = citizen_profile.get("occupation", "")
        if allowed_occupations:
            if user_occ.lower() in [o.lower() for o in allowed_occupations] or "All" in allowed_occupations:
                matching_rules.append(f"Occupation ({user_occ}) meets target criteria")
            else:
                violations.append(f"Occupation ({user_occ}) is not eligible (Requires: {', '.join(allowed_occupations)})")

        # 3. Age Check
        min_age = criteria.get("min_age")
        max_age = criteria.get("max_age")
        user_age = citizen_profile.get("age", 20)
        if min_age and user_age < min_age:
            violations.append(f"Age ({user_age}) is below minimum requirement ({min_age})")
        elif max_age and user_age > max_age:
            violations.append(f"Age ({user_age}) exceeds maximum limit ({max_age})")
        else:
            if min_age or max_age:
                matching_rules.append(f"Age ({user_age}) meets target range")

        # Result calculation
        if not violations:
            return True, "Eligible", matching_rules
        elif len(matching_rules) > 0:
            return False, "Partially Eligible", violations
        else:
            return False, "Not Eligible", violations

eligibility_engine = EligibilityEngine()
