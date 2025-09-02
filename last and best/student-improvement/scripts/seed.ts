#!/usr/bin/env node

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore'
import * as fs from 'fs'
import * as path from 'path'

// Load Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Load seed data
const seedDataPath = path.join(__dirname, '..', 'seed.json')
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'))

async function seedFirestore() {
  try {
    console.log('🌱 Starting Firestore seeding...')
    
    // Check if config exists
    const configSnapshot = await getDocs(collection(db, 'config'))
    
    if (!configSnapshot.empty) {
      console.log('⚠️  Database already seeded. Skipping...')
      return
    }
    
    // Create config document
    await setDoc(doc(db, 'config', 'app-config'), {
      ...seedData.config,
      createdAt: serverTimestamp()
    })
    console.log('✅ Config document created')
    
    // Seed demo data
    const now = Timestamp.now()
    const tomorrow = new Timestamp(now.seconds + 86400, 0)
    const userId = seedData.demoUser.uid
    
    // Create demo user
    await setDoc(doc(db, 'users', userId), {
      ...seedData.demoUser,
      createdAt: now,
      lastSeenAt: now
    })
    console.log('✅ Demo user created')
    
    // Seed collections
    const collections = [
      { name: 'tasks', data: seedData.sampleTasks, dateField: 'dueDate' },
      { name: 'assignments', data: seedData.sampleAssignments, dateField: 'due' },
      { name: 'habits', data: seedData.sampleHabits, dateField: null },
      { name: 'schedule', data: seedData.sampleSchedule, dateField: 'date' },
      { name: 'expenses', data: seedData.sampleExpenses, dateField: 'date' },
      { name: 'study_sessions', data: seedData.sampleStudySessions, dateField: null }
    ]
    
    for (const col of collections) {
      for (const item of col.data) {
        const docData = {
          ...item,
          userId,
          createdAt: now,
          ...(col.dateField && { [col.dateField]: col.dateField === 'date' ? now : tomorrow }),
          ...(col.name === 'study_sessions' && {
            startTime: now,
            endTime: new Timestamp(now.seconds + 1500, 0)
          }),
          ...(col.name === 'habits' && { lastCompleted: now })
        }
        
        await setDoc(doc(collection(db, col.name)), docData)
      }
      console.log(`✅ ${col.name} collection seeded`)
    }
    
    console.log('🎉 Firestore seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error)
    process.exit(1)
  }
}

// Run seeding
seedFirestore().then(() => {
  console.log('✨ Seeding process finished')
  process.exit(0)
})