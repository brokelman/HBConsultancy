import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  validateIntakeInput,
  buildFallbackModule1,
  buildFallbackModule2,
  buildFallbackModule3,
} from './src/utils/boardroomLogic.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const MODULE_1_SYSTEM_INSTRUCTION =
  'Je bent een meedogenloos scherpe Strategie Partner voor het MKB. Schrijf in korte, keiharde ondernemerstaal (maximaal 15 woorden per bullet, nul jargon). Leg direct bloot waar euro\'s weglekken en waarom de DGA zelf de blokkade is. Vertaal dit naar een 1-pagina OGSM met radicale keuzes: wat gaan we doen én waar stoppen we morgen mee.';

const MODULE_1_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tldr_3_bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 ultra-korte zinnen die een directeur in 5 seconden snapt',
    },
    total_estimated_euro_leak_per_year: {
      type: Type.STRING,
      description: 'Totaal geschat margelek per jaar, bijv. "€ 420.000 / jaar"',
    },
    dga_hours_freed_per_week: {
      type: Type.STRING,
      description: 'Vrijgespeelde DGA-tijd per week, bijv. "25 uur / week"',
    },
    red_flag_diagnosis: {
      type: Type.OBJECT,
      properties: {
        founder_bottleneck_headline: {
          type: Type.STRING,
          description: 'Kop van max 10 woorden waarom de DGA zelf de blokkade is',
        },
        founder_bottleneck_impact: { type: Type.STRING },
        uncomfortable_truth: { type: Type.STRING },
        margin_leaks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              leak_title: { type: Type.STRING },
              estimated_euro_loss: { type: Type.STRING },
              root_cause_one_liner: { type: Type.STRING },
            },
            required: ['leak_title', 'estimated_euro_loss', 'root_cause_one_liner'],
          },
        },
      },
      required: [
        'founder_bottleneck_headline',
        'founder_bottleneck_impact',
        'uncomfortable_truth',
        'margin_leaks',
      ],
    },
    ogsm: {
      type: Type.OBJECT,
      properties: {
        objective_one_liner: { type: Type.STRING },
        goals: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              metric_name: { type: Type.STRING },
              current_value: { type: Type.STRING },
              target_value: { type: Type.STRING },
              deadline: { type: Type.STRING },
            },
            required: ['metric_name', 'current_value', 'target_value', 'deadline'],
          },
        },
        strategic_pillars: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              strategy_id: { type: Type.STRING },
              strategy_title: { type: Type.STRING },
              radical_focus_do: { type: Type.STRING },
              stop_doing_immediately: { type: Type.STRING },
              leading_kpi: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  target: { type: Type.STRING },
                  owner_role: { type: Type.STRING },
                },
                required: ['name', 'target', 'owner_role'],
              },
              lagging_kpi: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  target: { type: Type.STRING },
                  owner_role: { type: Type.STRING },
                },
                required: ['name', 'target', 'owner_role'],
              },
              top_90_day_action: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  owner_role: { type: Type.STRING },
                },
                required: ['action', 'owner_role'],
              },
            },
            required: [
              'strategy_id',
              'strategy_title',
              'radical_focus_do',
              'stop_doing_immediately',
              'leading_kpi',
              'lagging_kpi',
              'top_90_day_action',
            ],
          },
        },
      },
      required: ['objective_one_liner', 'goals', 'strategic_pillars'],
    },
  },
  required: [
    'tldr_3_bullets',
    'total_estimated_euro_leak_per_year',
    'dga_hours_freed_per_week',
    'red_flag_diagnosis',
    'ogsm',
  ],
};

const MODULE_2_SYSTEM_INSTRUCTION =
  'Je bent een pragmatische Chief Process Architect voor het MKB. Vertaal de OGSM en de margelekken naar de 3 belangrijkste End-to-End waardeketens (bijv. Verkoop-tot-Factuur, Order-tot-Oplevering). Wijs een proceseigenaar aan (nooit de DGA!). Maak per keten 5 tot 7 simpele BPMN-stappen over afdelingen (Swimlanes) inclusief beslisruiten (Gateways). Geef bij elke stap aan waar het geld weglekt en zet er één keiharde, simpele spelregel (\'Marge-Slot / Control\') op.';

const MODULE_2_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tldr_3_bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    e2e_processes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          process_id: { type: Type.STRING },
          process_name: { type: Type.STRING },
          why_it_matters_one_liner: { type: Type.STRING },
          process_owner_role: { type: Type.STRING },
          health_kpis: {
            type: Type.OBJECT,
            properties: {
              lead_time: { type: Type.STRING },
              first_time_right: { type: Type.STRING },
              margin_target: { type: Type.STRING },
            },
            required: ['lead_time', 'first_time_right', 'margin_target'],
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                step_number: { type: Type.INTEGER },
                bpmn_type: {
                  type: Type.STRING,
                  description: 'Moet een van zijn: Task, Exclusive_Gateway, Event',
                },
                department_swimlane: { type: Type.STRING },
                short_title: { type: Type.STRING },
                handoff_rule_1_sentence: { type: Type.STRING },
                money_leak_risk: { type: Type.STRING },
                hard_control_rule: { type: Type.STRING },
                control_type: {
                  type: Type.STRING,
                  description: 'Systeem-Slot (Preventief) of Dashboard-Check (Detectief)',
                },
                ai_quick_win: { type: Type.STRING },
              },
              required: [
                'step_number',
                'bpmn_type',
                'department_swimlane',
                'short_title',
                'handoff_rule_1_sentence',
                'money_leak_risk',
                'hard_control_rule',
                'control_type',
                'ai_quick_win',
              ],
            },
          },
        },
        required: [
          'process_id',
          'process_name',
          'why_it_matters_one_liner',
          'process_owner_role',
          'health_kpis',
          'steps',
        ],
      },
    },
  },
  required: ['tldr_3_bullets', 'e2e_processes'],
};

