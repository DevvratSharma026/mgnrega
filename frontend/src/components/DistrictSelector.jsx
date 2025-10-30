import React, { useEffect, useState } from "react";
import { getDistricts } from "../services/api";
import { useLanguage } from "../i18n/LanguageProvider";

export default function DistrictSelector({ onSelect, state = "Bihar" }) {
  const [districts, setDistricts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getDistricts(state);
        if (!mounted) return;
        setDistricts(list);
      } catch {
        // fallback: basic static list for Bihar (minimal)
        setDistricts([
          "Patna","Gaya","Muzaffarpur","Darbhanga","Bhagalpur","Purnia","Saran","Siwan",
          "Chapra","Begusarai","Nalanda","Buxar","Bhojpur","Samastipur","Araria","Madhubani"
        ]);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [state]);

  const filtered = districts.filter(d => d.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h2 className="font-bold text-lg text-slate-800">{t("chooseDistrict")}</h2>
          <p className="text-sm text-slate-500">Select a district to view analytics</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-600 font-medium">{t("loading")}</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Results Count */}
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-slate-500">
              {filtered.length} {filtered.length === 1 ? 'district' : 'districts'} found
            </span>
            {q && (
              <button
                onClick={() => setQ("")}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Districts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
            {filtered.map((d, index) => {
              const key = `districts.${d}`;
              const translated = t(key);
              const label = translated === key ? d : translated;
              
              return (
                <button
                  key={d}
                  onClick={() => onSelect(d)}
                  className="group relative p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-all duration-300 hover:scale-105 hover:shadow-md text-left"
                >
                  {/* Background pattern on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-green-200 transition-colors">
                        <span className="text-sm font-semibold text-emerald-700">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {label}
                        </h3>
                        {/* <p className="text-xs text-slate-500 mt-0.5">View performance data</p> */}
                      </div>
                    </div>
                    
                    {/* Hover arrow */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">No districts found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}