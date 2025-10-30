import React, { useEffect, useState } from "react";
import { getDistrictPerformance } from "../services/api";
import BarChart from "../components/BarChart";
import PieChart, { PieLegend } from "../components/PieChart";
import { useLanguage } from "../i18n/LanguageProvider";

export default function Dashboard({ state, district }) {
  const [loading, setLoading] = useState(true);
  const [perf, setPerf] = useState(null);
  const [error, setError] = useState("");
  const { t, tryT } = useLanguage();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const data = await getDistrictPerformance(district, 12);
        if (!mounted) return;
        setPerf(data);
      } catch {
        setError("Unable to fetch performance data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [state, district]);

  if (loading) return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/60">
      <div className="flex items-center justify-center space-x-3">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-700 font-medium">{t("loading")}</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-200">
      <div className="flex items-center space-x-3 text-red-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        <span className="font-medium">{error}</span>
      </div>
    </div>
  );
  
  if (!perf) return null;

  const { latestMonth = {}, timeseriesDays = [] } = perf;
  const fmt = (n) => (n === undefined || n === null ? "—" : new Intl.NumberFormat("en-IN").format(n));
  const fmtMoney = (n) => (n === undefined || n === null ? "—" : `₹${new Intl.NumberFormat("en-IN").format(n)}`);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
            <span className="font-semibold text-blue-700">{t("stateLabel")}</span>
            <span className="text-blue-900">{state ? tryT(`states.${state}`, state) : "—"}</span>
          </div>
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-full">
            <span className="font-semibold text-green-700">{t("districtLabel")}</span>
            <span className="text-green-900">{district ? tryT(`districts.${district}`, district) : "—"}</span>
          </div>
          <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-full">
            <span className="font-semibold text-purple-700">{t("monthLabel")}</span>
            <span className="text-purple-900">{latestMonth.monthLabel ? tryT(`months.${latestMonth.monthLabel}`, latestMonth.monthLabel) : "—"} {latestMonth.finYear || ""}</span>
          </div>
        </div>
      </div>

      {/* Employment Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h3 className="font-bold text-lg text-slate-800">{t("employmentSummary")}</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: latestMonth.households, label: t("households"), color: "from-blue-500 to-blue-600" },
            { value: latestMonth.avgDaysPerHH, label: t("avgDays"), color: "from-green-500 to-green-600" },
            { value: latestMonth.womenPersondays, label: t("womenPersondays"), color: "from-pink-500 to-pink-600" },
            { value: latestMonth.differentlyAbledWorked, label: t("differentlyAbled"), color: "from-purple-500 to-purple-600" }
          ].map((item, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
              <div className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-2`}>
                {fmt(item.value)}
              </div>
              <div className="text-sm text-slate-600 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wages & Payments */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
          <h3 className="font-bold text-lg text-slate-800">{t("wagesPayments")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: fmtMoney(latestMonth.avgWagePerDay), label: t("avgWage"), icon: "💰" },
            { value: fmtMoney(latestMonth.expenditure), label: t("totalExpenditure"), icon: "💳" },
            { value: `${fmt(latestMonth.paymentWithin15DaysPct)}%`, label: t("paymentsWithin"), icon: "⚡" }
          ].map((item, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="text-lg mb-1 opacity-70">{item.icon}</div>
              <div className="text-2xl font-bold text-amber-700 mb-2">{item.value}</div>
              <div className="text-sm text-slate-600 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Works & Projects */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
          <h3 className="font-bold text-lg text-slate-800">{t("worksProjects")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: latestMonth.worksCompleted, label: t("completed"), color: "text-emerald-600" },
            { value: latestMonth.worksOngoing, label: t("ongoing"), color: "text-blue-600" },
            { value: latestMonth.worksTotal, label: t("total"), color: "text-slate-700" }
          ].map((item, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
              <div className={`text-2xl font-bold ${item.color} mb-2`}>{fmt(item.value)}</div>
              <div className="text-sm text-slate-600 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800">{t("employmentTrend")}</h3>
          </div>
          <BarChart data={timeseriesDays} xLabel={t("monthLabel")} yLabel={t("avgDays")} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-6 bg-gradient-to-b from-rose-500 to-rose-600 rounded-full"></div>
            <h3 className="font-bold text-slate-800">{t("worksCompletion")}</h3>
          </div>
          <PieChart completed={latestMonth.worksCompleted || 0} ongoing={latestMonth.worksOngoing || 0} />
          <PieLegend completed={latestMonth.worksCompleted || 0} ongoing={latestMonth.worksOngoing || 0} />
        </div>
      </div>
    </div>
  );
}