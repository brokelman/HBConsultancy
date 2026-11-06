import React, { useState } from 'react';
import {
  IntakeData,
  DEMO_CASE_JANSEN,
  validateIntakeInput,
  IntakeValidationResult,
} from '../utils/boardroomLogic';
import { ArrowRight, Sparkles, Building2, Users, Briefcase, FileText, AlertCircle } from 'lucide-react';

interface Tab1IntakeProps {
  intake: IntakeData;
  onIntakeChange: (updated: IntakeData) => void;
  onStartDiagnosis: (intakeToRun: IntakeData) => void;
  isLoading: boolean;
}

export const Tab1Intake: React.FC<Tab1IntakeProps> = ({
  intake,
  onIntakeChange,
  onStartDiagnosis,
  isLoading,
}) => {
  const [validationErrors, setValidationErrors] = useState<IntakeValidationResult['errors']>({});
  const [demoLoadedBanner, setDemoLoadedBanner] = useState(false);

  const handleLoadDemo = () => {
    onIntakeChange({ ...DEMO_CASE_JANSEN });
    setValidationErrors({});
    setDemoLoadedBanner(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateIntakeInput(intake);
    if (!check.valid) {
      setValidationErrors(check.errors);
      return;
    }
    setValidationErrors({});
    onStartDiagnosis(intake);
  };

  return (
    <div className="space-y-6">
      {/* Bento Grid: Left Intake Form (7 cols) + Right Executive Value Preview (5 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Left Column: Intake & 1-Klik Demo */}
        <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-6 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                  Stap 1 · Directie Intake
                </span>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                  Bedrijfsprofiel & Ruwe Gespreksnotities
                </h1>
              </div>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                Laad Demo Casus (Jansen Klimaattechniek - 65 FTE)
              </button>
            </div>

            {demoLoadedBanner && (
              <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-xs font-medium text-emerald-300">
                Demo casus geladen: Jansen Klimaattechniek B.V. (€ 14M omzet · 65 FTE · DGA Peter). Klik onderaan op &ldquo;Start 10-Seconden Diagnose &amp; OGSM&rdquo;.
              </div>
            )}

            <form id="intake-form" onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Bedrijfsnaam */}
                <div>
                  <label
                    htmlFor="input-company-name"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    Bedrijfsnaam
                  </label>
                  <input
                    id="input-company-name"
                    type="text"
                    value={intake.companyName}
                    onChange={(e) =>
                      onIntakeChange({ ...intake, companyName: e.target.value })
                    }
                    placeholder="Bijv. Jansen Klimaattechniek B.V."
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.companyName && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.companyName}
                    </p>
                  )}
                </div>

                {/* Branche */}
                <div>
                  <label
                    htmlFor="input-industry"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    Branche
                  </label>
                  <input
                    id="input-industry"
                    type="text"
                    value={intake.industry}
                    onChange={(e) =>
                      onIntakeChange({ ...intake, industry: e.target.value })
                    }
                    placeholder="Bijv. Installatietechniek"
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.industry && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.industry}
                    </p>
                  )}
                </div>

                {/* Aantal FTE */}
                <div>
                  <label
                    htmlFor="input-fte"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    Aantal FTE (25 - 250)
                  </label>
                  <input
                    id="input-fte"
                    type="number"
                    min={1}
                    max={10000}
                    value={intake.fte || ''}
                    onChange={(e) =>
                      onIntakeChange({
                        ...intake,
                        fte: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    placeholder="65"
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3.5 py-2.5 font-mono text-sm text-white tabular-nums placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.fte && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.fte}
                    </p>
                  )}
                </div>
              </div>

              {/* Ruwe Gespreksnotities */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-raw-notes"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    Ruwe Gespreksnotities (Uit DGA-interview)
                  </label>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {intake.rawNotes.length} tekens
                  </span>
                </div>
                <textarea
                  id="input-raw-notes"
                  rows={7}
                  value={intake.rawNotes}
                  onChange={(e) =>
                    onIntakeChange({ ...intake, rawNotes: e.target.value })
                  }
                  placeholder="Plak hier de ongefilterde notities uit het gesprek met de DGA: omzet, margedruk, waar de directeur zelf nog tussen zit, faalkosten en de ambitie over 3 jaar..."
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] p-3.5 text-sm leading-relaxed text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
                {validationErrors.rawNotes && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {validationErrors.rawNotes}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <span>
                    {isLoading
                      ? 'Bezig met 10-Seconden Diagnose & OGSM...'
                      : 'Start 10-Seconden Diagnose & OGSM →'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Bento Grid van de 3 Modules (Geen Scroll-Woestijn) */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-5">
          {/* Bento Tile 1: Rode Vlaggen & Euro-Lekken */}
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-400 uppercase">
                Module 1 · Rode Vlaggen & OGSM
              </span>
              <span className="font-mono text-lg font-bold text-red-400 tabular-nums">
                € 980.000 / jr
              </span>
            </div>
            <h2 className="mt-2 text-base font-bold text-white">
              Leg bloot waar euro&apos;s weglekken en waarom de DGA de blokkade is
            </h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Berekent direct de 3 grootste margelekken en vertaalt ze naar een 1-pagina OGSM met harde DOEN en DIRECT STOPPEN keuzes.
            </p>
          </div>

          {/* Bento Tile 2: BPMN Proces-Sloten */}
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase">
                Module 2 · Procesketen & Marge-Sloten
              </span>
              <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                ≥ 32% Marge-Slot
              </span>
            </div>
            <h2 className="mt-2 text-base font-bold text-white">
              Visuele Swimlanes met keiharde Systeem-Sloten per afdeling
            </h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Wijst per waardeketen een proceseigenaar aan (nooit de DGA!) en plaatst beslisruiten tussen Verkoop, Calculatie en Werkvoorbereiding.
            </p>
          </div>

          {/* Bento Tile 3: DGA Vrijheidskalender */}
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase">
                Module 3 · DGA-Vrijheidskalender
              </span>
              <span className="font-mono text-lg font-bold text-amber-400 tabular-nums">
                +28 uur / week
              </span>
            </div>
            <h2 className="mt-2 text-base font-bold text-white">
              Management by Exception & 3 Strakke Ritme-Meetings
            </h2>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Het DGA Bevrijdings-Contract legt vast wat de directeur vandaag loslaat en wanneer iemand binnen 48 uur moet ingrijpen bij een rood stoplicht.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
