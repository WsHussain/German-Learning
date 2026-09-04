export type RoadmapTopicType =
  | "GRAMMAR"
  | "VOCABULARY"
  | "LISTENING"
  | "SPEAKING"
  | "READING"
  | "WRITING";

export interface RoadmapTopicSeed {
  type: RoadmapTopicType;
  title: string;
  description: string;
}

export interface RoadmapWeekSeed {
  level: "A0" | "A1" | "A2" | "B1";
  weekIndex: number;
  title: string;
  focus: string;
  topics: RoadmapTopicSeed[];
}

/**
 * A realistic 6-month (26-week) progression from absolute beginner (A0)
 * to B1, structured week by week. weekIndex restarts at 1 for each level;
 * `order` (assigned at seed time) gives the global sequence across all
 * 26 weeks so the daily task generator can walk through it linearly.
 */
export const ROADMAP: RoadmapWeekSeed[] = [
  // ── A0 — absolute basics (2 weeks) ─────────────────────────────────────
  {
    level: "A0",
    weekIndex: 1,
    title: "First steps",
    focus: "Alphabet, pronunciation, greetings, and introducing yourself",
    topics: [
      { type: "SPEAKING", title: "Alphabet & pronunciation", description: "The German alphabet, umlauts (ä ö ü), and ß. Core pronunciation rules that differ from English." },
      { type: "SPEAKING", title: "Greetings", description: "Hallo, Guten Morgen/Tag/Abend, Auf Wiedersehen, Tschüss — formal vs. informal." },
      { type: "SPEAKING", title: "Introducing yourself", description: "Ich heiße..., Ich komme aus..., Ich bin... — the sentences you'll use in every first conversation." },
      { type: "VOCABULARY", title: "Numbers 0–20", description: "Counting from null to zwanzig, used constantly in daily life." },
      { type: "GRAMMAR", title: "The verb 'sein' (to be)", description: "Conjugating ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie sind." },
    ],
  },
  {
    level: "A0",
    weekIndex: 2,
    title: "Everyday basics",
    focus: "Numbers, time, and the questions you'll ask constantly",
    topics: [
      { type: "VOCABULARY", title: "Numbers 20–100", description: "Larger numbers for prices, ages, and phone numbers." },
      { type: "VOCABULARY", title: "Days & months", description: "Wochentage and Monate, plus how Germans write dates." },
      { type: "GRAMMAR", title: "W-questions", description: "Wer, was, wo, wann, warum, wie — the backbone of every conversation." },
      { type: "LISTENING", title: "Classroom & polite phrases", description: "Ich verstehe nicht, Können Sie das wiederholen?, Wie sagt man...?" },
      { type: "READING", title: "Simple signs & labels", description: "Reading everyday German signage: Eingang, Ausgang, Offen, Geschlossen." },
    ],
  },

  // ── A1 — 10 weeks ────────────────────────────────────────────────────
  {
    level: "A1",
    weekIndex: 1,
    title: "Alphabet, pronunciation & introductions",
    focus: "Consolidating the basics and introducing numbers in context",
    topics: [
      { type: "SPEAKING", title: "Alphabet & pronunciation", description: "Spelling your name out loud (Buchstabieren) — a real skill you'll use often." },
      { type: "SPEAKING", title: "Greetings", description: "Regional greeting variations and small talk openers." },
      { type: "SPEAKING", title: "Introducing yourself", description: "Extended self-introduction: name, origin, age, language." },
      { type: "VOCABULARY", title: "Numbers", description: "Numbers up to 1000, used in addresses and prices." },
    ],
  },
  {
    level: "A1",
    weekIndex: 2,
    title: "Family, countries & jobs",
    focus: "Talking about the people and world around you",
    topics: [
      { type: "VOCABULARY", title: "Family", description: "Mutter, Vater, Geschwister, and describing your family tree." },
      { type: "VOCABULARY", title: "Countries & nationalities", description: "Countries, nationalities, and languages: Ich komme aus Frankreich, ich bin Franzose." },
      { type: "VOCABULARY", title: "Jobs", description: "Common professions and asking Was machst du beruflich?" },
      { type: "GRAMMAR", title: "Basic verbs", description: "Present-tense conjugation of regular verbs: -e, -st, -t, -en, -t, -en." },
    ],
  },
  {
    level: "A1",
    weekIndex: 3,
    title: "Articles & gender",
    focus: "Der, die, das — the foundation of German grammar",
    topics: [
      { type: "GRAMMAR", title: "Articles", description: "Definite (der/die/das) and indefinite (ein/eine) articles." },
      { type: "GRAMMAR", title: "Gender", description: "Why German nouns have grammatical gender, and patterns that help predict it." },
      { type: "GRAMMAR", title: "Present tense", description: "Regular and key irregular verbs (haben, sein, gehen) in the present tense." },
      { type: "LISTENING", title: "Articles in context", description: "Listening for der/die/das in natural speech." },
    ],
  },
  {
    level: "A1",
    weekIndex: 4,
    title: "Accusative case & negation",
    focus: "Your first case, and how to say 'not'",
    topics: [
      { type: "GRAMMAR", title: "Akkusativ case", description: "The direct-object case: den, die, das, einen." },
      { type: "GRAMMAR", title: "Negation", description: "Nicht vs. kein — negating verbs and nouns correctly." },
      { type: "GRAMMAR", title: "Possessive pronouns", description: "Mein, dein, sein, ihr — expressing ownership." },
      { type: "WRITING", title: "Short descriptions", description: "Writing 3–4 sentences describing your belongings and family using possessives." },
    ],
  },
  {
    level: "A1",
    weekIndex: 5,
    title: "Food, drink & modal verbs",
    focus: "Ordering food and expressing ability, permission, and desire",
    topics: [
      { type: "VOCABULARY", title: "Food & drink", description: "Restaurant and grocery vocabulary." },
      { type: "SPEAKING", title: "Ordering food", description: "Ich möchte..., Die Rechnung, bitte — restaurant dialogues." },
      { type: "GRAMMAR", title: "Modal verbs", description: "Können, müssen, wollen, and their sentence-final infinitive pattern." },
      { type: "LISTENING", title: "Restaurant conversations", description: "Following a real ordering conversation at native pace (slowed)." },
    ],
  },
  {
    level: "A1",
    weekIndex: 6,
    title: "Daily routine",
    focus: "Describing your day and telling time",
    topics: [
      { type: "VOCABULARY", title: "Daily routine", description: "Aufstehen, frühstücken, arbeiten, schlafen gehen." },
      { type: "GRAMMAR", title: "Separable verbs", description: "Verbs like aufstehen and anrufen that split in the sentence." },
      { type: "GRAMMAR", title: "Time expressions", description: "Telling time, and words like immer, oft, manchmal, nie." },
      { type: "WRITING", title: "A day in my life", description: "Writing a short paragraph about your typical weekday." },
    ],
  },
  {
    level: "A1",
    weekIndex: 7,
    title: "Housing & directions",
    focus: "Describing where you live and finding your way",
    topics: [
      { type: "VOCABULARY", title: "Housing", description: "Rooms, furniture, and describing your home." },
      { type: "GRAMMAR", title: "Two-way prepositions", description: "In, an, auf, unter — location (Dativ) vs. movement (Akkusativ)." },
      { type: "SPEAKING", title: "Asking for directions", description: "Wie komme ich zum/zur...? and understanding directions given back to you." },
      { type: "LISTENING", title: "Giving directions", description: "Following spoken directions around a city." },
    ],
  },
  {
    level: "A1",
    weekIndex: 8,
    title: "Talking about the past",
    focus: "Your first past tense: the Perfekt",
    topics: [
      { type: "GRAMMAR", title: "Perfekt with haben", description: "Forming the past tense with haben + past participle for most verbs." },
      { type: "VOCABULARY", title: "Weekend activities", description: "Vocabulary for hobbies and free time." },
      { type: "SPEAKING", title: "Talking about your weekend", description: "Was hast du am Wochenende gemacht?" },
      { type: "READING", title: "A short weekend story", description: "Reading a beginner-level narrative in the Perfekt tense." },
    ],
  },
  {
    level: "A1",
    weekIndex: 9,
    title: "Shopping & comparison",
    focus: "Clothes shopping and comparing things",
    topics: [
      { type: "VOCABULARY", title: "Shopping & clothes", description: "Clothing items, sizes, colors, and shop vocabulary." },
      { type: "GRAMMAR", title: "Comparative adjectives", description: "Forming and using billiger, teurer, besser, schöner." },
      { type: "SPEAKING", title: "In a clothing store", description: "Trying on clothes and asking for a different size or color." },
      { type: "WRITING", title: "Comparing two products", description: "Writing sentences comparing price, quality, and style." },
    ],
  },
  {
    level: "A1",
    weekIndex: 10,
    title: "Weather, hobbies & A1 review",
    focus: "Consolidating everything before moving to A2",
    topics: [
      { type: "VOCABULARY", title: "Weather", description: "Describing weather and seasons." },
      { type: "VOCABULARY", title: "Hobbies", description: "Free-time activities and expressing likes/dislikes with gern." },
      { type: "GRAMMAR", title: "A1 grammar review", description: "Consolidating articles, cases, present tense, and Perfekt." },
      { type: "READING", title: "A1 checkpoint reading", description: "A short passage combining this level's vocabulary and grammar." },
    ],
  },

  // ── A2 — 8 weeks ────────────────────────────────────────────────────
  {
    level: "A2",
    weekIndex: 1,
    title: "Travel & the Perfekt with sein",
    focus: "Movement verbs in the past tense",
    topics: [
      { type: "GRAMMAR", title: "Perfekt with sein", description: "Motion and change-of-state verbs (fahren, gehen, werden) that use sein." },
      { type: "VOCABULARY", title: "Travel", description: "Airport, train station, booking, and travel vocabulary." },
      { type: "SPEAKING", title: "Planning a trip", description: "Dialogue practice for booking tickets and asking about schedules." },
      { type: "LISTENING", title: "Train station announcements", description: "Understanding real (slowed) German train announcements." },
    ],
  },
  {
    level: "A2",
    weekIndex: 2,
    title: "The dative case",
    focus: "Indirect objects and giving things to people",
    topics: [
      { type: "GRAMMAR", title: "Dativ case", description: "Indirect object case: dem, der, den + dative verbs like helfen, danken, gefallen." },
      { type: "GRAMMAR", title: "Dative prepositions", description: "Mit, nach, bei, seit, von, zu — prepositions that always take the dative." },
      { type: "SPEAKING", title: "Giving directions", description: "Using dative prepositions to explain routes and locations." },
      { type: "WRITING", title: "A postcard", description: "Writing a short postcard describing a trip using dative constructions." },
    ],
  },
  {
    level: "A2",
    weekIndex: 3,
    title: "Health & the body",
    focus: "Describing symptoms and visiting the doctor",
    topics: [
      { type: "VOCABULARY", title: "Body & health", description: "Body parts, common illnesses, and pharmacy vocabulary." },
      { type: "GRAMMAR", title: "Modal verbs review", description: "Sollen and dürfen added to your modal verb toolkit." },
      { type: "SPEAKING", title: "At the doctor's", description: "Describing symptoms: Mir tut... weh, Ich habe Kopfschmerzen." },
      { type: "LISTENING", title: "A doctor's appointment", description: "Following a natural-paced dialogue at a medical practice." },
    ],
  },
  {
    level: "A2",
    weekIndex: 4,
    title: "Describing people & comparison",
    focus: "Physical descriptions and the superlative",
    topics: [
      { type: "GRAMMAR", title: "Comparative & superlative", description: "Am schönsten, am besten — full comparison patterns." },
      { type: "VOCABULARY", title: "Describing people", description: "Appearance and personality adjectives." },
      { type: "READING", title: "Personality profiles", description: "Reading short personal-ad style texts describing people." },
      { type: "WRITING", title: "Describe a friend", description: "Writing a short description of a friend or family member." },
    ],
  },
  {
    level: "A2",
    weekIndex: 5,
    title: "Storytelling with the Präteritum",
    focus: "The written past tense used in stories and news",
    topics: [
      { type: "GRAMMAR", title: "Präteritum of common verbs", description: "War, hatte, ging, machte — the simple past for haben, sein, and modal verbs." },
      { type: "SPEAKING", title: "Telling a story", description: "Narrating a simple past event out loud." },
      { type: "READING", title: "A short story", description: "Reading a beginner short story written in the Präteritum." },
      { type: "LISTENING", title: "News headlines (simplified)", description: "Following simplified German news audio." },
    ],
  },
  {
    level: "A2",
    weekIndex: 6,
    title: "Subordinate clauses",
    focus: "Connecting ideas with weil, dass, and wenn",
    topics: [
      { type: "GRAMMAR", title: "Subordinate clauses", description: "Verb-final word order after weil, dass, wenn, obwohl." },
      { type: "SPEAKING", title: "Giving reasons", description: "Explaining opinions and decisions using weil and deshalb." },
      { type: "WRITING", title: "An opinion paragraph", description: "Writing a short paragraph giving reasons for an opinion." },
      { type: "LISTENING", title: "Everyday conversations", description: "Native-paced conversations using subordinate clauses naturally." },
    ],
  },
  {
    level: "A2",
    weekIndex: 7,
    title: "Work & the office",
    focus: "Professional vocabulary and formal writing",
    topics: [
      { type: "VOCABULARY", title: "Work & office life", description: "Meetings, emails, job titles, and workplace small talk." },
      { type: "WRITING", title: "A formal email", description: "Sehr geehrte Damen und Herren — structuring a formal email." },
      { type: "SPEAKING", title: "Small talk at work", description: "Common workplace small-talk phrases." },
      { type: "READING", title: "A job posting", description: "Reading and understanding a real-style German job advertisement." },
    ],
  },
  {
    level: "A2",
    weekIndex: 8,
    title: "Future plans & A2 review",
    focus: "Talking about the future before consolidating A2",
    topics: [
      { type: "GRAMMAR", title: "Future with werden", description: "Werden + infinitive for plans and predictions." },
      { type: "SPEAKING", title: "My plans for next year", description: "Describing future goals and intentions." },
      { type: "GRAMMAR", title: "A2 grammar review", description: "Consolidating dative, Präteritum, and subordinate clauses." },
      { type: "READING", title: "A2 checkpoint reading", description: "A longer passage combining this level's grammar and vocabulary." },
    ],
  },

  // ── B1 — 6 weeks ────────────────────────────────────────────────────
  {
    level: "B1",
    weekIndex: 1,
    title: "The genitive case & relative clauses",
    focus: "The final case, and describing nouns with extra detail",
    topics: [
      { type: "GRAMMAR", title: "Genitiv case", description: "The possessive case: des, der + genitive prepositions (trotz, während, wegen)." },
      { type: "GRAMMAR", title: "Relative clauses", description: "Der Mann, der..., Die Frau, die... — adding detail with relative pronouns." },
      { type: "READING", title: "A magazine-style article", description: "Reading an authentic-style article using relative clauses." },
      { type: "WRITING", title: "Describing in detail", description: "Combining sentences using relative clauses." },
    ],
  },
  {
    level: "B1",
    weekIndex: 2,
    title: "Konjunktiv II — hypotheticals",
    focus: "Would, could, and should — polite and hypothetical speech",
    topics: [
      { type: "GRAMMAR", title: "Konjunktiv II", description: "Würde, könnte, sollte — forming and using the subjunctive for politeness and hypotheticals." },
      { type: "SPEAKING", title: "Giving opinions politely", description: "Ich würde sagen..., An deiner Stelle würde ich..." },
      { type: "LISTENING", title: "A debate or discussion", description: "Following native speakers giving opinions and disagreeing politely." },
      { type: "WRITING", title: "What would you do?", description: "Writing hypothetical scenarios and your responses." },
    ],
  },
  {
    level: "B1",
    weekIndex: 3,
    title: "The passive voice",
    focus: "Describing processes and news without a clear subject",
    topics: [
      { type: "GRAMMAR", title: "Passive voice", description: "Werden + past participle — forming and recognizing the passive." },
      { type: "VOCABULARY", title: "News & media", description: "Vocabulary for reading and discussing news articles." },
      { type: "READING", title: "A news article", description: "Reading a real (simplified) German news article." },
      { type: "SPEAKING", title: "Summarizing news", description: "Practicing summarizing what you read or heard, out loud." },
    ],
  },
  {
    level: "B1",
    weekIndex: 4,
    title: "Complex connectors",
    focus: "Writing and speaking with more sophisticated logic",
    topics: [
      { type: "GRAMMAR", title: "Advanced connectors", description: "Obwohl, trotzdem, deshalb, außerdem — linking complex ideas." },
      { type: "WRITING", title: "A structured essay", description: "Writing a short structured argument using connectors." },
      { type: "LISTENING", title: "A podcast excerpt", description: "Following a short German podcast segment at natural speed." },
      { type: "SPEAKING", title: "Structured arguments", description: "Presenting a short, structured opinion out loud." },
    ],
  },
  {
    level: "B1",
    weekIndex: 5,
    title: "Culture & society",
    focus: "Discussing bigger topics with confidence",
    topics: [
      { type: "VOCABULARY", title: "Culture & society", description: "Vocabulary for discussing culture, traditions, and current topics." },
      { type: "SPEAKING", title: "Discussing opinions", description: "Agreeing, disagreeing, and building on someone else's point." },
      { type: "READING", title: "A cultural essay", description: "Reading an intermediate-level text about German culture." },
      { type: "LISTENING", title: "An interview", description: "Following a natural-paced interview on a cultural topic." },
    ],
  },
  {
    level: "B1",
    weekIndex: 6,
    title: "B1 review & what's next",
    focus: "Consolidating six months of progress",
    topics: [
      { type: "GRAMMAR", title: "Full grammar review", description: "Reviewing all four cases, tenses, and clause structures from A0 to B1." },
      { type: "READING", title: "B1 checkpoint reading", description: "A full-length passage integrating everything you've learned." },
      { type: "SPEAKING", title: "Free conversation", description: "An unscripted speaking session summarizing your six-month journey." },
      { type: "WRITING", title: "Reflect & plan ahead", description: "Writing about your progress and setting goals beyond B1." },
    ],
  },
];
