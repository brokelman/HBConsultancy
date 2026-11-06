import React from 'react';
import {
  IntakeData,
  Module1Output,
  Module2Output,
  Module3Output,
} from '../utils/boardroomLogic';
import { Printer, X, Download } from 'lucide-react';

interface OnePagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  intake: IntakeData;
  module1: Module1Output;
  module2: Module2Output;
  module3: Module3Output;
}

export const OnePagerModal: React.FC<OnePagerModalProps> = ({
  isOpen,
  onClose,
  intake,
  module1,
  module2,
  module3,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      intake,
      module1,
      module2,
      module3,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boardroom-os-${intake.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="1-Pagina Directie Samenvatting"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-y-auto"
    >
      <div className="relative my-8 w-full max-w-5xl rounded-xl border border-slate-700 bg-[#0F1624] p-6 text-slate-100 shadow-2xl">
        {/* Modal Action Bar (hidden on print) */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase">
              Boardroom OS · Directie One-Pager
            </span>
            <h2 className="text-xl font-bold text-white">
              1-Pagina Directie Samenvatting — {intake.companyName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              Download Dossier (JSON)
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Opslaan als PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Sluit 1-Pagina Samenvatting"
              className="rounded-lg border border-slate-700 bg-[#090D16] p-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Executive One-Pager Content */}
        <div className="space-y-5 text-xs">
          {/* Header Metrics */}
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-800 bg-[#090D16] p-4 sm:grid-cols-4">
            <div>
              <span className="text-slate-400 block">Bedrijf &amp; Omvang</span>
              <strong className="text-sm text-white">
                {intake.companyName} ({intake.fte} FTE)
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Geschat Margeherstel</span>
              <strong className="font-mono text-base text-emerald-400 tabular-nums">
                {module1.total_estimated_euro_leak_per_year}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">Vrijgespeelde DGA-Tijd</span>
              <strong className="font-mono text-base text-amber-400 tabular-nums">
                {module1.dga_hours_freed_per_week}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block">DGA Knelpunt</span>
              <strong className="text-red-400">
                {module1.red_flag_diagnosis.founder_bottleneck_headline}
              </strong>
            </div>
          </div>

          {/* Row 1: Top 3 Margelekken + 1-Pagina OGSM */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4">
              <h3 className="font-bold text-red-400 uppercase">
                1. De 3 Grootste Euro-Lekken
              </h3>
              <ul className="mt-2.5 space-y-2">
                {module1.red_flag_diagnosis.margin_leaks.map((leak, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2 border-b border-slate-800/70 pb-2">
                    <div>
                      <strong className="text-white block">{leak.leak_title}</strong>
                      <span className="text-slate-400">{leak.root_cause_one_liner}</span>
                    </div>
                    <span className="font-mono font-bold text-red-400 tabular-nums shrink-0">
                      {leak.estimated_euro_loss}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4">
              <h3 className="font-bold text-emerald-400 uppercase">
                2. 1-Pagina OGSM Kernkeuzes
              </h3>
              <p className="mt-1 font-semibold text-white">
                {module1.ogsm.objective_one_liner}
              </p>
              <ul className="mt-2.5 space-y-2">
                {module1.ogsm.strategic_pillars.map((p) => (
                  <li key={p.strategy_id} className="border-b border-slate-800/70 pb-2">
                    <strong className="text-amber-300 block">{p.strategy_title}</strong>
                    <span className="text-emerald-300 block">✓ DOEN: {p.radical_focus_do}</span>
                    <span className="text-red-300 block">✕ STOPPEN: {p.stop_doing_immediately}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 2: Proces-Sloten & DGA Bevrijdings-Contract */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4">
              <h3 className="font-bold text-sky-400 uppercase">
                3. End-to-End Waardeketens &amp; Marge-Sloten
              </h3>
              <ul className="mt-2.5 space-y-2">
                {module2.e2e_processes.map((proc) => (
                  <li key={proc.process_id} className="border-b border-slate-800/70 pb-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{proc.process_name}</strong>
                      <span className="font-mono text-emerald-400 tabular-nums">
                        {proc.health_kpis.margin_target}
                      </span>
                    </div>
                    <span className="text-slate-400 block">
                      Eigenaar: {proc.process_owner_role} · {proc.steps.length} BPMN-stappen
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#090D16] p-4">
              <h3 className="font-bold text-amber-400 uppercase">
                4. DGA Mandaat &amp; Stoplicht-Regie
              </h3>
              <p className="mt-1 font-semibold text-amber-200">
                {module3.dga_freedom_plan.golden_mandate_rule}
              </p>
              <div className="mt-2.5 space-y-1.5">
                {module3.traffic_light_escalation.slice(0, 3).map((esc, idx) => (
                  <div key={idx} className="border-b border-slate-800/70 pb-1.5">
                    <strong className="text-red-300 block">
                      Trigger: {esc.red_flag_trigger}
                    </strong>
                    <span className="text-slate-300">
                      {esc.who_fixes_it} → {esc.action_within_48h}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
