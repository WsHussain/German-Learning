export interface SpeakingSentenceSeed {
  german: string;
  english: string;
  level: "A0" | "A1" | "A2" | "B1";
  topic: string;
}

export const SPEAKING_SENTENCES: SpeakingSentenceSeed[] = [
  // A0
  { german: "Hallo, wie geht es dir?", english: "Hello, how are you?", level: "A0", topic: "greetings" },
  { german: "Ich heiße Waqas.", english: "My name is Waqas.", level: "A0", topic: "introductions" },
  { german: "Wie heißt du?", english: "What is your name?", level: "A0", topic: "introductions" },
  { german: "Es geht mir gut, danke.", english: "I'm doing well, thank you.", level: "A0", topic: "greetings" },
  { german: "Auf Wiedersehen und bis bald.", english: "Goodbye and see you soon.", level: "A0", topic: "greetings" },
  { german: "Wie bitte? Ich verstehe nicht.", english: "Excuse me? I don't understand.", level: "A0", topic: "classroom" },
  { german: "Können Sie das bitte wiederholen?", english: "Could you please repeat that?", level: "A0", topic: "classroom" },
  { german: "Ich bin zwanzig Jahre alt.", english: "I am twenty years old.", level: "A0", topic: "numbers" },

  // A1
  { german: "Ich komme aus Frankreich.", english: "I come from France.", level: "A1", topic: "introductions" },
  { german: "Ich lerne Deutsch.", english: "I am learning German.", level: "A1", topic: "introductions" },
  { german: "Ich arbeite als Webentwickler.", english: "I work as a web developer.", level: "A1", topic: "jobs" },
  { german: "Meine Familie wohnt in Berlin.", english: "My family lives in Berlin.", level: "A1", topic: "family" },
  { german: "Ich habe einen Bruder und eine Schwester.", english: "I have a brother and a sister.", level: "A1", topic: "family" },
  { german: "Was machst du beruflich?", english: "What do you do for work?", level: "A1", topic: "jobs" },
  { german: "Der Tisch ist aus Holz.", english: "The table is made of wood.", level: "A1", topic: "articles" },
  { german: "Ich möchte einen Kaffee, bitte.", english: "I would like a coffee, please.", level: "A1", topic: "food" },
  { german: "Die Rechnung, bitte.", english: "The bill, please.", level: "A1", topic: "food" },
  { german: "Ich stehe um sieben Uhr auf.", english: "I get up at seven o'clock.", level: "A1", topic: "daily-routine" },
  { german: "Ich frühstücke jeden Morgen.", english: "I have breakfast every morning.", level: "A1", topic: "daily-routine" },
  { german: "Meine Wohnung ist klein, aber gemütlich.", english: "My apartment is small but cozy.", level: "A1", topic: "housing" },
  { german: "Wie komme ich zum Bahnhof?", english: "How do I get to the train station?", level: "A1", topic: "directions" },
  { german: "Gehen Sie geradeaus und dann links.", english: "Go straight ahead and then left.", level: "A1", topic: "directions" },
  { german: "Was hast du am Wochenende gemacht?", english: "What did you do on the weekend?", level: "A1", topic: "weekend" },
  { german: "Ich bin im Park spazieren gegangen.", english: "I went for a walk in the park.", level: "A1", topic: "weekend" },
  { german: "Dieses Hemd ist mir zu teuer.", english: "This shirt is too expensive for me.", level: "A1", topic: "shopping" },
  { german: "Haben Sie eine größere Größe?", english: "Do you have a bigger size?", level: "A1", topic: "shopping" },
  { german: "Wie ist das Wetter heute?", english: "What's the weather like today?", level: "A1", topic: "weather" },
  { german: "Mein Hobby ist Lesen.", english: "My hobby is reading.", level: "A1", topic: "hobbies" },

  // A2
  { german: "Wir treffen uns am Flughafen.", english: "We'll meet at the airport.", level: "A2", topic: "travel" },
  { german: "Ich kaufe eine Fahrkarte nach Berlin.", english: "I'm buying a ticket to Berlin.", level: "A2", topic: "travel" },
  { german: "Der Zug hat zehn Minuten Verspätung.", english: "The train is ten minutes late.", level: "A2", topic: "travel" },
  { german: "Kannst du mir helfen?", english: "Can you help me?", level: "A2", topic: "dative" },
  { german: "Die Stadt gefällt mir sehr.", english: "I like the city a lot.", level: "A2", topic: "dative" },
  { german: "Ich habe Kopfschmerzen.", english: "I have a headache.", level: "A2", topic: "health" },
  { german: "Ich muss zum Arzt gehen.", english: "I need to go to the doctor.", level: "A2", topic: "health" },
  { german: "Mein Rücken tut weh.", english: "My back hurts.", level: "A2", topic: "health" },
  { german: "Meine Nachbarin ist sehr freundlich.", english: "My neighbor is very friendly.", level: "A2", topic: "describing-people" },
  { german: "Das Meeting beginnt um neun Uhr.", english: "The meeting starts at nine o'clock.", level: "A2", topic: "work" },
  { german: "Mein Kollege hilft mir oft.", english: "My colleague often helps me.", level: "A2", topic: "work" },
  { german: "Die Frist ist nächsten Freitag.", english: "The deadline is next Friday.", level: "A2", topic: "work" },
  { german: "Mein Ziel ist es, fließend Deutsch zu sprechen.", english: "My goal is to speak German fluently.", level: "A2", topic: "future-plans" },
  { german: "Was hast du für nächstes Jahr vor?", english: "What are your plans for next year?", level: "A2", topic: "future-plans" },
  { german: "Letztes Jahr bin ich nach Italien gefahren.", english: "Last year I went to Italy.", level: "A2", topic: "past" },
  { german: "Ich habe den ganzen Tag gearbeitet.", english: "I worked the whole day.", level: "A2", topic: "past" },

  // B1
  { german: "Wegen des Regens bleiben wir zu Hause.", english: "Because of the rain, we're staying home.", level: "B1", topic: "genitive" },
  { german: "Der Mann, der dort steht, ist mein Chef.", english: "The man standing there is my boss.", level: "B1", topic: "relative-clauses" },
  { german: "Ich würde gerne mehr Zeit haben.", english: "I would like to have more time.", level: "B1", topic: "konjunktiv" },
  { german: "An deiner Stelle würde ich das nicht tun.", english: "In your place, I wouldn't do that.", level: "B1", topic: "konjunktiv" },
  { german: "Meiner Meinung nach ist das eine gute Idee.", english: "In my opinion, that's a good idea.", level: "B1", topic: "opinions" },
  { german: "Ich bin davon überzeugt, dass es klappt.", english: "I'm convinced that it will work.", level: "B1", topic: "opinions" },
  { german: "Das Projekt wird nächste Woche abgeschlossen.", english: "The project will be finished next week (passive).", level: "B1", topic: "passive" },
  { german: "Die Zeitung berichtet über die Wahl.", english: "The newspaper reports on the election.", level: "B1", topic: "news" },
  { german: "Obwohl es regnet, gehen wir spazieren.", english: "Although it's raining, we're going for a walk.", level: "B1", topic: "connectors" },
  { german: "Deshalb habe ich mich entschieden umzuziehen.", english: "That's why I decided to move.", level: "B1", topic: "connectors" },
  { german: "Es gibt große Unterschiede zwischen den Kulturen.", english: "There are big differences between the cultures.", level: "B1", topic: "culture" },
  { german: "Das ist eine alte deutsche Tradition.", english: "That's an old German tradition.", level: "B1", topic: "culture" },
];
