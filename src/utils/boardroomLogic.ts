export interface IntakeData {
  companyName: string;
  industry: string;
  fte: number;
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

export const DEMO_CASE_JANSEN: IntakeData = {
  companyName: 'Jansen Klimaattechniek B.V.',
  industry: 'Zakelijke Klimaatinstallaties & Onderhoud',
  fte: 65,
  rawNotes:
    'Bedrijf: Jansen Klimaattechniek B.V. (installatie en onderhoud van duurzame klimaatinstallaties voor zakelijke panden). Omzet: 14 miljoen euro, 65 fte. Situatie uit gesprek met DGA (Peter): Peter werkt 65 uur per week. Elke offerte boven de 25.000 euro moet over zijn bureau omdat verkopers anders dingen beloven die de monteurs buiten niet kunnen maken of waar te weinig marge op zit. De omzet groeit met 15% per jaar, maar de nettowinst is gedaald van 11% naar 4% door faalkosten, nabestellingen op de bouwplaats en slechte overdracht van calculatie naar werkvoorbereiding. Daarnaast doen ze nog steeds kleine particuliere cv-ketel klusjes omdat Peter geen nee durft te zeggen tegen oude klanten, wat de planning compleet verstoort. Peter wil dat het bedrijf over 3 jaar zonder hem kan draaien op 15% EBITDA en 20 miljoen omzet, zodat hij een deel aan een investeerder kan verkopen.',
};

export interface IntakeValidationResult {
  valid: boolean;
  errors: {
    companyName?: string;
    industry?: string;
    fte?: string;
    rawNotes?: string;
  };
}

export function validateIntakeInput(data: Partial<IntakeData>): IntakeValidationResult {
  const errors: IntakeValidationResult['errors'] = {};

  if (!data.companyName || data.companyName.trim().length < 2) {
    errors.companyName = 'Vul een geldige bedrijfsnaam in.';
  }
  if (!data.industry || data.industry.trim().length < 2) {
    errors.industry = 'Vul de branche in.';
  }
  const fteNum = Number(data.fte);
  if (!Number.isFinite(fteNum) || fteNum < 1 || fteNum > 10000) {
    errors.fte = 'Vul een geldig aantal FTE in (1 - 10.000).';
  }
  if (!data.rawNotes || data.rawNotes.trim().length < 20) {
    errors.rawNotes = 'Voer minimaal één concrete situatiebeschrijving in (min. 20 tekens).';
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

export function formatEuroPerYear(amount: number): string {
  const formatted = new Intl.NumberFormat('nl-NL').format(Math.max(0, Math.round(amount)));
  return `€ ${formatted} / jaar`;
}

export function calculateTotalMarginLeak(leaks: MarginLeak[]): string {
  const sum = leaks.reduce((acc, item) => acc + parseEuroAmount(item.estimated_euro_loss), 0);
  if (sum <= 0) return '€ 0 / jaar';
  return formatEuroPerYear(sum);
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
  const isJansen = intake.companyName.toLowerCase().includes('jansen');
  const name = intake.companyName.trim() || 'Het Bedrijf';

  if (isJansen) {
    return {
      tldr_3_bullets: [
        'Er lekt € 980.000 winst weg door faalkosten op de bouw en foute verkoopbeloftes.',
        'DGA Peter is zelf het grootste knelpunt door elke offerte boven € 25k vast te houden.',
        'Particuliere cv-ketel klusjes slopen het monteursritme van grote zakelijke projecten.',
      ],
      total_estimated_euro_leak_per_year: '€ 980.000 / jaar',
      dga_hours_freed_per_week: '28 uur / week',
      red_flag_diagnosis: {
        founder_bottleneck_headline: 'Peter is hoofdcalculator én brandweerman tegelijk',
        founder_bottleneck_impact:
          '65 uur werkweek waarin Peter offertes nakijkt en spoedklussen van oude kennissen tussendoor duwt.',
        uncomfortable_truth:
          'Zolang Peter geen nee zegt tegen particuliere ketelklusjes en verkopers zonder techniekcheck laat verkopen, koopt geen enkele investeerder dit bedrijf.',
        margin_leaks: [
          {
            leak_title: 'Faalkosten & nabestellingen op de bouwplaats',
            estimated_euro_loss: '€ 520.000 / jaar',
            root_cause_one_liner:
              'Verkoop belooft maatwerk zonder technische check; werkvoorbereiding krijgt halve dossiers.',
          },
          {
            leak_title: 'Particuliere cv-ketel klusjes tussendoor',
            estimated_euro_loss: '€ 260.000 / jaar',
            root_cause_one_liner:
              'DGA durft geen nee te zeggen tegen oude bekenden en trekt monteurs weg van grote projecten.',
          },
          {
            leak_title: 'DGA-goedkeuring op elke offerte > € 25.000',
            estimated_euro_loss: '€ 200.000 / jaar',
            root_cause_one_liner:
              'Geen vaste prijsblokken en minimale margedrempel in het offertesysteem.',
          },
        ],
      },
      ogsm: {
        objective_one_liner:
          'Binnen 36 maanden zelfstandig draaiend zakelijk klimaatbedrijf op € 20M omzet en 15% EBITDA, verkoopklaar zonder DGA in de operatie.',
        goals: [
          {
            metric_name: 'EBITDA-marge',
            current_value: '4,0% (€ 560k)',
            target_value: '15,0% (€ 3,0M)',
            deadline: '36 maanden',
          },
          {
            metric_name: 'Zakelijke Omzet',
            current_value: '€ 14,0M',
            target_value: '€ 20,0M',
            deadline: '36 maanden',
          },
          {
            metric_name: 'Faalkosten % van omzet',
            current_value: '7,2%',
            target_value: '< 2,0%',
            deadline: '12 maanden',
          },
          {
            metric_name: 'DGA Operationele Uren',
            current_value: '65 uur / week',
            target_value: '12 uur / week',
            deadline: '9 maanden',
          },
        ],
        strategic_pillars: [
          {
            strategy_id: 'PIL-1',
            strategy_title: '01. Standaardiseer Verkoop & Calculatie met Harde Marge-Sloten',
            radical_focus_do:
              'Werk met 8 vaste modulaire zakelijke klimaatconcepten met automatische brutomarge-vloer van 32%.',
            stop_doing_immediately:
              'Stop morgen met DGA-akkoord onder € 150.000 en verbied maatwerk zonder getekende opnamecheck.',
            leading_kpi: {
              name: '% Offertes met volledige technische pre-check',
              target: '100% vóór verzending',
              owner_role: 'Hoofd Verkoop & Calculatie',
            },
            lagging_kpi: {
              name: 'Gerealiseerde brutomarge op projecten > € 25k',
              target: 'Minimaal 32,0%',
              owner_role: 'Commercieel Manager',
            },
            top_90_day_action: {
              action: 'Bouw 8 standaard calculatieblokken in ERP met blokkade onder 32% brutomarge.',
              owner_role: 'Hoofd Calculatie',
            },
          },
          {
            strategy_id: 'PIL-2',
            strategy_title: '02. IJzeren Overdrachtspoort naar Werkvoorbereiding & Uitvoering',
            radical_focus_do:
              'Start geen enkel project zonder 100% compleet digitaal uitvoeringsdossier 10 dagen vóór start bouw.',
            stop_doing_immediately:
              'Stop direct met mondelinge overdrachten en spoedbestellingen vanaf de bouwplaats zonder afdelingshoofdakkoord.',
            leading_kpi: {
              name: '% Dossiers 10 dagen voor start 100% compleet',
              target: '> 95% per week',
              owner_role: 'Hoofd Werkvoorbereiding',
            },
            lagging_kpi: {
              name: 'Nabestellingen & faalkosten op de bouwplaats',
              target: '< € 12.000 / maand',
              owner_role: 'Operationeel Directeur (COO)',
            },
            top_90_day_action: {
              action: 'Voer verplichte 15-minuten Gate-Check in tussen Calculatie en Werkvoorbereiding.',
              owner_role: 'Hoofd Werkvoorbereiding',
            },
          },
          {
            strategy_id: 'PIL-3',
            strategy_title: '03. 100% Zakelijke Focus & Afstoten Particulier Kleinwerk',
            radical_focus_do:
              'Richt alle 65 FTE op zakelijke utiliteitsprojecten (> € 35k) met meerjarige onderhoudscontracten.',
            stop_doing_immediately:
              'Draag alle 420 particuliere cv-ketel klanten deze maand over aan een lokale partner tegen doorverwijsfee.',
            leading_kpi: {
              name: 'Aantal verstorende particuliere klussen in planning',
              target: '0 klussen / week',
              owner_role: 'Hoofd Planning & Service',
            },
            lagging_kpi: {
              name: 'Monteursproductiviteit (declarabele projecturen)',
              target: '> 86% per monteur',
              owner_role: 'Manager Uitvoering',
            },
            top_90_day_action: {
              action: 'Teken overdrachtscontract voor particuliere cv-portefeuille en bevries DGA-telefoonlijn.',
              owner_role: 'Operationeel Directeur (COO)',
            },
          },
        ],
      },
    };
  }

  return {
    tldr_3_bullets: [
      `Bij ${name} lekt jaarlijks circa € 480.000 marge weg door ad-hoc maatwerk en herstelwerk.`,
      'De DGA is de centrale flessenhals doordat operationele beslissingen geen duidelijk mandaat hebben.',
      'Kleine verstorende opdrachten vreten de capaciteit van winstgevende kernprojecten op.',
    ],
    total_estimated_euro_leak_per_year: '€ 480.000 / jaar',
    dga_hours_freed_per_week: '24 uur / week',
    red_flag_diagnosis: {
      founder_bottleneck_headline: `DGA van ${name} houdt elk operationeel dossier vast`,
      founder_bottleneck_impact:
        'Meer dan 24 uur per week gaat verloren aan ad-hoc goedkeuringen, brandjes blussen en nacalculaties.',
      uncomfortable_truth:
        'Zolang het team elke afwijking bij de directie mag neerleggen, neemt niemand eigenaarschap voor de netto marge.',
      margin_leaks: [
        {
          leak_title: 'Faalkosten door onvolledige overdracht Verkoop naar Operatie',
          estimated_euro_loss: '€ 240.000 / jaar',
          root_cause_one_liner: 'Verkoop sluit deals zonder harde haalbaarheidscheck van uitvoering.',
        },
        {
          leak_title: 'Capaciteitsverlies door kleine ad-hoc klantverzoeken',
          estimated_euro_loss: '€ 145.000 / jaar',
          root_cause_one_liner: 'Geen harde ondergrens op ordergrootte; planning wordt dagelijks omgegooid.',
        },
        {
          leak_title: 'Marge-erosie door ongedocumenteerd meerwerk',
          estimated_euro_loss: '€ 95.000 / jaar',
          root_cause_one_liner: 'Extra uren worden wel gemaakt maar niet vooraf getekend of gefactureerd.',
        },
      ],
    },
    ogsm: {
      objective_one_liner: `${name} binnen 24 maanden transformeren naar een zelfsturend bedrijf in ${intake.industry} met > 15% EBITDA.`,
      goals: [
        {
          metric_name: 'EBITDA-marge',
          current_value: '5,5%',
          target_value: '15,0%',
          deadline: '24 maanden',
        },
        {
          metric_name: 'Faalkosten & Herstelwerk',
          current_value: '6,8% van omzet',
          target_value: '< 1,8% van omzet',
          deadline: '12 maanden',
        },
        {
          metric_name: 'DGA Operationele Druk',
          current_value: '58 uur / week',
          target_value: '14 uur / week',
          deadline: '9 maanden',
        },
      ],
      strategic_pillars: [
        {
          strategy_id: 'PIL-1',
          strategy_title: '01. Harde Margevloer & Standaardisatie in Verkoop',
          radical_focus_do: 'Verkoop uitsluitend binnen 5 gestandaardiseerde proposities met vaste prijslijsten.',
          stop_doing_immediately: 'Stop direct met DGA-goedkeuring op standaardoffertes en kortingen zonder tegenprestatie.',
          leading_kpi: {
            name: '% Offertes binnen standaardmarge (>32%)',
            target: '100% per week',
            owner_role: 'Commercieel Verantwoordelijke',
          },
          lagging_kpi: {
            name: 'Gerealiseerde brutomarge per project',
            target: '> 34,0%',
            owner_role: 'Commercieel Verantwoordelijke',
          },
          top_90_day_action: {
            action: 'Activeer automatische margeblokkade in offertesysteem.',
            owner_role: 'Hoofd Verkoop',
          },
        },
        {
          strategy_id: 'PIL-2',
          strategy_title: '02. Foutloze Overdrachtspoort naar Uitvoering',
          radical_focus_do: 'Start pas met plannen als de intake-checklist 100% digitaal is afgetekend.',
          stop_doing_immediately: 'Verbied mondelinge overdrachten en start zonder compleet dossier.',
          leading_kpi: {
            name: '% Projecten dat First-Time-Right door intake komt',
            target: '> 94%',
            owner_role: 'Hoofd Operatie',
          },
          lagging_kpi: {
            name: 'Faalkosten in uitvoering',
            target: '< € 8.000 / maand',
            owner_role: 'Hoofd Operatie',
          },
          top_90_day_action: {
            action: 'Implementeer verplichte digitale Gate-Check tussen verkoop en uitvoering.',
            owner_role: 'Hoofd Operatie',
          },
        },
        {
          strategy_id: 'PIL-3',
          strategy_title: '03. Capaciteitsbescherming & Meerwerk-Discipline',
          radical_focus_do: 'Factureer 100% van al het meerwerk via digitaal akkoord op locatie.',
          stop_doing_immediately: 'Stop met onbetaalde vriendendiensten en klussen onder de minimale orderdrempel.',
          leading_kpi: {
            name: '% Meerwerk vooraf digitaal geaccordeerd',
            target: '100%',
            owner_role: 'Projectleider',
          },
          lagging_kpi: {
            name: 'Declarabele urenratio team',
            target: '> 85%',
            owner_role: 'Operationeel Manager',
          },
          top_90_day_action: {
            action: 'Stel ondergrens van orderwaarde in en automatiseer meerwerk-goedkeuring.',
            owner_role: 'Operationeel Manager',
          },
        },
      ],
    },
  };
}

export function buildFallbackModule2(_intake: IntakeData, _mod1?: Module1Output): Module2Output {
  return {
    tldr_3_bullets: [
      'Elke offerte boven € 25k loopt voortaan via een systeem-slot in plaats van over het bureau van Peter.',
      'Werkvoorbereiding heeft vetorecht: geen compleet technisch dossier betekent géén monteur in de bus.',
      'Meerwerk en nabestellingen op de bouw worden geblokkeerd zonder digitale reden-code en foto.',
    ],
    e2e_processes: [
      {
        process_id: 'PROC-1',
        process_name: '01. Verkoop-tot-Werkvoorbereiding (Quote-to-Handoff)',
        why_it_matters_one_liner:
          'Hier ontstaat 70% van de latere faalkosten door te rooskleurige beloftes en te krappe calculaties.',
        process_owner_role: 'Commercieel Manager (NIET de DGA)',
        health_kpis: {
          lead_time: '< 4 werkdagen',
          first_time_right: '96% dossier-compleet',
          margin_target: 'Min. 32% Brutomarge',
        },
        steps: [
          {
            step_number: 1,
            bpmn_type: 'Event',
            department_swimlane: 'Verkoop',
            short_title: 'Zakelijke Aanvraag Filter',
            handoff_rule_1_sentence:
              'Alleen zakelijke aanvragen > € 25.000 met geldig KvK-nummer gaan door naar opname.',
            money_leak_risk:
              'Particuliere cv-ketel klusjes en kleine gunsten glippen via Peter alsnog de planning in.',
            hard_control_rule:
              'CRM weigert aanmaak van offertedossier onder € 25.000 of zonder zakelijk pand-profiel.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI-intakebot filtert particuliere aanvragen direct eruit en stuurt ze door naar de lokale cv-partner.',
          },
          {
            step_number: 2,
            bpmn_type: 'Task',
            department_swimlane: 'Verkoop',
            short_title: 'Technische Schouw op Locatie',
            handoff_rule_1_sentence:
              'Verkoper vult verplichte 12-punts opname-app in inclusief foto’s van schacht en dakdoorvoer.',
            money_leak_risk:
              'Verkoper schat leidingwerk vanaf tekening in waardoor monteurs later niet uitkomen.',
            hard_control_rule:
              'Calculatie kan pas starten als alle 12 verplichte opnamefoto’s en maten in het dossier staan.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Mobiele AI-schouw app controleert automatisch of typeplaatjes en meterkastfoto’s scherp en compleet zijn.',
          },
          {
            step_number: 3,
            bpmn_type: 'Task',
            department_swimlane: 'Calculatie',
            short_title: 'Modulaire Prijsopbouw',
            handoff_rule_1_sentence:
              'Calculator selecteert standaard klimaatbouwstenen met vaste montage-uren en materiaalprijzen.',
            money_leak_risk:
              'Te lage inschatting van montage-uren om de klantprijs kunstmatig omlaag te rekenen.',
            hard_control_rule:
              'Urennormen uit standaardblokken zijn bevroren; korting geven verlaagt direct de verkopersbonus.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI vergelijkt calculatie met de laatste 50 vergelijkbare projecten en markeert urenafwijkingen > 10%.',
          },
          {
            step_number: 4,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Calculatie',
            short_title: 'Poort: Brutomarge ≥ 32%?',
            handoff_rule_1_sentence:
              'Automatische beslisruit op berekende voorcalculatie-marge en technische standaardisatie.',
            money_leak_risk:
              'Vroeger moest Peter elke offerte > € 25k zelf nakijken, wat 15 uur per week kostte.',
            hard_control_rule:
              'Is marge ≥ 32% én standaardmodule? Dan direct vrijgeven zonder DGA. Onder 32%? Systeem blokkeert verzending.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Automatische marge-audit berekent direct welk onderdeel aangepast moet worden om 32% te halen.',
          },
          {
            step_number: 5,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Werkvoorbereiding',
            short_title: 'Poort: Dossier 100% Bouwklaar?',
            handoff_rule_1_sentence:
              'Werkvoorbereider controleert getekende offerte, opnamefoto’s en levertijden vóór inplannen.',
            money_leak_risk:
              'Halve overdracht zorgt voor € 520.000 aan faalkosten en stilstaande monteurs op de bouw.',
            hard_control_rule:
              'Werkvoorbereider heeft hard vetorecht: mist 1 item, dan springt het dossier terug naar Verkoop.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI-compleetheidsscanner checkt in 5 seconden of offerte, tekeningen en materiaallijst exact overeenkomen.',
          },
          {
            step_number: 6,
            bpmn_type: 'Task',
            department_swimlane: 'Werkvoorbereiding',
            short_title: 'Vrijgave naar Uitvoeringsplanning',
            handoff_rule_1_sentence:
              'Project wordt pas ingepland zodra alle materialen bevestigd zijn voor levering.',
            money_leak_risk:
              'Monteurs starten op een project terwijl warmtepompen of kleppen nog in backorder staan.',
            hard_control_rule:
              'Planbord vergrendelt projectstatus totdat Inkoop leverbevestiging in ERP heeft gekoppeld.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Koppeling met groothandels-API zet automatisch een rood slot op projecten met vertraagde onderdelen.',
          },
        ],
      },
      {
        process_id: 'PROC-2',
        process_name: '02. Order-tot-Oplevering op de Bouwplaats (Order-to-Completion)',
        why_it_matters_one_liner:
          'Stopt het weglekken van marge door spoedbestellingen, zoekgeraakt materiaal en gratis meerwerk.',
        process_owner_role: 'Hoofd Uitvoering & Realisatie',
        health_kpis: {
          lead_time: '95% op geplande einddatum',
          first_time_right: '< 1,5% nabestellingen',
          margin_target: 'Max. 2% afwijking t.o.v. voorcalculatie',
        },
        steps: [
          {
            step_number: 1,
            bpmn_type: 'Task',
            department_swimlane: 'Logistiek & Magazijn',
            short_title: 'Projectkrat Volledigheidscheck',
            handoff_rule_1_sentence:
              'Magazijn zet 48 uur voor start alle materialen per bouwfase klaar op gepersonaliseerde rolcontainers.',
            money_leak_risk:
              'Monteurs rijden ’s ochtends langs de groothandel en verliezen 45 minuten per dag per bus.',
            hard_control_rule:
              'Geen monteur haalt los materiaal bij de balie; alleen gescande projectkratten verlaten het magazijn.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Foto-scan bij uitgifte registreert exact welke container compleet op de bouwplaats is afgeleverd.',
          },
          {
            step_number: 2,
            bpmn_type: 'Task',
            department_swimlane: 'Uitvoering (Monteurs)',
            short_title: 'Dagstart & Tekeningcheck',
            handoff_rule_1_sentence:
              'Eerste monteur opent digitaal bouwplaatspaspoort op tablet en bevestigt maatvoering.',
            money_leak_risk:
              'Monteurs werken vanaf verouderde papieren tekeningen in de bus.',
            hard_control_rule:
              'Urenregistratie op project opent pas na vinkje op laatste revisietekening in de tablet-app.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Tablet-assistent leest wijzigingen t.o.v. vorige revisie in 3 korte gesproken bullets voor aan de monteur.',
          },
          {
            step_number: 3,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Uitvoering (Monteurs)',
            short_title: 'Poort: Afwijking of Meerwerk?',
            handoff_rule_1_sentence:
              'Wordt er op de bouw meer materiaal of > 2 uur extra tijd gevraagd dan gepland?',
            money_leak_risk:
              'Monteurs lossen bouwkundige fouten van de aannemer gratis op zonder meerwerkbon.',
            hard_control_rule:
              'Meerwerk > € 350 vereist digitale handtekening van uitvoerder op de tablet vóórdat er gebouwd wordt.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Spraak-naar-Meerwerkbon: monteur spreekt 20 seconden in, AI maakt direct geprijsde meerwerkbon voor handtekening.',
          },
          {
            step_number: 4,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Werkvoorbereiding',
            short_title: 'Poort: Spoed-Nabestelling Nodig?',
            handoff_rule_1_sentence:
              'Elke nabestelling vanaf de bouwplaats moet langs de foutoorzaak-registratie.',
            money_leak_risk:
              'Onzichtbare nabestellingen vreten de projectmarge op zonder dat iemand leert van de oorzaak.',
            hard_control_rule:
              'Inkooporder boven voorcalculatie kan alleen geplaatst worden met verplichte foutcode (Calculatie / Leverancier / Bouw).',
            control_type: 'Dashboard-Check (Detectief)',
            ai_quick_win:
              'Wekelijkse AI-analyse groepeert alle nabestellingen en toont top-3 oorzaken op het vrijdagdashboard.',
          },
          {
            step_number: 5,
            bpmn_type: 'Task',
            department_swimlane: 'Uitvoering (Monteurs)',
            short_title: 'Inbedrijfstelling & Opleverrapport',
            handoff_rule_1_sentence:
              'Systeem wordt pas opgeleverd na drukmating, inregeling en klant-handtekening op tablet.',
            money_leak_risk:
              'Restpunten blijven maanden openstaan waardoor de laatste 20% termijnfactuur niet verstuurd kan worden.',
            hard_control_rule:
              'Monteur kan project pas sluiten bij 0 openstaande kritieke opleverpunten en getekend meetrapport.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Meetwaarden worden automatisch uitgelezen en direct omgezet in een gecertificeerd opleverrapport.',
          },
          {
            step_number: 6,
            bpmn_type: 'Event',
            department_swimlane: 'Financiën',
            short_title: 'Automatische Eindfactuur & Nacalculatie',
            handoff_rule_1_sentence:
              'Getekend opleverrapport triggert dezelfde dag de slotfactuur én het nacalculatie-rapport.',
            money_leak_risk:
              'Facturatie wacht weken op papieren bonnen en nacalculatie gebeurt pas na maanden.',
            hard_control_rule:
              'Binnen 24 uur na digitale oplevering verstuurt ERP automatisch de slotfactuur inclusief getekend meerwerk.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI stuurt direct een 3-regelige nacalculatie-alert naar Commercie en Werkvoorbereiding bij > 3% marge-afwijking.',
          },
        ],
      },
      {
        process_id: 'PROC-3',
        process_name: '03. Zakelijk Onderhoud & Service-Regie (Contract-to-Cash)',
        why_it_matters_one_liner:
          'Bouwt voorspelbare, hoog-rendabele terugkerende omzet op (belangrijkste waardeverhoger voor investeerders).',
        process_owner_role: 'Hoofd Service & Onderhoud',
        health_kpis: {
          lead_time: '100% SLA-dekking',
          first_time_right: '88% in 1 bezoek opgelost',
          margin_target: '42% Brutomarge op contracten',
        },
        steps: [
          {
            step_number: 1,
            bpmn_type: 'Event',
            department_swimlane: 'Service & Planning',
            short_title: 'Automatische SLA-Contractactivatie',
            handoff_rule_1_sentence:
              'Elk opgeleverd zakelijk project krijgt standaard een 5-jarig prestatiecontract gekoppeld.',
            money_leak_risk:
              'Na oplevering vergeten we het onderhoudscontract te indexeren of actief te verkopen.',
            hard_control_rule:
              'Projectoplevering vereist verplichte statuskeuze voor Servicecontract (Actief of Bewust Afgewezen door klant).',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Automatische jaarlijkse prijsindexatie + verlengingsvoorstel op basis van asset-data.',
          },
          {
            step_number: 2,
            bpmn_type: 'Exclusive_Gateway',
            department_swimlane: 'Service & Planning',
            short_title: 'Poort: Zakelijke SLA-Klant?',
            handoff_rule_1_sentence:
              'Binnenkomende storingsmelding wordt direct getoetst op actief zakelijk onderhoudscontract.',
            money_leak_risk:
              'Oude particuliere kennissen bellen Peter rechtstreeks voor een kapotte cv-ketel.',
            hard_control_rule:
              'Geen actief zakelijk contractnummer = geen monteursinzet; beller wordt automatisch doorgezet naar particuliere partner.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Slimme telefoon- en mailrouter herkent contractklanten direct en routeert particulier werk buiten de planning om.',
          },
          {
            step_number: 3,
            bpmn_type: 'Task',
            department_swimlane: 'Service & Planning',
            short_title: 'Remote Diagnose vóór Uitruk',
            handoff_rule_1_sentence:
              'Servicedesk leest gebouwbeheersysteem op afstand uit voordat een bus gaat rijden.',
            money_leak_risk:
              'Monteur rijdt 2 uur voor een simpele reset of zonder het juiste vervangingsonderdeel.',
            hard_control_rule:
              'Geen storingsbon op het planbord zonder ingevulde foutcode en benodigd onderdeelnummer.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'AI-storingsassistent voorspelt op basis van foutcode welk onderdeel met 90% zekerheid in de bus moet liggen.',
          },
          {
            step_number: 4,
            bpmn_type: 'Task',
            department_swimlane: 'Servicemonteurs',
            short_title: 'Bundeling Preventieve Routes',
            handoff_rule_1_sentence:
              'Preventief onderhoud wordt in vaste geografische dagroutes uitgevoerd door een gescheiden serviceteam.',
            money_leak_risk:
              'Projectmonteurs worden van grote klussen gehaald voor losse storingen.',
            hard_control_rule:
              'Projectteams en Serviceteams zijn strikt gescheiden in het planbord; uitwisseling is geblokkeerd.',
            control_type: 'Systeem-Slot (Preventief)',
            ai_quick_win:
              'Route-optimalisatie bundelt alle zakelijke panden per postcodegebied en bespaart 30% reistijd.',
          },
          {
            step_number: 5,
            bpmn_type: 'Task',
            department_swimlane: 'Financiën',
            short_title: 'Directe Buiten-Bundel Facturatie',
            handoff_rule_1_sentence:
              'Vervangingsonderdelen buiten SLA-dekking worden dezelfde dag automatisch gefactureerd.',
            money_leak_risk:
              'Vervangen pompen en kleppen worden per ongeluk onder het gratis servicecontract geboekt.',
            hard_control_rule:
              'ERP controleert elk verbruikt artikel tegen de SLA-dekkingsmatrix en maakt automatisch een factuurregel aan.',
            control_type: 'Dashboard-Check (Detectief)',
            ai_quick_win:
              'AI controleert werkbon-tekst op verborgen vervangingen en zet deze direct klaar voor facturatie.',
          },
        ],
      },
    ],
  };
}

export function buildFallbackModule3(_intake: IntakeData, _mod1?: Module1Output, _mod2?: Module2Output): Module3Output {
  return {
    tldr_3_bullets: [
      'DGA Peter stopt vandaag met offertes onder € 150k, monteursplanning en particuliere ketelklanten.',
      'Het MT krijgt volledig mandaat binnen 32% brutomarge; Peter stuurt alleen nog op 3 rode uitzonderingen.',
      'Met 3 strakke meetings op vaste tijden draait het bedrijf voorspelbaar richting 15% EBITDA.',
    ],
    dga_freedom_plan: {
      stop_doing_today: [
        'Geen enkele offerte onder € 150.000 meer bekijken of accorderen.',
        'Geen telefoontjes van oude particuliere cv-ketel klanten meer aannemen of doorzetten naar planning.',
        'Niet meer ingrijpen in het dagelijkse monteursplanbord of materiaalbestellingen op de bouw.',
        'Geen technische calculaties meer corrigeren aan het bureau van verkopers.',
      ],
      only_focus_on: [
        'Commerciële sleutelrelaties & strategische raamcontracten boven € 500.000.',
        'Maandelijkse kasstroom-, EBITDA- en voorcalculatie-vs-nacalculatie review (90 min per maand).',
        'Investeerdersgereedheid (verkoopmemorandum, MT-coaching en terugkerende onderhoudsportefeuille).',
      ],
      golden_mandate_rule:
        'GOUDEN MANDAATREGEL: Zolang een zakelijk project ≥ 32% brutomarge heeft en het overdrachtsdossier 100% compleet is, beslist het MT volledig zelfstandig zonder tussenkomst van Peter.',
    },
    meeting_rhythm: [
      {
        meeting_title: 'Vloer- & Poortcheck (Geen DGA aanwezig)',
        tier_badge: 'Week - 30 min Vloer',
        chair_role: 'Hoofd Werkvoorbereiding',
        participants: ['Hoofd Verkoop', 'Hoofd Werkvoorbereiding', 'Hoofd Uitvoering', 'Hoofd Planning'],
        dashboard_kpis_on_screen: [
          '% Dossiers 100% compleet (10 dagen voor start)',
          'Aantal nabestellingen afgelopen week (€)',
          'Declarabele monteursuren (%)',
        ],
        agenda_blocks: [
          {
            minutes: 'Min 00 - 10',
            topic: 'Poort-Check komende 2 weken',
            forced_decision: 'Welke projecten zijn 100% compleet (GROEN) en welke worden geblokkeerd voor start (ROOD)?',
          },
          {
            minutes: 'Min 10 - 20',
            topic: 'Top-3 Faalkosten & Nabestellingen afgelopen week',
            forced_decision: 'Welke 1 standaardcalculatie of opnamecheck passen we deze week aan om herhaling te stoppen?',
          },
          {
            minutes: 'Min 20 - 30',
            topic: 'Capaciteit & Meerwerk-discipline',
            forced_decision: 'Zijn alle meerwerkbonnen > € 350 digitaal getekend door de opdrachtgever?',
          },
        ],
      },
      {
        meeting_title: 'Proces- & Margeslot Review (MT zonder DGA)',
        tier_badge: 'Maand - 60 min Proces',
        chair_role: 'Operationeel Directeur / MT-Voorzitter',
        participants: ['Commercieel Manager', 'Hoofd Werkvoorbereiding', 'Hoofd Uitvoering', 'Financieel Controller'],
        dashboard_kpis_on_screen: [
          'Voorcalculatie vs. Nacalculatie marge per opgeleverd project',
          'Faalkosten % van de maandomzet',
          'Groei zakelijke SLA-onderhoudscontracten (€ ARR)',
        ],
        agenda_blocks: [
          {
            minutes: 'Min 00 - 20',
            topic: 'Nacalculatie-Audit opgeleverde projecten',
            forced_decision: 'Bij elk project onder 30% brutomarge: wordt de rekennorm in ERP per direct verhoogd?',
          },
          {
            minutes: 'Min 20 - 40',
            topic: 'Proces-Sloten & Vetorecht Evaluatie',
            forced_decision: 'Welke verkoper of projectleider probeerde een proces-slot te omzeilen en hoe corrigeren we dit?',
          },
          {
            minutes: 'Min 40 - 60',
            topic: 'Conversie naar Onderhoudscontracten',
            forced_decision: 'Welke opgeleverde projecten van deze maand hebben nog geen actief 5-jarig SLA-contract?',
          },
        ],
      },
      {
        meeting_title: 'Boardroom Cockpit (DGA + MT op Uitzonderingen)',
        tier_badge: 'Maand - 90 min Boardroom',
        chair_role: 'DGA (Peter)',
        participants: ['DGA', 'Operationeel Directeur', 'Commercieel Manager', 'Financieel Controller'],
        dashboard_kpis_on_screen: [
          'Netto EBITDA % (Doel: pad naar 15%)',
          'Vrije Kasstroom & Onderhanden Werk (OHW)',
          'Rode Stoplicht-Escalaties (> 3% margelek)',
        ],
        agenda_blocks: [
          {
            minutes: 'Min 00 - 30',
            topic: '10-Seconden Stoplicht Scorecard',
            forced_decision: 'Groene KPI’s worden NIET besproken; alleen rode KPI’s krijgen een hard 30-dagen herstelbesluit.',
          },
          {
            minutes: 'Min 30 - 60',
            topic: 'Strategische OGSM Voortgang (90-Dagen Acties)',
            forced_decision: 'Liggen de 3 OGSM-pijlers op koers of verschuiven we budget/capaciteit?',
          },
          {
            minutes: 'Min 60 - 90',
            topic: 'Waardecreatie & Investeerders-Readiness',
            forced_decision: 'Welke strategische klantdeals (> € 150k) of overnames vragen komende maand om inzet van de DGA?',
          },
        ],
      },
    ],
    traffic_light_escalation: [
      {
        red_flag_trigger: 'Project dreigt tijdens uitvoering onder 28% brutomarge te zakken (Nacalculatie-alarm).',
        who_fixes_it: 'Hoofd Uitvoering + Commercieel Manager',
        action_within_48h:
          'Bouwstop op onbetaald meerwerk; direct gesprek met hoofdaannemer voor bijbetaling of scope-reductie.',
        when_dga_steps_in:
          'Pas als het totale margeverlies op 1 project groter dreigt te worden dan € 25.000.',
      },
      {
        red_flag_trigger: 'Meer dan 2 projectdossiers in 1 week afgekeurd bij de Werkvoorbereidings-poort.',
        who_fixes_it: 'Commercieel Manager',
        action_within_48h:
          'Bevries nieuwe offertes van betreffende verkoper totdat alle openstaande dossiers 100% compleet zijn.',
        when_dga_steps_in:
          'Niet. Pas bij structureel falen van de Commercieel Manager gedurende 2 opeenvolgende maanden.',
      },
      {
        red_flag_trigger: 'Spoed-nabestellingen op de bouwplaats overschrijden € 5.000 in één week.',
        who_fixes_it: 'Hoofd Werkvoorbereiding',
        action_within_48h:
          'Blokkeer bestelrechten van betreffend projectteam en voer verplichte krat-controle in voor vertrek.',
        when_dga_steps_in:
          'Pas als het maandelijkse faalkostenbudget (> 2,5% van maandomzet) wordt overschreden.',
      },
      {
        red_flag_trigger: 'Offertedossier boven € 150.000 of afwijkend risicoprofiel (boeteclausules).',
        who_fixes_it: 'Commercieel Manager + Financieel Controller',
        action_within_48h:
          'Stel een 1-pagina risico- & margevoorstel op met 2 keuze-opties voor de DGA.',
        when_dga_steps_in:
          'DGA geeft binnen 24 uur een GO / NO-GO op basis van de 1-pagina samenvatting (kost max. 15 minuten).',
      },
    ],
  };
}
