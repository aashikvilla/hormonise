import { expect, test, type Page } from "@playwright/test";

async function openArjun(page: Page) {
  await page.goto("/");
  await page.getByRole("link", { name: /Explore Arjun's fictional example/i }).click();
  await expect(page.getByRole("heading", { name: "What's been on your mind?" })).toBeVisible();
}

async function reachCommunity(page: Page, firstAnswer = "Relationship and family expectations") {
  await openArjun(page);
  await page.getByRole("button", { name: firstAnswer }).click();
  await page.getByRole("button", { name: "Hear experiences without advice" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await expect(page.getByRole("heading", { name: "Have I understood what matters?" })).toBeVisible();
  await page.getByRole("button", { name: "Use this to explore communities" }).click();
}

test("landing provides four paths and a separate fictional example", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "You don't have to know what to say." })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices" })).toBeVisible();
  await page.getByRole("button", { name: "Explore community" }).first().click();
  const experiencesTab = page.getByRole("tab", { name: "Experiences" });
  await expect(experiencesTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Ravi · fictional")).toBeVisible();
  await experiencesTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Discussions" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText(/SAMPLE DISCUSSIONS · FICTIONAL/i)).toBeVisible();
  await page.getByRole("tab", { name: "People" }).click();
  await expect(page.getByRole("heading", { name: "Qualified professional" })).toBeVisible();
  await page.getByRole("tab", { name: "Guidelines" }).click();
  await expect(page.getByText(/no moderator was notified/i)).toHaveCount(0);
  await page.getByRole("tab", { name: "Experiences" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await expect(page.getByRole("heading", { name: "One person's experience" })).toBeVisible();
  for (const title of ["Too many opinions", "A different kind of conversation", "More clarity, still uncertainty"]) await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(/Ravi had an existing trusted friend/i)).toBeVisible();
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("button", { name: "Read experience" }).nth(1).click();
  await expect(page.getByRole("heading", { name: "Nisha" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi anonymously" })).toHaveCount(0);
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await page.getByRole("button", { name: "Ask Ravi anonymously" }).click();
  const send = page.getByRole("button", { name: "Show simulated reply" });
  await expect(send).toBeDisabled();
  const question = page.getByRole("textbox", { name: "Your question" });
  await question.fill("How did you ask someone to listen before giving advice?");
  await expect(page.getByText("Ravi · contributor.ravi")).toBeVisible();
  const preview = page.locator(".recipient-preview");
  await expect(preview).not.toContainText(/Everything seems normal|Hyderabad|29 years old/i);
  await page.getByRole("button", { name: "Cancel · keep my draft" }).click();
  await page.getByRole("button", { name: "Ask Ravi anonymously" }).click();
  await expect(question).toHaveValue("How did you ask someone to listen before giving advice?");
  await page.getByRole("checkbox", { name: /I reviewed the exact alias and question/i }).check();
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.getByText("Fictional contributor reply — demo")).toBeVisible();
  await page.getByRole("button", { name: "Continue to reflection" }).click();
  await page.getByRole("button", { name: "Not helpful" }).click();
  await expect(page.getByText(/Thanks for saying so/i)).toBeVisible();
  await page.getByRole("button", { name: "Keep this note in my journey" }).click();
  await expect(page.getByText(/Saved for this session only/i)).toBeVisible();
  await page.getByRole("button", { name: "View my journey" }).click();
  await expect(page.getByText(/your note, approved to keep for this session/i)).toBeVisible();
  await page.getByRole("button", { name: "Start a new chapter" }).click();
  await expect(page.getByRole("heading", { name: "Moving & Finding Friends" })).toBeVisible();
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
  await expect(page.getByRole("button", { name: "Ask Ravi anonymously" })).toHaveCount(0);
  await expect(page.getByLabel("Pseudonym")).toHaveCount(0);
  await page.getByRole("link", { name: "Leave page" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("typed text stays uninterpreted and a confirmed work correction changes community results", async ({ page }) => {
  await openArjun(page);
  await page.getByLabel("Or write a short answer").fill("A completely different concern about my job.");
  await page.getByRole("button", { name: "Use my answer" }).click();
  await expect(page.getByText(/New text is not interpreted in this guided demo/i)).toBeVisible();
  await page.getByLabel("Or use your own words").fill("I would like quiet support.");
  await page.getByRole("button", { name: "Use my answer" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await expect(page.getByText(/Typed answers are not analyzed here/i)).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Family expectations" })).not.toBeChecked();
});

test("a confirmed work correction changes community results and the no-match branch is honest", async ({ page }) => {
  await openArjun(page);
  await page.getByRole("button", { name: "Relationship and family expectations" }).click();
  await page.getByRole("button", { name: "Hear experiences without advice" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await page.getByRole("checkbox", { name: "Family expectations" }).uncheck();
  await page.getByRole("checkbox", { name: "Relationship uncertainty" }).uncheck();
  await page.getByRole("checkbox", { name: "Work pressure" }).check();
  await expect(page.getByRole("checkbox", { name: "Work pressure" })).toBeChecked();
  await page.getByRole("button", { name: "Use this to explore communities" }).click();
  await expect(page.getByRole("heading", { name: "Navigating Work Pressure" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices" })).toHaveCount(0);
  await page.getByRole("button", { name: "None of these feels relevant" }).click();
  await expect(page.getByRole("heading", { name: "There isn't a close fit in these examples." })).toBeVisible();
});

test("revoking Ravi's scope removes his story and blocks the question route", async ({ page }) => {
  await page.goto("/demo?path=support");
  const summary = page.getByRole("textbox", { name: "Edit the shareable version" });
  await summary.fill("I chose to ask someone to listen before sharing more opinions.");
  await page.getByRole("button", { name: "Preview what others see" }).click();
  await expect(page.locator(".public-preview").getByText("I chose to ask someone to listen before sharing more opinions.")).toBeVisible();
  const publish = page.getByRole("button", { name: "Publish approved demo summary" });
  await expect(publish).toBeDisabled();
  await page.getByRole("button", { name: "I approve this summary" }).click();
  await expect(publish).toBeEnabled();
  await publish.click();
  await expect(page.getByText(/currently discoverable in the demo/i)).toBeVisible();
  await page.getByRole("button", { name: "Revoke sharing" }).click();
  await expect(page.getByText(/removed from public discovery/i)).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Communities" }).click();
  await expect(page.getByRole("heading", { name: "Explore communities and experiences" })).toBeVisible();
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await expect(page.getByRole("button", { name: "Read experience" })).toHaveCount(1);
  await expect(page.getByText("Nisha · fictional")).toBeVisible();
});

test("navigation reaches safety information and supports keyboard use without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  await page.getByRole("link", { name: /Talk something through/i }).click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Help & safety" }).click();
  await expect(page.getByRole("heading", { name: "Help, safety and support roles" })).toBeVisible();
  await expect(page.getByText(/does not monitor messages or assess safety/i)).toBeVisible();
  await page.screenshot({ path: `/tmp/harmonise-${testInfo.project.name}-help.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("hero and core flows fit 1920x1080 and mobile viewports without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.screenshot({ path: `/tmp/harmonise-${testInfo.project.name}-landing.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto("/demo?example=arjun");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Relationship and family expectations" }).click();
  await page.getByRole("button", { name: "Hear experiences without advice" }).click();
  await page.getByRole("button", { name: "Review understanding" }).click();
  await page.getByRole("button", { name: "Use this to explore communities" }).click();
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/demo?path=quiet");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices", level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
