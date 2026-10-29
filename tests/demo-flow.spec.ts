import { expect, test, type Page } from "@playwright/test";

async function openArjun(page: Page) {
  await page.goto("/demo?path=talk");
  await expect(page.getByRole("heading", { name: "You can start anywhere." })).toBeVisible();
}

async function sendChat(page: Page, text: string) {
  await page.getByRole("textbox", { name: "Your message" }).fill(text);
  await page.getByRole("button", { name: "Send" }).click();
}

async function reachCommunity(page: Page) {
  await openArjun(page);
  await sendChat(page, "I don't know... things at home feel weird lately.");
  await page.getByRole("button", { name: "Something with someone" }).click();
  await sendChat(page, "Actually, I can talk with my wife. My parents' expectations are the hard part.");
  await page.getByRole("button", { name: "Yes, that’s closer" }).click();
  await page.getByRole("button", { name: "Hear experiences" }).click();
}

test("the first view is a real editable conversation with quiet browsing available", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("textbox", { name: "Your message" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Use voice" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore quietly" })).toBeVisible();
  await expect(page.getByText(/Replies appear immediately from local example rules/i)).toBeVisible();
  await sendChat(page, "A concern I want to phrase in my own words.");
  await expect(page.getByText("A concern I want to phrase in my own words.")).toBeVisible();
  await expect(page.getByText(/We can keep it broad/i)).toBeVisible();
});

