import { expect, test, type Page } from '@playwright/test';

const sampleStory = "I'm 29 and have been married for four years. Things haven't been going well, but my parents are completely against divorce. I can't talk to my friends because they know my family. I don't want somebody telling me what decision to make. I wish I could speak to someone who's dealt with this kind of family pressure.";

async function enterDiscover(page: Page) {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: /here’s what we understood/i })).toBeVisible();
  await page.getByRole('button', { name: 'Yes, find relevant support' }).click();
  await expect(page.getByRole('heading', { name: /people who understand/i })).toBeVisible();
}

async function enterConnect(page: Page) {
  await enterDiscover(page);
  await page.getByRole('button', { name: 'Choose circle', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'You decide what others see.' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'I reviewed what will be shared in this simulated circle.' }).check();
  await page.getByRole('button', { name: /join circle with this introduction/i }).click();
  await expect(page.getByRole('region', { name: 'Simulated circle conversation' })).toBeVisible();
}

test('landing and guided five-step experience stay legible at recording and mobile widths', async ({ page }, testInfo) => {
  const externalRequests: string[] = [];
  const appOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000').origin;
  page.on('request', (request) => {
    const url = request.url();
    if (url.startsWith('data:') || url.startsWith('blob:')) return;
    try {
      const origin = new URL(url).origin;
      if (origin !== appOrigin) externalRequests.push(url);
    } catch {
      externalRequests.push(url);
    }
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: /you don’t have to.*carry it alone/i })).toBeVisible();
  await expect(page.getByText(/concept prototype/i).first()).toBeVisible();
  await expect(page.getByText('Kabir, 27')).toBeVisible();
  await expect(page.getByText('Samira, 31')).toBeVisible();
  await expect(page.getByText('Meera, 36')).toBeVisible();
  await page.screenshot({ path: `/tmp/beyond-silence-${testInfo.project.name}-landing.png`, fullPage: true });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.getByRole('link', { name: /experience the 3-minute demo/i }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByLabel('Your story')).toHaveValue(sampleStory);
  await expect(page.getByRole('navigation', { name: 'Demo progress' })).toContainText('Share');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: /here’s what we understood/i })).toBeVisible();
  await page.getByRole('button', { name: 'Yes, find relevant support' }).click();
  await expect(page.getByRole('heading', { name: /people who understand/i })).toBeVisible();
  await page.getByRole('button', { name: 'Choose circle', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'You decide what others see.' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'I reviewed what will be shared in this simulated circle.' }).check();
  await page.getByRole('button', { name: /join circle with this introduction/i }).click();
  await expect(page.getByRole('heading', { name: 'A place to begin, at your pace.' })).toBeVisible();
  const hostSuggestion = page.locator('.host-card');
  await expect(hostSuggestion).toContainText('Suggested weekly topic');
  await expect(hostSuggestion).toContainText('Organizer approval required');
  await expect(hostSuggestion.getByRole('button')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/beyond-silence-${testInfo.project.name}-connect.png`, fullPage: true });

  expect(externalRequests, 'the prototype should not initiate runtime requests to external origins').toEqual([]);
});

test('empty stories are blocked and edited stories are preserved with an honest fixed-preview warning', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('#story-error')).toContainText(/add a few words/i);
  await expect(page.getByLabel('Your story')).toHaveValue('');

  const edited = 'I moved to a new city and feel isolated from everyone I know.';
  await page.getByLabel('Your story').fill(edited);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('note')).toContainText('fixed example interpretation');
  await expect(page.locator('.quote-text')).toContainText(edited);
  await page.getByRole('button', { name: 'Edit my story' }).click();
  await expect(page.getByLabel('Your story')).toHaveValue(edited);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('note')).toContainText('live AI analysis is not connected');
});

test('discovery comparison reorders fixtures and quiet preview creates no membership or disclosure', async ({ page }) => {
  await enterDiscover(page);
  const titles = page.locator('.circle-result h2');
  await expect(titles).toHaveText([
    'When family expectations shape personal decisions',
    'Quiet conversations about difficult relationships',
    'Divorce logistics & legal processes',
  ]);
  await page.getByRole('button', { name: 'Topic-only' }).click();
  await expect(titles.first()).toHaveText('Divorce logistics & legal processes');
  await expect(page.locator('.circle-result').first()).toContainText(/direct overlap/i);
  await expect(page.getByText(/not a measured evaluation/i)).toBeVisible();

  await page.getByRole('button', { name: 'Read quietly' }).click();
  await expect(page.getByText(/quiet reading preview · no membership created/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Just looking is a valid choice.' })).toBeVisible();
  const preview = page.locator('.preview-content');
  await expect(preview).not.toContainText(/QuietRiver29|married for four years|Hyderabad|parents are completely against divorce/i);
  await expect(page.getByText(/no alias or introduction is shown to the circle/i)).toBeVisible();
  await page.getByRole('button', { name: 'Back to results' }).first().click();
  await expect(page.getByRole('heading', { name: /people who understand/i })).toBeVisible();
});

test('joining requires consent and exposes only allowlisted disclosure; drafts remain editable until sent', async ({ page }) => {
  await enterDiscover(page);
  await page.getByRole('button', { name: 'Choose circle', exact: true }).first().click();
  await expect(page.getByRole('checkbox', { name: 'My age and city' })).not.toBeChecked();
  const intro = page.locator('.intro-preview');
  const introText = intro.locator('p');
  await expect(introText).toContainText(/family expectations/i);
  await expect(introText).toContainText(/similar experiences/i);
  await expect(introText).not.toContainText(/Hyderabad|29|four years|divorce|parents/i);

  await page.getByRole('button', { name: /join circle with this introduction/i }).click();
  await expect(page.locator('.form-error[role="alert"]')).toContainText(/review and confirm/i);
  await expect(page.getByRole('heading', { name: 'You decide what others see.' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'My age and city' }).check();
  await expect(introText).toContainText(/Hyderabad|29/);
  await page.getByRole('checkbox', { name: 'My age and city' }).uncheck();
  await page.getByRole('checkbox', { name: 'I reviewed what will be shared in this simulated circle.' }).check();
  await page.getByRole('button', { name: /join circle with this introduction/i }).click();

  const conversation = page.getByRole('region', { name: 'Simulated circle conversation' });
  const messageList = conversation.locator('.message-list');
  await expect(conversation).toContainText('Your shared introduction');
  await expect(conversation).toContainText(/family expectations/i);
  await expect(conversation).not.toContainText(/married for four years|parents are completely against divorce|Hyderabad/);
  await expect(conversation).toContainText('Fictional peer conversation');

  await page.getByRole('button', { name: 'Fill composer with sample draft 1' }).click();
  const composer = page.getByRole('textbox', { name: 'Write a message' });
  await expect(composer).toHaveValue(/family expectations/i);
  await expect(messageList).not.toContainText(/mainly looking for somebody/);
  await composer.fill('Could someone listen first, without advice?');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(messageList).toContainText('Could someone listen first, without advice?');
  await expect(messageList).toContainText('Simulated peer response');
  await expect(messageList.getByText('Maya_R')).toHaveCount(2);

  await composer.fill('Thank you for making space.');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(messageList).toContainText('Thank you for making space.');
  await expect(messageList.getByText('Simulated peer response')).toHaveCount(1);
});

test('About dialog traps keyboard focus, closes with Escape, and restores its trigger', async ({ page }) => {
  await enterConnect(page);
  const about = page.getByRole('button', { name: 'About this prototype' });
  await about.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText(/all people.*simulated/i);
  const close = page.getByRole('button', { name: 'Close dialog' });
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Got it' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(about).toBeFocused();
});

test('restart clears choices, conversation and draft, then restores the sample Share step', async ({ page }) => {
  await enterConnect(page);
  await page.getByRole('button', { name: 'Fill composer with sample draft 2' }).click();
  await page.getByRole('textbox', { name: 'Write a message' }).fill('A message to clear on restart');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Simulated circle conversation' })).toContainText('A message to clear on restart');
  await page.getByRole('button', { name: 'Restart demo' }).click();
  await expect(page.getByLabel('Your story')).toHaveValue(sampleStory);
  await expect(page.getByRole('navigation', { name: 'Demo progress' }).locator('[aria-current="step"]')).toContainText('Share');

  await enterConnect(page);
  const conversation = page.getByRole('region', { name: 'Simulated circle conversation' });
  await expect(conversation).not.toContainText('A message to clear on restart');
  await expect(page.getByRole('textbox', { name: 'Write a message' })).toHaveValue('');
  await expect(page.getByRole('region', { name: 'Simulated circle conversation' })).not.toContainText(/Hyderabad/);
});
