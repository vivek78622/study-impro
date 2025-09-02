# Firestore Seeding System Documentation

## Overview
Complete TypeScript-based seeding system for populating Firestore with validated sample data using Firebase Admin SDK.

## Project Structure
```
├── models/
│   └── index.ts          # TypeScript interfaces for all collections
├── scripts/
│   └── seed.ts           # Main seeding script
├── seed.json             # Sample data for all collections
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── serviceAccountKey.json # Firebase service account (not included)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Authentication Setup

#### Option A: Service Account Key (Recommended)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `serviceAccountKey.json` in project root
4. Run: `npm run seed:dev`

#### Option B: Application Default Credentials
1. Install Google Cloud CLI
2. Run: `gcloud auth application-default login`
3. Run: `npm run seed`

### 3. Run Seeding
```bash
# With service account key
npm run seed:dev

# With application default credentials  
npm run seed
```

## Features

### Type Safety
- Shared TypeScript interfaces in `/models`
- Compile-time validation of data structures
- Type-safe seeding operations

### Data Validation
- Required field validation before writing
- Enum value validation for status/priority fields
- Automatic timestamp conversion
- Error handling with detailed logging

### Safety Features
- Only seeds empty collections (preserves production data)
- Config document created automatically if missing
- `demo: true` flag on all seeded documents
- Proper error handling and rollback

### Collections Seeded
- **users**: 2 demo users with profiles
- **tasks**: 3 sample tasks with different priorities
- **assignments**: 2 sample assignments
- **habits**: 2 sample habits with tracking
- **schedule**: 2 scheduled events
- **study_sessions**: 2 study sessions
- **expenses**: 2 expense records
- **config**: 1 app configuration (always created if missing)

## Sample Output
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

📝 Creating config document...
✓ Created config/app-config
✅ Created config document

🎉 Seeding complete! Created 15 total documents.
```

## Using TypeScript Interfaces

### In Your Next.js App
```typescript
import { Task, User, Assignment } from './models';

// Type-safe Firestore operations
const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  const docRef = await db.collection('tasks').add({
    ...task,
    createdAt: serverTimestamp(),
    demo: false
  });
};
```

### Filtering Demo Data
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
const collections = ['users', 'tasks', 'assignments', 'habits', 'schedule', 'study_sessions', 'expenses'];

for (const collectionName of collections) {
  const snapshot = await db.collection(collectionName)
    .where('demo', '==', true)
    .get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`Deleted ${snapshot.size} demo documents from ${collectionName}`);
}
```

## Troubleshooting

### Permission Errors
- Ensure service account has Firestore Admin role
- Check `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- Verify Firebase project ID in service account key

### Validation Errors
- Check required fields in `models/index.ts`
- Ensure enum values match interface definitions
- Verify date format in `seed.json` (ISO 8601)

### TypeScript Errors
- Run `npm run type-check` to validate types
- Ensure all imports use correct paths
- Check `tsconfig.json` configuration

## Development Commands
```bash
npm run seed          # Run seeding with ADC
npm run seed:dev      # Run seeding with service account key
npm run build         # Compile TypeScript
npm run type-check    # Validate types without compilation
```