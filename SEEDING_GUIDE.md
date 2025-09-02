# Firestore Seeding System

## Overview
Complete seeding system for populating Firestore with sample data using Firebase Admin SDK and TypeScript.

## Files Created
- `seed.json` - Sample data for all collections
- `scripts/seed.ts` - TypeScript seeding script
- `package.json` - Dependencies and scripts

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Authentication Setup

#### Option A: Service Account Key (Recommended for Development)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key and download `serviceAccountKey.json`
3. Place file in project root
4. Run: `npm run seed:dev`

#### Option B: Application Default Credentials (Production)
1. Install Google Cloud CLI
2. Run: `gcloud auth application-default login`
3. Run: `npm run seed`

## Running the Seeder

### Development (with service account key)
```bash
npm run seed:dev
```

### Production (with ADC)
```bash
npm run seed
```

## Features

### Safety Features
- ✅ Only seeds empty collections (preserves existing data)
- ✅ Uses Firebase Admin SDK (bypasses security rules)
- ✅ Adds `demo: true` flag to all seeded documents
- ✅ Proper timestamp conversion for date fields
- ✅ Comprehensive error handling and logging

### Collections Seeded
- **users** (2 demo users)
- **tasks** (3 sample tasks)
- **assignments** (3 sample assignments)
- **habits** (3 sample habits)
- **schedule** (3 scheduled events)
- **study_sessions** (3 study sessions)
- **expenses** (3 expense records)
- **config** (1 app configuration document)

### Sample Output
```
🌱 Starting Firestore seeding...

📝 Seeding users collection...
✓ Created users/demo-user-1
✓ Created users/demo-user-2
✅ Created 2 documents in users

📝 Seeding tasks collection...
✓ Created tasks/task-1
✓ Created tasks/task-2
✓ Created tasks/task-3
✅ Created 3 documents in tasks

🎉 Seeding completed! Created 17 total documents.
💡 All seeded documents have demo: true flag for easy filtering.
```

## Filtering Demo Data
Query demo documents in your app:
```typescript
// Get only demo data
const demoTasks = await db.collection('tasks')
  .where('demo', '==', true)
  .get();

// Get only production data
const realTasks = await db.collection('tasks')
  .where('demo', '!=', true)
  .get();
```

## Cleanup Demo Data
```typescript
// Delete all demo documents
const collections = ['users', 'tasks', 'assignments', 'habits', 'schedule', 'study_sessions', 'expenses'];

for (const collectionName of collections) {
  const snapshot = await db.collection(collectionName)
    .where('demo', '==', true)
    .get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
}
```