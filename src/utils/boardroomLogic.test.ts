import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEMO_CASE_JANSEN,
  EMPTY_INTAKE_CASE,
  IntakeData,
  validateIntakeInput,
  parseEuroAmount,
  calculateTotalMarginLeak,
  calculateLiveIntakeMetrics,
  extractSwimlanesForProcess,
  buildFallbackModule1,
  buildFallbackModule2,
  buildFallbackModule3,
} from './boardroomLogic';

test('validateIntakeInput accepts custom company cases and rejects empty required fields', () => {
  const customCase: IntakeData = {
    ...EMPTY_INTAKE_CASE,
    companyName: 'Bakkerij De Kroon B.V.',
    dgaName: 'Sander',
    industry: 'Voedingsmiddelenindustrie',
    fte: 85,
    currentRevenueMillions: 22,
    targetRevenueMillions: 30,
    coreBottleneckSummary: 'Spoedorders en verpakkingswissels verstoren de lijnplanning.',
    rawNotes: 'Sander zit nog tussen elke offerte boven 10.000 euro.',
  };

  const validRes = validateIntakeInput(customCase);
  assert.equal(validRes.valid, true);
  assert.equal(Object.keys(validRes.errors).length, 0);

  const invalidRes = validateIntakeInput({
    companyName: '',
    dgaName: '',
    industry: '',
    fte: 0,
    currentRevenueMillions: 0,
    rawNotes: 'Kort',
  });
  assert.equal(invalidRes.valid, false);
  assert.ok(invalidRes.errors.companyName);
  assert.ok(invalidRes.errors.dgaName);
  assert.ok(invalidRes.errors.industry);
  assert.ok(invalidRes.errors.fte);
});

test('calculateLiveIntakeMetrics computes dynamic euro leaks and freed DGA hours from intake variables', () => {
  const customCase: IntakeData = {
    ...EMPTY_INTAKE_CASE,
    companyName: 'Metaalwerk Noord B.V.',
    dgaName: 'Hendrik',
    industry: 'Maakindustrie',
    fte: 40,
    currentRevenueMillions: 10,
    targetRevenueMillions: 15,
    currentEbitdaPercent: 5,
    targetEbitdaPercent: 15,
    failureCostPercent: 6,
    minGrossMarginPercent: 38,
    currentDgaHoursPerWeek: 58,
    targetDgaHoursPerWeek: 18,
    currentApprovalThresholdEuro: 15000,
    newMtMandateThresholdEuro: 120000,
    coreBottleneckSummary: 'Herstelwerk op CNC-onderdelen',
    rawNotes: 'Veel herstelwerk door slechte werktekeningen.',
  };

  const metrics = calculateLiveIntakeMetrics(customCase);
  // 6% of 10M = 600,000
  assert.equal(metrics.totalEuroLeakNumber, 600000);
  assert.equal(metrics.totalEuroLeakFormatted, '€ 600.000 / jaar');
  // 58 - 18 = 40 hours freed
  assert.equal(metrics.freedHoursPerWeek, 40);
  assert.equal(metrics.freedHoursFormatted, '40 uur / week');
});

test('dynamic generators reflect custom company, DGA name, margin target, and mandate thresholds across all 3 modules', () => {
  const customCase: IntakeData = {
    ...EMPTY_INTAKE_CASE,
    companyName: 'Van Dijk Logistiek B.V.',
    dgaName: 'Marloes',
    industry: 'Transport & Warehousing',
    fte: 110,
    currentRevenueMillions: 25,
    targetRevenueMillions: 35,
    currentEbitdaPercent: 4,
    targetEbitdaPercent: 12,
    failureCostPercent: 4,
    minGrossMarginPercent: 36,
    currentDgaHoursPerWeek: 62,
    targetDgaHoursPerWeek: 14,
    currentApprovalThresholdEuro: 20000,
    newMtMandateThresholdEuro: 200000,
    coreBottleneckSummary: 'Lege retourritten en onbetaalde wachturen bij klanten',
    rawNotes: 'Marloes keurt nog elk transportcontract boven 20k zelf goed.',
  };

  const m1 = buildFallbackModule1(customCase);
  assert.ok(m1.tldr_3_bullets[0].includes('Van Dijk Logistiek B.V.'));
  assert.ok(m1.tldr_3_bullets[1].includes('Marloes'));
  assert.equal(m1.total_estimated_euro_leak_per_year, '€ 1.000.000 / jaar');
  assert.equal(m1.dga_hours_freed_per_week, '48 uur / week');

  const m2 = buildFallbackModule2(customCase, m1);
  assert.ok(m2.tldr_3_bullets[0].includes('36%'));
  assert.ok(m2.e2e_processes[0].process_owner_role.includes('Marloes'));

  const m3 = buildFallbackModule3(customCase, m1, m2);
  assert.ok(m3.dga_freedom_plan.golden_mandate_rule.includes('Marloes'));
  assert.ok(m3.dga_freedom_plan.golden_mandate_rule.includes('36%'));
});

test('parseEuroAmount and extractSwimlanesForProcess work accurately', () => {
  assert.equal(parseEuroAmount('€ 520.000 / jaar'), 520000);
  const total = calculateTotalMarginLeak([
    { leak_title: 'A', estimated_euro_loss: '€ 300.000 / jaar', root_cause_one_liner: 'X' },
    { leak_title: 'B', estimated_euro_loss: '€ 200.000 / jaar', root_cause_one_liner: 'Y' },
  ]);
  assert.equal(total, '€ 500.000 / jaar');

  const mod2 = buildFallbackModule2(DEMO_CASE_JANSEN);
  const lanes = extractSwimlanesForProcess(mod2.e2e_processes[0]);
  assert.deepEqual(lanes, ['Verkoop', 'Calculatie', 'Werkvoorbereiding']);
});
