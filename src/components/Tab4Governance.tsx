import React, { useState } from 'react';
import { Module3Output } from '../utils/boardroomLogic';
import { CockpitMode } from './TenSecondBar';
import {
  XOctagon,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Clock,
  Users,
  AlertOctagon,
  Printer,
} from 'lucide-react';

interface Tab4GovernanceProps {
  data: Module3Output;
  mode: CockpitMode;
  onUpdateData: (updated: Module3Output) => void;
  onOpenOnePager: () => void;
}

export const Tab4Governance: React.FC<Tab4GovernanceProps> = ({
  data,
  mode,
  onUpdateData,
  onOpenOnePager,
}) => {
  const { dga_freedom_plan, meeting_rhythm, traffic_light_escalation } = data;
  // Interactive traffic light status per row ('red' | 'green')
  const [rowStatus, setRowStatus] = useState<Record<number, 'red' | 'green'>>({
    0: 'red',
    1: 'green',
    2: 'red',
    3: 'green',
  });

  const toggleRowStatus = (idx: number) => {
    setRowStatus((prev) => ({
      ...prev,
      [idx]: prev[idx] === 'red' ? 'green' : 'red',
    }));
  };

  const handleEscalationEdit = (
    idx: number,
    field:
      | 'red_flag_trigger'
      | 'who_fixes_it'
      | 'action_within_48h'
      | 'when_dga_steps_in',
    value: string
  ) => {
    const updated = traffic_light_escalation.map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    );
    onUpdateData({
      ...data,
      traffic_light_escalation: updated,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. DGA BEVRIJDINGS-CONTRACT */}
      <section aria-label="DGA Bevrijdings-Contract" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white">
            01. Het DGA Bevrijdings-Contract
          </h2>
          <span className="text-xs text-slate-400">
            Waar de directeur vandaag zijn handen vanaf trekt vs. de enige 3 stuurknoppen
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Links in Rood: Vandaag Loslaten */}
          <div className="rounded-xl border border-red-500/35 bg-[#0F1624] p-5">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase">
                <XOctagon className="h-4 w-4 shrink-0" />
                Vandaag Loslaten (Verboden voor DGA)
              </span>
              <span className="font-mono text-xs font-semibold text-red-300">
                Direct overdragen aan MT
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {dga_freedom_plan.stop_doing_today.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-lg bg-[#090D16] p-3 text-xs text-slate-100"
                >
                  <span className="font-mono font-bold text-red-400 shrink-0">
                    ✕
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechts in Groen: Jouw enige 3 Stuurknoppen */}
          <div className="rounded-xl border border-emerald-500/35 bg-[#0F1624] p-5">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Jouw Enige 3 Stuurknoppen (100% DGA-Focus)
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-300">
                Waardecreatie &amp; Regie
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {dga_freedom_plan.only_focus_on.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-lg bg-[#090D16] p-3 text-xs text-slate-100"
                >
                  <span className="font-mono font-bold text-emerald-400 tabular-nums shrink-0">
                    0{idx + 1}.
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gouden Balk met de Mandaatregel */}
        <div
          data-testid="golden-mandate-banner"
          className="rounded-xl border border-amber-400/50 bg-amber-500/10 p-5"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>De Gouden Mandaatregel voor het MT</span>
          </div>
          {mode === 'consultant' ? (
            <input
              type="text"
              aria-label="Bewerk Gouden Mandaatregel"
              value={dga_freedom_plan.golden_mandate_rule}
              onChange={(e) =>
                onUpdateData({
                  ...data,
                  dga_freedom_plan: {
                    ...dga_freedom_plan,
                    golden_mandate_rule: e.target.value,
                  },
                })
              }
              className="mt-2 w-full rounded border border-amber-500/40 bg-[#090D16] px-3 py-2 text-sm font-bold text-amber-200"
            />
          ) : (
            <p className="mt-1.5 text-base font-bold text-amber-100 leading-snug">
              {dga_freedom_plan.golden_mandate_rule}
            </p>
          )}
        </div>
      </section>

      {/* 2. DE 3 VERGADER-KAARTEN NAAST ELKAAR ALS VISUELE TIJDLIJNEN */}
      <section aria-label="Besturingsritme en 3 Vergader-Kaarten" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white">
            02. De 3 Vergader-Kaarten (Visuele Tijdlijnen op de Minuut Af)
          </h2>
          <span className="text-xs text-slate-400">
            Geen praatclubjes: elk agendablok eindigt met een verplicht besluit
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {meeting_rhythm.map((meeting, mIdx) => (
            <div
              key={mIdx}
              data-testid={`meeting-card-${mIdx}`}
              className="rounded-xl border border-slate-800 bg-[#0F1624] p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {meeting.tier_badge}
                  </span>
                  <span className="text-xs text-slate-400">
                    Voorzitter: <strong className="text-slate-200">{meeting.chair_role}</strong>
                  </span>
                </div>

                <h3 className="mt-2 text-base font-bold text-white">
                  {meeting.meeting_title}
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="truncate">
                    {meeting.participants.join(' · ')}
                  </span>
                </div>

                {/* KPI's op het Scherm */}
                <div className="mt-3 rounded-lg bg-[#090D16] p-3">
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase">
                    Live KPI&apos;s op het Scherm
                  </span>
                  <ul className="mt-1.5 space-y-1">
                    {meeting.dashboard_kpis_on_screen.map((kpi, kIdx) => (
                      <li key={kIdx} className="text-xs text-slate-300">
                        · {kpi}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visuele Tijdlijn per Minuut */}
                <div className="mt-4 space-y-2.5">
                  {meeting.agenda_blocks.map((block, bIdx) => (
                    <div
                      key={bIdx}
                      className="rounded-lg border border-slate-800/90 bg-[#090D16] p-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 font-mono font-bold text-amber-400 tabular-nums">
                          <Clock className="h-3 w-3" />
                          {block.minutes}
                        </span>
                        <span className="font-semibold text-white">
                          {block.topic}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-300 leading-snug">
                        <strong className="text-emerald-400">Verplicht besluit:</strong>{' '}
                        {block.forced_decision}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MANAGEMENT BY EXCEPTION STOPLICHT-TABEL */}
      <section
        aria-label="Management by Exception Stoplicht-Tabel"
        className="rounded-xl border border-slate-800 bg-[#0F1624] p-5"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              03. &ldquo;Management by Exception&rdquo; Stoplicht-Tabel
            </h2>
            <p className="text-xs text-slate-400">
              Zolang het groen is doet de DGA niets · Kleurt een rij rood, dan lost de eigenaar het binnen 48 uur op
            </p>
          </div>
          <span className="text-xs text-amber-300">
            Klik op een stoplicht-status om Rood Alarm / Groen Normaal te simuleren
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-3 pr-3">Stoplicht</th>
                <th className="py-3 px-3">Rode Vlag Trigger (Afwijking)</th>
                <th className="py-3 px-3">Wie lost het op?</th>
                <th className="py-3 px-3">Verplichte Actie binnen 48 Uur</th>
                <th className="py-3 pl-3">Wanneer stapt DGA pas in?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {traffic_light_escalation.map((row, idx) => {
                const status = rowStatus[idx] ?? 'red';
                const isRed = status === 'red';

                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isRed ? 'bg-red-950/15' : 'bg-emerald-950/10'
                    }`}
                  >
                    <td className="py-3.5 pr-3">
                      <button
                        type="button"
                        onClick={() => toggleRowStatus(idx)}
                        aria-label={`Wissel stoplicht status rij ${idx + 1}`}
                        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs font-bold whitespace-nowrap cursor-pointer ${
                          isRed
                            ? 'border border-red-500/40 bg-red-500/20 text-red-300'
                            : 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        <AlertOctagon className="h-3.5 w-3.5 shrink-0" />
                        {isRed ? 'ROOD · ACTIE' : 'GROEN · RUST'}
                      </button>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-white">
                      {mode === 'consultant' ? (
                        <input
                          type="text"
                          value={row.red_flag_trigger}
                          onChange={(e) =>
                            handleEscalationEdit(
                              idx,
                              'red_flag_trigger',
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-slate-700 bg-[#090D16] px-2 py-1 text-xs text-white"
                        />
                      ) : (
                        row.red_flag_trigger
                      )}
                    </td>

                    <td className="py-3.5 px-3 font-medium text-amber-300">
                      {mode === 'consultant' ? (
                        <input
                          type="text"
                          value={row.who_fixes_it}
                          onChange={(e) =>
                            handleEscalationEdit(idx, 'who_fixes_it', e.target.value)
                          }
                          className="w-full rounded border border-slate-700 bg-[#090D16] px-2 py-1 text-xs text-amber-300"
                        />
                      ) : (
                        row.who_fixes_it
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-slate-200">
                      {mode === 'consultant' ? (
                        <input
                          type="text"
                          value={row.action_within_48h}
                          onChange={(e) =>
                            handleEscalationEdit(
                              idx,
                              'action_within_48h',
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-slate-700 bg-[#090D16] px-2 py-1 text-xs text-slate-200"
                        />
                      ) : isRed ? (
                        row.action_within_48h
                      ) : (
                        <span className="text-emerald-400">
                          Binnen norm — Geen actie nodig (DGA niet storen).
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 pl-3 text-slate-300">
                      {mode === 'consultant' ? (
                        <input
                          type="text"
                          value={row.when_dga_steps_in}
                          onChange={(e) =>
                            handleEscalationEdit(
                              idx,
                              'when_dga_steps_in',
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-slate-700 bg-[#090D16] px-2 py-1 text-xs text-slate-300"
                        />
                      ) : (
                        row.when_dga_steps_in
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom CTA: Genereer 1-Pagina Directie Samenvatting */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onOpenOnePager}
          className="flex items-center gap-2.5 rounded-lg bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-colors cursor-pointer"
        >
          <Printer className="h-4 w-4" />
          <span>Open 1-Pagina Directie Samenvatting (Print / Export)</span>
        </button>
      </div>
    </div>
  );
};
