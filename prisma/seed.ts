import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { ROADMAP } from "./seed-data/roadmap";
import { VOCABULARY } from "./seed-data/vocabulary";
import { SPEAKING_SENTENCES } from "./seed-data/speaking";

const prisma = new PrismaClient();

async function seedRoadmap() {
  console.log(`Seeding roadmap: ${ROADMAP.length} weeks...`);
  let order = 1;
  for (const week of ROADMAP) {
    const created = await prisma.roadmapWeek.upsert({
      where: { level_weekIndex: { level: week.level, weekIndex: week.weekIndex } },
      update: { title: week.title, focus: week.focus, order },
      create: {
        level: week.level,
        weekIndex: week.weekIndex,
        title: week.title,
        focus: week.focus,
        order,
      },
    });

    // Replace topics for this week (idempotent re-seed).
    await prisma.roadmapTopic.deleteMany({ where: { roadmapWeekId: created.id } });
    await prisma.roadmapTopic.createMany({
      data: week.topics.map((t, index) => ({
        roadmapWeekId: created.id,
        type: t.type,
        title: t.title,
        description: t.description,
        order: index,
      })),
    });

    order++;
  }
}

async function seedVocabulary() {
  console.log(`Seeding vocabulary: ${VOCABULARY.length} words...`);
  for (const word of VOCABULARY) {
    const existing = await prisma.vocabularyWord.findFirst({
      where: { german: word.german, topic: word.topic },
    });
    if (existing) {
      await prisma.vocabularyWord.update({ where: { id: existing.id }, data: word });
    } else {
      await prisma.vocabularyWord.create({ data: word });
    }
  }
}

async function seedSpeaking() {
  console.log(`Seeding speaking sentences: ${SPEAKING_SENTENCES.length} sentences...`);
  for (const sentence of SPEAKING_SENTENCES) {
    const existing = await prisma.speakingSentence.findFirst({
      where: { german: sentence.german },
    });
    if (existing) {
      await prisma.speakingSentence.update({ where: { id: existing.id }, data: sentence });
    } else {
      await prisma.speakingSentence.create({ data: sentence });
    }
  }
}

async function seedDemoUser() {
  const email = "demo@deutschcoach.app";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo user already exists, skipping.");
    return;
  }

  console.log("Creating demo user (demo@deutschcoach.app / demo1234)...");
  const passwordHash = await bcrypt.hash("demo1234", 12);
  await prisma.user.create({
    data: {
      name: "Demo Learner",
      email,
      passwordHash,
      currentLevel: "A1",
      targetLevel: "B1",
      onboardingCompleted: true,
      xpTotal: 0,
      settings: {
        create: {
          goal: "GENERAL_LEARNING",
          dailyGoalMinutes: 60,
          preferredStudyTime: "08:00",
        },
      },
      reminders: {
        create: [
          { label: "Duolingo", time: "08:00", taskType: "DUOLINGO" },
          { label: "German lesson", time: "13:00", taskType: "NICOS_WEG" },
          { label: "Anki review", time: "19:00", taskType: "ANKI" },
          { label: "Watch a German video", time: "20:00", taskType: "YOUTUBE" },
          { label: "Speaking practice", time: "21:00", taskType: "SPEAKING" },
        ],
      },
    },
  });
}

async function main() {
  await seedRoadmap();
  await seedVocabulary();
  await seedSpeaking();
  await seedDemoUser();
  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
