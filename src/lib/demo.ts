export const STEPS = ["share", "understand", "discover", "join", "connect"] as const;

export type DemoStep = (typeof STEPS)[number];
export type DiscoveryMode = "context" | "keyword";

export type InsightKey = "familyPressure" | "privacy" | "livedExperience" | "legalAdvice";

export interface StoryInsights {
  id: string;
  mainChallenge: string;
  barriers: string[];
  supportPreference: string;
  intent: string;
  privacyPreference: string;
  evidencePhrases: string[];
  selectedKeys: Record<InsightKey, boolean>;
  simulated: true;
}

export interface PeerCircle {
  id: string;
  title: string;
  description: string;
  tags: string[];
  memberCount: number;
  format: string;
  whyContext: string;
  whyKeyword: string;
  previewPosts: { author: string; text: string }[];
  simulated: true;
}

export interface ShareChoices {
  relationshipContext: boolean;
  seekLivedExperience: boolean;
  ageAndCity: boolean;
  alias: string;
  consented: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderDisplayName: string;
  text: string;
  kind: "peer-seed" | "user-intro" | "user" | "mock-reply";
  simulated: true;
}

export interface OtherStory {
  id: "kabir" | "samira" | "meera";
  name: string;
  age: number;
  title: string;
  summary: string;
  concept: string;
  mode: "Activity-based belonging" | "Quiet reading" | "Independent peer host";
  simulated: true;
}

export const sampleStory =
  "I'm 29 and have been married for four years. Things haven't been going well, but my parents are completely against divorce. I can't talk to my friends because they know my family. I don't want somebody telling me what decision to make. I wish I could speak to someone who's dealt with this kind of family pressure.";

export const storyInsights: StoryInsights = {
  id: "arjun-family-pressure",
  mainChallenge: "Marriage uncertainty under family pressure",
  barriers: [
    "Fear of social judgment",
    "Friends overlap with family",
    "Not ready for public disclosure",
  ],
  supportPreference:
    "Someone with similar lived experience who will listen without directing the decision",
  intent: "Talk privately before deciding next steps",
  privacyPreference: "High privacy preference",
  evidencePhrases: [
    "My parents are completely against divorce",
    "I can't talk to my friends because they know my family",
    "I don't want somebody telling me what decision to make",
  ],
  selectedKeys: {
    familyPressure: true,
    privacy: true,
    livedExperience: true,
    legalAdvice: false,
  },
  simulated: true,
};

export const insightOptions: { key: InsightKey; label: string }[] = [
  { key: "familyPressure", label: "Family expectations are central" },
  { key: "privacy", label: "Privacy matters more than visibility" },
  { key: "livedExperience", label: "I want lived experience, not prescriptions" },
  { key: "legalAdvice", label: "I want legal advice" },
];

export const circles: PeerCircle[] = [
  {
    id: "family-expectations",
    title: "When family expectations shape personal decisions",
    description:
      "A small, pseudonymous circle for people navigating relationship uncertainty, social pressure, and the need for a nonjudgmental listener.",
    tags: ["Family expectations", "Lived experience", "Private conversations"],
    memberCount: 12,
    format: "Small, pseudonymous circle",
    whyContext:
      "You mentioned family pressure, fear of judgment, and wanting someone with lived experience. This circle discusses all three, not just the topic of divorce.",
    whyKeyword:
      "This circle is relevant to the broader topic, though its conversations focus more on family context than the word “divorce”.",
    previewPosts: [
      {
        author: "Maya_R",
        text: "It took me a long time to talk about family expectations. You're welcome to read quietly first.",
      },
      {
        author: "StillLearning",
        text: "Having someone listen without pushing a decision made a difference for me.",
      },
    ],
    simulated: true,
  },
  {
    id: "quiet-relationships",
    title: "Quiet conversations about difficult relationships",
    description:
      "A broader peer space for people sorting through relationship changes at their own pace.",
    tags: ["Relationships", "No pressure", "Listening first"],
    memberCount: 18,
    format: "Small, pseudonymous circle",
    whyContext:
      "This circle makes room for relationship uncertainty and listening without pressure, though it is less focused on family expectations.",
    whyKeyword:
      "This circle overlaps with relationship topics, with conversations spanning more than divorce logistics.",
    previewPosts: [
      {
        author: "OpenWindow",
        text: "Some days it helps just to read how other people are taking things one step at a time.",
      },
      {
        author: "RiverStone",
        text: "You can ask for listening only. Advice isn't the default here.",
      },
    ],
    simulated: true,
  },
  {
    id: "divorce-logistics",
    title: "Divorce logistics & legal processes",
    description:
      "A topic-focused space for practical questions about separation paperwork and legal processes.",
    tags: ["Divorce", "Practical information", "Legal processes"],
    memberCount: 26,
    format: "Small, pseudonymous circle",
    whyContext:
      "The topic overlaps, but this circle centers on logistics and legal processes rather than the family pressure and listening you described.",
    whyKeyword:
      "Ranked mainly by direct overlap with the term “divorce”. It may overlook your need for discretion and family-pressure context.",
    previewPosts: [
      {
        author: "PaperTrail",
        text: "People here trade general process questions. Please seek qualified local guidance for legal decisions.",
      },
      {
        author: "NextChapter",
        text: "I found it useful to make a list of practical questions before speaking with a professional.",
      },
    ],
    simulated: true,
  },
];

