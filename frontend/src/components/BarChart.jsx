import React from "react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function BarChart({ data = [], height = 200, padding = 32, xLabel = "", yLabel = "" }) {
  const width = 600;
  const values = data.map((d) => Number(d.value) || 0);
  const labels = data.map((d) => d.label);
  const max = Math.max(1, ...values);
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const barW = values.length > 0 ? innerW / values.length : innerW;
  const x = (i) => padding + i * barW + barW * 0.1;
  const barInnerW = barW * 0.7;
  const barH = (v) => ((v) / max) * innerH;

  const yBase = height - padding;

  const xTicks = [0, values.length - 1].filter((i) => i >= 0);
  const { tryT } = useLanguage();

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" className="w-full h-48 md:h-56 lg:mt-24">
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
        const y = padding + innerH * (1 - ratio);
        return (
          <line
            key={index}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#f1f5f9"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        );
      })}

      {/* axes */}
      <line x1={padding} y1={padding} x2={padding} y2={yBase} stroke="#e2e8f0" strokeWidth="1.5" />
      <line x1={padding} y1={yBase} x2={width - padding} y2={yBase} stroke="#e2e8f0" strokeWidth="1.5" />

      {/* y-axis ticks */}
      {[0, max].map((value, index) => {
        const y = index === 0 ? yBase : padding;
        return (
          <g key={index}>
            <line
              x1={padding - 4}
              y1={y}
              x2={padding}
              y2={y}
              stroke="#64748b"
              strokeWidth="1"
            />
            <text
              x={padding - 8}
              y={y + (index === 0 ? 3 : -3)}
              textAnchor="end"
              fontSize="11"
              fill="#64748b"
              fontWeight="500"
            >
              {value}
            </text>
          </g>
        );
      })}

      {/* x labels (first/last) */}
      {xTicks.map((i) => {
        const raw = labels[i];
        const translated = tryT(`months.${raw}`, raw);
        return (
          <g key={i}>
            <line
              x1={x(i) + barInnerW / 2}
              y1={yBase}
              x2={x(i) + barInnerW / 2}
              y2={yBase + 4}
              stroke="#64748b"
              strokeWidth="1"
            />
            <text
              x={x(i) + barInnerW / 2}
              y={yBase + 16}
              textAnchor={i === 0 ? "start" : i === values.length - 1 ? "end" : "middle"}
              fontSize="11"
              fill="#475569"
              fontWeight="500"
            >
              {translated}
            </text>
          </g>
        );
      })}

      {/* Additional middle label if enough data points */}
      {values.length > 2 && (
        <text
          x={x(Math.floor(values.length / 2)) + barInnerW / 2}
          y={yBase + 16}
          textAnchor="middle"
          fontSize="11"
          fill="#475569"
          fontWeight="500"
        >
          {tryT(`months.${labels[Math.floor(values.length / 2)]}`, labels[Math.floor(values.length / 2)])}
        </text>
      )}

      {/* axis titles */}
      {xLabel ? (
        <text
          x={width / 2}
          y={height - 8}
          textAnchor="middle"
          fontSize="12"
          fill="#64748b"
          fontWeight="600"
        >
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text
          x={16}
          y={height / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#64748b"
          fontWeight="600"
          transform={`rotate(-90 16 ${height / 2})`}
        >
          {yLabel}
        </text>
      ) : null}

  {/* bars with hover effects */}
      {values.map((v, i) => {
        const h = barH(v);
        return (
          <g key={i} className="group cursor-pointer">
            <rect
              x={x(i)}
              y={yBase - h}
              width={barInnerW}
              height={h}
              fill="url(#barGradient)"
              rx="2"
              className="transition-all duration-300 group-hover:fill-[url(#barHoverGradient)] group-hover:filter group-hover:brightness-110"
            />
            {/* Hover tooltip */}
            <rect
              x={x(i)}
              y={padding}
              width={barInnerW}
              height={innerH}
              fill="transparent"
              className="group-hover:fill-blue-50/30 transition-colors duration-200"
            />
            <text
              x={x(i) + barInnerW / 2}
              y={yBase - h - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#1e40af"
              fontWeight="600"
              opacity="0"
              className="group-hover:opacity-100 transition-opacity duration-200"
            >
              {v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}