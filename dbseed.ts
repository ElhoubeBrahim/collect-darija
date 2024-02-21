const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");

// Import data
const users = require("./seeders/users.data");
const sentences = require("./seeders/sentences.data");

// initialization
const projectId = "collect-darija";
process.env["FIRESTORE_EMULATOR_HOST"] = "localhost:8080";
process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "localhost:9099";

admin.initializeApp({
  projectId,
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();
const auth = admin.auth();

async function seedUsers() {
  for (let user of users) {
    // Authenticate user
    await auth.createUser({
      uid: user.id,
      displayName: user.username,
      email: user.email,
      emailVerified: true,
      password: "password",
    });

    // Create user
    await db
      .collection("users")
      .doc(user.id)
      .set(
        {
          ...user,
          scoreUpdatedAt: admin.firestore.Timestamp.fromDate(
            user.scoreUpdatedAt,
          ),
          createdAt: admin.firestore.Timestamp.fromDate(user.createdAt),
          lastLoginAt: admin.firestore.Timestamp.fromDate(user.lastLoginAt),
        },
        { merge: true },
      );
  }
}

async function seedSentences() {
  for (let sentence of sentences) {
    await db
      .collection("sentences")
      .doc(sentence.id)
      .set(sentence, { merge: true });
  }
}

async function seedTranslations() {
  for (let sentence of sentences) {
    const translationsCount = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10

    for (let i = 0; i < translationsCount; i++) {
      // Create a translation
      const translation = {
        id: faker.string.alphanumeric(20),
        userId: faker.helpers.arrayElement(users).id,
        sentence: {
          id: sentence.id,
          content: sentence.content,
        },
        translation: faker.lorem.sentence({ min: 5, max: 20 }),
        translatedAt: admin.firestore.Timestamp.fromDate(new Date()),
      };

      // Save the translation
      await db
        .collection("translations")
        .doc(translation.id)
        .set(translation, { merge: true });

      // Update the sentence translations count
      await db
        .collection("sentences")
        .doc(sentence.id)
        .update({ translationsCount: admin.firestore.FieldValue.increment(1) });

      // Update user translations count & score
      await db
        .collection("users")
        .doc(translation.userId)
        .update({
          "stats.translations": admin.firestore.FieldValue.increment(1),
          score: admin.firestore.FieldValue.increment(10),
          scoreUpdatedAt: admin.firestore.Timestamp.fromDate(new Date()),
        });
    }
  }
}

async function main() {
  // seed users
  console.log("🌱 Seeding users ...");
  await seedUsers();

  // seed sentences
  console.log("🌱 Seeding sentences ...");
  await seedSentences();

  // seed translations
  console.log("🌱 Seeding translations ...");
  await seedTranslations();
}

main();
