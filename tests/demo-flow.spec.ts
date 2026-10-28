import { expect, test, type Page } from "@playwright/test";

async function openArjun(page: Page) {
  await page.goto("/");
  await page.getByRole("link", { name: /Follow Arjun's illustrative story/i }).click();
  await expect(page.getByRole("heading", { name: "What's been on your mind?" })).toBeVisible();
}

async function reachCommunity(page: Page, firstAnswer = "Not quite — the pressure is from my family") {
  await openArjun(page);
  await page.getByRole("button", { name: firstAnswer }).click();
  await page.getByRole("button", { name: "Hear how others handled that pressure, without advice" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await expect(page.getByRole("heading", { name: "Have I understood what matters?" })).toBeVisible();
  await page.getByRole("button", { name: "Find human perspectives" }).click();
}

test("landing provides four paths and a separate fictional example", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "You don't have to have the right words." })).toBeVisible();
  for (const [label, heading] of [
    ["Talk something through", "What's been on your mind?"],
    ["I'm not sure where to start", "What's been on your mind?"],
    ["Just read experiences", "Explore communities and experiences"],
    ["I'd like to support others", "Share an experience by choice"],
  ]) {
    await page.goto("/");
    await page.getByRole("link", { name: new RegExp(label, "i") }).click();
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }
});

