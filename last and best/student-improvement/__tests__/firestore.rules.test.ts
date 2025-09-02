import { initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { resolve } from 'path'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'test-project',
    firestore: {
      rules: readFileSync(resolve(__dirname, '../firestore.rules'), 'utf8'),
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

afterEach(async () => {
  await testEnv.clearFirestore()
})

describe('Firestore Security Rules', () => {
  describe('Users Collection', () => {
    test('users can read their own data', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const userDoc = alice.firestore().doc('users/alice')
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('users/alice').set({
          uid: 'alice',
          name: 'Alice',
          email: 'alice@example.com',
          role: 'user'
        })
      })
      
      await expect(userDoc.get()).resolves.toBeDefined()
    })

    test('users cannot read other users data', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const bobDoc = alice.firestore().doc('users/bob')
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('users/bob').set({
          uid: 'bob',
          name: 'Bob',
          email: 'bob@example.com',
          role: 'user'
        })
      })
      
      await expect(bobDoc.get()).rejects.toThrow()
    })

    test('users can update their own data', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const userDoc = alice.firestore().doc('users/alice')
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('users/alice').set({
          uid: 'alice',
          name: 'Alice',
          email: 'alice@example.com',
          role: 'user'
        })
      })
      
      await expect(userDoc.update({ name: 'Alice Updated' })).resolves.toBeDefined()
    })
  })

  describe('Tasks Collection', () => {
    test('users can create their own tasks', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const taskDoc = alice.firestore().collection('tasks').doc()
      
      await expect(taskDoc.set({
        userId: 'alice',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        category: 'study',
        progress: 0,
        dueDate: new Date(),
        createdAt: new Date()
      })).resolves.toBeDefined()
    })

    test('users cannot create tasks for other users', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const taskDoc = alice.firestore().collection('tasks').doc()
      
      await expect(taskDoc.set({
        userId: 'bob',
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
        category: 'study',
        progress: 0,
        dueDate: new Date(),
        createdAt: new Date()
      })).rejects.toThrow()
    })

    test('users can only read their own tasks', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const bob = testEnv.authenticatedContext('bob')
      
      // Create tasks for both users
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection('tasks').add({
          userId: 'alice',
          title: 'Alice Task',
          status: 'todo'
        })
        await context.firestore().collection('tasks').add({
          userId: 'bob',
          title: 'Bob Task',
          status: 'todo'
        })
      })
      
      // Alice should only see her tasks
      const aliceTasks = await alice.firestore()
        .collection('tasks')
        .where('userId', '==', 'alice')
        .get()
      
      expect(aliceTasks.docs).toHaveLength(1)
      expect(aliceTasks.docs[0].data().title).toBe('Alice Task')
      
      // Alice should not be able to query Bob's tasks
      await expect(
        alice.firestore()
          .collection('tasks')
          .where('userId', '==', 'bob')
          .get()
      ).rejects.toThrow()
    })

    test('rejects invalid task status', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const taskDoc = alice.firestore().collection('tasks').doc()
      
      await expect(taskDoc.set({
        userId: 'alice',
        title: 'Test Task',
        status: 'invalid_status', // Invalid status
        priority: 'medium',
        category: 'study',
        progress: 0,
        dueDate: new Date(),
        createdAt: new Date()
      })).rejects.toThrow()
    })
  })

  describe('Config Collection', () => {
    test('users can read config document', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const configDoc = alice.firestore().doc('config/app')
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('config/app').set({
          appId: 'test-app',
          branding: { name: 'Test App' },
          defaults: { theme: 'light' }
        })
      })
      
      await expect(configDoc.get()).resolves.toBeDefined()
    })

    test('users cannot write to config document', async () => {
      const alice = testEnv.authenticatedContext('alice')
      const configDoc = alice.firestore().doc('config/app')
      
      await expect(configDoc.set({
        appId: 'hacked-app',
        branding: { name: 'Hacked App' }
      })).rejects.toThrow()
    })
  })

  describe('Unauthenticated Access', () => {
    test('unauthenticated users cannot read any data', async () => {
      const unauth = testEnv.unauthenticatedContext()
      
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('users/alice').set({
          uid: 'alice',
          name: 'Alice'
        })
      })
      
      await expect(unauth.firestore().doc('users/alice').get()).rejects.toThrow()
    })

    test('unauthenticated users cannot write any data', async () => {
      const unauth = testEnv.unauthenticatedContext()
      
      await expect(unauth.firestore().doc('users/alice').set({
        uid: 'alice',
        name: 'Alice'
      })).rejects.toThrow()
    })
  })
})

// Run the tests
if (require.main === module) {
  console.log('Running Firestore Security Rules Tests...')
}