export interface IntakeData {
  id?: string;
  companyName: string;
  dgaName: string;
  industry: string;
  fte: number;
  currentRevenueMillions: number;
  targetRevenueMillions: number;
  currentEbitdaPercent: number;
  targetEbitdaPercent: number;
  failureCostPercent: number;
  minGrossMarginPercent: number;
  currentDgaHoursPerWeek: number;
  targetDgaHoursPerWeek: number;
  currentApprovalThresholdEuro: number;
  newMtMandateThresholdEuro: number;
  coreBottleneckSummary: string;
  rawNotes: string;
}

export interface MarginLeak {
  leak_title: string;
  estimated_euro_loss: string;
  root_cause_one_liner: string;
}

export interface OgsmGoal {
  metric_name: string;
  current_value: string;
  target_value: string;
  deadline: string;
}

export interface KpiMetric {
  name: string;
  target: string;
  owner_role: string;
}

export interface StrategicPillar {
  strategy_id: string;
  strategy_title: string;
  radical_focus_do: string;
  stop_doing_immediately: string;
  leading_kpi: KpiMetric;
  lagging_kpi: KpiMetric;
  top_90_day_action: {
    action: string;
    owner_role: string;
  };
}

export interface Module1Output {
  tldr_3_bullets: string[];
  total_estimated_euro_leak_per_year: string;
  dga_hours_freed_per_week: string;
  red_flag_diagnosis: {
    founder_bottleneck_headline: string;
    founder_bottleneck_impact: string;
    uncomfortable_truth: string;
    margin_leaks: MarginLeak[];
  };
  ogsm: {
    objective_one_liner: string;
    goals: OgsmGoal[];
    strategic_pillars: StrategicPillar[];
  };
}

export type BpmnType = 'Task' | 'Exclusive_Gateway' | 'Event';
export type ControlType = 'Systeem-Slot (Preventief)' | 'Dashboard-Check (Detectief)';

export interface ProcessStep {
  step_number: number;
  bpmn_type: BpmnType;
  department_swimlane: string;
  short_title: string;
  handoff_rule_1_sentence: string;
  money_leak_risk: string;
  hard_control_rule: string;
  control_type: ControlType;
  ai_quick_win: string;
}

export interface E2EProcess {
  process_id: string;
  process_name: string;
  why_it_matters_one_liner: string;
  process_owner_role: string;
  health_kpis: {
    lead_time: string;
    first_time_right: string;
    margin_target: string;
  };
  steps: ProcessStep[];
}

export interface Module2Output {
  tldr_3_bullets: string[];
  e2e_processes: E2EProcess[];
}

export type MeetingTierBadge =
  | 'Week - 30 min Vloer'
  | 'Maand - 60 min Proces'
  | 'Maand - 90 min Boardroom';

export interface AgendaBlock {
  minutes: string;
  topic: string;
  forced_decision: string;
}

export interface MeetingRhythmCard {
  meeting_title: string;
  tier_badge: MeetingTierBadge;
  chair_role: string;
  participants: string[];
  dashboard_kpis_on_screen: string[];
  agenda_blocks: AgendaBlock[];
}

export interface TrafficLightRow {
  red_flag_trigger: string;
  who_fixes_it: string;
  action_within_48h: string;
  when_dga_steps_in: string;
}

export interface Module3Output {
  tldr_3_bullets: string[];
  dga_freedom_plan: {
    stop_doing_today: string[];
    only_focus_on: string[];
    golden_mandate_rule: string;
  };
  meeting_rhythm: MeetingRhythmCard[];
  traffic_light_escalation: TrafficLightRow[];
}

export interface SavedClientCase {
  id: string;
  updatedAt: string;
  intake: IntakeData;
  module1: Module1Output;
  module2: Module2Output;
  module3: Module3Output;
}

export const EMPTY_INTAKE_CASE: IntakeData = {
  companyName: '',
  dgaName: '',
  industry: '',
  fte: 50,
  currentRevenueMillions: 10,
  targetRevenueMillions: 16,
  currentEbitdaPercent: 6,
  targetEbitdaPercent: 15,
  failureCostPercent: 5,
  minGrossMarginPercent: 35,
  currentDgaHoursPerWeek: 60,
  targetDgaHoursPerWeek: 16,
  currentApprovalThresholdEuro: 15000,
  newMtMandateThresholdEuro: 100000,
  coreBottleneckSummary: '',
  rawNotes: '',
};

