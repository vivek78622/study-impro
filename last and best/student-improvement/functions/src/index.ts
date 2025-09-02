import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { User, Task, Assignment, StudySession } from '../../models'

admin.initializeApp()
const db = admin.firestore()

// 1. Auto-create user profile on signup
export const createUserProfile = functions.auth.user().onCreate(async (user) => {
  const userRef = db.doc(`users/${user.uid}`)
  const userDoc = await userRef.get()
  
  if (!userDoc.exists) {
    const userData: User = {
      uid: user.uid,
      name: user.displayName || 'Student',
      email: user.email || '',
      photoUrl: user.photoURL || null,
      role: 'user',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp()
    }
    
    await userRef.set(userData)
    console.log(`Created user profile for ${user.uid}`)
  }
})

// 2. Update last seen on auth events
export const updateLastSeen = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId
    await db.doc(`users/${userId}`).update({
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp()
    })
  })

// 3. Protect config document
export const protectConfigDocument = functions.firestore
  .document('config/{docId}')
  .onWrite(async (change, context) => {
    const docId = context.params.docId
    
    // Only allow 'app-config' document
    if (docId !== 'app-config') {
      await change.after.ref.delete()
      throw new functions.https.HttpsError('permission-denied', 'Only app-config document allowed')
    }
    
    // Prevent deletion
    if (!change.after.exists && change.before.exists) {
      const defaultConfig = {
        appId: 'student-productivity-app',
        branding: {
          name: 'StudyFlow',
          primaryColor: '#22C1A3',
          secondaryColor: '#ADD8E6',
          logo: '/logo.png'
        },
        defaults: {
          pomodoroLength: 25,
          breakLength: 5,
          dailyGoal: 4,
          theme: 'light'
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
      await change.after.ref.set(defaultConfig)
    }
  })

// 4. Clean up user data on account deletion
export const cleanUpUserData = functions.auth.user().onDelete(async (user) => {
  const collections = ['tasks', 'assignments', 'habits', 'schedule', 'study_sessions', 'expenses']
  const batch = db.batch()
  
  for (const collection of collections) {
    const snapshot = await db.collection(collection)
      .where('userId', '==', user.uid)
      .get()
    
    snapshot.docs.forEach(doc => batch.delete(doc.ref))
  }
  
  // Delete user document
  batch.delete(db.doc(`users/${user.uid}`))
  
  await batch.commit()
  console.log(`Cleaned up data for user ${user.uid}`)
})

// 5. Validate data enums
export const validateTaskData = functions.firestore
  .document('tasks/{taskId}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) return
    
    const data = change.after.data() as Task
    const validStatuses = ['todo', 'in_progress', 'done']
    const validPriorities = ['low', 'medium', 'high']
    
    if (!validStatuses.includes(data.status) || !validPriorities.includes(data.priority)) {
      await change.after.ref.delete()
      throw new functions.https.HttpsError('invalid-argument', 'Invalid task status or priority')
    }
  })

export const validateAssignmentData = functions.firestore
  .document('assignments/{assignmentId}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) return
    
    const data = change.after.data() as Assignment
    const validStatuses = ['not_started', 'in_progress', 'done']
    
    if (!validStatuses.includes(data.status)) {
      await change.after.ref.delete()
      throw new functions.https.HttpsError('invalid-argument', 'Invalid assignment status')
    }
  })

export const validateStudySessionData = functions.firestore
  .document('study_sessions/{sessionId}')
  .onWrite(async (change, context) => {
    if (!change.after.exists) return
    
    const data = change.after.data() as StudySession
    const validModes = ['25min', '60min']
    const validStatuses = ['active', 'completed']
    
    if (!validModes.includes(data.mode) || !validStatuses.includes(data.status)) {
      await change.after.ref.delete()
      throw new functions.https.HttpsError('invalid-argument', 'Invalid study session mode or status')
    }
  })

// 6. Seed data on first run
export const seedOnFirstRun = functions.https.onCall(async (data, context) => {
  const configSnapshot = await db.collection('config').get()
  
  if (configSnapshot.empty) {
    // Create config
    await db.doc('config/app-config').set({
      appId: 'student-productivity-app',
      branding: {
        name: 'StudyFlow',
        primaryColor: '#22C1A3',
        secondaryColor: '#ADD8E6',
        logo: '/logo.png'
      },
      defaults: {
        pomodoroLength: 25,
        breakLength: 5,
        dailyGoal: 4,
        theme: 'light'
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    // Create demo user
    const demoUserId = 'demo-user-123'
    await db.doc(`users/${demoUserId}`).set({
      uid: demoUserId,
      name: 'Demo Student',
      email: 'demo@studyflow.com',
      photoUrl: null,
      role: 'user',
      demo: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSeenAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    // Seed sample data
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    await db.collection('tasks').add({
      userId: demoUserId,
      title: 'Complete Biology Assignment',
      description: 'Research and write about cellular respiration',
      priority: 'high',
      category: 'Biology',
      status: 'todo',
      progress: 0,
      dueDate: admin.firestore.Timestamp.fromDate(tomorrow),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      demo: true
    })
    
    await db.collection('assignments').add({
      userId: demoUserId,
      title: 'Physics Lab Report',
      subject: 'Physics',
      status: 'not_started',
      progress: 0,
      grade: '',
      notes: 'Pendulum experiment analysis',
      files: [],
      due: admin.firestore.Timestamp.fromDate(tomorrow),
      demo: true
    })
    
    console.log('Database seeded successfully')
    return { success: true, message: 'Database seeded' }
  }
  
  return { success: false, message: 'Database already seeded' }
})