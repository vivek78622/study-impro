import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import { User, Task, Assignment, Habit, Schedule, StudySession, Expense, Config } from '../models';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

interface SeedData {
  users: User[];
  tasks: Task[];
  assignments: Assignment[];
  habits: Habit[];
  schedule: Schedule[];
  study_sessions: StudySession[];
  expenses: Expense[];
  config: Config[];
}

const requiredFields = {
  users: ['uid', 'name', 'email', 'role'],
  tasks: ['id', 'userId', 'title', 'priority', 'status'],
  assignments: ['id', 'userId', 'title', 'subject', 'status'],
  habits: ['id', 'userId', 'name', 'frequency'],
  schedule: ['id', 'userId', 'title', 'priority'],
  study_sessions: ['id', 'userId', 'mode', 'status'],
  expenses: ['id', 'userId', 'category', 'amount'],
  config: ['appId']
};

function validateDocument(doc: any, collection: string): boolean {
  const required = requiredFields[collection as keyof typeof requiredFields];
  return required.every(field => doc[field] !== undefined && doc[field] !== null);
}

function convertTimestamps(doc: any): any {
  const converted = { ...doc, demo: true };
  
  const timestampFields = ['createdAt', 'lastSeenAt', 'dueDate', 'due', 'date', 'startTime', 'endTime', 'lastCompleted'];
  
  timestampFields.forEach(field => {
    if (doc[field]) {
      converted[field] = admin.firestore.Timestamp.fromDate(new Date(doc[field]));
    }
  });

  if (!doc.createdAt) {
    converted.createdAt = admin.firestore.FieldValue.serverTimestamp();
  }

  return converted;
}

async function checkCollectionEmpty(collectionName: string): Promise<boolean> {
  const snapshot = await db.collection(collectionName).limit(1).get();
  return snapshot.empty;
}

async function checkConfigExists(): Promise<boolean> {
  const doc = await db.collection('config').doc('app-config').get();
  return doc.exists;
}

async function seedCollection(collectionName: string, documents: any[]): Promise<number> {
  let createdCount = 0;
  
  for (const doc of documents) {
    if (!validateDocument(doc, collectionName)) {
      console.log(`❌ Skipping invalid ${collectionName} document: missing required fields`);
      continue;
    }

    const docData = convertTimestamps(doc);
    
    try {
      if (collectionName === 'users') {
        await db.collection(collectionName).doc(doc.uid).set(docData);
        console.log(`✓ Created ${collectionName}/${doc.uid}`);
      } else if (collectionName === 'config') {
        await db.collection(collectionName).doc('app-config').set(docData);
        console.log(`✓ Created ${collectionName}/app-config`);
      } else {
        await db.collection(collectionName).doc(doc.id).set(docData);
        console.log(`✓ Created ${collectionName}/${doc.id}`);
      }
      createdCount++;
    } catch (error) {
      console.error(`❌ Failed to create ${collectionName}/${doc.id || doc.uid}:`, error);
    }
  }
  
  return createdCount;
}

async function main() {
  try {
    console.log('🌱 Starting Firestore seeding...\n');

    const seedPath = path.join(__dirname, '..', 'seed.json');
    const seedData: SeedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

    const collections = ['users', 'tasks', 'assignments', 'habits', 'schedule', 'study_sessions', 'expenses'];
    let totalCreated = 0;

    // Seed regular collections only if empty
    for (const collectionName of collections) {
      const isEmpty = await checkCollectionEmpty(collectionName);
      
      if (isEmpty) {
        console.log(`📝 Seeding ${collectionName} collection...`);
        const documents = seedData[collectionName as keyof SeedData];
        const created = await seedCollection(collectionName, documents);
        totalCreated += created;
        console.log(`✅ Created ${created} documents in ${collectionName}\n`);
      } else {
        console.log(`⏭️  Skipping ${collectionName} - collection not empty\n`);
      }
    }

    // Always check and seed config if missing
    const configExists = await checkConfigExists();
    if (!configExists) {
      console.log(`📝 Creating config document...`);
      const created = await seedCollection('config', seedData.config);
      totalCreated += created;
      console.log(`✅ Created config document\n`);
    } else {
      console.log(`⏭️  Config document already exists\n`);
    }

    console.log(`🎉 Seeding complete! Created ${totalCreated} total documents.`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();