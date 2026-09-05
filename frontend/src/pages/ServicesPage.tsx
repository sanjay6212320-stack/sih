import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { serviceApi } from "../services/serviceApi";
import { GovernmentService } from "../types";
import { ServiceCard } from "../components/ServiceCard";
import { Search, Filter, SlidersHorizontal, CheckCircle2, AlertCircle, X, ShieldCheck } from "lucide-react";

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [loading, setLoading] = useState(true);

  // Eligibility check modal state
  const [activeCheckService, setActiveCheckService] = useState<GovernmentService | null>(null);
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [userIncome, setUserIncome] = useState(120000);
  const [userAge, setUserAge] = useState(20);
  const [userOccupation, setUserOccupation] = useState("Student");

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, queryParam]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      if (queryParam) {
        const data = await serviceApi.searchServices(queryParam);
        setServices(data);
      } else {
        const data = await serviceApi.getServices(selectedCategory === "All" ? undefined : selectedCategory);
        setServices(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const handleRunEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCheckService) return;
    setIsChecking(true);
    try {
      const res = await serviceApi.checkEligibility(activeCheckService.id, {
        annual_income: Number(userIncome),
        age: Number(userAge),
        occupation: userOccupation,
        category: "General",
      });
      setEligibilityResult(res);
    } catch (err) {
      alert("Error calculating eligibility");
    } finally {
      setIsChecking(false);
    }
  };

  const categories = ["All", "Education", "Revenue", "Health", "Agriculture", "Welfare"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Government Services Registry</h1>
          <p className="text-xs text-slate-500">
            Discover, check eligibility, and apply across 6 connected department backends.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by service name, department, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-24 py-2.5 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams({});
                setQuery("");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat && !queryParam
                  ? "bg-slate-900 text-amber-400 shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading government services catalog...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          No government services found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onCheckEligibility={(srv) => {
                setActiveCheckService(srv);
                setEligibilityResult(null);
              }}
            />
          ))}
        </div>
      )}

      {/* Eligibility Quiz Modal Drawer */}
      {activeCheckService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setActiveCheckService(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Dynamic Rules Engine
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Preliminary Eligibility Check: {activeCheckService.title}
              </h3>
            </div>

            <form onSubmit={handleRunEligibility} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Family Income (INR)</label>
                <input
                  type="number"
                  value={userIncome}
                  onChange={(e) => setUserIncome(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                  <select
                    value={userOccupation}
                    onChange={(e) => setUserOccupation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Student">Student</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Small Business">Small Business</option>
                    <option value="Retired">Retired</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChecking}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {isChecking ? "Evaluating Rules..." : "Evaluate Preliminary Eligibility"}
              </button>
            </form>

            {/* Result display */}
            {eligibilityResult && (
              <div
                className={`p-4 rounded-xl border space-y-2 text-xs ${
                  eligibilityResult.eligible
                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                    : "bg-rose-50 border-rose-200 text-rose-950"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {eligibilityResult.eligible ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span>Status: {eligibilityResult.status}</span>
                </div>
                <p className="leading-relaxed">{eligibilityResult.reason}</p>
                <p className="text-[10px] text-slate-500 italic mt-2">{eligibilityResult.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