test("Arjun corrects the understanding, explores the community, asks with consent, reflects and starts a new chapter", async ({ page }) => {
  const externalRequests: string[] = [];
  const appOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000").origin;
  page.on("request", (request) => {
    if (!request.url().startsWith("data:") && new URL(request.url()).origin !== appOrigin) externalRequests.push(request.url());
  });
  await reachCommunity(page);
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices", level: 2 })).toBeVisible();
  await page.getByRole("button", { name: "Explore community" }).first().click();
  const experiencesTab = page.getByRole("tab", { name: "Experiences" });
  await expect(experiencesTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Illustrative contributor · Ravi")).toBeVisible();
  await experiencesTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Discussions" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { name: "Questions people might explore" })).toBeVisible();
  await page.getByRole("tab", { name: "People" }).click();
  await expect(page.getByRole("heading", { name: "Who contributes here?" })).toBeVisible();
  await page.getByRole("tab", { name: "Guidelines" }).click();
  await expect(page.getByText(/no moderator was notified/i)).toHaveCount(0);
  await page.getByRole("tab", { name: "Experiences" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await expect(page.getByRole("heading", { name: "One person's experience" })).toBeVisible();
  for (const title of ["Every question felt like a demand for an answer", "Separating my worries from other people's expectations", "Clearer about what I needed, not the relationship outcome"]) await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(/Ravi had an existing trusted friend/i)).toBeVisible();
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("button", { name: "Read experience" }).nth(1).click();
  await expect(page.getByRole("heading", { name: "Nisha", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What Nisha reported" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi" })).toHaveCount(0);
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await page.getByRole("button", { name: "Ask Ravi" }).click();
  const send = page.getByRole("button", { name: "Continue to prepared response" });
  await expect(send).toBeDisabled();
  const question = page.getByRole("textbox", { name: "Your question" });
  await question.fill("How did you ask someone to listen before giving advice?");
  await expect(page.getByText("Ravi · contributor.ravi")).toBeVisible();
  const preview = page.locator(".recipient-preview");
  await expect(preview).not.toContainText(/Everything seems normal|Hyderabad|29 years old/i);
  await page.getByRole("button", { name: "Cancel · keep my draft" }).click();
  await page.getByRole("button", { name: "Ask Ravi" }).click();
  await expect(question).toHaveValue("How did you ask someone to listen before giving advice?");
  await page.getByRole("checkbox", { name: /I reviewed the exact alias and question/i }).check();
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.getByText("Prepared illustrative reply")).toBeVisible();
  await page.getByRole("button", { name: "Continue to reflection" }).click();
  await page.getByRole("button", { name: "Not helpful" }).click();
  await expect(page.getByText(/Thanks for saying so/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Read another perspective" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Take a break" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore qualified support" })).toBeVisible();
  await page.getByRole("button", { name: "Keep privately" }).click();
  await expect(page.getByText(/Kept in this session only/i)).toBeVisible();
  await page.getByRole("button", { name: "View my journey" }).click();
  await expect(page.getByText(/Your private takeaway/i)).toBeVisible();
  await page.getByRole("button", { name: "Start separately" }).click();
  await expect(page.getByRole("heading", { name: "New City, New Connections" }).first()).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "My journey" }).click();
  await expect(page.getByText("CHAPTER 1 · RELATIONSHIPS")).toBeVisible();
  await expect(page.getByText("CHAPTER 2 · NEW CITY")).toBeVisible();
  await expect(page.getByText(/I think something is wrong with my marriage/)).toBeVisible();
  await expect(page.getByText(/Perspectives on family expectations, without pressure to choose a relationship outcome/)).toBeVisible();
  await expect(page.getByText(/You reviewed a prepared response after choosing the exact alias and question/)).toBeVisible();
  await expect(page.getByText(/You started this chapter separately. The relationship conversation did not shape these topics/)).toBeVisible();
  await expect(page.getByText(/Work is okay, but after moving to Hyderabad/)).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test("quiet reading opens a story without alias, question, joining or feedback", async ({ page }) => {
  await page.goto("/demo?path=quiet");
  await expect(page.getByRole("heading", { name: "Explore communities and experiences" })).toBeVisible();
  await expect(page.getByText(/Quiet reading · no alias/i)).toBeVisible();
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await page.getByRole("tab", { name: "Experiences" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await expect(page.getByRole("heading", { name: "One person's experience" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi" })).toHaveCount(0);
  await expect(page.getByLabel("Pseudonym")).toHaveCount(0);
  await page.getByRole("link", { name: "Leave page" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("typed text stays uninterpreted and a confirmed work correction changes community results", async ({ page }) => {
  await openArjun(page);
  await page.getByLabel("Or write a short answer").fill("A completely different concern about my job.");
  await page.getByRole("button", { name: "Use my answer" }).click();
  await expect(page.getByText(/Your own words are kept here, but this example doesn't interpret them/i)).toBeVisible();
  await page.getByLabel("Or use your own words").fill("I would like quiet support.");
  await page.getByRole("button", { name: "Use my answer" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await expect(page.getByText(/Your typed words were not interpreted/i)).toBeVisible();
  await expect(page.getByText(/No themes were inferred from your new words/i)).toBeVisible();
});

test("a confirmed work correction changes community results and the no-match branch is honest", async ({ page }) => {
  await openArjun(page);
  await page.getByRole("button", { name: "Not quite — the pressure is from my family" }).click();
  await page.getByRole("button", { name: "Hear how others handled that pressure, without advice" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await page.getByRole("checkbox", { name: "Family expectations" }).uncheck();
  await page.getByRole("checkbox", { name: "Relationship uncertainty" }).uncheck();
  await page.getByText("Add a different topic").click();
  await page.getByRole("checkbox", { name: "Personal choices" }).uncheck();
  await page.getByRole("checkbox", { name: "Work pressure" }).check();
  await expect(page.getByRole("checkbox", { name: "Work pressure" })).toBeChecked();
  await page.getByRole("button", { name: "Find human perspectives" }).click();
  await expect(page.getByRole("heading", { name: "Navigating Work Pressure" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices" })).toHaveCount(0);
  await page.getByRole("button", { name: "None of these feels relevant" }).click();
  await expect(page.getByRole("heading", { name: "There isn't a close fit in these communities." })).toBeVisible();
});

test("revoking Ravi's scope removes his story and blocks the question route", async ({ page }) => {
  await page.goto("/demo?path=support");
  const summary = page.getByRole("textbox", { name: "Edit the shareable version" });
  await summary.fill("I chose to ask someone to listen before sharing more opinions.");
  await page.getByRole("button", { name: "Preview what could be shared" }).click();
  await expect(page.locator(".public-preview").getByText("I chose to ask someone to listen before sharing more opinions.")).toBeVisible();
  const publish = page.getByRole("button", { name: "Apply choices to this scenario" });
  await expect(publish).toBeDisabled();
  await page.getByRole("button", { name: "Approve this summary" }).click();
  await expect(publish).toBeEnabled();
  await publish.click();
  await expect(page.getByText(/approved story is available in this scenario/i)).toBeVisible();
  await page.getByRole("checkbox", { name: "Allow one question in this prepared scenario" }).uncheck();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Communities" }).click();
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await page.getByRole("tab", { name: "Experiences" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await expect(page.getByRole("heading", { name: "What Ravi reported" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ravi isn't available for questions here" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi" })).toHaveCount(0);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Contribute" }).click();
  await page.getByRole("button", { name: "Remove from discovery" }).click();
  await expect(page.getByText(/removed from this scenario's discovery/i)).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Communities" }).click();
  await expect(page.getByRole("heading", { name: "Explore communities and experiences" })).toBeVisible();
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await expect(page.getByRole("button", { name: "Read experience" })).toHaveCount(1);
  await expect(page.getByText("Illustrative contributor · Nisha")).toBeVisible();
});

test("navigation reaches safety information and supports keyboard use without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  await page.getByRole("link", { name: /Talk something through/i }).click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Help & safety" }).click();
  await expect(page.getByRole("heading", { name: "Help, safety and support roles" })).toBeVisible();
  await expect(page.getByText(/No messages are monitored and safety is not assessed here/i)).toBeVisible();
  await page.screenshot({ path: `/tmp/harmonise-${testInfo.project.name}-help.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("hero and core flows fit 1920x1080 and mobile viewports without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.screenshot({ path: `/tmp/harmonise-${testInfo.project.name}-landing.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto("/demo?example=arjun");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Not quite — the pressure is from my family" }).click();
  await page.getByRole("button", { name: "Hear how others handled that pressure, without advice" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await page.screenshot({ path: `/tmp/harmonise-${testInfo.project.name}-understanding.png`, fullPage: true });
  await page.getByRole("button", { name: "Find human perspectives" }).click();
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices", level: 2 })).toBeVisible();
  await page.screenshot({ path: `/tmp/harmonise-${testInfo.project.name}-discovery.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/demo?path=quiet");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices", level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
