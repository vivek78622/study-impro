import { collection, doc, setDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore'
import { db } from './firebase'
import seedData from './seed.json'

export async function initializeFirestore() {
  try {
    // Check if config exists
    const configSnapshot = await getDocs(collection(db, 'config'))
    
    if (configSnapshot.empty) {
      // Create config document
      await setDoc(doc(db, 'config', 'app-config'), {
        ...seedData.config,
        createdAt: serverTimestamp()
      })
      console.log('✅ Config collection initialized')
      
      // Seed demo data
      await seedDemoData()
    }
    
    console.log('🚀 Firestore initialization complete')
  } catch (error) {
    console.error('❌ Error initializing Firestore:', error)
  }
}

export async function seedDemoData() {
  const now = Timestamp.now()
  const tomorrow = new Timestamp(now.seconds + 86400, 0)
  const userId = seedData.demoUser.uid
  
  try {
    // Create demo user
    await setDoc(doc(db, 'users', userId), {
      ...seedData.demoUser,
      createdAt: now,
      lastSeenAt: now
    })
    
    // Seed tasks
    for (const task of seedData.sampleTasks) {
      await setDoc(doc(collection(db, 'tasks')), {
        ...task,
        userId,
        dueDate: tomorrow,
        createdAt: now
      })
    }
    
    // Seed assignments
    for (const assignment of seedData.sampleAssignments) {
      await setDoc(doc(collection(db, 'assignments')), {
        ...assignment,
        userId,
        due: tomorrow
      })
    }
    
    // Seed habits
    for (const habit of seedData.sampleHabits) {
      await setDoc(doc(collection(db, 'habits')), {
        ...habit,
        userId,
        createdAt: now,
        lastCompleted: now
      })
    }
    
    // Seed schedule
    for (const event of seedData.sampleSchedule) {
      await setDoc(doc(collection(db, 'schedule')), {
        ...event,
        userId,
        date: now
      })
    }
    
    // Seed expenses
    for (const expense of seedData.sampleExpenses) {
      await setDoc(doc(collection(db, 'expenses')), {
        ...expense,
        userId,
        date: now
      })
    }
    
    // Seed study sessions
    for (const session of seedData.sampleStudySessions) {
      await setDoc(doc(collection(db, 'study_sessions')), {
        ...session,
        userId,
        startTime: now,
        endTime: new Timestamp(now.seconds + 1500, 0)
      })
    }
    
    console.log('✅ Demo data seeded')
  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
  }
}

export async function seedUserData(userId: string) {
  const now = Timestamp.now()
  const tomorrow = new Timestamp(now.seconds + 86400, 0)
  
  try {
    // Seed tasks
    for (const task of seedData.sampleTasks) {
      await setDoc(doc(collection(db, 'tasks')), {
        ...task,
        userId,
        dueDate: tomorrow,
        createdAt: now,
        demo: false
      })
    }
    
    // Seed assignments
    for (const assignment of seedData.sampleAssignments) {
      await setDoc(doc(collection(db, 'assignments')), {
        ...assignment,
        userId,
        due: tomorrow,
        demo: false
      })
    }
    
    // Seed habits
    for (const habit of seedData.sampleHabits) {
      await setDoc(doc(collection(db, 'habits')), {
        ...habit,
        userId,
        createdAt: now,
        lastCompleted: now,
        demo: false
      })
    }
    
    console.log('✅ Sample data seeded for user:', userId)
  } catch (error) {
    console.error('❌ Error seeding user data:', error)
  }
}