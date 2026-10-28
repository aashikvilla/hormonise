import { describe, expect, it } from "vitest";
import {
  composePeerQuestionPayload,
  fixtures,
  getPublicExperiences,
  getRecommendedCommunities,
  harmoniseReducer,
  initialHarmoniseState,
  stateForEntry,
  type HarmoniseState,
  type ThemeId,
} from "./harmonise";

describe("Harmonise guided demo state and fictional fixtures", () => {
  it("offers four distinct entry paths and an independent Arjun example", () => {
    expect(stateForEntry("talk").screen).toBe("conversation");
    expect(stateForEntry("unsure").screen).toBe("conversation");
    expect(stateForEntry("quiet").screen).toBe("discovery");
    expect(stateForEntry("quiet").quietReader).toBe(true);
    expect(stateForEntry("support").screen).toBe("contribute");
    expect(stateForEntry("arjun").screen).toBe("conversation");
    expect(stateForEntry("arjun").isArjunDemo).toBe(true);
  });

  it("lets a sample conversation change family context to work pressure", () => {
    let state = stateForEntry("arjun");
    state = harmoniseReducer(state, { type: "ANSWER_FIRST", source: "sample", value: "Work has felt difficult, and I am not sure how to talk about it." });
    state = harmoniseReducer(state, { type: "ANSWER_SECOND", source: "sample", value: "I want to talk through work without advice." });
    state = harmoniseReducer(state, { type: "CONFIRM_UNDERSTANDING" });
    expect(state.confirmedThemes).toEqual(["work-pressure"]);
    expect(getRecommendedCommunities(state).map((community) => community.id)).toEqual(["community.work-pressure"]);
    expect(getRecommendedCommunities(state).map((community) => community.id)).not.toContain("community.family-expectations");
  });

  it("uses a correction in the understanding map to rerank recommendations", () => {
    let state = stateForEntry("arjun");
    state = harmoniseReducer(state, { type: "ANSWER_FIRST", source: "sample", value: "It's my marriage and I am worried about family expectations." });
    state = harmoniseReducer(state, { type: "ANSWER_SECOND", source: "sample", value: "I want to hear experiences, without advice." });
    state = harmoniseReducer(state, { type: "OPEN_UNDERSTANDING" });
    state = harmoniseReducer(state, { type: "TOGGLE_THEME", theme: "family-expectations" });
    state = harmoniseReducer(state, { type: "TOGGLE_THEME", theme: "relationship-uncertainty" });
    state = harmoniseReducer(state, { type: "TOGGLE_THEME", theme: "work-pressure" });
    state = harmoniseReducer(state, { type: "CONFIRM_UNDERSTANDING" });
    expect(getRecommendedCommunities(state).map((community) => community.id)).toEqual(["community.work-pressure"]);
  });

  it("does not analyze arbitrary typed content or retain stale personalized themes", () => {
    let state = stateForEntry("arjun");
    state = harmoniseReducer(state, { type: "ANSWER_FIRST", source: "typed", value: "A different concern I typed myself." });
    expect(state.mockTextNotice).toBe(true);
    expect(state.confirmedThemes).toEqual([]);
    expect(state.proposedThemes).toEqual([]);
  });

  it("keeps the community fixture human-centered and clearly labeled", () => {
    expect(fixtures.communities.map((community) => community.name)).toContain("Family Expectations & Personal Choices");
    const ravi = fixtures.experiences.find((experience) => experience.id === "experience.ravi");
    expect(ravi?.milestones).toHaveLength(3);
    expect(ravi?.milestones.every((milestone) => milestone.whatIActuallyTried)).toBe(true);
    expect(ravi?.importantDifferencesFromArjun.length).toBeGreaterThan(0);
    expect(fixtures.contributors.every((contributor) => contributor.isFictional)).toBe(true);
  });

  it("does not allow questions to the read-only Nisha fixture", () => {
    let state = stateForEntry("arjun");
    state = harmoniseReducer(state, { type: "OPEN_EXPERIENCE", experienceId: "experience.nisha" });
    state = harmoniseReducer(state, { type: "OPEN_QUESTION" });
    expect(state.screen).toBe("experience");
    expect(state.error).toMatch(/not accepting questions/i);
  });

  it("requires consent and returns only the approved recipient, alias and question", () => {
    let state = stateForEntry("arjun");
    state = harmoniseReducer(state, { type: "OPEN_EXPERIENCE", experienceId: "experience.ravi" });
    state = harmoniseReducer(state, { type: "OPEN_QUESTION" });
    state = harmoniseReducer(state, { type: "SET_QUESTION_TEXT", value: "How did you make room for your own choices?" });
    state = harmoniseReducer(state, { type: "SEND_QUESTION" });
    expect(state.screen).toBe("question");
    state = harmoniseReducer(state, { type: "SET_QUESTION_CONSENT", value: true });
    state = harmoniseReducer(state, { type: "SEND_QUESTION" });
    expect(state.screen).toBe("reply");
    expect(state.questionPayload).toEqual({
      recipientId: "contributor.ravi",
      alias: "QuietRiver29",
      questionText: "How did you make room for your own choices?",
    });
    expect(Object.keys(state.questionPayload ?? {}).sort()).toEqual(["alias", "questionText", "recipientId"]);
    expect(JSON.stringify(state.questionPayload)).not.toMatch(/Hyderabad|married|Everything seems normal/);
    expect(composePeerQuestionPayload({ recipientId: "contributor.ravi", alias: " river ", questionText: " question text " })).toEqual({ recipientId: "contributor.ravi", alias: "river", questionText: "question text" });
  });

  it("preserves a question draft when the user cancels and goes back", () => {
    let state = stateForEntry("arjun");
    state = harmoniseReducer(state, { type: "OPEN_EXPERIENCE", experienceId: "experience.ravi" });
    state = harmoniseReducer(state, { type: "OPEN_QUESTION" });
    state = harmoniseReducer(state, { type: "SET_QUESTION_TEXT", value: "My own revised question for Ravi." });
    state = harmoniseReducer(state, { type: "BACK" });
    expect(state.screen).toBe("experience");
    state = harmoniseReducer(state, { type: "OPEN_QUESTION" });
    expect(state.questionText).toBe("My own revised question for Ravi.");
    expect(state.questionConsent).toBe(false);
  });

  it("removes Ravi from discovery and disables contact when sharing is revoked", () => {
    let state: HarmoniseState = { ...initialHarmoniseState, confirmedThemes: ["family-expectations"] };
    expect(getPublicExperiences(state).some((experience) => experience.id === "experience.ravi")).toBe(true);
    state = harmoniseReducer(state, { type: "REVOKE_CONTRIBUTOR" });
    expect(getPublicExperiences(state).some((experience) => experience.id === "experience.ravi")).toBe(false);
    state = harmoniseReducer(state, { type: "OPEN_EXPERIENCE", experienceId: "experience.ravi" });
    state = harmoniseReducer(state, { type: "OPEN_QUESTION" });
    expect(state.screen).toBe("experience");
  });

  it("starts a separate later chapter with a different community", () => {
    const state = harmoniseReducer(initialHarmoniseState, { type: "START_FUTURE_CHAPTER" });
    expect(state.chapter).toBe("belonging");
    expect(state.confirmedNeed).toContain("shared interests");
    expect(getRecommendedCommunities(state).map((community) => community.id)).toEqual(["community.moving-friends"]);
  });

  it("records only explicitly approved insights and respects negative or skipped feedback", () => {
    let state = harmoniseReducer(initialHarmoniseState, { type: "SET_USEFULNESS", value: "not-helpful" });
    expect(state.usefulness).toBe("not-helpful");
    expect(state.insightApproved).toBe(false);
    state = harmoniseReducer(state, { type: "SET_INSIGHT_DRAFT", value: "A note I wrote" });
    state = harmoniseReducer(state, { type: "APPROVE_INSIGHT" });
    expect(state.insightApproved).toBe(true);
    expect(state.insightDraft).toBe("A note I wrote");
    state = harmoniseReducer(state, { type: "SET_USEFULNESS", value: "skip" });
    expect(state.usefulness).toBe("skip");
  });

  it("takes negative experience feedback to a different community instead of repeating the same result", () => {
    const viewed = {
      ...stateForEntry("arjun"),
      screen: "experience" as const,
      selectedExperienceId: "experience.ravi",
      confirmedThemes: ["family-expectations", "relationship-uncertainty"] as ThemeId[],
      openedExperienceIds: ["experience.ravi"],
    };
    const alternative = harmoniseReducer(viewed, { type: "EXPLORE_DIFFERENT_PERSPECTIVE" });
    expect(alternative.screen).toBe("discovery");
    expect(alternative.usefulness).toBe("not-helpful");
    expect(getRecommendedCommunities(alternative).map((community) => community.id)).toEqual(["community.relationship-uncertainty"]);
  });
});