const MODULE_3_SYSTEM_INSTRUCTION =
  'Je bent een Governance & Operating Model expert. Ontwerp een besturingsritme waarmee het bedrijf zonder de DGA draait. Schrijf kort, visueel en activerend: waar trekt de DGA vandaag zijn handen vanaf, wat is het mandaat van het MT, welke 3 korte meetings houden de boel scherp, en wanneer moet iemand op de rode knop drukken (escalatie).';

const MODULE_3_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tldr_3_bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    dga_freedom_plan: {
      type: Type.OBJECT,
      properties: {
        stop_doing_today: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        only_focus_on: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        golden_mandate_rule: { type: Type.STRING },
      },
      required: ['stop_doing_today', 'only_focus_on', 'golden_mandate_rule'],
    },
    meeting_rhythm: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          meeting_title: { type: Type.STRING },
          tier_badge: {
            type: Type.STRING,
            description:
              'Week - 30 min Vloer, Maand - 60 min Proces, of Maand - 90 min Boardroom',
          },
          chair_role: { type: Type.STRING },
          participants: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          dashboard_kpis_on_screen: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          agenda_blocks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                minutes: { type: Type.STRING },
                topic: { type: Type.STRING },
                forced_decision: { type: Type.STRING },
              },
              required: ['minutes', 'topic', 'forced_decision'],
            },
          },
        },
        required: [
          'meeting_title',
          'tier_badge',
          'chair_role',
          'participants',
          'dashboard_kpis_on_screen',
          'agenda_blocks',
        ],
      },
    },
    traffic_light_escalation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          red_flag_trigger: { type: Type.STRING },
          who_fixes_it: { type: Type.STRING },
          action_within_48h: { type: Type.STRING },
          when_dga_steps_in: { type: Type.STRING },
        },
        required: ['red_flag_trigger', 'who_fixes_it', 'action_within_48h', 'when_dga_steps_in'],
      },
    },
  },
  required: ['tldr_3_bullets', 'dga_freedom_plan', 'meeting_rhythm', 'traffic_light_escalation'],
};

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.post('/api/module1', async (req, res) => {
    const intake = req.body?.intake;
    const validation = validateIntakeInput(intake || {});
    if (!validation.valid) {
      res.status(400).json({
        error: 'Ongeldige intake-invoer. Controleer alle verplichte velden.',
        validationErrors: validation.errors,
      });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.json({ data: buildFallbackModule1(intake), source: 'deterministic' });
      return;
    }

    try {
      const prompt = `Analyseer dit MKB-bedrijf en genereer de 10-Seconden Diagnose & 1-Pagina OGSM in het Nederlands:
Bedrijfsnaam: ${intake.companyName}
Branche: ${intake.industry}
Aantal FTE: ${intake.fte}
Ruwe Gespreksnotities:
${intake.rawNotes}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MODULE_1_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: MODULE_1_SCHEMA,
          seed: 42,
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({ data: parsed, source: 'gemini' });
    } catch (err) {
      console.error('Gemini Module 1 fallback triggered:', err);
      res.json({ data: buildFallbackModule1(intake), source: 'deterministic' });
    }
  });

  app.post('/api/module2', async (req, res) => {
    const { intake, module1 } = req.body || {};
    if (!intake || !module1) {
      res.status(400).json({ error: 'Module 1 data ontbreekt voor Module 2.' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.json({ data: buildFallbackModule2(intake, module1), source: 'deterministic' });
      return;
    }

    try {
      const prompt = `Vertaal onderstaande Module 1 (Rode Vlaggen & OGSM) van ${intake.companyName} (${intake.fte} FTE, ${intake.industry}) naar de 3 belangrijkste End-to-End waardeketens met 5 tot 7 BPMN-stappen en Marge-Sloten:
Module 1 JSON:
${JSON.stringify(module1, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MODULE_2_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: MODULE_2_SCHEMA,
          seed: 42,
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({ data: parsed, source: 'gemini' });
    } catch (err) {
      console.error('Gemini Module 2 fallback triggered:', err);
      res.json({ data: buildFallbackModule2(intake, module1), source: 'deterministic' });
    }
  });

  app.post('/api/module3', async (req, res) => {
    const { intake, module1, module2 } = req.body || {};
    if (!intake || !module1 || !module2) {
      res.status(400).json({ error: 'Module 1 en 2 data ontbreken voor Module 3.' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.json({ data: buildFallbackModule3(intake, module1, module2), source: 'deterministic' });
      return;
    }

    try {
      const prompt = `Ontwerp de DGA-Vrijheidskalender & Stoplicht-Regie voor ${intake.companyName} (${intake.fte} FTE) op basis van Module 1 en Module 2:
Module 1 JSON:
${JSON.stringify(module1)}

Module 2 JSON:
${JSON.stringify(module2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: MODULE_3_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: MODULE_3_SCHEMA,
          seed: 42,
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim());
      res.json({ data: parsed, source: 'gemini' });
    } catch (err) {
      console.error('Gemini Module 3 fallback triggered:', err);
      res.json({ data: buildFallbackModule3(intake, module1, module2), source: 'deterministic' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Boardroom OS server listening on http://localhost:${port}`);
  });
}

startServer();
