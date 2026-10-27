import { expect, test, type Page } from "@playwright/test";

async function answerConversation(page: Page) {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { name: "Some things are hard to explain." })).toBeVisible();
  await expect(page.getByLabel(/your opening/i)).toHaveValue(/I don't know how to explain it/);
  await page.getByRole("button", { name: "Things in my relationship" }).click();
  await expect(page.getByText(/what would be most useful right now/i)).toBeVisible();
  await page.getByRole("button", { name: "Hear how other people navigated this" }).click();
  await expect(page.getByRole("heading", { name: "Does this sound right?" })).toBeVisible();
}

async function confirmAndExplore(page: Page) {
  await answerConversation(page);
  await expect(page.getByText("POSSIBLE TENSION · PLEASE CONFIRM")).toBeVisible();
  await expect(page.getByLabel("WHAT WOULD HELP NOW?")).toHaveValue(/hear how other people navigated this/i);
  await page.getByRole("button", { name: "Confirm and explore experiences" }).click();
  await expect(page.getByRole("heading", { name: "Experiences are perspectives, not instructions." })).toBeVisible();
}

async function openRavi(page: Page) {
  await confirmAndExplore(page);
  await page.getByRole("button", { name: "Open story" }).first().click();
  await expect(page.getByRole("heading", { name: "Ravi, 34" })).toBeVisible();
}

