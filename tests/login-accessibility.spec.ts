import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';
import type { Page, TestInfo } from '@playwright/test';
import { expect, test } from '../fixtures/base';

const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
];

async function expectNoAccessibilityViolations(
  page: Page,
  testInfo: TestInfo,
  attachmentName: string
): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze();

  // Attach the complete Axe result so it can be inspected in the test report.
  await testInfo.attach(`axe-${attachmentName}.json`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  expect(
    results.violations,
    summarise(results.violations)
  ).toEqual([]);
}

function summarise(violations: Result[]): string {
  if (violations.length === 0) {
    return 'No accessibility violations.';
  }

  return violations
    .map(
      (violation) =>
        `[${violation.impact ?? 'unknown'}] ` +
        `${violation.id}: ${violation.help}\n` +
        violation.nodes
          .map(
            (node) => `    -> ${node.target.join(' ')}`
          )
          .join('\n')
    )
    .join('\n');
}

test.describe('Login accessibility', () => {
  // Establish a baseline by scanning the initial login form before interaction.
  test(
    'the login screen has no detectable WCAG 2.1 A/AA violations',
    {
      tag: ['@a11y'],
    },
    async ({ loginPage, page }, testInfo) => {
      await expect(loginPage.form).toBeVisible();

      await expectNoAccessibilityViolations(
        page,
        testInfo,
        'login-screen'
      );
    }
  );

  // Scan again after validation because dynamically displayed errors may
  // introduce accessibility issues that are absent from the initial form.
  test(
    'the error state has no detectable WCAG 2.1 A/AA violations',
    {
      tag: ['@a11y'],
    },
    async ({ loginPage, page }, testInfo) => {
      await loginPage.login(
        'nobody@example.com',
        'wrong-password'
      );
      await expect(loginPage.errorMessage).toBeVisible();

      await expectNoAccessibilityViolations(
        page,
        testInfo,
        'login-error'
      );
    }
  );
});