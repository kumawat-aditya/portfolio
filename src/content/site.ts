import raw from "@raw/content.json";

/* ============================================================================
   CONTENT LAYER
   ----------------------------------------------------------------------------
   raw_data/content.json is the single source of truth for facts.
   Nothing in this file invents information. Everything here is either
   (a) read straight out of the JSON, or
   (b) a *presentation choice* about which fact to show and how short to cut it.

   Swapping content.json should never require touching a scene component.
   ========================================================================= */

type RawProject = (typeof raw.projects)[number];

export const person = {
  name: raw.personal.name,
  firstName: raw.personal.name.split(" ")[0],
  role: raw.personal.role,
  location: raw.personal.location,
  email: raw.personal.email,
  github: raw.personal.links.github,
  linkedin: raw.personal.links.linkedin,
};

/* --------------------------------------------------------------------------
   Projects
   --------------------------------------------------------------------------
   `readout` — the defining constraint of the system, in the machine's voice.
   Every number below is traceable to content.json. These are instrument
   labels, not marketing copy: the numbers do the persuading.

   `honest` — one line, always about the part that was actually hard.
   Each is a compression of that project's own `failure_points` or
   `why_it_was_hard`. Nothing new is claimed.
   -------------------------------------------------------------------------- */

type Presentation = {
  slug: string;
  /** short enough to be set at display size */
  name: string;
  /** case-insensitive fragment that identifies this project in content.json */
  match: string;
  readout: string;
  honest: string;
  /**
   * The system's own stages, drawn inline as a hairline chain. Only given to
   * projects whose shape is genuinely legible in five words — density where
   * density earns itself, nothing where it doesn't.
   */
  chain?: string[];
};

const PRESENTATION: Presentation[] = [
  {
    slug: "ant-meta-bots",
    name: "ANT Meta Bots",
    match: "ant meta bots",
    readout: "1s loop · 4 subsystems · 1 thread",
    honest: "Four things that all wanted to be the only thing running.",
    chain: ["api", "botmanager", "livefeed", "watchdog"],
  },
  {
    slug: "elastic-dca",
    name: "Elastic DCA v4",
    match: "elastic dca",
    readout: "1 Hz · server-authoritative · 10s watchdog",
    honest: "The terminal kept forgetting what the server had already decided.",
  },
  {
    slug: "quant-discovery",
    name: "Quant Discovery",
    match: "quant discovery",
    readout: "~570,000,000 rows · 300+ features · 5 layers",
    honest: "The join that kept eating all the RAM.",
    chain: ["bronze", "silver", "gold", "platinum", "diamond"],
  },
  {
    slug: "rubiks-solver",
    name: "Rubik's Cube Solver",
    match: "rubik",
    readout: "~43 quintillion states · under 2s · 0 dependencies",
    honest: "Brute force ran out of memory before it ran out of ideas.",
  },
  {
    slug: "elisa",
    name: "ELISA",
    match: "elisa",
    readout: "0 cloud calls · 20 intents · 3 services",
    honest: "One microphone, two programs, both convinced it was theirs.",
    chain: ["wake", "vad", "stt", "nlu", "logic", "tts"],
  },
  {
    slug: "telegram-signals",
    name: "Telegram Signal Bridge",
    match: "telegram signal",
    readout: "poll 10s · ttl 10s / 600s · 7 regex patterns",
    honest: "Trade instructions arriving as human sentences in a group chat.",
  },
  {
    slug: "lorentzian",
    name: "Lorentzian ML Engine",
    match: "lorentzian ml engine",
    readout: "3 languages · 1 answer · 0 ML libraries",
    honest: "Same maths in three languages, and a float that quietly disagreed.",
  },
  {
    slug: "stella",
    name: "Stella",
    match: "stella",
    readout: "3 tiers · 2-phase payments · 1 signature check",
    honest: "Money arriving twice for the same order.",
  },
  {
    slug: "classical-nlp",
    name: "Classical NLP Engine",
    match: "classical nlp",
    readout: "8 layers · 0 LLMs",
    honest: "Works beautifully until someone types like a person.",
  },
];

const findRaw = (match: string): RawProject => {
  const found = raw.projects.find((p) => p.title.toLowerCase().includes(match));
  if (!found) throw new Error(`content.json has no project matching "${match}"`);
  return found;
};

export type Project = Presentation & {
  /** the full title as written in content.json, kept for case-study pages */
  fullTitle: string;
  description: string;
  stack: string[];
  github: string;
  problem: string;
  whyHard: string;
  tradeoffs: string[];
  failurePoints: string[];
  learned: string;
  behaviour: string;
};

export const projects: Project[] = PRESENTATION.map((p) => {
  const r = findRaw(p.match);
  return {
    ...p,
    fullTitle: r.title,
    description: r.description,
    stack: r.stack,
    github: r.github,
    problem: r.insights.problem,
    whyHard: r.insights.why_it_was_hard,
    tradeoffs: r.insights.tradeoffs,
    failurePoints: r.insights.failure_points,
    learned: r.insights.what_i_learned,
    behaviour: r.insights.real_world_behavior,
  };
});

/** the wall shows five at scale; the rest sit on the shelf below it */
export const featuredProjects = projects.slice(0, 5);
export const shelfProjects = projects.slice(5);

/* --------------------------------------------------------------------------
   Evolution — 2022 to now, used to draw one continuous line
   -------------------------------------------------------------------------- */

export type Era = {
  year: string;
  title: string;
  subtitle: string | null;
  description: string;
  points: string[];
  tech: string[];
  /** how settled the work had become — drives how straight the line is drawn */
  precision: number;
};

export const eras: Era[] = raw.evolution.map((e, i, all) => ({
  year: e.year,
  title: e.title,
  subtitle: e.subtitle,
  description: e.description,
  points: e.points,
  tech: e.tech,
  precision: all.length > 1 ? i / (all.length - 1) : 1,
}));

/* --------------------------------------------------------------------------
   Where he actually works now
   -------------------------------------------------------------------------- */

export const currentRole = {
  company: raw.experience[0].company,
  role: raw.experience[0].role,
  duration: raw.experience[0].duration,
};

export const priorRole = {
  company: raw.experience[1].company,
  role: raw.experience[1].role,
  duration: raw.experience[1].duration,
};

/**
 * The belief the whole site is built around, and the project that proves he
 * actually holds it. Both quoted from content.json rather than written.
 */
export const belief = {
  source: raw.evolution[2].description,
  evidence: (() => {
    const project = projects.find((p) => p.slug === "elastic-dca");
    if (!project) throw new Error("content.json is missing elastic-dca");
    return { quote: project.learned, from: project.name };
  })(),
};
