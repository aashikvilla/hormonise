import { expect, test, type Page } from "@playwright/test";

async function openArjun(page: Page) {
  await page.goto("/demo?path=talk");
  await expect(page.getByRole("heading", { name: "Some things are hard to say out loud." })).toBeVisible();
}

async function sendChat(page: Page, text: string) {
  await page.getByRole("textbox", { name: "Your message" }).fill(text);
  await page.getByRole("button", { name: "Send" }).click();
}

async function reachCommunity(page: Page) {
  await openArjun(page);
  await sendChat(page, "I don't know... things at home feel weird lately.");
  await page.getByRole("button", { name: "With someone" }).click();
  await sendChat(page, "Actually, I can talk with my wife. My parents' expectations are the hard part.");
  await page.getByRole("button", { name: "Yes, that’s closer" }).click();
  await page.getByRole("button", { name: "Hear experiences" }).click();
}

test("the first view is a real editable conversation with quiet browsing available", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox", { name: "Your message" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use voice" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore quietly" })).toBeVisible();
  await expect(page.getByText(/no AI service is connected/i)).toBeVisible();
  await sendChat(page, "A concern I want to phrase in my own words.");
  await expect(page.getByText("A concern I want to phrase in my own words.")).toBeVisible();
  await expect(page.getByText(/We can keep it broad/i)).toBeVisible();
});

test("scenario and example query params both open an editable unsent Arjun opener", async ({ page }) => {
  for (const query of ["scenario=arjun", "example=arjun"]) {
    await page.goto(`/demo?${query}`);
    const composer = page.getByRole("textbox", { name: "Your message" });
    await expect(composer).toHaveValue("I don't know... things at home feel weird lately.");
    await expect(page.getByRole("heading", { name: "Some things are hard to say out loud." })).not.toBeFocused();
    await expect(page.getByText("A local illustrative conversation · no AI service is connected")).toBeVisible();
  }
});

test("microphone denial leaves the text composer usable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: async () => Promise.reject(new DOMException("Permission denied", "NotAllowedError")) },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Use voice" }).click();
  await expect(page.getByText(/Microphone access wasn’t granted/i)).toBeVisible();
  await sendChat(page, "I can still type what I want to say.");
  await expect(page.getByText("I can still type what I want to say.")).toBeVisible();
});

