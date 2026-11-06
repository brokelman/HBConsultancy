import React, { useState } from 'react';
import {
  IntakeData,
  EMPTY_INTAKE_CASE,
  DEMO_CASE_JANSEN,
  SavedClientCase,
  validateIntakeInput,
  IntakeValidationResult,
  calculateLiveIntakeMetrics,
  formatEuro,
} from '../utils/boardroomLogic';
import {
  Building2,
  Users,
  Briefcase,
  FileText,
  AlertCircle,
  User,
  Euro,
  Percent,
  Clock,
  ShieldCheck,
  PlusCircle,
  Save,
  Trash2,
  FolderOpen,
  Sparkles,
} from 'lucide-react';

interface Tab1IntakeProps {
  intake: IntakeData;
  onIntakeChange: (updated: IntakeData) => void;
  onStartDiagnosis: (intakeToRun: IntakeData) => void;
  onResetToNewCase: () => void;
  savedCases: SavedClientCase[];
  activeCaseId: string | undefined;
  onSelectSavedCase: (saved: SavedClientCase) => void;
  onDeleteSavedCase: (id: string) => void;
  onSaveCurrentCase: () => void;
  isLoading: boolean;
}

export const Tab1Intake: React.FC<Tab1IntakeProps> = ({
  intake,
  onIntakeChange,
  onStartDiagnosis,
  onResetToNewCase,
  savedCases,
  activeCaseId,
  onSelectSavedCase,
  onDeleteSavedCase,
  onSaveCurrentCase,
  isLoading,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    IntakeValidationResult['errors']
  >({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const liveMetrics = calculateLiveIntakeMetrics(intake);

  const handleNewEmptyCase = () => {
    onResetToNewCase();
    setValidationErrors({});
    setStatusMessage(
      'Nieuwe lege case gestart. Vul hieronder de bedrijfsvariabelen van de klant in.'
    );
  };

  const handleLoadExample = () => {
    onIntakeChange({ ...DEMO_CASE_JANSEN });
    setValidationErrors({});
    setStatusMessage('Referentiecasus geladen (Jansen Klimaattechniek B.V.). Alle velden zijn vrij aanpasbaar.');
  };

  const handleSaveCaseClick = () => {
    const check = validateIntakeInput(intake);
    if (!check.valid) {
      setValidationErrors(check.errors);
      return;
    }
    setValidationErrors({});
    onSaveCurrentCase();
    setStatusMessage(`Case "${intake.companyName}" is opgeslagen in Mijn Klant-Cases.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateIntakeInput(intake);
    if (!check.valid) {
      setValidationErrors(check.errors);
      return;
    }
    setValidationErrors({});
    setStatusMessage(null);
    onStartDiagnosis(intake);
  };

  const updateNumberField = (field: keyof IntakeData, rawVal: string) => {
    const parsed = rawVal === '' ? 0 : parseFloat(rawVal);
    onIntakeChange({
      ...intake,
      [field]: Number.isFinite(parsed) ? parsed : 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Grid: Left Editable Case Variables Form (8 cols) + Right Saved Cases & Live Preview (4 cols) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Volledige Case Opvoer & Variabelen */}
        <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                Stap 1 · Klant-Intake &amp; Bedrijfsvariabelen
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
                Nieuwe Case Opvoeren of Variabelen Wijzigen
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleNewEmptyCase}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
                Nieuwe Lege Case
              </button>

              <button
                type="button"
                onClick={handleSaveCaseClick}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#090D16] px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5 text-amber-400" />
                Case Opslaan
              </button>

              <button
                type="button"
                onClick={handleLoadExample}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#090D16] px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Laad Voorbeeld
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-4 py-2.5 text-xs font-medium text-emerald-300">
              {statusMessage}
            </div>
          )}

          <form
            id="intake-form"
            onSubmit={handleSubmit}
            className="mt-5 space-y-6"
            noValidate
          >
            {/* SECTIE A: Bedrijf & Directie */}
            <div>
              <h2 className="mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase">
                A. Bedrijfsprofiel &amp; Directie
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Bedrijfsnaam */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="input-company-name"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Building2 className="h-3.5 w-3.5 text-amber-400" />
                    Bedrijfsnaam *
                  </label>
                  <input
                    id="input-company-name"
                    type="text"
                    value={intake.companyName}
                    onChange={(e) =>
                      onIntakeChange({ ...intake, companyName: e.target.value })
                    }
                    placeholder="Bijv. Van Dijk Precisiemetaal B.V."
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.companyName && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.companyName}
                    </p>
                  )}
                </div>

                {/* Naam DGA */}
                <div>
                  <label
                    htmlFor="input-dga-name"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <User className="h-3.5 w-3.5 text-amber-400" />
                    Naam DGA / Directeur *
                  </label>
                  <input
                    id="input-dga-name"
                    type="text"
                    value={intake.dgaName}
                    onChange={(e) =>
                      onIntakeChange({ ...intake, dgaName: e.target.value })
                    }
                    placeholder="Bijv. Mark"
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.dgaName && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.dgaName}
                    </p>
                  )}
                </div>

                {/* Aantal FTE */}
                <div>
                  <label
                    htmlFor="input-fte"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Users className="h-3.5 w-3.5 text-amber-400" />
                    Aantal FTE *
                  </label>
                  <input
                    id="input-fte"
                    type="number"
                    min={1}
                    max={10000}
                    value={intake.fte || ''}
                    onChange={(e) => updateNumberField('fte', e.target.value)}
                    placeholder="50"
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-white tabular-nums placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.fte && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.fte}
                    </p>
                  )}
                </div>

                {/* Branche */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label
                    htmlFor="input-industry"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                    Branche / Kernactiviteit *
                  </label>
                  <input
                    id="input-industry"
                    type="text"
                    value={intake.industry}
                    onChange={(e) =>
                      onIntakeChange({ ...intake, industry: e.target.value })
                    }
                    placeholder="Bijv. Maakindustrie, Installatietechniek, Transport & Logistiek, Zakelijke Dienstverlening..."
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.industry && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.industry}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTIE B: Financiële, Omzet & Marge Variabelen */}
            <div className="border-t border-slate-800/80 pt-5">
              <h2 className="mb-3 text-xs font-bold tracking-wider text-emerald-400 uppercase">
                B. Financiële &amp; Marge Variabelen (Sturen de Euro-Lekken &amp; OGSM Doelen)
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Huidige Jaaromzet (€M) */}
                <div>
                  <label
                    htmlFor="input-current-rev"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Euro className="h-3.5 w-3.5 text-emerald-400" />
                    Huidige Omzet (€ miljoen)
                  </label>
                  <input
                    id="input-current-rev"
                    type="number"
                    step="0.5"
                    min={0.1}
                    value={intake.currentRevenueMillions || ''}
                    onChange={(e) =>
                      updateNumberField('currentRevenueMillions', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-white tabular-nums focus:border-amber-400 focus:outline-none"
                  />
                  {validationErrors.currentRevenueMillions && (
                    <p className="mt-1 text-xs text-red-400">
                      {validationErrors.currentRevenueMillions}
                    </p>
                  )}
                </div>

                {/* Doelomzet over 3 jaar (€M) */}
                <div>
                  <label
                    htmlFor="input-target-rev"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Euro className="h-3.5 w-3.5 text-emerald-400" />
                    Doelomzet 3 Jaar (€ miljoen)
                  </label>
                  <input
                    id="input-target-rev"
                    type="number"
                    step="0.5"
                    min={0.1}
                    value={intake.targetRevenueMillions || ''}
                    onChange={(e) =>
                      updateNumberField('targetRevenueMillions', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-white tabular-nums focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Faalkosten / Margelek (%) */}
                <div>
                  <label
                    htmlFor="input-failure-cost"
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-300"
                  >
                    <Percent className="h-3.5 w-3.5 text-red-400" />
                    Faalkosten / Margelek (% omzet)
                  </label>
                  <input
                    id="input-failure-cost"
                    type="number"
                    step="0.5"
                    min={0.5}
                    max={50}
                    value={intake.failureCostPercent || ''}
                    onChange={(e) =>
                      updateNumberField('failureCostPercent', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-red-500/40 bg-[#090D16] px-3 py-2 font-mono text-sm font-bold text-red-300 tabular-nums focus:border-red-400 focus:outline-none"
                  />
                </div>

                {/* Huidige EBITDA (%) */}
                <div>
                  <label
                    htmlFor="input-current-ebitda"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Percent className="h-3.5 w-3.5 text-slate-400" />
                    Huidige EBITDA / Winst (%)
                  </label>
                  <input
                    id="input-current-ebitda"
                    type="number"
                    step="0.5"
                    value={intake.currentEbitdaPercent || ''}
                    onChange={(e) =>
                      updateNumberField('currentEbitdaPercent', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-white tabular-nums focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Doel EBITDA (%) */}
                <div>
                  <label
                    htmlFor="input-target-ebitda"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Percent className="h-3.5 w-3.5 text-emerald-400" />
                    Doel-EBITDA over 3 Jaar (%)
                  </label>
                  <input
                    id="input-target-ebitda"
                    type="number"
                    step="0.5"
                    value={intake.targetEbitdaPercent || ''}
                    onChange={(e) =>
                      updateNumberField('targetEbitdaPercent', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-emerald-300 tabular-nums focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                {/* Minimale Brutomarge-Slot Norm (%) */}
                <div>
                  <label
                    htmlFor="input-min-margin"
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Hard Brutomarge-Slot (%)
                  </label>
                  <input
                    id="input-min-margin"
                    type="number"
                    step="1"
                    min={5}
                    max={95}
                    value={intake.minGrossMarginPercent || ''}
                    onChange={(e) =>
                      updateNumberField('minGrossMarginPercent', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-emerald-500/40 bg-[#090D16] px-3 py-2 font-mono text-sm font-bold text-emerald-300 tabular-nums focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTIE C: DGA Tijd & Mandaat Variabelen */}
            <div className="border-t border-slate-800/80 pt-5">
              <h2 className="mb-3 text-xs font-bold tracking-wider text-amber-400 uppercase">
                C. DGA Tijdsbesteding &amp; MT-Mandaatgrenzen
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Huidige DGA Werkweek */}
                <div>
                  <label
                    htmlFor="input-cur-hours"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Clock className="h-3.5 w-3.5 text-red-400" />
                    DGA Uren Nu (u/wk)
                  </label>
                  <input
                    id="input-cur-hours"
                    type="number"
                    min={1}
                    max={100}
                    value={intake.currentDgaHoursPerWeek || ''}
                    onChange={(e) =>
                      updateNumberField('currentDgaHoursPerWeek', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-white tabular-nums focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Doel DGA Werkweek */}
                <div>
                  <label
                    htmlFor="input-tgt-hours"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    Doel DGA Uren (u/wk)
                  </label>
                  <input
                    id="input-tgt-hours"
                    type="number"
                    min={0}
                    max={80}
                    value={intake.targetDgaHoursPerWeek ?? ''}
                    onChange={(e) =>
                      updateNumberField('targetDgaHoursPerWeek', e.target.value)
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-emerald-300 tabular-nums focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Huidige DGA Goedkeuringsgrens (€) */}
                <div>
                  <label
                    htmlFor="input-old-threshold"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Euro className="h-3.5 w-3.5 text-red-400" />
                    DGA Keurt Nu Boven (€)
                  </label>
                  <input
                    id="input-old-threshold"
                    type="number"
                    step="5000"
                    min={0}
                    value={intake.currentApprovalThresholdEuro || ''}
                    onChange={(e) =>
                      updateNumberField(
                        'currentApprovalThresholdEuro',
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3 py-2 font-mono text-sm text-white tabular-nums focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Nieuw MT Mandaat tot (€) */}
                <div>
                  <label
                    htmlFor="input-new-mandate"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <Euro className="h-3.5 w-3.5 text-amber-400" />
                    Nieuw MT-Mandaat (€)
                  </label>
                  <input
                    id="input-new-mandate"
                    type="number"
                    step="10000"
                    min={5000}
                    value={intake.newMtMandateThresholdEuro || ''}
                    onChange={(e) =>
                      updateNumberField(
                        'newMtMandateThresholdEuro',
                        e.target.value
                      )
                    }
                    className="mt-1.5 w-full rounded-lg border border-amber-500/40 bg-[#090D16] px-3 py-2 font-mono text-sm font-bold text-amber-300 tabular-nums focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTIE D: Operationeel Knelpunt & Gespreksnotities */}
            <div className="border-t border-slate-800/80 pt-5 space-y-4">
              <div>
                <label
                  htmlFor="input-core-bottleneck"
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                >
                  <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                  Grootste Operationeel Knelpunt op de Vloer (1 regel)
                </label>
                <input
                  id="input-core-bottleneck"
                  type="text"
                  value={intake.coreBottleneckSummary}
                  onChange={(e) =>
                    onIntakeChange({
                      ...intake,
                      coreBottleneckSummary: e.target.value,
                    })
                  }
                  placeholder="Bijv. Spoedorders, fouten in overdracht van verkoop naar productie en onbetaald meerwerk"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-raw-notes"
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-300"
                  >
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    Aanvullende Gespreksnotities &amp; Context *
                  </label>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {intake.rawNotes.length} tekens
                  </span>
                </div>
                <textarea
                  id="input-raw-notes"
                  rows={4}
                  value={intake.rawNotes}
                  onChange={(e) =>
                    onIntakeChange({ ...intake, rawNotes: e.target.value })
                  }
                  placeholder="Noteer hier specifieke details uit het gesprek met de DGA (bijv. klantgroepen waarmee gestopt moet worden, knelpunten in het MT, verkoopdoel of overname-horizon)..."
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#090D16] p-3 text-sm leading-relaxed text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
                {validationErrors.rawNotes && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {validationErrors.rawNotes}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <span>
                  {isLoading
                    ? 'Bezig met doorrekenen van Case & Genereren van OGSM...'
                    : `Start 10-Seconden Diagnose & OGSM voor ${
                        intake.companyName.trim() || 'deze Case'
                      } →`}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Opgeslagen Klant-Cases + Live Case-Doorrekening */}
        <div className="space-y-4 lg:col-span-4">
          {/* Opgeslagen Klant-Cases Switcher */}
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                <FolderOpen className="h-4 w-4 shrink-0" />
                Mijn Opgevoerde Klant-Cases ({savedCases.length})
              </span>
              <button
                type="button"
                onClick={handleNewEmptyCase}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                + Nieuw bedrijf
              </button>
            </div>

            {savedCases.length === 0 ? (
              <p className="mt-3 text-xs text-slate-400">
                Nog geen eigen cases opgeslagen. Vul links een nieuw bedrijf in en klik op &ldquo;Case Opslaan&rdquo; of start direct de diagnose.
              </p>
            ) : (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                {savedCases.map((sc) => {
                  const isCurrent = sc.id === activeCaseId;
                  return (
                    <div
                      key={sc.id}
                      className={`flex items-center justify-between gap-2 rounded-lg border p-3 transition-colors ${
                        isCurrent
                          ? 'border-amber-400/60 bg-amber-500/10'
                          : 'border-slate-800 bg-[#090D16] hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectSavedCase(sc)}
                        className="flex-1 text-left cursor-pointer"
                      >
                        <div className="text-xs font-bold text-white">
                          {sc.intake.companyName}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          DGA: {sc.intake.dgaName} · {sc.intake.fte} FTE · €{' '}
                          {sc.intake.currentRevenueMillions}M omzet
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSavedCase(sc.id)}
                        aria-label={`Verwijder case ${sc.intake.companyName}`}
                        className="rounded p-1.5 text-slate-500 hover:bg-red-950/40 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live Bento Tile 1: Berekend Euro-Lek uit Huidige Variabelen */}
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-red-400 uppercase whitespace-nowrap">
                Module 1 · Live Margelek
              </span>
              <span
                data-testid="live-preview-leak"
                className="font-mono text-base font-bold text-red-400 tabular-nums whitespace-nowrap shrink-0"
              >
                {liveMetrics.totalEuroLeakFormatted}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-white">
              {intake.failureCostPercent}% faalkosten op €{' '}
              {intake.currentRevenueMillions}M jaaromzet
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              EBITDA-doelsprong van {intake.currentEbitdaPercent}% (
              {formatEuro(liveMetrics.currentEbitdaEuro)}) naar{' '}
              {intake.targetEbitdaPercent}% (
              {formatEuro(liveMetrics.targetEbitdaEuro)} bij €{' '}
              {intake.targetRevenueMillions}M).
            </p>
          </div>

          {/* Live Bento Tile 2: Proces- & Marge-Sloten */}
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase whitespace-nowrap">
                Module 2 · Proces-Slot
              </span>
              <span
                data-testid="live-preview-margin-lock"
                className="font-mono text-base font-bold text-emerald-400 tabular-nums whitespace-nowrap shrink-0"
              >
                ≥ {intake.minGrossMarginPercent}% Marge-Slot
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-white">
              Geen DGA-akkoord meer tussen{' '}
              {formatEuro(intake.currentApprovalThresholdEuro)} en{' '}
              {formatEuro(intake.newMtMandateThresholdEuro)}
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Vervangt handmatige controle door {intake.dgaName || 'de DGA'} met een harde systeem-poort in Verkoop, Calculatie en Werkvoorbereiding.
            </p>
          </div>

          {/* Live Bento Tile 3: Vrijgespeelde DGA-Tijd */}
          <div className="rounded-xl border border-slate-800 bg-[#0F1624] p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-amber-400 uppercase whitespace-nowrap">
                Module 3 · DGA-Vrijheid
              </span>
              <span
                data-testid="live-preview-freed-hours"
                className="font-mono text-base font-bold text-amber-400 tabular-nums whitespace-nowrap shrink-0"
              >
                +{liveMetrics.freedHoursPerWeek} uur / week
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-white">
              Werkweek {intake.dgaName || 'DGA'} van{' '}
              {intake.currentDgaHoursPerWeek} naar {intake.targetDgaHoursPerWeek}{' '}
              uur/week
            </h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Het MT stuurt op de wekelijkse en maandelijkse KPI-meetings;{' '}
              {intake.dgaName || 'de DGA'} grijpt alleen in bij rode stoplichten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
