import { describe, expect, it } from "vitest";
import {
  circles,
  composeIntroduction,
  isAliasValid,
  rankCircles,
  sampleStory,
  storyInsights,
} from "./demo";

describe("demo fixtures", () => {
  it("ranks the same three circles in deterministic context and keyword order", () => {
    expect(rankCircles("context").map(({ id }) => id)).toEqual([
      "family-expectations",
      "quiet-relationships",
      "divorce-logistics",
    ]);
    expect(rankCircles("keyword").map(({ id }) => id)).toEqual([
      "divorce-logistics",
      "quiet-relationships",
      "family-expectations",
    ]);
    expect(circles).toHaveLength(3);
    expect(storyInsights.simulated).toBe(true);
  });

  it("composes an introduction only from explicitly selected fragments", () => {
    const text = composeIntroduction({
      relationshipContext: true,
      seekLivedExperience: true,
      ageAndCity: false,
      alias: "QuietRiver29",
      consented: true,
    });

    expect(text).toContain("family expectations around a personal relationship");
    expect(text).toContain("people with similar experiences");
    expect(text).not.toContain("Hyderabad");
    expect(text).not.toContain("four years");
    expect(text).not.toContain(sampleStory);
  });

  it("includes age and city only when that choice is enabled", () => {
    expect(
      composeIntroduction({
        relationshipContext: false,
        seekLivedExperience: false,
        ageAndCity: true,
        alias: "QuietRiver29",
        consented: true,
      }),
    ).toBe("I'm 29 and based in Hyderabad.");
  });

  it("validates aliases by length and allowed characters", () => {
    expect(isAliasValid("QuietRiver29")).toBe(true);
    expect(isAliasValid("ab")).toBe(false);
    expect(isAliasValid("this-alias-has-a-hyphen")).toBe(false);
    expect(isAliasValid("this_alias_is_definitely_too_long")).toBe(false);
  });
});