export const DEMO_CASE_JANSEN: IntakeData = {
  id: 'case-jansen-klimaat',
  companyName: 'Jansen Klimaattechniek B.V.',
  dgaName: 'Peter',
  industry: 'Zakelijke Klimaatinstallaties & Onderhoud',
  fte: 65,
  currentRevenueMillions: 14,
  targetRevenueMillions: 20,
  currentEbitdaPercent: 4,
  targetEbitdaPercent: 15,
  failureCostPercent: 7,
  minGrossMarginPercent: 32,
  currentDgaHoursPerWeek: 65,
  targetDgaHoursPerWeek: 15,
  currentApprovalThresholdEuro: 25000,
  newMtMandateThresholdEuro: 150000,
  coreBottleneckSummary:
    'Faalkosten op de bouwplaats, slechte overdracht van calculatie naar werkvoorbereiding en verstorende kleine klussen.',
  rawNotes:
    'Bedrijf: Jansen Klimaattechniek B.V. (installatie en onderhoud van duurzame klimaatinstallaties voor zakelijke panden). Omzet: 14 miljoen euro, 65 fte. Situatie uit gesprek met DGA (Peter): Peter werkt 65 uur per week. Elke offerte boven de 25.000 euro moet over zijn bureau omdat verkopers anders dingen beloven die de monteurs buiten niet kunnen maken of waar te weinig marge op zit. De omzet groeit met 15% per jaar, maar de nettowinst is gedaald van 11% naar 4% door faalkosten, nabestellingen op de bouwplaats en slechte overdracht van calculatie naar werkvoorbereiding. Daarnaast doen ze nog steeds kleine particuliere cv-ketel klusjes omdat Peter geen nee durft te zeggen tegen oude klanten, wat de planning compleet verstoort. Peter wil dat het bedrijf over 3 jaar zonder hem kan draaien op 15% EBITDA en 20 miljoen omzet, zodat hij een deel aan een investeerder kan verkopen.',
};

export interface IntakeValidationResult {
  valid: boolean;
  errors: {
    companyName?: string;
    dgaName?: string;
    industry?: string;
    fte?: string;
    currentRevenueMillions?: string;
    rawNotes?: string;
  };
}

