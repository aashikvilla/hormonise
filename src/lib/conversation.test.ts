import { describe, expect, it } from "vitest";
import { hasFamilyContext, replyForUserMessage } from "./conversation";

describe("local conversation fixtures", () => {
  it("answers each turn with a short, contextual next question", () => {
    expect(replyForUserMessage("Things at home feel weird", 1)).toMatch(/keep it broad/i);
    expect(replyForUserMessage("Maybe my wife, but we aren't always arguing", 2)).toMatch(/isn’t constant conflict/i);
    expect(replyForUserMessage("My parents' expectations weigh on me", 3)).toMatch(/two things you care about/i);
    expect(replyForUserMessage("I don't want a verdict", 4)).toMatch(/hearing how others handled/i);
  });

  it("reflects a correction toward human context and detects family context only from user turns", () => {
    expect(replyForUserMessage("Not for me; I am not looking for legal paperwork", 5)).toMatch(/missed what you asked for/i);
    expect(hasFamilyContext([{ role: "you", text: "My parents have expectations" }])).toBe(true);
    expect(hasFamilyContext([{ role: "you", text: "My wife and I are not always arguing" }])).toBe(false);
    expect(hasFamilyContext([{ role: "harmonise", text: "family expectations" }])).toBe(false);
    expect(hasFamilyContext([{ role: "you", text: "I feel lonely after work" }])).toBe(false);
    expect(replyForUserMessage("Work has felt uncertain lately", 3)).not.toMatch(/family|relationship/i);
  });
});
