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

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1' ? 'tab2' : 'tab1';
  });

  const [mode, setMode] = useState<CockpitMode>('cockpit');
  const [intake, setIntake] = useState<IntakeData>({
    companyName: '',
    industry: '',
    fte: 65,
    rawNotes: '',
  });

  // Pre-seed modules with Jansen Klimaattechniek so any tab is immediately inspectable,
  // and overwrite dynamically whenever the user runs Module 1 -> Module 2 -> Module 3.
  const [module1, setModule1] = useState<Module1Output>(() =>
    buildFallbackModule1(DEMO_CASE_JANSEN)
  );
  const [module2, setModule2] = useState<Module2Output>(() =>
    buildFallbackModule2(DEMO_CASE_JANSEN, buildFallbackModule1(DEMO_CASE_JANSEN))
  );
  const [module3, setModule3] = useState<Module3Output>(() =>
    buildFallbackModule3(
      DEMO_CASE_JANSEN,
      buildFallbackModule1(DEMO_CASE_JANSEN),
      buildFallbackModule2(DEMO_CASE_JANSEN)
    )
  );

  const [loadingModule, setLoadingModule] = useState<'m1' | 'm2' | 'm3' | null>(
    null
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [isOnePagerOpen, setIsOnePagerOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && !intake.companyName) {
      setIntake({ ...DEMO_CASE_JANSEN });
    }
  }, [intake.companyName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [activeTab]);

  const handleRunModule1 = async (intakeToRun: IntakeData) => {
    setLoadingModule('m1');
    setApiError(null);
    try {
      const response = await fetch('/api/module1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake: intakeToRun }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Static hosting fallback (e.g. Netlify static deploy)
        const m1Fallback = buildFallbackModule1(intakeToRun);
        const m2Fallback = buildFallbackModule2(intakeToRun, m1Fallback);
        const m3Fallback = buildFallbackModule3(
          intakeToRun,
          m1Fallback,
          m2Fallback
        );
        setModule1(m1Fallback);
        setModule2(m2Fallback);
        setModule3(m3Fallback);
        setActiveTab('tab2');
        return;
      }

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || 'Kon Module 1 niet genereren.');
      }
      const m1Data: Module1Output = json.data;
      setModule1(m1Data);
      setActiveTab('tab2');

      // Automatically feed Module 1 JSON into Module 2 in the background so it is ready
      fetch('/api/module2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake: intakeToRun, module1: m1Data }),
      })
        .then((r) => r.json())
        .then((j2) => {
          if (j2?.data) {
            setModule2(j2.data);
            return fetch('/api/module3', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                intake: intakeToRun,
                module1: m1Data,
                module2: j2.data,
              }),
            });
          }
          return null;
        })
        .then((r3) => (r3 ? r3.json() : null))
        .then((j3) => {
          if (j3?.data) {
            setModule3(j3.data);
          }
        })
        .catch(() => {
          // Fallback already pre-populated
        });
    } catch {
      const m1Fallback = buildFallbackModule1(intakeToRun);
      const m2Fallback = buildFallbackModule2(intakeToRun, m1Fallback);
      const m3Fallback = buildFallbackModule3(
        intakeToRun,
        m1Fallback,
        m2Fallback
      );
      setModule1(m1Fallback);
      setModule2(m2Fallback);
      setModule3(m3Fallback);
      setActiveTab('tab2');
    } finally {
      setLoadingModule(null);
    }
  };

  const handleProceedToModule2 = async () => {
    const effectiveIntake = intake.companyName ? intake : DEMO_CASE_JANSEN;
    setLoadingModule('m2');
    setApiError(null);
    try {
      const response = await fetch('/api/module2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intake: effectiveIntake, module1 }),
      });
      const json = await response.json();
      if (response.ok && json.data) {
        setModule2(json.data);
      }
      setActiveTab('tab3');
    } catch {
      setActiveTab('tab3');
    } finally {
      setLoadingModule(null);
    }
  };

  const handleProceedToModule3 = async () => {
    const effectiveIntake = intake.companyName ? intake : DEMO_CASE_JANSEN;
    setLoadingModule('m3');
    setApiError(null);
    try {
      const response = await fetch('/api/module3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intake: effectiveIntake,
          module1,
          module2,
        }),
      });
      const json = await response.json();
      if (response.ok && json.data) {
        setModule3(json.data);
      }
      setActiveTab('tab4');
    } catch {
      setActiveTab('tab4');
    } finally {
      setLoadingModule(null);
    }
  };

  // Select current tab's 3 TL;DR bullets for the 10-Seconden Balk
  const getActiveTldrBullets = (): string[] => {
    if (activeTab === 'tab3') return module2.tldr_3_bullets;
    if (activeTab === 'tab4') return module3.tldr_3_bullets;
    return module1.tldr_3_bullets;
  };

  const getActiveModuleTitle = (): string => {
    switch (activeTab) {
      case 'tab1':
        return 'Tabblad 1 · Intake & 1-Klik Demo';
      case 'tab2':
        return 'Module 1 · Rode Vlaggen & 1-Pagina OGSM';
      case 'tab3':
        return 'Module 2 · Visuele Procesketen & Marge-Sloten';
      case 'tab4':
        return 'Module 3 · DGA-Vrijheidskalender & Stoplicht-Regie';
    }
  };

  const displayCompanyName =
    intake.companyName.trim() || DEMO_CASE_JANSEN.companyName;

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
            01. Intake &amp; Demo
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
          euroLeakPerYear={module1.total_estimated_euro_leak_per_year}
          dgaHoursFreedPerWeek={module1.dga_hours_freed_per_week}
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
