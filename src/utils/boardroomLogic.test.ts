import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_CASE_JANSEN,
  validateIntakeInput,
  parseEuroAmount,
  calculateTotalMarginLeak,
  extractSwimlanesForProcess,
  buildFallbackModule1,
  buildFallbackModule2,
  buildFallbackModule3,
} from './boardroomLogic';

test('validateIntakeInput accepts DEMO_CASE_JANSEN and rejects empty fields', () => {
  const validRes = validateIntakeInput(DEMO_CASE_JANSEN);
  assert.equal(validRes.valid, true);
  assert.equal(Object.keys(validRes.errors).length, 0);

  const invalidRes = validateIntakeInput({
    companyName: '',
    industry: '',
    fte: 0,
    rawNotes: 'Kort',
  });
  assert.equal(invalidRes.valid, false);
  assert.ok(invalidRes.errors.companyName);
  assert.ok(invalidRes.errors.industry);
  assert.ok(invalidRes.errors.fte);
  assert.ok(invalidRes.errors.rawNotes);
});

test('parseEuroAmount and calculateTotalMarginLeak sum euro strings accurately', () => {
  assert.equal(parseEuroAmount('€ 520.000 / jaar'), 520000);
  assert.equal(parseEuroAmount('€ 260.000'), 260000);
  const total = calculateTotalMarginLeak([
    { leak_title: 'A', estimated_euro_loss: '€ 520.000 / jaar', root_cause_one_liner: 'X' },
    { leak_title: 'B', estimated_euro_loss: '€ 260.000 / jaar', root_cause_one_liner: 'Y' },
    { leak_title: 'C', estimated_euro_loss: '€ 200.000 / jaar', root_cause_one_liner: 'Z' },
  ]);
  assert.equal(total, '€ 980.000 / jaar');
});

test('extractSwimlanesForProcess preserves unique department swimlanes in order', () => {
  const mod2 = buildFallbackModule2(DEMO_CASE_JANSEN);
  const firstProc = mod2.e2e_processes[0];
  const lanes = extractSwimlanesForProcess(firstProc);
  assert.deepEqual(lanes, ['Verkoop', 'Calculatie', 'Werkvoorbereiding']);
});

test('fallback generators return complete schema structures for Module 1, 2, and 3', () => {
  const m1 = buildFallbackModule1(DEMO_CASE_JANSEN);
  assert.equal(m1.tldr_3_bullets.length, 3);
  assert.equal(m1.red_flag_diagnosis.margin_leaks.length, 3);
  assert.equal(m1.ogsm.strategic_pillars.length, 3);

  const m2 = buildFallbackModule2(DEMO_CASE_JANSEN, m1);
  assert.equal(m2.tldr_3_bullets.length, 3);
  assert.equal(m2.e2e_processes.length, 3);
  assert.ok(m2.e2e_processes[0].steps.length >= 5);

  const m3 = buildFallbackModule3(DEMO_CASE_JANSEN, m1, m2);
  assert.equal(m3.tldr_3_bullets.length, 3);
  assert.equal(m3.meeting_rhythm.length, 3);
  assert.ok(m3.traffic_light_escalation.length >= 3);
});
