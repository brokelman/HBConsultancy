import React, { useState } from 'react';
import {
  Module2Output,
  ProcessStep,
  extractSwimlanesForProcess,
} from '../utils/boardroomLogic';
import { CockpitMode } from './TenSecondBar';
import {
  AlertTriangle,
  Lock,
  Zap,
  ArrowRight,
  UserCheck,
  Clock,
  CheckCircle,
  TrendingUp,
  GitCommit,
  Diamond,
  Square,
} from 'lucide-react';

interface Tab3ProcessProps {
  data: Module2Output;
  mode: CockpitMode;
  onUpdateData: (updated: Module2Output) => void;
  onProceedToModule3: () => void;
  isLoadingNext: boolean;
}

export const Tab3Process: React.FC<Tab3ProcessProps> = ({
  data,
  mode,
  onUpdateData,
  onProceedToModule3,
  isLoadingNext,
}) => {
  const [selectedProcessIdx, setSelectedProcessIdx] = useState(0);
  const [selectedStepNumber, setSelectedStepNumber] = useState(1);

  const processes = data.e2e_processes || [];
  const activeProcess = processes[selectedProcessIdx] || processes[0];

  if (!activeProcess) {
    return null;
  }

  const swimlanes = extractSwimlanesForProcess(activeProcess);
  const activeStep: ProcessStep =
    activeProcess.steps.find((s) => s.step_number === selectedStepNumber) ||
    activeProcess.steps[0];

  const handleSelectProcess = (idx: number) => {
    setSelectedProcessIdx(idx);
    const firstStep = processes[idx]?.steps?.[0]?.step_number ?? 1;
    setSelectedStepNumber(firstStep);
  };

  const handleStepEdit = (
    stepNum: number,
    field: 'money_leak_risk' | 'hard_control_rule' | 'ai_quick_win',
    value: string
  ) => {
    const updatedProcesses = processes.map((proc, pIdx) => {
      if (pIdx !== selectedProcessIdx) return proc;
      return {
        ...proc,
        steps: proc.steps.map((st) =>
          st.step_number === stepNum ? { ...st, [field]: value } : st
        ),
      };
    });
    onUpdateData({
      ...data,
      e2e_processes: updatedProcesses,
    });
  };

  return (
    <div className="space-y-6">
      {/* Proces-Keuzeknoppen + 3 Grote Process Health Tellers */}
      <section aria-label="End-to-End Waardeketens en Proces Health">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div
            role="tablist"
            aria-label="Kies End-to-End Waardeketen"
            className="flex flex-wrap items-center gap-2"
          >
            {processes.map((proc, idx) => {
              const isSelected = idx === selectedProcessIdx;
              return (
                <button
                  key={proc.process_id || idx}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelectProcess(idx)}
                  className={`rounded-lg px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : 'border border-slate-800 bg-[#0F1624] text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {proc.process_name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-[#0F1624] px-3.5 py-2 text-xs">
            <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Proceseigenaar:</span>
            <span className="font-bold text-emerald-300">
              {activeProcess.process_owner_role}
            </span>
          </div>
        </div>

        {/* 3 Grote Process Health Tellers */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Doorlooptijd Norm (Lead Time)</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-1.5 font-mono text-xl font-bold text-white tabular-nums">
              {activeProcess.health_kpis.lead_time}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {activeProcess.why_it_matters_one_liner}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>First-Time-Right Norm</span>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-1.5 font-mono text-xl font-bold text-emerald-400 tabular-nums">
              {activeProcess.health_kpis.first_time_right}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Geen onvolledige dossiers over de afdelingsschutting
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Hard Marge-Doel Keten</span>
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-1.5 font-mono text-xl font-bold text-amber-400 tabular-nums">
              {activeProcess.health_kpis.margin_target}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Bewaakt via automatische systeem-sloten in het proces
            </p>
          </div>
        </div>
      </section>

      {/* VISUEEL SWIMLANE DIAGRAM (Horizontale banen per afdeling) */}
      <section
        aria-label="Visueel BPMN Swimlane Diagram"
        className="rounded-xl border border-slate-800 bg-[#0F1624] p-5"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white">
              Visueel Swimlane Diagram · Klik op een stap of beslisruit voor het Marge-Slot
            </h2>
            <p className="text-xs text-slate-400">
              Horizontale afdelingsbanen · Gele ruit = Harde Beslispoort (Gateway) · Groen slot = Control
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Square className="h-3.5 w-3.5 text-sky-400" />
              Proces-Taak
            </span>
            <span className="flex items-center gap-1.5">
              <Diamond className="h-3.5 w-3.5 text-amber-400" />
              Beslisruit (Gateway)
            </span>
            <span className="flex items-center gap-1.5">
              <GitCommit className="h-3.5 w-3.5 text-emerald-400" />
              Start / Eind Event
            </span>
          </div>
        </div>

        {/* Swimlane Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[820px] space-y-2">
            {swimlanes.map((lane) => (
              <div
                key={lane}
                className="grid grid-cols-12 items-center rounded-lg border border-slate-800/90 bg-[#090D16] p-2.5"
              >
                {/* Swimlane Header Left (2 cols) */}
                <div className="col-span-2 pr-3 border-r border-slate-800">
                  <span className="text-xs font-bold text-slate-200 block truncate">
                    {lane}
                  </span>
                  <span className="text-[11px] text-slate-400">Swimlane</span>
                </div>

                {/* Steps columns (10 cols divided across steps) */}
                <div
                  className="col-span-10 grid gap-2 pl-3"
                  style={{
                    gridTemplateColumns: `repeat(${activeProcess.steps.length}, minmax(120px, 1fr))`,
                  }}
                >
                  {activeProcess.steps.map((step) => {
                    const belongsToLane =
                      (step.department_swimlane.trim() || 'Algemeen') === lane;
                    const isSelected =
                      step.step_number === activeStep.step_number;

                    if (!belongsToLane) {
                      return (
                        <div
                          key={step.step_number}
                          className="h-20 rounded border border-dashed border-slate-800/40 flex items-center justify-center"
                        >
                          <span className="font-mono text-[10px] text-slate-700">
                            Stap {step.step_number} ↓
                          </span>
                        </div>
                      );
                    }

                    const isGateway = step.bpmn_type === 'Exclusive_Gateway';
                    const isEvent = step.bpmn_type === 'Event';

                    return (
                      <button
                        key={step.step_number}
                        type="button"
                        data-testid={`bpmn-step-${step.step_number}`}
                        onClick={() => setSelectedStepNumber(step.step_number)}
                        className={`group relative flex h-20 flex-col justify-between rounded-lg p-2.5 text-left transition-all cursor-pointer ${
                          isGateway
                            ? isSelected
                              ? 'border-2 border-amber-400 bg-amber-500/20'
                              : 'border border-amber-500/50 bg-amber-950/25 hover:border-amber-400'
                            : isEvent
                            ? isSelected
                              ? 'border-2 border-emerald-400 bg-emerald-500/20'
                              : 'border border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400'
                            : isSelected
                            ? 'border-2 border-sky-400 bg-sky-500/20'
                            : 'border border-slate-700 bg-[#0F1624] hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 w-full">
                          <span className="font-mono text-[11px] font-bold text-slate-300 tabular-nums">
                            #{step.step_number}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase ${
                              isGateway
                                ? 'text-amber-300'
                                : isEvent
                                ? 'text-emerald-300'
                                : 'text-sky-300'
                            }`}
                          >
                            {isGateway
                              ? '◆ Beslisruit'
                              : isEvent
                              ? '● Event'
                              : 'Taak'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white line-clamp-2 leading-tight">
                          {step.short_title}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIEVE PROCES-KAART (Opent bij klik op een stap) */}
      <section
        aria-label="Geselecteerde Proces-Kaart Details"
        data-testid="active-process-card"
        className="rounded-xl border border-slate-700 bg-[#0F1624] p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase">
              <span>
                Stap #{activeStep.step_number} · Afdeling {activeStep.department_swimlane}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {activeStep.bpmn_type === 'Exclusive_Gateway'
                  ? 'Beslisruit (Exclusive Gateway)'
                  : activeStep.bpmn_type === 'Event'
                  ? 'Start / Eind Event'
                  : 'Proces-Taak'}
              </span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-white">
              {activeStep.short_title}
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Overdrachtsregel: {activeStep.handoff_rule_1_sentence}
            </p>
          </div>

          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-2 text-xs font-bold text-emerald-300">
            Control-Type: {activeStep.control_type}
          </div>
        </div>

        {/* De 3 Gevraagde Iconen: Rode Waarschuwing, Groen Slot, Paarse Bliksem */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* 1. Rode Waarschuwing: Wat gaat hier mis? */}
          <div className="rounded-xl border border-red-500/30 bg-[#090D16] p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>1. Wat gaat hier mis? (Geldlek)</span>
            </div>
            {mode === 'consultant' ? (
              <textarea
                rows={3}
                aria-label="Bewerk geldlek risico"
                value={activeStep.money_leak_risk}
                onChange={(e) =>
                  handleStepEdit(
                    activeStep.step_number,
                    'money_leak_risk',
                    e.target.value
                  )
                }
                className="mt-3 w-full rounded border border-slate-700 bg-[#0F1624] p-2.5 text-xs text-white"
              />
            ) : (
              <p className="mt-3 text-sm font-medium text-slate-100 leading-relaxed">
                {activeStep.money_leak_risk}
              </p>
            )}
          </div>

          {/* 2. Groen Slot-icoon: De keiharde Spelregel/Control */}
          <div className="rounded-xl border border-emerald-500/30 bg-[#090D16] p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
              <Lock className="h-4 w-4 shrink-0" />
              <span>2. Keiharde Spelregel (Marge-Slot)</span>
            </div>
            {mode === 'consultant' ? (
              <textarea
                rows={3}
                aria-label="Bewerk harde spelregel"
                value={activeStep.hard_control_rule}
                onChange={(e) =>
                  handleStepEdit(
                    activeStep.step_number,
                    'hard_control_rule',
                    e.target.value
                  )
                }
                className="mt-3 w-full rounded border border-slate-700 bg-[#0F1624] p-2.5 text-xs text-white"
              />
            ) : (
              <p className="mt-3 text-sm font-medium text-slate-100 leading-relaxed">
                {activeStep.hard_control_rule}
              </p>
            )}
          </div>

          {/* 3. Paarse Bliksem: Hoe AI/Automatisering dit overneemt */}
          <div className="rounded-xl border border-purple-500/30 bg-[#090D16] p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase">
              <Zap className="h-4 w-4 shrink-0" />
              <span>3. AI &amp; Automatisering Quick-Win</span>
            </div>
            {mode === 'consultant' ? (
              <textarea
                rows={3}
                aria-label="Bewerk AI quick win"
                value={activeStep.ai_quick_win}
                onChange={(e) =>
                  handleStepEdit(
                    activeStep.step_number,
                    'ai_quick_win',
                    e.target.value
                  )
                }
                className="mt-3 w-full rounded border border-slate-700 bg-[#0F1624] p-2.5 text-xs text-white"
              />
            ) : (
              <p className="mt-3 text-sm font-medium text-slate-100 leading-relaxed">
                {activeStep.ai_quick_win}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Consultant Diepte-Modus: Volledige Risk & Control Matrix */}
      {mode === 'consultant' && (
        <section
          aria-label="Volledige Risk en Control Matrix"
          className="rounded-xl border border-slate-800 bg-[#0F1624] p-5"
        >
          <h3 className="text-sm font-bold text-emerald-400 uppercase">
            Consultant Diepte-Tabel · Volledige Risk &amp; Control Matrix ({activeProcess.process_name})
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 pr-3">Stap</th>
                  <th className="py-2.5 px-3">Afdeling</th>
                  <th className="py-2.5 px-3">Geldlek Risico</th>
                  <th className="py-2.5 px-3">Marge-Slot / Control</th>
                  <th className="py-2.5 px-3">Type Control</th>
                  <th className="py-2.5 pl-3">AI Quick-Win</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {activeProcess.steps.map((st) => (
                  <tr
                    key={st.step_number}
                    onClick={() => setSelectedStepNumber(st.step_number)}
                    className="hover:bg-slate-900/60 cursor-pointer"
                  >
                    <td className="py-3 pr-3 font-mono font-bold text-white tabular-nums">
                      #{st.step_number} {st.short_title}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {st.department_swimlane}
                    </td>
                    <td className="py-3 px-3 text-red-300">{st.money_leak_risk}</td>
                    <td className="py-3 px-3 text-emerald-300">
                      {st.hard_control_rule}
                    </td>
                    <td className="py-3 px-3 font-mono text-amber-300">
                      {st.control_type}
                    </td>
                    <td className="py-3 pl-3 text-purple-300">{st.ai_quick_win}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Actieknop naar Module 3 */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onProceedToModule3}
          disabled={isLoadingNext}
          className="flex items-center justify-center rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <span>
            {isLoadingNext
              ? 'Bezig met DGA-Vrijheidskalender & Stoplicht-Regie...'
              : 'Zet de Vergader- & Vrijheidskalender klaar (Module 3) →'}
          </span>
        </button>
      </div>
    </div>
  );
};
