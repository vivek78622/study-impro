# Firebase Cloud Functions

## Overview
Automated backend functions for the student productivity app that handle user lifecycle, data validation, and system maintenance.

## Functions

### 1. createUserProfile
- **Trigger**: Firebase Auth onCreate
- **Action**: Auto-creates user document with default fields
- **Security**: Only creates if document doesn't exist

### 2. updateLastSeen
- **Trigger**: Firestore user document onUpdate
- **Action**: Updates lastSeenAt timestamp

### 3. protectConfigDocument
- **Trigger**: Firestore config collection onWrite
- **Action**: Ensures only one config document exists, prevents deletion

### 4. cleanUpUserData
- **Trigger**: Firebase Auth onDelete
- **Action**: Removes all user-owned documents across collections

### 5. validateTaskData / validateAssignmentData / validateStudySessionData
- **Trigger**: Firestore onCreate/onUpdate
- **Action**: Validates enum fields, rejects invalid data

### 6. seedOnFirstRun
- **Trigger**: HTTP callable function
- **Action**: Seeds database with initial config and demo data

## Local Development

```bash
# Install dependencies
cd functions
npm install

# Start emulators
npm run dev

# Build functions
npm run build

# View logs
npm run logs
```

## Deployment

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:createUserProfile
```

## Environment Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init functions`
4. Set project: `firebase use your-project-id`

## Testing

Call the seed function to initialize data:
```javascript
const functions = firebase.functions()
const seedFunction = functions.httpsCallable('seedOnFirstRun')
seedFunction().then(result => console.log(result.data))
```

## Security Notes

- Functions run with admin privileges
- All validation mirrors Firestore Security Rules
- User data is isolated by userId
- Config document is protected from deletion