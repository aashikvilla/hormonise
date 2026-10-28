export type LocalChatTurn = { id: string; role: "you" | "harmonise"; text: string };

/** Replies are deterministic local examples until a server model is configured. */
export function replyForUserMessage(text: string, userTurn: number, priorUserMessages: string[] = []): string {
  const lower = text.toLowerCase();
  if (lower.includes("legal") || lower.includes("paperwork") || lower.includes("not for me")) {
    return "You're right—that result missed what you asked for. I’ll look at experiences about family expectations and personal choices instead.";
  }
  if (userTurn === 1) return "We can keep it broad. Is it something happening with someone, or more how you’ve been feeling lately?";
  if (lower.includes("parent") || lower.includes("family") || lower.includes("expectation")) {
    return "I hear two things you care about: making your own choices and staying close to your family. Is the pressure around their expectations the part you want to explore first?";
  }
  if (lower.includes("wife") || lower.includes("partner") || (userTurn === 2 && priorUserMessages.some((message) => /home|someone|wife|partner/i.test(message)))) {
    return "So it isn’t constant conflict. What part feels hardest to carry at the moment? You don’t have to share details.";
  }
  if (lower.includes("stay or leave") || lower.includes("verdict")) {
    return "Would hearing how others handled family expectations help, or would you rather keep talking here?";
  }
  return "You can take your time. What feels most important about that for you right now?";
}

export function hasFamilyContext(turns: Pick<LocalChatTurn, "role" | "text">[]): boolean {
  return turns.some((turn) => turn.role === "you" && /parent|family|expectation/i.test(turn.text));
}
