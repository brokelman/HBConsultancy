/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  IntakeData,
  Module1Output,
  Module2Output,
  Module3Output,
  SavedClientCase,
  EMPTY_INTAKE_CASE,
  DEMO_CASE_JANSEN,
  buildFallbackModule1,
  buildFallbackModule2,
  buildFallbackModule3,
} from './utils/boardroomLogic';
import { TenSecondBar, CockpitMode } from './components/TenSecondBar';
import { Tab1Intake } from './components/Tab1Intake';
import { Tab2Ogsm } from './components/Tab2Ogsm';
import { Tab3Process } from './components/Tab3Process';
import { Tab4Governance } from './components/Tab4Governance';
import { OnePagerModal } from './components/OnePagerModal';
import { Printer, AlertCircle } from 'lucide-react';

type ActiveTab = 'tab1' | 'tab2' | 'tab3' | 'tab4';

const STORAGE_KEY_CASES = 'boardroom_os_saved_cases_v1';

function loadInitialSavedCases(): SavedClientCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CASES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  const m1 = buildFallbackModule1(DEMO_CASE_JANSEN);
  const m2 = buildFallbackModule2(DEMO_CASE_JANSEN, m1);
  const m3 = buildFallbackModule3(DEMO_CASE_JANSEN, m1, m2);
  return [
    {
      id: DEMO_CASE_JANSEN.id || 'case-jansen-klimaat',
      updatedAt: new Date().toISOString(),
      intake: { ...DEMO_CASE_JANSEN },
      module1: m1,
      module2: m2,
      module3: m3,
    },
  ];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1' ? 'tab2' : 'tab1';
  });

  const [mode, setMode] = useState<CockpitMode>('cockpit');
  const [savedCases, setSavedCases] = useState<SavedClientCase[]>(() =>
    loadInitialSavedCases()
  );

  // Start with a clean, editable new case form by default (unless ?autostart=1)
  const [intake, setIntake] = useState<IntakeData>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return { ...DEMO_CASE_JANSEN };
    }
    return { ...EMPTY_INTAKE_CASE, id: `case-${Date.now()}` };
  });

  const [module1, setModule1] = useState<Module1Output>(() =>
    buildFallbackModule1(intake.companyName ? intake : DEMO_CASE_JANSEN)
  );
  const [module2, setModule2] = useState<Module2Output>(() =>
    buildFallbackModule2(
      intake.companyName ? intake : DEMO_CASE_JANSEN,
      module1
    )
  );
  const [module3, setModule3] = useState<Module3Output>(() =>
    buildFallbackModule3(
      intake.companyName ? intake : DEMO_CASE_JANSEN,
      module1,
      module2
    )
  );

  const [loadingModule, setLoadingModule] = useState<'m1' | 'm2' | 'm3' | null>(
    null
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [isOnePagerOpen, setIsOnePagerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CASES, JSON.stringify(savedCases));
    } catch {
      // ignore storage errors
    }
  }, [savedCases]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab]);

  const upsertSavedCase = (
    intakeData: IntakeData,
    m1: Module1Output,
    m2: Module2Output,
    m3: Module3Output
  ) => {
    const caseId = intakeData.id || `case-${Date.now()}`;
    const updatedIntake = { ...intakeData, id: caseId };
    setIntake(updatedIntake);

    const entry: SavedClientCase = {
      id: caseId,
      updatedAt: new Date().toISOString(),
      intake: updatedIntake,
      module1: m1,
      module2: m2,
      module3: m3,
    };

    setSavedCases((prev) => {
      const exists = prev.some((c) => c.id === caseId);
      if (exists) {
        return prev.map((c) => (c.id === caseId ? entry : c));
      }
      return [entry, ...prev];
    });
  };

  const handleResetToNewCase = () => {
    const fresh: IntakeData = {
      ...EMPTY_INTAKE_CASE,
      id: `case-${Date.now()}`,
    };
    setIntake(fresh);
    setApiError(null);
  };

  const handleSelectSavedCase = (saved: SavedClientCase) => {
    setIntake({ ...saved.intake });
    setModule1(saved.module1);
    setModule2(saved.module2);
    setModule3(saved.module3);
    setApiError(null);
  };

  const handleDeleteSavedCase = (id: string) => {
    setSavedCases((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveCurrentCase = () => {
    const m1 = buildFallbackModule1(intake);
    const m2 = buildFallbackModule2(intake, m1);
    const m3 = buildFallbackModule3(intake, m1, m2);
    setModule1(m1);
    setModule2(m2);
    setModule3(m3);
    upsertSavedCase(intake, m1, m2, m3);
  };

  const handleRunModule1 = async (intakeToRun: IntakeData) => {
    setApiError(null);

    // Immediately compute and display the diagnosis for all 3 modules from the user's exact variables
    const localM1 = buildFallbackModule1(intakeToRun);
    const localM2 = buildFallbackModule2(intakeToRun, localM1);
    const localM3 = buildFallbackModule3(intakeToRun, localM1, localM2);

    setModule1(localM1);
    setModule2(localM2);
    setModule3(localM3);
    upsertSavedCase(intakeToRun, localM1, localM2, localM3);
    setActiveTab('tab2');

    // Enrich asynchronously via server-side Gemini API if available
    fetch('/api/module1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intake: intakeToRun }),
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type') || '';
        if (!response.ok || !contentType.includes('application/json')) {
          return null;
        }
        return response.json();
      })
      .then((json) => {
        if (json?.data && json.source === 'gemini') {
          setModule1(json.data);
          upsertSavedCase(intakeToRun, json.data, localM2, localM3);
        }
      })
      .catch(() => {
        // Deterministic calculation already active
      });
  };

  const handleProceedToModule2 = () => {
    setActiveTab('tab3');
  };

  const handleProceedToModule3 = () => {
    setActiveTab('tab4');
  };

  // On Tab 1, live-calculate the 10-Seconden Balk directly from the current form variables!
  const liveTab1Preview = buildFallbackModule1(intake);

  const getActiveTldrBullets = (): string[] => {
    if (activeTab === 'tab1') return liveTab1Preview.tldr_3_bullets;
    if (activeTab === 'tab3') return module2.tldr_3_bullets;
    if (activeTab === 'tab4') return module3.tldr_3_bullets;
    return module1.tldr_3_bullets;
  };

  const getActiveEuroLeak = (): string => {
    if (activeTab === 'tab1') {
      return liveTab1Preview.total_estimated_euro_leak_per_year;
    }
    return module1.total_estimated_euro_leak_per_year;
  };

  const getActiveDgaHours = (): string => {
    if (activeTab === 'tab1') {
      return liveTab1Preview.dga_hours_freed_per_week;
    }
    return module1.dga_hours_freed_per_week;
  };

  const getActiveModuleTitle = (): string => {
    switch (activeTab) {
      case 'tab1':
        return 'Tabblad 1 · Nieuwe Case Opvoeren & Variabelen';
      case 'tab2':
        return 'Module 1 · Rode Vlaggen & 1-Pagina OGSM';
      case 'tab3':
        return 'Module 2 · Visuele Procesketen & Marge-Sloten';
      case 'tab4':
        return 'Module 3 · DGA-Vrijheidskalender & Stoplicht-Regie';
    }
  };

  const displayCompanyName =
    intake.companyName.trim() || 'Nieuwe Klant-Case (Invoer)';

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print flex items-center justify-between gap-8 border-b border-slate-800 bg-[#090D16] px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('tab1');
          }}
          className="font-display text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Boardroom OS
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Hoofdnavigatie modules"
          className="flex items-center gap-6 overflow-x-auto text-sm font-medium text-slate-400"
        >
          <button
            type="button"
            onClick={() => setActiveTab('tab1')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tab1'
                ? 'border-b-2 border-amber-400 font-bold text-white'
                : 'hover:text-white'
            }`}
          >
            01. Intake &amp; Cases
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tab2')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tab2'
                ? 'border-b-2 border-amber-400 font-bold text-white'
                : 'hover:text-white'
            }`}
          >
            02. Rode Vlaggen &amp; OGSM
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tab3')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tab3'
                ? 'border-b-2 border-amber-400 font-bold text-white'
                : 'hover:text-white'
            }`}
          >
            03. Proces &amp; Sloten
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tab4')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tab4'
                ? 'border-b-2 border-amber-400 font-bold text-white'
                : 'hover:text-white'
            }`}
          >
            04. Vrijheidskalender
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsOnePagerOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            1-Pagina Samenvatting
          </button>
        </div>
      </header>

      {/* Main Cockpit Container */}
      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {/* De "10-Seconden Balk" (TL;DR) bovenaan élk tabblad */}
        <TenSecondBar
          bullets={getActiveTldrBullets()}
          euroLeakPerYear={getActiveEuroLeak()}
          dgaHoursFreedPerWeek={getActiveDgaHours()}
          mode={mode}
          onModeChange={setMode}
          companyName={displayCompanyName}
          activeModuleTitle={getActiveModuleTitle()}
        />

        {apiError && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 text-xs text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{apiError}</span>
          </div>
        )}

        {/* Active Tab View */}
        {activeTab === 'tab1' && (
          <Tab1Intake
            intake={intake}
            onIntakeChange={setIntake}
            onStartDiagnosis={handleRunModule1}
            onResetToNewCase={handleResetToNewCase}
            savedCases={savedCases}
            activeCaseId={intake.id}
            onSelectSavedCase={handleSelectSavedCase}
            onDeleteSavedCase={handleDeleteSavedCase}
            onSaveCurrentCase={handleSaveCurrentCase}
            isLoading={loadingModule === 'm1'}
          />
        )}

        {activeTab === 'tab2' && (
          <Tab2Ogsm
            data={module1}
            mode={mode}
            onUpdateData={setModule1}
            onProceedToModule2={handleProceedToModule2}
            isLoadingNext={loadingModule === 'm2'}
          />
        )}

        {activeTab === 'tab3' && (
          <Tab3Process
            data={module2}
            mode={mode}
            onUpdateData={setModule2}
            onProceedToModule3={handleProceedToModule3}
            isLoadingNext={loadingModule === 'm3'}
          />
        )}

        {activeTab === 'tab4' && (
          <Tab4Governance
            data={module3}
            mode={mode}
            onUpdateData={setModule3}
            onOpenOnePager={() => setIsOnePagerOpen(true)}
          />
        )}
      </main>

      {/* 1-Pagina Directie Samenvatting Modal */}
      <OnePagerModal
        isOpen={isOnePagerOpen}
        onClose={() => setIsOnePagerOpen(false)}
        intake={intake.companyName ? intake : DEMO_CASE_JANSEN}
        module1={module1}
        module2={module2}
        module3={module3}
      />
    </div>
  );
}