test("landing promise opens the new private conversation journey", async ({ page }, testInfo) => {
  const externalRequests: string[] = [];
  const appOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000").origin;
  page.on("request", (request) => {
    try {
      const url = request.url();
      if (!url.startsWith("data:") && !url.startsWith("blob:") && new URL(url).origin !== appOrigin) externalRequests.push(url);
    } catch { externalRequests.push(request.url()); }
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /some things are.*too personal to post/i })).toBeVisible();
  await expect(page.getByText(/fictional stories and peers.*simulated ai/i)).toBeVisible();
  await page.screenshot({ path: `/tmp/beyond-silence-v2-${testInfo.project.name}-landing.png`, fullPage: true });
  await page.getByRole("link", { name: /explore arjun's story/i }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByLabel(/your opening/i)).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test("sample conversation runs two turns and the user can edit and confirm their need", async ({ page }) => {
  await answerConversation(page);
  await expect(page.getByText("IN YOUR WORDS").locator(".."))
    .toContainText("Hear how other people navigated this");
  await expect(page.getByText("Uncertainty about the relationship + concern about how family may react.", { exact: true })).toBeVisible();
  await expect(page.getByText(/simulated interpretation, not a diagnosis/i)).toBeVisible();
  const need = page.getByLabel("WHAT WOULD HELP NOW?");
  await need.fill("Listen to perspectives without deciding for me");
  await page.getByRole("checkbox", { name: /I want someone to tell me whether to stay or leave/i }).check();
  await page.getByRole("button", { name: /that is not right/i }).click();
  await expect(page.getByText(/edit the need above/i)).toBeVisible();
  await page.getByRole("button", { name: "Confirm and explore experiences" }).click();
  await expect(page.getByRole("heading", { name: /experiences are perspectives/i })).toBeVisible();
});

test("arbitrary opening text is not represented as live analysis", async ({ page }) => {
  await page.goto("/demo");
  const opening = page.getByLabel(/your opening/i);
  await opening.fill("A completely different personal concern I wrote for this test.");
  await page.getByRole("button", { name: "Things in my relationship" }).click();
  await page.getByRole("button", { name: "Hear how other people navigated this" }).click();
  await expect(page.getByRole("note")).toContainText(/scripted example, not live analysis/i);
  await expect(page.getByText(/completely different personal concern/i)).not.toBeVisible();
});

test("experience cards expose structured fictional stories and context versus topic ranking", async ({ page }, testInfo) => {
  await confirmAndExplore(page);
  const titles = page.locator(".v2-story-card h2");
  await expect(titles).toHaveText(["Ravi, 34", "Nisha, 33", "Legal Processes Circle"]);
  await expect(page.getByText(/illustrative fixture ranking.*not measured model performance/i)).toBeVisible();
  await expect(titles).toHaveText(["Ravi, 34", "Nisha, 33", "Legal Processes Circle"]);
  await page.getByRole("button", { name: "Topic-only example" }).click();
  await expect(titles.first()).toHaveText("Legal Processes Circle");
  await page.getByRole("button", { name: "Context-first" }).click();
  await page.getByRole("button", { name: "Open story" }).first().click();
  await page.getByRole("button", { name: "Why this surfaced" }).click();
  await expect(page.getByText(/based on this story's stated situation.*no live model ranking/i)).toBeVisible();
  await page.getByRole("button", { name: "Back to experiences" }).click();
  await page.getByRole("button", { name: "Open story" }).nth(1).click();
  await expect(page.getByRole("heading", { name: "Nisha, 33" })).toBeVisible();
  await page.screenshot({ path: `/tmp/beyond-silence-v2-${testInfo.project.name}-story.png`, fullPage: true });
  for (const section of ["What happened", "What they tried", "What they say helped", "What did not help", "Where this differs"]) {
    await expect(page.getByRole("heading", { name: section })).toBeVisible();
  }
  await expect(page.getByText(/not a real testimonial/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi anonymously" })).toHaveCount(0);
});

test("quiet reading reaches takeaway with no identity, question, or assumed usefulness", async ({ page }) => {
  await page.goto("/demo");
  await page.getByRole("button", { name: /i would rather not share details/i }).click();
  await expect(page.getByRole("heading", { name: "Experiences are perspectives, not instructions." })).toBeVisible();
  await expect(page.getByText(/quiet reading · not personalized/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi anonymously" })).toHaveCount(0);
  await page.getByRole("button", { name: "Finish privately" }).click();
  await expect(page.getByRole("heading", { name: /you chose what to take with you/i })).toBeVisible();
  await expect(page.getByText(/you chose to continue privately without opening a story/i)).toBeVisible();
  await expect(page.getByLabel(/pseudonym/i)).toHaveCount(0);
  await expect(page.getByLabel(/your question/i)).toHaveCount(0);
  for (const feeling of ["Yes", "Somewhat", "No", "Skip"]) await expect(page.getByRole("button", { name: feeling, exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("radio", { name: "Nothing for now" }).check();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await expect(page.getByText(/thanks for saying so.*no response is treated as success/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "No", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Restart demo" }).first().click();
  await expect(page.getByRole("heading", { name: "Some things are hard to explain." })).toBeVisible();
  await expect(page.getByLabel(/your opening/i)).toHaveValue(/I don't know how to explain it/);
});

test("Ravi question is editable, exact, consented, and gets one clearly fictional response", async ({ page }, testInfo) => {
  await openRavi(page);
  await page.getByRole("button", { name: "Ask Ravi anonymously" }).click();
  await expect(page.getByRole("heading", { name: /ask ravi without sharing your whole story/i })).toBeVisible();
  const pseudonym = page.getByLabel("Pseudonym");
  await pseudonym.fill("GentleRiver7");
  const question = page.getByLabel("Your question");
  const send = page.getByRole("button", { name: "Send demo question" });
  await question.fill("   ");
  await expect(send).toBeDisabled();
  await question.fill("How did you find space to think without rushing?");
  const preview = page.getByText("EXACT RECIPIENT PREVIEW").locator("..");
  await expect(preview).toContainText("GentleRiver7");
  await expect(preview).toContainText("How did you find space to think without rushing?");
  await expect(preview).not.toContainText(/29|married|Hyderabad|family names|I don't know how to explain/i);
  await pseudonym.fill("not valid!");
  await expect(send).toBeDisabled();
  await pseudonym.fill("GentleRiver7");
  await expect(send).toBeDisabled();
  await page.getByRole("checkbox", { name: /I reviewed the text I'm sharing/i }).check();
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.getByText(/simulated human reply.*not live ai or sent to a person/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /ravi, 34.*fictional contributor/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue privately" })).toBeVisible();
  await page.getByRole("button", { name: "Continue privately" }).click();
  await expect(page.getByRole("heading", { name: /you chose what to take with you/i })).toBeVisible();
  await expect(page.getByText(/Ravi, 34.*fictional reply viewed/i)).toBeVisible();
  await page.screenshot({ path: `/tmp/beyond-silence-v2-${testInfo.project.name}-takeaway.png`, fullPage: true });
});

test("back navigation preserves stage state and restart resets an anonymous exchange", async ({ page }) => {
  await openRavi(page);
  await page.getByRole("button", { name: "Ask Ravi anonymously" }).click();
  const question = page.getByLabel("Your question");
  await question.fill("My own revised question for Ravi.");
  await page.getByRole("button", { name: "Back to stories" }).click();
  await expect(page.getByRole("heading", { name: "Experiences are perspectives, not instructions." })).toBeVisible();
  await page.getByRole("button", { name: "Open story" }).first().click();
  await page.getByRole("button", { name: "Ask Ravi anonymously" }).click();
  await expect(page.getByLabel("Your question")).toHaveValue("My own revised question for Ravi.");
  await page.getByRole("button", { name: "Restart demo" }).click();
  await expect(page.getByRole("heading", { name: "Some things are hard to explain." })).toBeVisible();
  await expect(page.getByLabel(/your opening/i)).toHaveValue(/I don't know how to explain it/);
});

test("layout has no horizontal overflow at the recording and mobile viewports", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto("/demo");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Things in my relationship" }).click();
  await page.getByRole("button", { name: "Hear how other people navigated this" }).click();
  await page.getByRole("button", { name: "Confirm and explore experiences" }).click();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
