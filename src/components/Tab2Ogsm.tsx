import React from 'react';
import {
  Module1Output,
  calculateTotalMarginLeak,
} from '../utils/boardroomLogic';
import { CockpitMode } from './TenSecondBar';
import {
  AlertTriangle,
  CheckCircle2,
  XOctagon,
  Gauge,
  Target,
  ArrowRight,
  UserX,
  Compass,
} from 'lucide-react';

interface Tab2OgsmProps {
  data: Module1Output;
  mode: CockpitMode;
  onUpdateData: (updated: Module1Output) => void;
  onProceedToModule2: () => void;
  isLoadingNext: boolean;
}

export const Tab2Ogsm: React.FC<Tab2OgsmProps> = ({
  data,
  mode,
  onUpdateData,
  onProceedToModule2,
  isLoadingNext,
}) => {
  const { red_flag_diagnosis, ogsm } = data;

  const handleLeakChange = (
    idx: number,
    field: 'leak_title' | 'estimated_euro_loss' | 'root_cause_one_liner',
    value: string
  ) => {
    const updatedLeaks = red_flag_diagnosis.margin_leaks.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    const recalculatedTotal =
      field === 'estimated_euro_loss'
        ? calculateTotalMarginLeak(updatedLeaks)
        : data.total_estimated_euro_leak_per_year;

    onUpdateData({
      ...data,
      total_estimated_euro_leak_per_year: recalculatedTotal,
      red_flag_diagnosis: {
        ...red_flag_diagnosis,
        margin_leaks: updatedLeaks,
      },
    });
  };

  const handlePillarChange = (
    idx: number,
    field: 'strategy_title' | 'radical_focus_do' | 'stop_doing_immediately',
    value: string
  ) => {
    const updatedPillars = ogsm.strategic_pillars.map((pillar, i) =>
      i === idx ? { ...pillar, [field]: value } : pillar
    );
    onUpdateData({
      ...data,
      ogsm: {
        ...ogsm,
        strategic_pillars: updatedPillars,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* SECTIE 1: DGA Blokkade + 3 Rode Vlag-Kaarten (Bento Grid) */}
      <section aria-label="Rode Vlaggen en Euro-Lekken">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            01. Rode Vlaggen &amp; Directe Margelekken
          </h2>
          <span className="text-xs text-slate-400">
            Waarom de nettowinst weglekt · Waarom de DGA zelf het knelpunt is
          </span>
        </div>

        {/* Founder Bottleneck Banner Card */}
        <div className="mb-4 grid grid-cols-1 gap-4 rounded-xl border border-amber-500/40 bg-[#0F1624] p-5 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase">
              <UserX className="h-4 w-4 shrink-0" />
              <span>DGA Blokkade-Diagnose</span>
            </div>
            <h3 className="mt-1.5 text-xl font-bold text-white">
              {red_flag_diagnosis.founder_bottleneck_headline}
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              {red_flag_diagnosis.founder_bottleneck_impact}
            </p>
          </div>

          <div className="rounded-lg border border-red-500/30 bg-[#090D16] p-4 lg:col-span-7">
            <span className="text-xs font-semibold text-red-400 uppercase">
              Ongemakkelijke Waarheid voor de Directie
            </span>
            <p className="mt-1 text-sm font-medium text-slate-100 leading-snug">
              &ldquo;{red_flag_diagnosis.uncomfortable_truth}&rdquo;
            </p>
          </div>
        </div>

        {/* 3 Rode Vlag-kaarten met grote rode Euro-cijfers */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {red_flag_diagnosis.margin_leaks.map((leak, idx) => (
            <div
              key={idx}
              data-testid={`margin-leak-card-${idx}`}
              className="rounded-xl border border-red-500/30 bg-[#0F1624] p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Geldlek 0{idx + 1}
                  </span>
                  <span className="font-mono text-xl font-bold text-red-400 tabular-nums">
                    {leak.estimated_euro_loss}
                  </span>
                </div>

                {mode === 'consultant' ? (
                  <div className="mt-3 space-y-2">
                    <label className="block text-xs text-slate-400">
                      Titel Margelek
                      <input
                        type="text"
                        value={leak.leak_title}
                        onChange={(e) =>
                          handleLeakChange(idx, 'leak_title', e.target.value)
                        }
                        className="mt-1 w-full rounded border border-slate-700 bg-[#090D16] px-2.5 py-1.5 text-xs font-semibold text-white"
                      />
                    </label>
                    <label className="block text-xs text-slate-400">
                      Geschat Verlies (€ / jaar)
                      <input
                        type="text"
                        value={leak.estimated_euro_loss}
                        onChange={(e) =>
                          handleLeakChange(
                            idx,
                            'estimated_euro_loss',
                            e.target.value
                          )
                        }
                        className="mt-1 w-full rounded border border-slate-700 bg-[#090D16] px-2.5 py-1.5 font-mono text-xs font-bold text-red-400 tabular-nums"
                      />
                    </label>
                    <label className="block text-xs text-slate-400">
                      Kernoorzaak (1 zin)
                      <textarea
                        rows={2}
                        value={leak.root_cause_one_liner}
                        onChange={(e) =>
                          handleLeakChange(
                            idx,
                            'root_cause_one_liner',
                            e.target.value
                          )
                        }
                        className="mt-1 w-full rounded border border-slate-700 bg-[#090D16] px-2.5 py-1.5 text-xs text-slate-200"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <h3 className="mt-3 text-base font-bold text-white leading-snug">
                      {leak.leak_title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                      {leak.root_cause_one_liner}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTIE 2: 1-Pagina Visuele OGSM */}
      <section aria-label="1-Pagina Visuele OGSM" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-white">
            02. De 1-Pagina Visuele OGSM (Radicale Keuzes)
          </h2>
          <span className="text-xs text-slate-400">
            Wat we vanaf morgen DOEN vs. waar we DIRECT MEE STOPPEN
          </span>
        </div>

        {/* Objective + 4 Harde Goals Strip */}
        <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase">
            <Compass className="h-4 w-4 shrink-0" />
            <span>Ambitie (Objective)</span>
          </div>
          {mode === 'consultant' ? (
            <input
              type="text"
              aria-label="Bewerk Ambitie (Objective)"
              value={ogsm.objective_one_liner}
              onChange={(e) =>
                onUpdateData({
                  ...data,
                  ogsm: { ...ogsm, objective_one_liner: e.target.value },
                })
              }
              className="mt-2 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 text-base font-bold text-white"
            />
          ) : (
            <p className="mt-1.5 text-lg font-bold text-white leading-snug">
              {ogsm.objective_one_liner}
            </p>
          )}

          {/* Goals Bento Strip */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ogsm.goals.map((goal, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-800 bg-[#090D16] p-3.5"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-300">{goal.metric_name}</span>
                  <span className="font-mono text-amber-400 tabular-nums">
                    {goal.deadline}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2 font-mono tabular-nums">
                  <span className="text-xs text-red-400 line-through">
                    {goal.current_value}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-base font-bold text-emerald-400">
                    {goal.target_value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Strategische Pijlers (DOEN vs DIRECT STOPPEN + Leading & Lagging KPI) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {ogsm.strategic_pillars.map((pillar, idx) => (
            <div
              key={pillar.strategy_id || idx}
              data-testid={`ogsm-pillar-${idx}`}
              className="rounded-xl border border-slate-800 bg-[#0F1624] p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    Strategische Pijler {pillar.strategy_id}
                  </span>
                  {mode === 'consultant' ? (
                    <input
                      type="text"
                      aria-label={`Strategie titel ${idx + 1}`}
                      value={pillar.strategy_title}
                      onChange={(e) =>
                        handlePillarChange(idx, 'strategy_title', e.target.value)
                      }
                      className="mt-1 w-full rounded border border-slate-700 bg-[#090D16] px-2.5 py-1.5 text-sm font-bold text-white"
                    />
                  ) : (
                    <h3 className="mt-1 text-base font-bold text-white leading-snug">
                      {pillar.strategy_title}
                    </h3>
                  )}
                </div>

                {/* GROEN: DOEN */}
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>DOEN (Radicale Focus)</span>
                  </div>
                  {mode === 'consultant' ? (
                    <textarea
                      rows={2}
                      aria-label={`Doen keuze pijler ${idx + 1}`}
                      value={pillar.radical_focus_do}
                      onChange={(e) =>
                        handlePillarChange(idx, 'radical_focus_do', e.target.value)
                      }
                      className="mt-1.5 w-full rounded border border-slate-700 bg-[#090D16] p-2 text-xs text-slate-100"
                    />
                  ) : (
                    <p className="mt-1.5 text-xs font-medium text-slate-100 leading-relaxed">
                      {pillar.radical_focus_do}
                    </p>
                  )}
                </div>

                {/* ROOD: DIRECT STOPPEN */}
                <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase">
                    <XOctagon className="h-4 w-4 shrink-0" />
                    <span>DIRECT STOPPEN</span>
                  </div>
                  {mode === 'consultant' ? (
                    <textarea
                      rows={2}
                      aria-label={`Stoppen keuze pijler ${idx + 1}`}
                      value={pillar.stop_doing_immediately}
                      onChange={(e) =>
                        handlePillarChange(
                          idx,
                          'stop_doing_immediately',
                          e.target.value
                        )
                      }
                      className="mt-1.5 w-full rounded border border-slate-700 bg-[#090D16] p-2 text-xs text-slate-100"
                    />
                  ) : (
                    <p className="mt-1.5 text-xs font-medium text-slate-100 leading-relaxed">
                      {pillar.stop_doing_immediately}
                    </p>
                  )}
                </div>
              </div>

              {/* KPI Meters: Leading + Lagging + 90-Day Action */}
              <div className="space-y-2.5 border-t border-slate-800 pt-3.5">
                <div className="rounded-lg bg-[#090D16] p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-semibold text-amber-400">
                      <Gauge className="h-3.5 w-3.5" />
                      Voorspellende KPI (Leading)
                    </span>
                    <span className="text-slate-400">
                      {pillar.leading_kpi.owner_role}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    {pillar.leading_kpi.name}
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-white tabular-nums">
                    Doel: {pillar.leading_kpi.target}
                  </p>
                </div>

                <div className="rounded-lg bg-[#090D16] p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <Target className="h-3.5 w-3.5" />
                      Resultaat KPI (Lagging)
                    </span>
                    <span className="text-slate-400">
                      {pillar.lagging_kpi.owner_role}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">
                    {pillar.lagging_kpi.name}
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-emerald-400 tabular-nums">
                    Doel: {pillar.lagging_kpi.target}
                  </p>
                </div>

                <div className="rounded-lg border border-amber-500/20 bg-amber-950/15 p-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                    <span>Eerste 90-Dagen Actie</span>
                    <span>{pillar.top_90_day_action.owner_role}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-200">
                    {pillar.top_90_day_action.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Consultant Diepte-Modus Extra: Volledige OGSM Koppelmatrix */}
      {mode === 'consultant' && (
        <section
          aria-label="Consultant OGSM Detailmatrix"
          className="rounded-xl border border-slate-800 bg-[#0F1624] p-5"
        >
          <h3 className="text-sm font-bold text-emerald-400 uppercase">
            Consultant Diepte-Tabel · Volledige OGSM &amp; Verantwoordelijkheden Matrix
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 pr-4">Pijler</th>
                  <th className="py-2.5 px-4">Leading KPI (Stuurknop)</th>
                  <th className="py-2.5 px-4">Lagging KPI (Eindresultaat)</th>
                  <th className="py-2.5 px-4">90-Dagen Oplevering</th>
                  <th className="py-2.5 pl-4">Eigenaar (Niet DGA)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {ogsm.strategic_pillars.map((p) => (
                  <tr key={p.strategy_id} className="hover:bg-slate-900/50">
                    <td className="py-3 pr-4 font-semibold text-white">
                      {p.strategy_title}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-300 tabular-nums">
                      {p.leading_kpi.name} ({p.leading_kpi.target})
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-300 tabular-nums">
                      {p.lagging_kpi.name} ({p.lagging_kpi.target})
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {p.top_90_day_action.action}
                    </td>
                    <td className="py-3 pl-4 font-medium text-white">
                      {p.top_90_day_action.owner_role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Actieknop naar Module 2 */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onProceedToModule2}
          disabled={isLoadingNext}
          className="flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <span>
            {isLoadingNext
              ? 'Bezig met BPMN Procesketens & Marge-Sloten...'
              : 'Dicht deze Margelekken met Proces & Controls (Module 2) →'}
          </span>
        </button>
      </div>
    </div>
  );
};
