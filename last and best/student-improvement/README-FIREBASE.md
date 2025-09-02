# Firebase Backend Setup

## Complete Firebase Backend for Student Productivity App

### Files Created

#### Core Firebase Files
- `firebase.ts` - Firebase initialization (Auth, Firestore, Storage)
- `firestore.rules` - Security rules with user-level isolation
- `firestore.indexes.json` - Composite indexes for optimized queries
- `storage.rules` - Storage security rules for file uploads
- `firebase.json` - Firebase project configuration
- `.env.example` - Environment variables template

#### Data Management
- `seed.ts` - Firestore initialization and auto-seeding
- `seed.json` - Complete sample data with demo user
- `scripts/seed.ts` - Node.js seeding script
- `models/index.ts` - TypeScript interfaces for all collections
- `lib/auth.ts` - Authentication helper functions

#### Cloud Functions (Optional)
- `functions/src/index.ts` - User lifecycle management
- `functions/package.json` - Dependencies
- `functions/tsconfig.json` - TypeScript config

## Setup Instructions

1. **Install dependencies:**
```bash
npm install
```

2. **Create Firebase project:**
   - Go to Firebase Console
   - Create new project
   - Enable Authentication (Email/Password + Google)
   - Enable Firestore Database
   - Enable Storage
   - Copy config to `.env.local`

3. **Deploy Firebase configuration:**
```bash
firebase login
firebase init
firebase deploy --only firestore:rules,firestore:indexes,storage
```

4. **Seed database:**
```bash
npm run seed
```

5. **Deploy Cloud Functions (optional):**
```bash
cd functions && npm install && firebase deploy --only functions
```

## Database Schema

### Collections
- **users** - User profiles with authentication data
- **tasks** - Student tasks with due dates and priorities
- **assignments** - Academic assignments with file attachments
- **habits** - Daily habits tracking with streaks
- **schedule** - Calendar events and class schedules
- **study_sessions** - Pomodoro timer sessions (25min/60min)
- **expenses** - Budget tracking and expense management
- **config** - App configuration (single document, auto-created)

### Security Features
- ✅ User-level data isolation (users can only access their own data)
- ✅ Field validation for enums (status, priority, mode)
- ✅ Public read-only access to config
- ✅ File upload security (profile pictures, assignment files)
- ✅ Auto-cleanup on user deletion

### Auto-Seeding
- ✅ Config document auto-created on first run
- ✅ Demo user with sample data
- ✅ All collections seeded with realistic data
- ✅ Demo flag for easy filtering

## Usage Examples

```typescript
import { signUp, signIn, signInWithGoogle } from './lib/auth'
import { db } from './firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import type { Task, Assignment } from './models'

// Authentication
const user = await signUp('student@example.com', 'password', 'John Doe')
const user = await signInWithGoogle()

// Query user's tasks ordered by due date
const tasksQuery = query(
  collection(db, 'tasks'),
  where('userId', '==', user.uid),
  orderBy('dueDate', 'asc')
)
const tasksSnapshot = await getDocs(tasksQuery)

// Query assignments
const assignmentsQuery = query(
  collection(db, 'assignments'),
  where('userId', '==', user.uid),
  orderBy('due', 'asc')
)
```

## File Structure
```
├── firebase.ts              # Firebase initialization
├── firestore.rules          # Database security rules
├── firestore.indexes.json   # Database indexes
├── storage.rules           # File storage security
├── firebase.json           # Firebase config
├── seed.ts                 # Auto-seeding logic
├── seed.json              # Sample data
├── models/
│   └── index.ts           # TypeScript interfaces
├── lib/
│   └── auth.ts            # Auth helpers
├── scripts/
│   └── seed.ts            # Seeding script
└── functions/             # Cloud Functions
    ├── src/index.ts
    ├── package.json
    └── tsconfig.json
```

## Ready to Use
The backend is fully configured and ready for your Next.js student productivity app!