import { dbState } from "../mock/dbState";
import { EligibilityEngine } from "../mock/eligibilityEngine";
import { mockDelay } from "./api";

export const serviceApi = {
  getServices: async (category?: string, department_id?: number) => {
    await mockDelay(100);
    let services = dbState.getServices();
    const depts = dbState.getDepartments();
    const deptMap = new Map(depts.map((d) => [d.id, d.name]));

    if (category) {
      services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (department_id) {
      services = services.filter((s) => s.department_id === Number(department_id));
    }

    return services.map((s) => ({
      ...s,
      department_name: deptMap.get(s.department_id) || "Department",
    }));
  },

  searchServices: async (q: string) => {
    await mockDelay(120);
    const services = dbState.getServices();
    const query = q.toLowerCase().trim();
    if (!query) return serviceApi.getServices();

    const depts = dbState.getDepartments();
    const deptMap = new Map(depts.map((d) => [d.id, d.name]));

    const filtered = services.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query)
    );

    return filtered.map((s) => ({
      ...s,
      department_name: deptMap.get(s.department_id) || "Department",
    }));
  },

  getServiceDetails: async (id: number) => {
    await mockDelay(100);
    const service = dbState.getServiceById(id);
    if (!service) throw new Error("Service not found");

    const dept = dbState.getDepartmentById(service.department_id);
    return {
      ...service,
      department_name: dept ? dept.name : "Department",
      department: dept || null,
    };
  },

  checkEligibility: async (id: number, profileData: any) => {
    await mockDelay(150);
    const service = dbState.getServiceById(id);
    if (!service) throw new Error("Service not found");

    const evalResult = EligibilityEngine.evaluate(profileData, service);
    return evalResult;
  },
};
