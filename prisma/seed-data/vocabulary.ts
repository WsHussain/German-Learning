export interface VocabularySeed {
  german: string;
  english: string;
  article?: "der" | "die" | "das";
  exampleSentence: string;
  exampleTranslation: string;
  pronunciation?: string;
  level: "A0" | "A1" | "A2" | "B1";
  topic: string;
  difficulty: number; // 1-5
}

export const VOCABULARY: VocabularySeed[] = [
  // ── Greetings (A0) ──
  { german: "hallo", english: "hello", exampleSentence: "Hallo, wie geht es dir?", exampleTranslation: "Hello, how are you?", pronunciation: "ha-LOH", level: "A0", topic: "greetings", difficulty: 1 },
  { german: "guten Morgen", english: "good morning", exampleSentence: "Guten Morgen, hast du gut geschlafen?", exampleTranslation: "Good morning, did you sleep well?", pronunciation: "GOO-ten MOR-gen", level: "A0", topic: "greetings", difficulty: 1 },
  { german: "guten Tag", english: "good day / hello (formal)", exampleSentence: "Guten Tag, mein Name ist Waqas.", exampleTranslation: "Good day, my name is Waqas.", pronunciation: "GOO-ten TAHK", level: "A0", topic: "greetings", difficulty: 1 },
  { german: "auf Wiedersehen", english: "goodbye (formal)", exampleSentence: "Auf Wiedersehen, bis morgen!", exampleTranslation: "Goodbye, see you tomorrow!", pronunciation: "owf VEE-der-zayn", level: "A0", topic: "greetings", difficulty: 1 },
  { german: "tschüss", english: "bye (informal)", exampleSentence: "Tschüss, wir sehen uns später.", exampleTranslation: "Bye, we'll see each other later.", pronunciation: "chüs", level: "A0", topic: "greetings", difficulty: 1 },
  { german: "bitte", english: "please / you're welcome", exampleSentence: "Ein Kaffee, bitte.", exampleTranslation: "One coffee, please.", pronunciation: "BIT-te", level: "A0", topic: "greetings", difficulty: 1 },
  { german: "danke", english: "thank you", exampleSentence: "Danke für deine Hilfe.", exampleTranslation: "Thank you for your help.", pronunciation: "DAN-ke", level: "A0", topic: "greetings", difficulty: 1 },
  { german: "entschuldigung", english: "excuse me / sorry", exampleSentence: "Entschuldigung, wo ist der Bahnhof?", exampleTranslation: "Excuse me, where is the train station?", pronunciation: "ent-SHUL-di-gung", level: "A0", topic: "greetings", difficulty: 2 },

  // ── Numbers (A0) ──
  { german: "eins", english: "one", exampleSentence: "Ich habe nur eins.", exampleTranslation: "I only have one.", level: "A0", topic: "numbers", difficulty: 1 },
  { german: "zwei", english: "two", exampleSentence: "Ich hätte gern zwei Brötchen.", exampleTranslation: "I'd like two bread rolls.", level: "A0", topic: "numbers", difficulty: 1 },
  { german: "drei", english: "three", exampleSentence: "Wir sind zu dritt.", exampleTranslation: "There are three of us.", level: "A0", topic: "numbers", difficulty: 1 },
  { german: "zehn", english: "ten", exampleSentence: "Das kostet zehn Euro.", exampleTranslation: "That costs ten euros.", level: "A0", topic: "numbers", difficulty: 1 },
  { german: "zwanzig", english: "twenty", exampleSentence: "Ich bin zwanzig Jahre alt.", exampleTranslation: "I am twenty years old.", level: "A0", topic: "numbers", difficulty: 1 },
  { german: "hundert", english: "hundred", exampleSentence: "Das Haus ist hundert Jahre alt.", exampleTranslation: "The house is a hundred years old.", level: "A0", topic: "numbers", difficulty: 2 },

  // ── Family (A1) ──
  { german: "die Familie", english: "family", article: "die", exampleSentence: "Meine Familie wohnt in Berlin.", exampleTranslation: "My family lives in Berlin.", level: "A1", topic: "family", difficulty: 1 },
  { german: "die Mutter", english: "mother", article: "die", exampleSentence: "Meine Mutter kocht sehr gut.", exampleTranslation: "My mother cooks very well.", level: "A1", topic: "family", difficulty: 1 },
  { german: "der Vater", english: "father", article: "der", exampleSentence: "Mein Vater arbeitet in einer Bank.", exampleTranslation: "My father works at a bank.", level: "A1", topic: "family", difficulty: 1 },
  { german: "der Bruder", english: "brother", article: "der", exampleSentence: "Ich habe einen älteren Bruder.", exampleTranslation: "I have an older brother.", level: "A1", topic: "family", difficulty: 1 },
  { german: "die Schwester", english: "sister", article: "die", exampleSentence: "Meine Schwester studiert Medizin.", exampleTranslation: "My sister studies medicine.", level: "A1", topic: "family", difficulty: 1 },
  { german: "die Eltern", english: "parents", article: "die", exampleSentence: "Meine Eltern kommen zu Besuch.", exampleTranslation: "My parents are coming to visit.", level: "A1", topic: "family", difficulty: 2 },
  { german: "das Kind", english: "child", article: "das", exampleSentence: "Das Kind spielt im Garten.", exampleTranslation: "The child is playing in the garden.", level: "A1", topic: "family", difficulty: 1 },

  // ── Countries & nationalities (A1) ──
  { german: "das Land", english: "country", article: "das", exampleSentence: "Deutschland ist ein schönes Land.", exampleTranslation: "Germany is a beautiful country.", level: "A1", topic: "countries", difficulty: 2 },
  { german: "Deutschland", english: "Germany", exampleSentence: "Ich lebe seit einem Jahr in Deutschland.", exampleTranslation: "I've lived in Germany for a year.", level: "A1", topic: "countries", difficulty: 1 },
  { german: "die Sprache", english: "language", article: "die", exampleSentence: "Deutsch ist eine schwere Sprache.", exampleTranslation: "German is a difficult language.", level: "A1", topic: "countries", difficulty: 2 },
  { german: "kommen aus", english: "to come from", exampleSentence: "Ich komme aus Frankreich.", exampleTranslation: "I come from France.", level: "A1", topic: "countries", difficulty: 1 },

  // ── Jobs (A1) ──
  { german: "der Beruf", english: "profession", article: "der", exampleSentence: "Was ist dein Beruf?", exampleTranslation: "What is your profession?", level: "A1", topic: "jobs", difficulty: 2 },
  { german: "der Webentwickler", english: "web developer", article: "der", exampleSentence: "Ich arbeite als Webentwickler.", exampleTranslation: "I work as a web developer.", level: "A1", topic: "jobs", difficulty: 2 },
  { german: "der Lehrer", english: "teacher", article: "der", exampleSentence: "Mein Bruder ist Lehrer.", exampleTranslation: "My brother is a teacher.", level: "A1", topic: "jobs", difficulty: 1 },
  { german: "arbeiten", english: "to work", exampleSentence: "Ich arbeite von zu Hause aus.", exampleTranslation: "I work from home.", level: "A1", topic: "jobs", difficulty: 1 },
  { german: "studieren", english: "to study (at university)", exampleSentence: "Sie studiert Informatik.", exampleTranslation: "She studies computer science.", level: "A1", topic: "jobs", difficulty: 2 },

  // ── Articles / gender (A1) ──
  { german: "der Tisch", english: "table", article: "der", exampleSentence: "Der Tisch ist aus Holz.", exampleTranslation: "The table is made of wood.", level: "A1", topic: "articles", difficulty: 1 },
  { german: "die Tür", english: "door", article: "die", exampleSentence: "Die Tür ist offen.", exampleTranslation: "The door is open.", level: "A1", topic: "articles", difficulty: 1 },
  { german: "das Fenster", english: "window", article: "das", exampleSentence: "Das Fenster ist geschlossen.", exampleTranslation: "The window is closed.", level: "A1", topic: "articles", difficulty: 1 },
  { german: "das Buch", english: "book", article: "das", exampleSentence: "Ich lese ein interessantes Buch.", exampleTranslation: "I'm reading an interesting book.", level: "A1", topic: "articles", difficulty: 1 },

  // ── Food & drink (A1) ──
  { german: "das Brot", english: "bread", article: "das", exampleSentence: "Ich esse gern frisches Brot.", exampleTranslation: "I like eating fresh bread.", level: "A1", topic: "food", difficulty: 1 },
  { german: "das Wasser", english: "water", article: "das", exampleSentence: "Ein Glas Wasser, bitte.", exampleTranslation: "A glass of water, please.", level: "A1", topic: "food", difficulty: 1 },
  { german: "der Kaffee", english: "coffee", article: "der", exampleSentence: "Ich trinke jeden Morgen Kaffee.", exampleTranslation: "I drink coffee every morning.", level: "A1", topic: "food", difficulty: 1 },
  { german: "die Rechnung", english: "the bill/check", article: "die", exampleSentence: "Die Rechnung, bitte.", exampleTranslation: "The bill, please.", level: "A1", topic: "food", difficulty: 2 },
  { german: "möchten", english: "would like to", exampleSentence: "Ich möchte einen Tee, bitte.", exampleTranslation: "I would like a tea, please.", level: "A1", topic: "food", difficulty: 2 },
  { german: "das Restaurant", english: "restaurant", article: "das", exampleSentence: "Wir gehen heute ins Restaurant.", exampleTranslation: "We're going to a restaurant today.", level: "A1", topic: "food", difficulty: 1 },

  // ── Daily routine (A1) ──
  { german: "aufstehen", english: "to get up", exampleSentence: "Ich stehe um sieben Uhr auf.", exampleTranslation: "I get up at seven o'clock.", level: "A1", topic: "daily-routine", difficulty: 2 },
  { german: "frühstücken", english: "to have breakfast", exampleSentence: "Wir frühstücken zusammen.", exampleTranslation: "We have breakfast together.", level: "A1", topic: "daily-routine", difficulty: 2 },
  { german: "schlafen gehen", english: "to go to sleep", exampleSentence: "Ich gehe um elf Uhr schlafen.", exampleTranslation: "I go to sleep at eleven o'clock.", level: "A1", topic: "daily-routine", difficulty: 2 },
  { german: "immer", english: "always", exampleSentence: "Ich trinke immer Kaffee am Morgen.", exampleTranslation: "I always drink coffee in the morning.", level: "A1", topic: "daily-routine", difficulty: 1 },
  { german: "manchmal", english: "sometimes", exampleSentence: "Manchmal arbeite ich am Wochenende.", exampleTranslation: "Sometimes I work on the weekend.", level: "A1", topic: "daily-routine", difficulty: 2 },

  // ── Housing (A1) ──
  { german: "die Wohnung", english: "apartment", article: "die", exampleSentence: "Meine Wohnung ist klein, aber gemütlich.", exampleTranslation: "My apartment is small but cozy.", level: "A1", topic: "housing", difficulty: 2 },
  { german: "das Zimmer", english: "room", article: "das", exampleSentence: "Das Zimmer hat viel Licht.", exampleTranslation: "The room has a lot of light.", level: "A1", topic: "housing", difficulty: 1 },
  { german: "die Küche", english: "kitchen", article: "die", exampleSentence: "Die Küche ist sehr modern.", exampleTranslation: "The kitchen is very modern.", level: "A1", topic: "housing", difficulty: 1 },
  { german: "der Stuhl", english: "chair", article: "der", exampleSentence: "Der Stuhl steht neben dem Tisch.", exampleTranslation: "The chair is next to the table.", level: "A1", topic: "housing", difficulty: 1 },

  // ── Directions (A1) ──
  { german: "links", english: "left", exampleSentence: "Gehen Sie nach links.", exampleTranslation: "Go to the left.", level: "A1", topic: "directions", difficulty: 1 },
  { german: "rechts", english: "right", exampleSentence: "Das Geschäft ist rechts.", exampleTranslation: "The shop is on the right.", level: "A1", topic: "directions", difficulty: 1 },
  { german: "geradeaus", english: "straight ahead", exampleSentence: "Gehen Sie immer geradeaus.", exampleTranslation: "Keep going straight ahead.", level: "A1", topic: "directions", difficulty: 2 },
  { german: "die Ecke", english: "corner", article: "die", exampleSentence: "Der Bahnhof ist um die Ecke.", exampleTranslation: "The train station is around the corner.", level: "A1", topic: "directions", difficulty: 2 },

  // ── Weekend activities / past (A1) ──
  { german: "das Wochenende", english: "weekend", article: "das", exampleSentence: "Was hast du am Wochenende gemacht?", exampleTranslation: "What did you do on the weekend?", level: "A1", topic: "weekend", difficulty: 1 },
  { german: "gemacht", english: "done/made (past participle)", exampleSentence: "Ich habe nichts Besonderes gemacht.", exampleTranslation: "I didn't do anything special.", level: "A1", topic: "weekend", difficulty: 2 },
  { german: "spazieren gehen", english: "to go for a walk", exampleSentence: "Wir sind im Park spazieren gegangen.", exampleTranslation: "We went for a walk in the park.", level: "A1", topic: "weekend", difficulty: 2 },

  // ── Shopping (A1) ──
  { german: "die Kleidung", english: "clothing", article: "die", exampleSentence: "Die Kleidung ist im Angebot.", exampleTranslation: "The clothing is on sale.", level: "A1", topic: "shopping", difficulty: 2 },
  { german: "billig", english: "cheap", exampleSentence: "Dieses Hemd ist billiger als das andere.", exampleTranslation: "This shirt is cheaper than the other one.", level: "A1", topic: "shopping", difficulty: 2 },
  { german: "teuer", english: "expensive", exampleSentence: "Das ist mir zu teuer.", exampleTranslation: "That's too expensive for me.", level: "A1", topic: "shopping", difficulty: 2 },
  { german: "die Größe", english: "size", article: "die", exampleSentence: "Haben Sie eine größere Größe?", exampleTranslation: "Do you have a bigger size?", level: "A1", topic: "shopping", difficulty: 2 },

  // ── Weather & hobbies (A1) ──
  { german: "das Wetter", english: "weather", article: "das", exampleSentence: "Wie ist das Wetter heute?", exampleTranslation: "What's the weather like today?", level: "A1", topic: "weather", difficulty: 1 },
  { german: "die Sonne", english: "sun", article: "die", exampleSentence: "Die Sonne scheint heute.", exampleTranslation: "The sun is shining today.", level: "A1", topic: "weather", difficulty: 1 },
  { german: "der Regen", english: "rain", article: "der", exampleSentence: "Ich mag den Regen nicht.", exampleTranslation: "I don't like the rain.", level: "A1", topic: "weather", difficulty: 1 },
  { german: "das Hobby", english: "hobby", article: "das", exampleSentence: "Mein Hobby ist Lesen.", exampleTranslation: "My hobby is reading.", level: "A1", topic: "hobbies", difficulty: 1 },
  { german: "gern haben", english: "to like", exampleSentence: "Ich habe Musik sehr gern.", exampleTranslation: "I like music very much.", level: "A1", topic: "hobbies", difficulty: 2 },

  // ── Travel (A2) ──
  { german: "der Flughafen", english: "airport", article: "der", exampleSentence: "Wir treffen uns am Flughafen.", exampleTranslation: "We'll meet at the airport.", level: "A2", topic: "travel", difficulty: 2 },
  { german: "der Bahnhof", english: "train station", article: "der", exampleSentence: "Der Zug fährt vom Hauptbahnhof ab.", exampleTranslation: "The train departs from the main station.", level: "A2", topic: "travel", difficulty: 2 },
  { german: "die Fahrkarte", english: "ticket", article: "die", exampleSentence: "Ich kaufe eine Fahrkarte nach Berlin.", exampleTranslation: "I'm buying a ticket to Berlin.", level: "A2", topic: "travel", difficulty: 2 },
  { german: "die Verspätung", english: "delay", article: "die", exampleSentence: "Der Zug hat zehn Minuten Verspätung.", exampleTranslation: "The train is ten minutes late.", level: "A2", topic: "travel", difficulty: 3 },

  // ── Dative / giving directions (A2) ──
  { german: "helfen", english: "to help (+ dative)", exampleSentence: "Kannst du mir helfen?", exampleTranslation: "Can you help me?", level: "A2", topic: "dative", difficulty: 3 },
  { german: "gefallen", english: "to please/like (+ dative)", exampleSentence: "Die Stadt gefällt mir sehr.", exampleTranslation: "I like the city a lot.", level: "A2", topic: "dative", difficulty: 3 },
  { german: "gehören", english: "to belong to (+ dative)", exampleSentence: "Das Buch gehört meinem Freund.", exampleTranslation: "The book belongs to my friend.", level: "A2", topic: "dative", difficulty: 3 },

  // ── Health & body (A2) ──
  { german: "der Kopf", english: "head", article: "der", exampleSentence: "Ich habe Kopfschmerzen.", exampleTranslation: "I have a headache.", level: "A2", topic: "health", difficulty: 2 },
  { german: "der Arzt", english: "doctor", article: "der", exampleSentence: "Ich muss zum Arzt gehen.", exampleTranslation: "I need to go to the doctor.", level: "A2", topic: "health", difficulty: 2 },
  { german: "krank", english: "sick", exampleSentence: "Mein Kollege ist krank.", exampleTranslation: "My colleague is sick.", level: "A2", topic: "health", difficulty: 2 },
  { german: "die Apotheke", english: "pharmacy", article: "die", exampleSentence: "Die Apotheke ist gleich um die Ecke.", exampleTranslation: "The pharmacy is just around the corner.", level: "A2", topic: "health", difficulty: 2 },
  { german: "weh tun", english: "to hurt", exampleSentence: "Mein Rücken tut weh.", exampleTranslation: "My back hurts.", level: "A2", topic: "health", difficulty: 3 },

  // ── Describing people (A2) ──
  { german: "freundlich", english: "friendly", exampleSentence: "Meine Nachbarin ist sehr freundlich.", exampleTranslation: "My neighbor is very friendly.", level: "A2", topic: "describing-people", difficulty: 2 },
  { german: "geduldig", english: "patient", exampleSentence: "Mein Lehrer ist sehr geduldig.", exampleTranslation: "My teacher is very patient.", level: "A2", topic: "describing-people", difficulty: 3 },
  { german: "die Persönlichkeit", english: "personality", article: "die", exampleSentence: "Sie hat eine starke Persönlichkeit.", exampleTranslation: "She has a strong personality.", level: "A2", topic: "describing-people", difficulty: 3 },

  // ── Work (A2) ──
  { german: "das Meeting", english: "meeting", article: "das", exampleSentence: "Das Meeting beginnt um neun Uhr.", exampleTranslation: "The meeting starts at nine o'clock.", level: "A2", topic: "work", difficulty: 2 },
  { german: "die Besprechung", english: "meeting/discussion", article: "die", exampleSentence: "Wir haben morgen eine wichtige Besprechung.", exampleTranslation: "We have an important meeting tomorrow.", level: "A2", topic: "work", difficulty: 3 },
  { german: "der Kollege", english: "colleague", article: "der", exampleSentence: "Mein Kollege hilft mir oft.", exampleTranslation: "My colleague often helps me.", level: "A2", topic: "work", difficulty: 2 },
  { german: "die Frist", english: "deadline", article: "die", exampleSentence: "Die Frist ist nächsten Freitag.", exampleTranslation: "The deadline is next Friday.", level: "A2", topic: "work", difficulty: 3 },

  // ── Future plans (A2) ──
  { german: "das Ziel", english: "goal", article: "das", exampleSentence: "Mein Ziel ist es, fließend Deutsch zu sprechen.", exampleTranslation: "My goal is to speak German fluently.", level: "A2", topic: "future-plans", difficulty: 3 },
  { german: "vorhaben", english: "to plan/intend", exampleSentence: "Was hast du für nächstes Jahr vor?", exampleTranslation: "What are your plans for next year?", level: "A2", topic: "future-plans", difficulty: 3 },

  // ── Genitive / relative clauses (B1) ──
  { german: "wegen", english: "because of (+ genitive)", exampleSentence: "Wegen des Regens bleiben wir zu Hause.", exampleTranslation: "Because of the rain, we're staying home.", level: "B1", topic: "genitive", difficulty: 4 },
  { german: "trotz", english: "despite (+ genitive)", exampleSentence: "Trotz des schlechten Wetters gehen wir raus.", exampleTranslation: "Despite the bad weather, we're going out.", level: "B1", topic: "genitive", difficulty: 4 },

  // ── Opinions / Konjunktiv II (B1) ──
  { german: "die Meinung", english: "opinion", article: "die", exampleSentence: "Meiner Meinung nach ist das falsch.", exampleTranslation: "In my opinion, that's wrong.", level: "B1", topic: "opinions", difficulty: 3 },
  { german: "der Vorschlag", english: "suggestion", article: "der", exampleSentence: "Das ist ein guter Vorschlag.", exampleTranslation: "That's a good suggestion.", level: "B1", topic: "opinions", difficulty: 3 },
  { german: "überzeugt sein", english: "to be convinced", exampleSentence: "Ich bin davon überzeugt, dass es klappt.", exampleTranslation: "I'm convinced that it will work.", level: "B1", topic: "opinions", difficulty: 4 },

  // ── News & media (B1) ──
  { german: "die Nachrichten", english: "the news", article: "die", exampleSentence: "Ich schaue jeden Abend die Nachrichten.", exampleTranslation: "I watch the news every evening.", level: "B1", topic: "news", difficulty: 3 },
  { german: "die Zeitung", english: "newspaper", article: "die", exampleSentence: "Er liest jeden Morgen die Zeitung.", exampleTranslation: "He reads the newspaper every morning.", level: "B1", topic: "news", difficulty: 2 },
  { german: "berichten", english: "to report", exampleSentence: "Die Zeitung berichtet über die Wahl.", exampleTranslation: "The newspaper reports on the election.", level: "B1", topic: "news", difficulty: 4 },

  // ── Culture & society (B1) ──
  { german: "die Gesellschaft", english: "society", article: "die", exampleSentence: "Das ist ein wichtiges Thema für unsere Gesellschaft.", exampleTranslation: "That's an important topic for our society.", level: "B1", topic: "culture", difficulty: 4 },
  { german: "die Tradition", english: "tradition", article: "die", exampleSentence: "Das ist eine alte deutsche Tradition.", exampleTranslation: "That's an old German tradition.", level: "B1", topic: "culture", difficulty: 3 },
  { german: "der Unterschied", english: "difference", article: "der", exampleSentence: "Es gibt große Unterschiede zwischen den Kulturen.", exampleTranslation: "There are big differences between the cultures.", level: "B1", topic: "culture", difficulty: 4 },
];