export function validateIntakeInput(data: Partial<IntakeData>): IntakeValidationResult {
  const errors: IntakeValidationResult['errors'] = {};

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.companyName = 'Vul een geldige bedrijfsnaam in.';
  }
  if (!data.dgaName || data.dgaName.trim().length < 2) {
    errors.dgaName = 'Vul de voornaam of naam van de DGA/directeur in.';
  }
  if (!data.industry || data.industry.trim().length < 2) {
    errors.industry = 'Vul de branche in.';
  }
  const fteNum = Number(data.fte);
  if (!Number.isFinite(fteNum) || fteNum < 1 || fteNum > 10000) {
    errors.fte = 'Vul een geldig aantal FTE in (1 - 10.000).';
  }
  const revNum = Number(data.currentRevenueMillions);
  if (!Number.isFinite(revNum) || revNum <= 0) {
    errors.currentRevenueMillions = 'Vul een geldige huidige omzet in (> 0).';
  }
  const notesText = (data.rawNotes || '').trim();
  const bottleneckText = (data.coreBottleneckSummary || '').trim();
  if (notesText.length < 10 && bottleneckText.length < 10) {
    errors.rawNotes =
      'Beschrijf kort het kernknelpunt of de gespreksnotities (min. 10 tekens).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function parseEuroAmount(euroStr: string): number {
  if (!euroStr) return 0;
  const cleaned = euroStr.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatEuro(amount: number): string {
  const formatted = new Intl.NumberFormat('nl-NL').format(Math.max(0, Math.round(amount)));
  return `€ ${formatted}`;
}

export function formatEuroPerYear(amount: number): string {
  return `${formatEuro(amount)} / jaar`;
}

export function calculateTotalMarginLeak(leaks: MarginLeak[]): string {
  const sum = leaks.reduce((acc, item) => acc + parseEuroAmount(item.estimated_euro_loss), 0);
  if (sum <= 0) return '€ 0 / jaar';
  return formatEuroPerYear(sum);
}

export function calculateLiveIntakeMetrics(intake: IntakeData): {
  totalEuroLeakNumber: number;
  totalEuroLeakFormatted: string;
  leak1Euro: number;
  leak2Euro: number;
  leak3Euro: number;
  freedHoursPerWeek: number;
  freedHoursFormatted: string;
  currentEbitdaEuro: number;
  targetEbitdaEuro: number;
} {
  const revEuro = Math.max(0.1, Number(intake.currentRevenueMillions) || 10) * 1_000_000;
  const targetRevEuro =
    Math.max(0.1, Number(intake.targetRevenueMillions) || 15) * 1_000_000;
  const failPct = Math.max(0.5, Number(intake.failureCostPercent) || 5);
  const totalEuroLeakNumber = Math.round((revEuro * failPct) / 100 / 5000) * 5000;

  // Split total leak across the 3 primary structural causes (50%, 30%, 20%)
  const leak1Euro = Math.round((totalEuroLeakNumber * 0.5) / 5000) * 5000;
  const leak2Euro = Math.round((totalEuroLeakNumber * 0.3) / 5000) * 5000;
  const leak3Euro = Math.max(5000, totalEuroLeakNumber - leak1Euro - leak2Euro);

  const curHours = Math.max(10, Number(intake.currentDgaHoursPerWeek) || 60);
  const tgtHours = Math.max(0, Number(intake.targetDgaHoursPerWeek) || 16);
  const freedHoursPerWeek = Math.max(4, curHours - tgtHours);

  const curEbitdaPct = Number(intake.currentEbitdaPercent) || 5;
  const tgtEbitdaPct = Number(intake.targetEbitdaPercent) || 15;

  return {
    totalEuroLeakNumber,
    totalEuroLeakFormatted: formatEuroPerYear(totalEuroLeakNumber),
    leak1Euro,
    leak2Euro,
    leak3Euro,
    freedHoursPerWeek,
    freedHoursFormatted: `${freedHoursPerWeek} uur / week`,
    currentEbitdaEuro: Math.round((revEuro * curEbitdaPct) / 100),
    targetEbitdaEuro: Math.round((targetRevEuro * tgtEbitdaPct) / 100),
  };
}

export function extractSwimlanesForProcess(process: E2EProcess): string[] {
  const seen = new Set<string>();
  const lanes: string[] = [];
  for (const step of process.steps) {
    const lane = step.department_swimlane.trim() || 'Algemeen';
    if (!seen.has(lane)) {
      seen.add(lane);
      lanes.push(lane);
    }
  }
  return lanes;
}

export function buildFallbackModule1(intake: IntakeData): Module1Output {
  const company = intake.companyName.trim() || 'Het Bedrijf';
  const dga = intake.dgaName?.trim() || 'De DGA';
  const industry = intake.industry.trim() || 'het MKB';
  const fte = Number(intake.fte) || 50;
  const curRev = Number(intake.currentRevenueMillions) || 10;
  const tgtRev = Number(intake.targetRevenueMillions) || 15;
  const curEbitda = Number(intake.currentEbitdaPercent) || 5;
  const tgtEbitda = Number(intake.targetEbitdaPercent) || 15;
  const failPct = Number(intake.failureCostPercent) || 5;
  const minMargin = Number(intake.minGrossMarginPercent) || 32;
  const curHours = Number(intake.currentDgaHoursPerWeek) || 60;
  const tgtHours = Number(intake.targetDgaHoursPerWeek) || 16;
  const oldThreshold = formatEuro(Number(intake.currentApprovalThresholdEuro) || 25000);
  const newMandate = formatEuro(Number(intake.newMtMandateThresholdEuro) || 150000);
  const bottleneck =
    intake.coreBottleneckSummary?.trim() ||
    'faalkosten in de overdracht, ad-hoc maatwerk en verstorende kleine opdrachten';

  const metrics = calculateLiveIntakeMetrics(intake);

  return {
    tldr_3_bullets: [
      `Bij ${company} lekt jaarlijks ${metrics.totalEuroLeakFormatted} winst weg door ${bottleneck.toLowerCase()}.`,
      `DGA ${dga} is zelf het grootste knelpunt door elke offerte boven ${oldThreshold} persoonlijk vast te houden (${curHours} uur/week).`,
      `Door een hard marge-slot van ${minMargin}% en een MT-mandaat tot ${newMandate} stijgt de EBITDA van ${curEbitda}% naar ${tgtEbitda}%.`,
    ],
    total_estimated_euro_leak_per_year: metrics.totalEuroLeakFormatted,
    dga_hours_freed_per_week: metrics.freedHoursFormatted,
    red_flag_diagnosis: {
      founder_bottleneck_headline: `${dga} is hoofdcalculator, planner én brandweerman tegelijk`,
      founder_bottleneck_impact: `${curHours} uur werkweek waarin ${dga} elk dossier boven ${oldThreshold} nakijkt en operationele uitzonderingen zelf oplost.`,
      uncomfortable_truth: `Zolang ${dga} geen harde nee verkoopt aan verstorend kleinwerk en het team zonder technische pre-check laat verkopen, wordt ${company} nooit zelfstandig schaalbaar naar € ${tgtRev}M.`,
      margin_leaks: [
        {
          leak_title: 'Faalkosten, herstelwerk & slechte overdracht Verkoop → Operatie',
          estimated_euro_loss: formatEuroPerYear(metrics.leak1Euro),
          root_cause_one_liner: `Verkoop belooft maatwerk onder de ${minMargin}% brutomarge-norm; uitvoering krijgt onvolledige dossiers.`,
        },
        {
          leak_title: 'Capaciteitsverlies door verstorende kleine ad-hoc opdrachten',
          estimated_euro_loss: formatEuroPerYear(metrics.leak2Euro),
          root_cause_one_liner: `${dga} en het team durven geen nee te zeggen tegen kleine spoedklussen die de hoofdplanning van ${fte} FTE verstoren.`,
        },
        {
          leak_title: `Vertraging & marge-erosie door DGA-goedkeuring boven ${oldThreshold}`,
          estimated_euro_loss: formatEuroPerYear(metrics.leak3Euro),
          root_cause_one_liner: `Geen vaste prijsblokken en geen automatische margevloer (${minMargin}%) in het offertesysteem.`,
        },
      ],
    },
    ogsm: {
      objective_one_liner: `${company} binnen 36 maanden uitbouwen tot een zelfsturend leider in ${industry} op € ${tgtRev}M omzet en ${tgtEbitda}% EBITDA, draaiend zonder ${dga} in de dagelijkse operatie.`,
      goals: [
        {
          metric_name: 'EBITDA-marge',
          current_value: `${curEbitda}% (${formatEuro(metrics.currentEbitdaEuro)})`,
          target_value: `${tgtEbitda}% (${formatEuro(metrics.targetEbitdaEuro)})`,
          deadline: '36 maanden',
        },
        {
          metric_name: 'Jaaromzet Kernfocus',
          current_value: `€ ${curRev}M`,
          target_value: `€ ${tgtRev}M`,
          deadline: '36 maanden',
        },
        {
          metric_name: 'Faalkosten % van omzet',
          current_value: `${failPct}%`,
          target_value: '< 1,8%',
          deadline: '12 maanden',
        },
        {
          metric_name: `Operationele Uren ${dga}`,
          current_value: `${curHours} uur / week`,
          target_value: `${tgtHours} uur / week`,
          deadline: '9 maanden',
        },
      ],
      strategic_pillars: [
        {
          strategy_id: 'PIL-1',
          strategy_title: `01. Standaardiseer Verkoop & Calculatie met Hard Marge-Slot (${minMargin}%)`,
          radical_focus_do: `Werk met vaste modulaire proposities met een automatische brutomarge-vloer van ${minMargin}%.`,
          stop_doing_immediately: `Stop morgen met DGA-akkoord van ${dga} onder ${newMandate} en verbied maatwerk zonder getekende pre-check.`,
          leading_kpi: {
            name: '% Offertes met volledige technische & financiële pre-check',
            target: '100% vóór verzending',
            owner_role: 'Commercieel Manager',
          },
          lagging_kpi: {
            name: `Gerealiseerde brutomarge op opdrachten > ${oldThreshold}`,
            target: `Minimaal ${minMargin}%`,
            owner_role: 'Commercieel Manager',
          },
          top_90_day_action: {
            action: `Bouw standaard calculatieblokken in ERP met automatische verzendblokkade onder ${minMargin}% brutomarge.`,
            owner_role: 'Hoofd Calculatie & Verkoop',
          },
        },
        {
          strategy_id: 'PIL-2',
          strategy_title: '02. IJzeren Overdrachtspoort naar Werkvoorbereiding & Operatie',
          radical_focus_do:
            'Start geen enkel project zonder 100% compleet digitaal uitvoeringsdossier 10 dagen vóór geplande start.',
          stop_doing_immediately:
            'Stop direct met mondelinge overdrachten en ongedocumenteerd meerwerk zonder klantakkoord.',
          leading_kpi: {
            name: '% Dossiers 10 dagen voor start 100% compleet (First-Time-Right)',
            target: '> 95% per week',
            owner_role: 'Hoofd Werkvoorbereiding / Operatie',
          },
          lagging_kpi: {
            name: 'Faalkosten & herstelwerk in uitvoering',
            target: '< 1,8% van maandomzet',
            owner_role: 'Operationeel Verantwoordelijke',
          },
          top_90_day_action: {
            action:
              'Geef Werkvoorbereiding formeel vetorecht op start uitvoering bij incomplete overdracht.',
            owner_role: 'Hoofd Operatie',
          },
        },
        {
          strategy_id: 'PIL-3',
          strategy_title: '03. Radicale Klantfocus & Eliminatie van Verstorend Kleinwerk',
          radical_focus_do: `Richt alle ${fte} FTE op schaalbare kernopdrachten boven ${oldThreshold} met terugkerende contractwaarde.`,
          stop_doing_immediately: `Stop met ad-hoc vriendendiensten en kleine losse klusjes via de telefoon van ${dga}.`,
          leading_kpi: {
            name: 'Aantal ongeplande spoed-onderbrekingen in weekplanning',
            target: '0 verstoringen / week',
            owner_role: 'Hoofd Planning',
          },
          lagging_kpi: {
            name: `Productiviteit & declarabele uren (${fte} FTE)`,
            target: '> 86% per medewerker',
            owner_role: 'Manager Uitvoering',
          },
          top_90_day_action: {
            action: `Stel minimale orderdrempel van ${oldThreshold} in en routeer kleinwerk naar externe partner.`,
            owner_role: 'Operationeel Manager',
          },
        },
      ],
    },
  };
}

export function buildFallbackModule2(intake: IntakeData, _mod1?: Module1Output): Module2Output {
  const company = intake.companyName.trim() || 'Het Bedrijf';
  const dga = intake.dgaName?.trim() || 'De DGA';
  const minMargin = Number(intake.minGrossMarginPercent) || 32;
  const oldThreshold = formatEuro(Number(intake.currentApprovalThresholdEuro) || 25000);
  const newMandate = formatEuro(Number(intake.newMtMandateThresholdEuro) || 150000);

  return {
    tldr_3_bullets: [
      `Elke offerte van ${company} tussen ${oldThreshold} en ${newMandate} loopt via een systeem-slot (≥ ${minMargin}% marge) in plaats van langs ${dga}.`,
      'Werkvoorbereiding heeft hard vetorecht: geen 100% compleet dossier betekent géén vrijgave naar planning.',
      'Meerwerk en afwijkingen in de uitvoering worden automatisch geblokkeerd zonder digitale reden-code en klantakkoord.',
    ],
    e2e_processes: [
      {
        process_id: 'PROC-1',
        process_name: '01. Verkoop-tot-Werkvoorbereiding (Quote-to-Handoff)',
        why_it_matters_one_liner: `Hier ontstaat bij ${company} het grootste deel van de latere faalkosten door te krappe calculaties en onvolledige intake.`,
        process_owner_role: `Commercieel Manager (NIET DGA ${dga})`,
        health_kpis: {
          lead_time: '< 4 werkdagen',
          first_time_right: '96% dossier-compleet',
          margin_target: `Min. ${minMargin}% Brutomarge`,
        },
        steps: [
          {
            step_number: 1,
            bpmn_type: 'Event',
            department_swimlane: 'Verkoop',
            short_title: 'Kwalificatie & Minimale Orderpoort',
            handoff_rule_1_sentence: `Alleen zakelijke kernaanvragen boven ${oldThreshold} die passen binnen de standaardpropositie gaan door naar calculatie.`,
            money_leak_risk: `Verstorend kleinwerk en ad-hoc verzoeken glippen via ${dga} alsnog de organisatie in.`,
            hard_control_rule: `CRM weigert aanmaak van offertedossier onder ${oldThreshold} of buiten het ideale klantprofiel.`,
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI-intakefilter kwalificeert aanvragen direct en wijst te kleine klussen automatisch door naar een partner.',
          },
          {
            step_number: 2,
            bpmn_type: 'Task',
            department_swimlane: 'Verkoop',
            short_title: 'Gestandaardiseerde Technische Intake',
            handoff_rule_1_sentence:
              'Verkoop vult de verplichte digitale intake-checklist 100% in vóór overdracht aan calculatie.',
            money_leak_risk:
              'Verkoop verkoopt aannames vanaf papier waardoor uitvoering later tegen verrassingen aanloopt.',
            hard_control_rule:
              'Calculatie kan pas starten zodra alle verplichte specificaties en brondocumenten in het dossier staan.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI-intake-assistent controleert geüploade klantdocumenten direct op ontbrekende randvoorwaarden.',
          },
          {
            step_number: 3,
            bpmn_type: 'Task',
            department_swimlane: 'Calculatie',
            short_title: 'Modulaire Prijs- & Urenopbouw',
            handoff_rule_1_sentence:
              'Calculator gebruikt bevroren standaardbouwstenen met historische normuren en actuele inkoopprijzen.',
            money_leak_risk:
              'Uren worden te scherp ingeschat om de opdracht binnen te halen ten koste van de nettomarge.',
            hard_control_rule:
              'Normuren zijn vergrendeld in ERP; korting geven verlaagt direct de commerciële provisie.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI vergelijkt de calculatie met de laatste 50 afgeronde opdrachten en waarschuwt bij afwijkingen > 10%.',
          },
          {
            step_number: 4,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Calculatie',
            short_title: `Poort: Brutomarge ≥ ${minMargin}% & < ${newMandate}?`,
            handoff_rule_1_sentence: `Automatische beslisruit op berekende voorcalculatie-marge (≥ ${minMargin}%) en mandaatgrens (${newMandate}).`,
            money_leak_risk: `Voorheen moest ${dga} elke offerte boven ${oldThreshold} zelf controleren.`,
            hard_control_rule: `Is brutomarge ≥ ${minMargin}% én orderwaarde < ${newMandate}? Direct vrijgeven zonder ${dga}. Onder ${minMargin}% blokkeert het systeem verzending.`,
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win: `AI-margecoach rekent direct uit welke scope-aanpassing nodig is om de ${minMargin}% margevloer te halen.`,
          },
          {
            step_number: 5,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Werkvoorbereiding',
            short_title: 'Poort: Dossier 100% Uitvoeringsklaar?',
            handoff_rule_1_sentence:
              'Werkvoorbereiding controleert getekende opdracht, specificaties en levertijden vóór inplannen.',
            money_leak_risk:
              'Halve overdracht vanuit Verkoop veroorzaakt faalkosten, nabestellingen en stilstand in de uitvoering.',
            hard_control_rule:
              'Werkvoorbereiding heeft hard vetorecht: mist 1 verplicht veld, dan springt het dossier terug naar Verkoop.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI-compleetheidsscanner vergelijkt offerte, opdrachtbevestiging en planning in 5 seconden op tegenstrijdigheden.',
          },
          {
            step_number: 6,
            bpmn_type: 'Task',
            department_swimlane: 'Werkvoorbereiding',
            short_title: 'Vrijgave naar Capaciteitsplanning',
            handoff_rule_1_sentence:
              'Opdracht wordt pas definitief ingepland zodra alle materialen en middelen bevestigd zijn.',
            money_leak_risk:
              'Teams starten aan een klus terwijl cruciale onderdelen of informatie nog ontbreken.',
            hard_control_rule:
              'Planbord vergrendelt status "Klaar voor Uitvoering" totdat inkoop/voorraad groen staat in ERP.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Automatische leveranciers-koppeling zet een rood slot op opdrachten met vertraagde leveringen.',
          },
        ],
      },
      {
        process_id: 'PROC-2',
        process_name: '02. Order-tot-Oplevering & Meerwerk-Regie (Order-to-Completion)',
        why_it_matters_one_liner:
          'Dicht het directe lek van faalkosten, spoedbestellingen en onbetaald meerwerk tijdens de uitvoering.',
        process_owner_role: 'Hoofd Operatie & Uitvoering',
        health_kpis: {
          lead_time: '95% op geplande leverdatum',
          first_time_right: '< 1,8% faalkosten',
          margin_target: 'Max. 2% afwijking t.o.v. voorcalculatie',
        },
        steps: [
          {
            step_number: 1,
            bpmn_type: 'Task',
            department_swimlane: 'Planning & Logistiek',
            short_title: '48-Uurs Pre-Start Check',
            handoff_rule_1_sentence:
              '48 uur voor start staat het volledige werkpakket en materiaal gecontroleerd klaar.',
            money_leak_risk:
              'Medewerkers verliezen kostbare uren door zoeken naar spullen of onduidelijke werkinstructies.',
            hard_control_rule:
              'Geen vrijgave naar de werkvloer zonder afgetekende 48-uurs gereedheidsmelding.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Digitaal startpakket stuurt automatisch de juiste instructies naar het uitvoerende team.',
          },
          {
            step_number: 2,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Uitvoering',
            short_title: 'Poort: Scope-Afwijking of Meerwerk?',
            handoff_rule_1_sentence:
              'Vraagt de klant of de situatie ter plekke om extra uren of materiaal buiten de offerte?',
            money_leak_risk:
              'Extra werkzaamheden worden gratis uitgevoerd zonder voorafgaand schriftelijk akkoord.',
            hard_control_rule:
              'Meerwerk > € 350 vereist digitaal akkoord van de klant op de mobiele werkbon vóór uitvoering.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Spraak-naar-Meerwerkbon: medewerker spreekt afwijking in, AI genereert direct geprijsde meerwerkbon voor akkoord.',
          },
          {
            step_number: 3,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Werkvoorbereiding',
            short_title: 'Poort: Spoedbestelling / Herstelwerk?',
            handoff_rule_1_sentence:
              'Elke extra bestelling of herstelactie boven de voorcalculatie vereist een verplichte foutcode.',
            money_leak_risk:
              'Verborgen faalkosten stapelen zich op zonder dat de structurele oorzaak wordt weggenomen.',
            hard_control_rule:
              'Extra inkoop/uren boeken boven budget kan alleen met verplichte oorzaakcode (Verkoop / Voorbereiding / Uitvoering).',
            control_type: 'Dashboard-Check (Detectief)',
            ai_quick_win:
              'Wekelijkse AI-analyse groepeert alle afwijkingen en zet de top-3 oorzaken klaar voor het weekoverleg.',
          },
          {
            step_number: 4,
            bpmn_type: 'Task',
            department_swimlane: 'Uitvoering',
            short_title: 'First-Time-Right Oplevercheck',
            handoff_rule_1_sentence:
              'Opdracht wordt pas afgemeld na volledige kwaliteitscheck en digitale handtekening van de klant.',
            money_leak_risk:
              'Openstaande restpunten vertragen de eindfactuur en kosten extra ritten achteraf.',
            hard_control_rule:
              'Systeem sluit het project pas bij 0 openstaande restpunten en een getekend opleverprotocol.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Automatische controle van opleverfoto’s en meetwaarden genereert direct het oplevercertificaat.',
          },
          {
            step_number: 5,
            bpmn_type: 'Event',
            department_swimlane: 'Financiën',
            short_title: 'Directe Eindfactuur & Nacalculatie-Signaal',
            handoff_rule_1_sentence:
              'Digitale oplevering triggert binnen 24 uur de eindfactuur én de voor- vs. nacalculatie vergelijking.',
            money_leak_risk:
              'Facturatie blijft weken liggen en margeverlies wordt pas maanden later ontdekt.',
            hard_control_rule:
              'ERP verstuurt binnen 24 uur na oplevering de factuur inclusief al het digitaal geaccordeerde meerwerk.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win: `AI stuurt direct een rode uitzonderings-alert als de gerealiseerde projectmarge > 3% onder de ${minMargin}% norm ligt.`,
          },
        ],
      },
      {
        process_id: 'PROC-3',
        process_name: '03. Terugkerende Contracten & Service-Regie (Contract-to-Cash)',
        why_it_matters_one_liner: `Bouwt voorspelbare, hoog-rendabele terugkerende omzet op en beschermt de planning van ${company}.`,
        process_owner_role: 'Hoofd Service & Relatiebeheer',
        health_kpis: {
          lead_time: '100% SLA-dekking',
          first_time_right: '88% in 1 keer opgelost',
          margin_target: `Min. ${minMargin + 8}% Brutomarge op contracten`,
        },
        steps: [
          {
            step_number: 1,
            bpmn_type: 'Event',
            department_swimlane: 'Relatiebeheer',
            short_title: 'Automatische Service- & SLA-Koppeling',
            handoff_rule_1_sentence:
              'Elke opgeleverde kernopdracht krijgt standaard een meerjarig service- of vervolgcontract aangeboden.',
            money_leak_risk:
              'Na oplevering stopt de omzetstroom en mist het bedrijf de meest winstgevende terugkerende marge.',
            hard_control_rule:
              'Dossier kan pas gearchiveerd worden nadat een meerjarig contractvoorstel is aangemaakt en verzonden.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Automatische jaarlijkse prijsindexatie en contractverlenging vanuit het ERP-systeem.',
          },
          {
            step_number: 2,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Service & Planning',
            short_title: 'Poort: Actief Zakelijk Contract?',
            handoff_rule_1_sentence:
              'Binnenkomende service- of spoedvragen worden direct getoetst op een actief zakelijk contract.',
            money_leak_risk: `Losse klusjes en oude kennissen bellen rechtstreeks naar ${dga} en verstoren de projectplanning.`,
            hard_control_rule:
              'Geen actief contractnummer = geen directe inplanning; aanvraag wordt doorgezet naar partner of standaard tariefpoort.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Slimme intakerouter herkent contractklanten direct en houdt niet-contractwerk buiten de hoofdplanning.',
          },
          {
            step_number: 3,
            bpmn_type: 'Task',
            department_swimlane: 'Service & Planning',
            short_title: 'Pre-Diagnose op Afstand',
            handoff_rule_1_sentence:
              'Servicedesk stelt oorzaak en benodigde onderdelen vast vóórdat er capaciteit wordt ingepland.',
            money_leak_risk:
              'Onvoorbereide inzet zorgt voor dubbele afspraken en ondeclarabele uren.',
            hard_control_rule:
              'Geen service-opdracht op het planbord zonder ingevulde probleemdiagnose en tijdsindicatie.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI-diagnose voorspelt op basis van klantmelding direct de oplossing en benodigde materialen.',
          },
          {
            step_number: 4,
            bpmn_type: 'Task',
            department_swimlane: 'Service Team',
            short_title: 'Gescheiden Capaciteitsblokken',
            handoff_rule_1_sentence:
              'Service en reguliere projecten werken met strikt gescheiden capaciteit zodat projecten nooit stilvallen.',
            money_leak_risk:
              'Specialisten worden van grote winstgevende projecten weggetrokken voor ad-hoc brandjes.',
            hard_control_rule:
              'Projectcapaciteit is vergrendeld in het planbord; uitwisseling vereist MT-goedkeuring.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Dynamische route- en capaciteitsoptimalisatie bundelt servicebezoeken per regio.',
          },
          {
            step_number: 5,
            bpmn_type: 'Task',
            department_swimlane: 'Financiën',
            short_title: 'Automatische Buiten-Bundel Facturatie',
            handoff_rule_1_sentence:
              'Werkzaamheden en materialen buiten de SLA-dekking worden dezelfde dag automatisch gefactureerd.',
            money_leak_risk:
              'Extra vervangingen en uren worden per ongeluk onder het vaste contract weggeboekt.',
            hard_control_rule:
              'ERP toetst elke geboekte regel tegen de contractdekking en zet buiten-bundel werk direct op de factuur.',
            control_type: 'Dashboard-Check (Detectief)',
            ai_quick_win:
              'AI scant afgeronde werkbonnen op verborgen meerwerk en maakt automatisch de factuurregel aan.',
          },
        ],
      },
    ],
  };
}

export function buildFallbackModule3(
  intake: IntakeData,
  _mod1?: Module1Output,
  _mod2?: Module2Output
): Module3Output {
  const company = intake.companyName.trim() || 'Het Bedrijf';
  const dga = intake.dgaName?.trim() || 'De DGA';
  const minMargin = Number(intake.minGrossMarginPercent) || 32;
  const tgtEbitda = Number(intake.targetEbitdaPercent) || 15;
  const tgtRev = Number(intake.targetRevenueMillions) || 20;
  const oldThreshold = formatEuro(Number(intake.currentApprovalThresholdEuro) || 25000);
  const newMandate = formatEuro(Number(intake.newMtMandateThresholdEuro) || 150000);

  return {
    tldr_3_bullets: [
      `DGA ${dga} stopt vandaag met het keuren van offertes onder ${newMandate}, dagelijkse planning en kleinwerk.`,
      `Het MT van ${company} krijgt volledig mandaat binnen ≥ ${minMargin}% brutomarge; ${dga} stuurt alleen op rode uitzonderingen.`,
      `Met 3 vaste ritme-meetings op de minuut af groeit ${company} voorspelbaar naar € ${tgtRev}M omzet en ${tgtEbitda}% EBITDA.`,
    ],
    dga_freedom_plan: {
      stop_doing_today: [
        `Geen enkele offerte tussen ${oldThreshold} en ${newMandate} meer bekijken of handmatig accorderen.`,
        `Geen ad-hoc telefoontjes voor kleine klusjes of vriendendiensten meer aannemen en in de planning duwen.`,
        'Niet meer ingrijpen in het dagelijkse planbord, de werkvoorbereiding of spoedbestellingen op de werkvloer.',
        'Geen voorcalculaties van verkopers meer persoonlijk naberekenen aan het bureau.',
      ],
      only_focus_on: [
        `Strategische sleutelklanten, partnerships en grote deals boven ${newMandate}.`,
        `Maandelijkse kasstroom-, EBITDA- (${tgtEbitda}% doel) en voorcalculatie-vs-nacalculatie review (90 min per maand).`,
        `Waardecreatie, MT-ontwikkeling en lange-termijn koers richting € ${tgtRev}M omzet.`,
      ],
      golden_mandate_rule: `GOUDEN MANDAATREGEL: Zolang een opdracht onder ${newMandate} een brutomarge van ≥ ${minMargin}% heeft en het overdrachtsdossier 100% compleet is, beslist het MT van ${company} volledig zelfstandig zonder tussenkomst van ${dga}.`,
    },
    meeting_rhythm: [
      {
        meeting_title: `Vloer- & Poortcheck (Geen ${dga} aanwezig)`,
        tier_badge: 'Week - 30 min Vloer',
        chair_role: 'Hoofd Werkvoorbereiding / Operatie',
        participants: ['Hoofd Verkoop', 'Hoofd Werkvoorbereiding', 'Hoofd Uitvoering', 'Hoofd Planning'],
        dashboard_kpis_on_screen: [
          '% Dossiers 100% compleet (10 dagen voor start)',
          'Faalkosten & herstelwerk afgelopen week (€)',
          'Declarabele productiviteit (%)',
        ],
        agenda_blocks: [
          {
            minutes: 'Min 00 - 10',
            topic: 'Poort-Check komende 2 weken',
            forced_decision:
              'Welke opdrachten zijn 100% compleet (GROEN) en welke worden geblokkeerd voor start (ROOD)?',
          },
          {
            minutes: 'Min 10 - 20',
            topic: 'Top-3 Faalkosten & Afwijkingen afgelopen week',
            forced_decision:
              'Welke 1 standaardnorm of intake-check passen we deze week aan om herhaling te stoppen?',
          },
          {
            minutes: 'Min 20 - 30',
            topic: 'Capaciteit & Meerwerk-discipline',
            forced_decision:
              'Zijn alle meerwerkbonnen > € 350 digitaal getekend door de opdrachtgever vóór uitvoering?',
          },
        ],
      },
      {
        meeting_title: `Proces- & Margeslot Review (MT zonder ${dga})`,
        tier_badge: 'Maand - 60 min Proces',
        chair_role: 'Operationeel Directeur / MT-Voorzitter',
        participants: [
          'Commercieel Manager',
          'Hoofd Werkvoorbereiding',
          'Hoofd Uitvoering',
          'Financieel Controller',
        ],
        dashboard_kpis_on_screen: [
          `Voorcalculatie vs. Nacalculatie marge (norm ≥ ${minMargin}%)`,
          'Faalkosten % van de maandomzet (doel < 1,8%)',
          'Groei terugkerende contractomzet (€ ARR)',
        ],
        agenda_blocks: [
          {
            minutes: 'Min 00 - 20',
            topic: 'Nacalculatie-Audit afgeronde projecten',
            forced_decision: `Bij elk project onder ${minMargin - 2}% brutomarge: wordt de rekennorm in ERP per direct verhoogd?`,
          },
          {
            minutes: 'Min 20 - 40',
            topic: 'Proces-Sloten & Vetorecht Evaluatie',
            forced_decision:
              'Waar werd geprobeerd een proces-slot te omzeilen en welke systeempaspoort-regel scherpen we aan?',
          },
          {
            minutes: 'Min 40 - 60',
            topic: 'Conversie naar Meerjarige Contracten',
            forced_decision:
              'Welke opgeleverde klanten van deze maand hebben nog geen actief vervolg- of onderhoudscontract?',
          },
        ],
      },
      {
        meeting_title: `Boardroom Cockpit (${dga} + MT op Uitzonderingen)`,
        tier_badge: 'Maand - 90 min Boardroom',
        chair_role: `DGA (${dga})`,
        participants: [
          `DGA (${dga})`,
          'Operationeel Verantwoordelijke',
          'Commercieel Manager',
          'Financieel Controller',
        ],
        dashboard_kpis_on_screen: [
          `Netto EBITDA % (Doel: pad naar ${tgtEbitda}%)`,
          'Vrije Kasstroom & Onderhanden Werk (OHW)',
          'Rode Stoplicht-Escalaties (> 3% margelek)',
        ],
        agenda_blocks: [
          {
            minutes: 'Min 00 - 30',
            topic: '10-Seconden Stoplicht Scorecard',
            forced_decision:
              'Groene KPI’s worden NIET besproken; alleen rode KPI’s krijgen een hard 30-dagen herstelbesluit.',
          },
          {
            minutes: 'Min 30 - 60',
            topic: 'Strategische OGSM Voortgang (90-Dagen Acties)',
            forced_decision:
              'Liggen de 3 OGSM-pijlers op koers of verschuiven we direct capaciteit?',
          },
          {
            minutes: 'Min 60 - 90',
            topic: `Strategische Groei naar € ${tgtRev}M`,
            forced_decision: `Welke strategische deals (> ${newMandate}) of investeringen vragen komende maand om inzet van ${dga}?`,
          },
        ],
      },
    ],
    traffic_light_escalation: [
      {
        red_flag_trigger: `Project dreigt tijdens uitvoering meer dan 3% onder de ${minMargin}% brutomarge-norm te zakken.`,
        who_fixes_it: 'Hoofd Uitvoering + Commercieel Manager',
        action_within_48h:
          'Directe stop op onbetaald meerwerk; gesprek met opdrachtgever voor bijbetaling of scope-reductie.',
        when_dga_steps_in: `Pas als het totale margeverlies op 1 project groter dreigt te worden dan ${oldThreshold}.`,
      },
      {
        red_flag_trigger:
          'Meer dan 2 dossiers in 1 week afgekeurd bij de overdrachtspoort van Werkvoorbereiding.',
        who_fixes_it: 'Commercieel Manager',
        action_within_48h:
          'Bevries nieuwe offertes van betreffende verkoper totdat alle openstaande dossiers 100% compleet zijn.',
        when_dga_steps_in:
          'Niet. Pas bij structureel falen van de Commercieel Manager gedurende 2 opeenvolgende maanden.',
      },
      {
        red_flag_trigger:
          'Wekelijkse faalkosten en spoedbestellingen overschrijden de 1,8% maandomzet-drempel.',
        who_fixes_it: 'Hoofd Werkvoorbereiding / Operatie',
        action_within_48h:
          'Blokkeer handmatige bestelrechten en voer verplichte 48-uurs pre-start controle in.',
        when_dga_steps_in:
          'Pas als het maandelijkse faalkostenbudget twee maanden op rij wordt overschreden.',
      },
      {
        red_flag_trigger: `Offertedossier boven ${newMandate} of afwijkend juridisch/financieel risicoprofiel.`,
        who_fixes_it: 'Commercieel Manager + Financieel Controller',
        action_within_48h: `Stel een 1-pagina risico- & margevoorstel op met 2 keuze-opties voor ${dga}.`,
        when_dga_steps_in: `${dga} geeft binnen 24 uur een GO / NO-GO op basis van de 1-pagina samenvatting (kost max. 15 minuten).`,
      },
    ],
  };
}
