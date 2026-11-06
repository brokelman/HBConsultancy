import React from 'react';
import { ShieldAlert, Clock, TrendingUp, Sliders, Eye } from 'lucide-react';

export type CockpitMode = 'cockpit' | 'consultant';

interface TenSecondBarProps {
  bullets: string[];
  euroLeakPerYear: string;
  dgaHoursFreedPerWeek: string;
  mode: CockpitMode;
  onModeChange: (mode: CockpitMode) => void;
  companyName: string;
  activeModuleTitle: string;
}

export const TenSecondBar: React.FC<TenSecondBarProps> = ({
  bullets,
  euroLeakPerYear,
  dgaHoursFreedPerWeek,
  mode,
  onModeChange,
  companyName,
  activeModuleTitle,
}) => {
  return (
    <section
      aria-label="10-Seconden Directie Samenvattingsbalk"
      className="mb-6 rounded-xl border border-slate-800 bg-[#0F1624] p-5"
    >
      {/* Top Row: Context Title + Mode Switcher right-aligned */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
            10-Seconden Balk (TL;DR)
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span className="text-sm font-medium text-slate-300">
            {companyName || 'MKB Directie Diagnose'}
          </span>
          <span aria-hidden="true" className="text-slate-600">
            /
          </span>
          <span className="text-sm text-slate-400">{activeModuleTitle}</span>
        </div>

        {/* Modus-Schakelaar Rechtsboven */}
        <div
          role="group"
          aria-label="Weergavemodus schakelaar"
          className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#090D16] p-1"
        >
          <button
            type="button"
            onClick={() => onModeChange('cockpit')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              mode === 'cockpit'
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Directie Cockpit (10-Sec Overzicht)
          </button>
          <button
            type="button"
            onClick={() => onModeChange('consultant')}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              mode === 'consultant'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Consultant Diepte-Modus
          </button>
        </div>
      </div>

      {/* Main Content: 3 Hard Bullets Left + 2 Big Counters Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        <div className="space-y-2.5 lg:col-span-7">
          {bullets.slice(0, 3).map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="font-mono text-xs font-bold text-amber-400 tabular-nums mt-0.5 shrink-0">
                0{idx + 1}.
              </span>
              <p className="text-sm font-medium text-slate-100 leading-snug">{bullet}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5">
          {/* Counter 1: Geschat Margeherstel */}
          <div className="rounded-lg border border-emerald-500/30 bg-[#090D16] p-3.5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-slate-400">
              <span className="whitespace-nowrap">Geschat Margeherstel (€ / jaar)</span>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            </div>
            <div
              data-testid="counter-margin-recovery"
              className="mt-1 font-mono text-2xl font-bold tracking-tight text-emerald-400 tabular-nums"
            >
              {euroLeakPerYear}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Direct terug te winnen uit faalkosten &amp; margelekken
            </p>
          </div>

          {/* Counter 2: Vrijgespeelde DGA-tijd */}
          <div className="rounded-lg border border-amber-500/30 bg-[#090D16] p-3.5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-slate-400">
              <span className="whitespace-nowrap">Vrijgespeelde DGA-tijd (uur / week)</span>
              <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            </div>
            <div
              data-testid="counter-dga-hours"
              className="mt-1 font-mono text-2xl font-bold tracking-tight text-amber-400 tabular-nums"
            >
              {dgaHoursFreedPerWeek}
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Door systeem-sloten en MT-mandaat boven 32% marge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
