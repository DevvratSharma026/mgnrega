import React, { useState } from "react";
import DistrictSelector from "../components/DistrictSelector";
import Dashboard from "./Dashboard";
import { locateUser } from "../services/api";
import { useLanguage } from "../i18n/LanguageProvider";

export default function Home() {
  const [district, setDistrict] = useState(null);
  const [autoDetectMsg, setAutoDetectMsg] = useState("");
  const [autoDetected, setAutoDetected] = useState({ state: null, district: null, supported: false });
  const { t } = useLanguage();

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setAutoDetectMsg("Geolocation not supported by browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // micro UX: show user we detected them, backend will map coords -> district
        setAutoDetectMsg("Location detected. Finding nearest district...");
        // call backend to reverse-map coords -> state/district and check support
        locateUser(pos.coords.latitude, pos.coords.longitude)
          .then((json) => {
            setAutoDetected(json);
            if (json?.supported) {
              setDistrict(json.district);
              setAutoDetectMsg(t("detectedLocation", { state: json.state, district: json.district ? `, ${json.district}` : "" }));
            } else {
              setAutoDetectMsg(t("unsupportedLocation"));
              setDistrict(null);
              setAutoDetected({ state: json.state, district: null, supported: false });
            }
          })
          .catch(() => setAutoDetectMsg(t("detectingError")));
      },
      () => setAutoDetectMsg("Permission denied for location.")
    );
  };

  return (
    <div className="space-y-8">
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
          <DistrictSelector onSelect={setDistrict} />
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg border border-blue-200/60">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h2 className="font-bold text-lg text-slate-800">{t("quickActions")}</h2>
          </div>
          
          <button 
            onClick={handleAutoDetect} 
            className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
              <span>{t("autoDetect")}</span>
            </span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          
          {autoDetectMsg && (
            <div className="mt-4 p-3 bg-white/60 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700 flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span>{autoDetectMsg}</span>
              </p>
            </div>
          )}
          
          {autoDetected?.state && (
            <div className="mt-3 px-3 py-2 bg-blue-100/80 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-medium">
                {t("detectedLabel")} <span className="font-semibold">{autoDetected.state}{autoDetected.district ? ", " + autoDetected.district : ""}</span>
              </p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-white/50 rounded-xl border border-slate-200/60">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{t("tipLocation")}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        {district ? (
          <Dashboard state="Bihar" district={district} />
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/60 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t("selectDistrictPrompt")}</h3>
            <p className="text-slate-500 text-sm">Choose a district from the selector above to view detailed analytics</p>
          </div>
        )}
      </section>
    </div>
  );
}