test("recorded audio reaches an editable typed-transcript fallback before sending", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) },
    });
    class MockRecorder {
      state = "inactive";
      start() { this.state = "recording"; }
      stop() { this.state = "inactive"; }
    }
    Object.defineProperty(window, "MediaRecorder", { configurable: true, value: MockRecorder });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Use voice" }).click();
  await expect(page.getByText("Listening", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Stop and review" }).click();
  await expect(page.getByText(/Voice transcription is not connected here/i)).toBeVisible();
  await page.getByRole("textbox", { name: "Your transcript" }).fill("I want to share these words after reviewing them.");
  await page.getByRole("button", { name: "Send this text" }).click();
  await expect(page.getByText("I want to share these words after reviewing them.")).toBeVisible();
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
  await expect(page.getByText(/Example facilitator note · fictional role/i)).toBeVisible();
  await expect(page.getByText(/no live moderator/i)).toBeVisible();
  const experiencesTab = page.getByRole("tab", { name: "Experiences" });
  await expect(experiencesTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Illustrative contributor · Ravi")).toBeVisible();
  await expect(page.getByText("Illustrative contributor · Mira")).toBeVisible();
  await expect(page.getByText(/For me, boundaries weren't enough on their own/i)).toBeVisible();
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
  await expect(page.getByText("What they tried:")).toHaveCount(3);
  await expect(page.getByText("What they reported helped:")).toHaveCount(2);
  await expect(page.getByText("What they reported did not help:")).toHaveCount(2);
  for (const title of ["Every question felt like a demand for an answer", "Separating my worries from other people's expectations", "Clearer about what I needed, not the relationship outcome"]) await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText(/Ravi had an existing trusted friend/i)).toBeVisible();
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("button", { name: "Read experience" }).nth(2).click();
  await expect(page.getByRole("heading", { name: "Mira", exact: true })).toBeVisible();
  await expect(page.getByText("What they tried:")).toBeVisible();
  await expect(page.getByText(/^(What he tried:|He said helped:|He said did not help:)$/)).toHaveCount(0);
  await expect(page.getByText(/Mira chose distance and professional support/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi" })).toHaveCount(0);
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("button", { name: "Read experience" }).nth(1).click();
  await expect(page.getByRole("heading", { name: "Nisha", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What Nisha reported" })).toBeVisible();
  await expect(page.getByText("What they tried:")).toBeVisible();
  await expect(page.getByText("What they reported helped:")).toBeVisible();
  await expect(page.getByText("What they reported did not help:")).toBeVisible();
  await expect(page.getByText(/^(What he tried:|He said helped:|He said did not help:)$/)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ask Ravi" })).toHaveCount(0);
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await page.getByRole("button", { name: "Ask Ravi" }).click();
  const send = page.getByRole("button", { name: "Continue to prepared response" });
  await expect(send).toBeDisabled();
  const question = page.getByRole("textbox", { name: "Your question" });
  const alias = page.getByRole("textbox", { name: "Your alias" });
  const approvedQuestion = "When you didn't want to disappoint your family, how did you figure out what you wanted before listening to everyone else's opinions?";
  await expect(alias).toHaveValue("QuietRiver");
  await expect(question).toHaveValue(approvedQuestion);
  const exactPreview = page.locator(".recipient-preview");
  await expect(exactPreview.locator("dt")).toHaveText(["Recipient", "Alias", "Question"]);
  await expect(exactPreview).toContainText("QuietRiver");
  await expect(exactPreview).toContainText(approvedQuestion);
  await expect(exactPreview).not.toContainText(/online|here now|currently available/i);
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
  await expect(page.locator(".prepared-reply")).toContainText("I didn't know at first. I kept asking people what they'd do, and their answers made me more unsure.");
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
  await expect(page.getByRole("heading", { name: "New City, Feeling Lonely After Work" }).first()).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "My journey" }).click();
  await expect(page.getByText("CHAPTER 1 · RELATIONSHIPS")).toBeVisible();
  await expect(page.getByText("CHAPTER 2 · NEW CITY")).toBeVisible();
  await expect(page.getByText(/I don't know\.\.\. things at home feel weird lately/)).toBeVisible();
  await expect(page.getByText(/Perspectives on family expectations, without pressure to choose a relationship outcome/)).toBeVisible();
  await expect(page.getByText(/You reviewed a prepared response after choosing the exact alias and question/)).toBeVisible();
  await expect(page.getByText(/You started this chapter separately. The relationship conversation did not shape these topics/)).toBeVisible();
  await expect(page.getByText(/I moved cities recently\. I feel lonely after work/)).toBeVisible();
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

test("arbitrary typed text stays tentative until the user confirms an interpretation", async ({ page }) => {
  await openArjun(page);
  await sendChat(page, "A completely different concern about my job.");
  await expect(page.getByText(/We can keep it broad/i)).toBeVisible();
  await sendChat(page, "I would like quiet support.");
  await sendChat(page, "I don't want someone to tell me what to do.");
  await expect(page.getByText(/I don’t have enough context to name a theme yet/i)).toBeVisible();
  await page.getByRole("button", { name: "Not quite" }).click();
  await expect(page.getByText("Not confirmed yet")).toBeVisible();
});

test("rejecting a broad legal topic changes discovery and the no-match branch is honest", async ({ page }) => {
  await reachCommunity(page);
  await page.getByRole("button", { name: "Not for me · change these results" }).click();
  await expect(page.getByText(/Broad legal-topic suggestions are set aside/i)).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Family Expectations & Personal Choices" })).toBeVisible();
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
  await expect(page.getByRole("button", { name: "Read experience" })).toHaveCount(2);
  await expect(page.getByText("Illustrative contributor · Nisha")).toBeVisible();
  await expect(page.getByText("Illustrative contributor · Mira")).toBeVisible();
});

test("navigation reaches safety information and supports keyboard use without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
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
  await sendChat(page, "Things at home feel uncertain.");
  await page.getByRole("button", { name: "With someone" }).click();
  await sendChat(page, "My parents' expectations are part of it.");
  await page.getByRole("button", { name: "Yes, that’s closer" }).click();
  await page.screenshot({ path: `/tmp/harmonise-${testInfo.project.name}-understanding.png`, fullPage: true });
  await page.getByRole("button", { name: "Hear experiences" }).click();
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
