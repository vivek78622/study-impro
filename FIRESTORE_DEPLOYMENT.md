# Firestore Security Rules & Indexes Deployment

## Files Created
- `firestore.rules` - Security rules with authentication and validation
- `firestore.indexes.json` - Composite indexes for efficient queries

## Deployment Commands

### Deploy Security Rules Only
```bash
firebase deploy --only firestore:rules
```

### Deploy Indexes Only
```bash
firebase deploy --only firestore:indexes
```

### Deploy Both Rules and Indexes
```bash
firebase deploy --only firestore
```

### Deploy Everything (Rules, Indexes, Functions, Hosting)
```bash
firebase deploy
```

## Security Features Implemented

### Authentication & Authorization
- Only authenticated users can access data
- Users can only read/write their own documents (userId == auth.uid)
- Config collection is read-only for all users

### Enum Validation
- `tasks.status`: ["todo", "in_progress", "done"]
- `tasks.priority`: ["low", "medium", "high"]  
- `assignments.status`: ["not_started", "in_progress", "done"]
- `study_sessions.mode`: ["25min", "60min"]
- `study_sessions.status`: ["active", "completed"]

### Required Fields Validation
- Tasks: userId, title, status, priority
- Assignments: userId, title, subject, status
- Habits: userId, name, frequency
- Schedule: userId, title, date
- Study Sessions: userId, mode, status
- Expenses: userId, date, category, amount

## Index Benefits
- Efficient queries for tasks ordered by dueDate
- Fast assignment queries ordered by due date
- Optimized schedule queries ordered by date
- Additional indexes for status-based filtering
- Habit streak leaderboard queries

## Testing Rules
Use Firebase Emulator Suite for local testing:
```bash
firebase emulators:start --only firestore
```