export const seedMessages: ChatMessage[] = [
  {
    id: "seed-maya",
    senderId: "maya-r",
    senderDisplayName: "Maya_R",
    text: "It took me a long time to talk about family expectations. You're welcome to read quietly first.",
    kind: "peer-seed",
    simulated: true,
  },
  {
    id: "seed-learning",
    senderId: "still-learning",
    senderDisplayName: "StillLearning",
    text: "Having someone listen without pushing a decision made a difference for me.",
    kind: "peer-seed",
    simulated: true,
  },
];

export const suggestedDrafts = [
  "I'm mainly looking for somebody who understands family expectations. I'd appreciate listening before advice.",
  "I may mostly read for now. Thanks for making space.",
] as const;

export const weeklyTopic = {
  title: "What helps you feel heard when family expectations feel heavy?",
  note: "Illustrative suggestion. Organizer approval required.",
  simulated: true as const,
};

export const otherStories: OtherStory[] = [
  {
    id: "kabir",
    name: "Kabir",
    age: 27,
    title: "I don't want a support group. I want somewhere to belong.",
    summary:
      "Recently moved to Hyderabad and wants a low-pressure way to rebuild routine and meet people.",
    concept: "Activity-based belonging",
    mode: "Activity-based belonging",
    simulated: true,
  },
  {
    id: "samira",
    name: "Samira",
    age: 31,
    title: "I want to understand my options without anyone knowing I'm here.",
    summary:
      "Wants to read useful, approved experiences without joining or creating a public profile.",
    concept: "Quiet reading",
    mode: "Quiet reading",
    simulated: true,
  },
  {
    id: "meera",
    name: "Meera",
    age: 36,
    title: "I've been through this. I can help, without joining an organization.",
    summary:
      "Would like to share lived experience occasionally while choosing her own topics and boundaries.",
    concept: "Independent peer host",
    mode: "Independent peer host",
    simulated: true,
  },
];

export function rankCircles(mode: DiscoveryMode): PeerCircle[] {
  const contextOrder = ["family-expectations", "quiet-relationships", "divorce-logistics"];
  const keywordOrder = ["divorce-logistics", "quiet-relationships", "family-expectations"];
  const order = mode === "context" ? contextOrder : keywordOrder;
  return order.flatMap((id) => circles.filter((circle) => circle.id === id));
}

export function composeIntroduction(choices: ShareChoices): string {
  const fragments: string[] = [];
  if (choices.relationshipContext) {
    fragments.push("I'm dealing with family expectations around a personal relationship.");
  }
  if (choices.seekLivedExperience) {
    fragments.push("I'd appreciate hearing from people with similar experiences.");
  }
  if (choices.ageAndCity) {
    fragments.push("I'm 29 and based in Hyderabad.");
  }
  return fragments.join(" ");
}

export function isAliasValid(alias: string): boolean {
  return /^[A-Za-z0-9_]{3,24}$/.test(alias);
}