test("scenario and example query params both open an editable unsent Arjun opener", async ({ page }) => {
  for (const query of ["scenario=arjun", "example=arjun"]) {
    await page.goto(`/demo?${query}`);
    const composer = page.getByRole("textbox", { name: "Your message" });
    await expect(composer).toHaveValue("I don't know... things at home feel weird lately.");
    await expect(page.getByRole("heading", { name: "You can start anywhere." })).not.toBeFocused();
    await expect(page.getByText(/Replies appear immediately from local example rules/i)).toBeVisible();
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

test("independent spaces support group-only contact, reviewed contribution and human review", async ({ page }) => {
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
  await expect(page.getByRole("button", { name: "Join this example group" })).toBeVisible();
  await page.getByRole("tab", { name: "Discussions" }).click();
  await expect(page.getByRole("heading", { name: "Questions people might explore" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Does anyone know how to tell your parents what you want when they see it as disrespect?" })).toBeVisible();
  await expect(page.locator(".discussion-card")).toHaveCount(11);
  await page.getByRole("tab", { name: "People" }).click();
  await expect(page.getByText("Ravi", { exact: true })).toBeVisible();
  await expect(page.getByText(/Ravi.*group replies only/i)).toBeVisible();
  await page.getByRole("tab", { name: "Experiences" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await expect(page.getByRole("heading", { name: "Ravi accepts replies in the group only" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi" })).toHaveCount(0);
  await page.getByRole("button", { name: "See the group conversation" }).click();
  await expect(page.getByRole("heading", { name: "Questions people might explore" })).toBeVisible();
  await page.getByRole("button", { name: "Join this example group" }).click();
  await expect(page.getByText(/Joined in this browser example only/i)).toBeVisible();
  await page.getByRole("textbox", { name: "Your words, only if you choose to share" }).fill("I'm still figuring this out. I wrote down what I wanted to say. My dad didn't agree, but I said a little more clearly what mattered to me.");
  await page.getByRole("button", { name: "Preview audience and text" }).click();
  await expect(page.getByText("Alias: QuietRiver · this group only")).toBeVisible();
  await expect(page.getByText(/Your private conversation is not included/i)).toBeVisible();
  await page.getByRole("checkbox", { name: /I reviewed this exact text and group audience/i }).check();
  await page.getByRole("button", { name: "Post in this example group" }).click();
  await expect(page.getByText(/Not published or visible to other people/i)).toBeVisible();
  await page.getByRole("button", { name: "Find Support" }).click();
  await page.getByRole("button", { name: "Review a reported post · example" }).click();
  await page.getByRole("button", { name: "Request revision" }).click();
  await expect(page.getByText(/Decision recorded/)).toBeVisible();
  await expect(page.getByText(/No post or account changed/)).toBeVisible();
  await page.getByRole("button", { name: "Connections" }).click();
  await page.getByRole("button", { name: "Open an illustrative incoming request" }).click();
  await page.getByRole("button", { name: "Block this example member" }).click();
  await expect(page.getByText(/Blocked in this browser example/)).toBeVisible();
  await page.getByRole("button", { name: "Find Support" }).click();
  await page.getByRole("button", { name: "Explore professional support" }).click();
  await expect(page.getByRole("heading", { name: "We don't have a verified provider for these preferences yet." })).toBeVisible();
  await page.getByRole("button", { name: "My Journey" }).click();
  await page.getByRole("button", { name: "Paused" }).click();
  await expect(page.getByRole("button", { name: "Paused" })).toHaveAttribute("aria-pressed", "true");
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
  await expect(page.getByRole("heading", { name: "Ravi accepts replies in the group only" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ask Ravi" })).toHaveCount(0);
  await page.getByRole("button", { name: "Back to community" }).click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "My Journey" }).click();
  await page.getByRole("button", { name: "Preview contribution choices" }).click();
  await page.getByRole("button", { name: "Remove from discovery" }).click();
  await expect(page.getByText(/removed from this scenario's discovery/i)).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Communities" }).click();
  await expect(page.getByRole("heading", { name: "Explore communities and experiences" })).toBeVisible();
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await expect(page.getByRole("button", { name: "Read experience" })).toHaveCount(2);
  await expect(page.getByText("Illustrative contributor · Nisha")).toBeVisible();
  await expect(page.getByText("Illustrative contributor · Mira")).toBeVisible();
});

test("story reflection and voluntary sharing keep the prior takeaway branches usable", async ({ page }) => {
  await reachCommunity(page);
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await page.getByRole("tab", { name: "Experiences" }).click();
  await page.getByRole("button", { name: "Read experience" }).first().click();
  await expect(page.getByRole("heading", { name: "Ravi accepts replies in the group only" })).toBeVisible();
  await page.getByRole("button", { name: "Reflect on what you read" }).click();
  await page.getByRole("button", { name: "Not helpful" }).click();
  await expect(page.getByText(/Thanks for saying so/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Read another perspective" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Take a break" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore qualified support" })).toBeVisible();
  await page.getByLabel("Edit this, write your own, or leave it blank").fill("I want someone to listen before offering advice.");
  await page.getByRole("button", { name: "Keep privately" }).click();
  await expect(page.getByText(/Kept in this session only/i)).toBeVisible();
  await page.getByLabel("Choose an optional next step").selectOption("Talk with someone I trust");
  await page.getByRole("button", { name: "View my journey" }).click();
  await expect(page.getByText(/Your private takeaway/)).toBeVisible();
  await page.getByRole("button", { name: "Start separately" }).click();
  await expect(page.getByRole("heading", { name: "New City, Feeling Lonely After Work" })).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "My Journey" }).click();
  await expect(page.getByText(/You started this chapter separately. The relationship conversation did not shape these topics/)).toBeVisible();
  await page.getByRole("button", { name: "Preview contribution choices" }).click();
  await page.getByRole("button", { name: "Preview what could be shared" }).click();
  await expect(page.locator(".public-preview")).toContainText("Public preview · fictional");
  await page.getByRole("button", { name: "Remove from discovery" }).click();
  await expect(page.getByText(/removed from this scenario's discovery/i)).toBeVisible();
});

test("My Journey keeps work and family conversation transcripts separate", async ({ page }) => {
  await openArjun(page);
  await sendChat(page, "At home, family expectations are weighing on me.");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "My Journey" }).click();
  await page.getByRole("button", { name: /Work decisions/ }).click();
  await expect(page.getByRole("heading", { name: "You can start anywhere." })).toBeVisible();
  await sendChat(page, "My manager changed the project deadline.");
  await expect(page.getByText("At home, family expectations are weighing on me.")).toHaveCount(0);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "My Journey" }).click();
  await page.getByRole("button", { name: /Family and choices/ }).click();
  await expect(page.getByText("At home, family expectations are weighing on me.")).toBeVisible();
  await expect(page.getByText("My manager changed the project deadline.")).toHaveCount(0);
});

test("navigation reaches safety information and supports keyboard use without horizontal overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Find Support" }).click();
  await expect(page.getByRole("heading", { name: "Find Support" })).toBeVisible();
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
  await page.getByRole("button", { name: "Something with someone" }).click();
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo?example=arjun");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const findSupport = nav.getByRole("button", { name: "Find Support" });
  await expect(findSupport).toBeVisible();
  await expect(findSupport).toBeInViewport();
  expect(await nav.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/demo?path=quiet");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Explore community" }).first().click();
  await expect(page.getByRole("heading", { name: "Family Expectations & Personal Choices", level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
