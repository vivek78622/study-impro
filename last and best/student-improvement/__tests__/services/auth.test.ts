import { signUp, signIn, signInWithGoogle, logout } from '@/services/auth'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'

// Mock Firebase functions
jest.mock('firebase/auth')
jest.mock('firebase/firestore')
jest.mock('../../firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}))

const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>
const mockSignIn = signInWithEmailAndPassword as jest.MockedFunction<typeof signInWithEmailAndPassword>
const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<typeof signInWithPopup>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>
const mockDoc = doc as jest.MockedFunction<typeof doc>
const mockServerTimestamp = serverTimestamp as jest.MockedFunction<typeof serverTimestamp>

describe('Auth Service', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockServerTimestamp.mockReturnValue('mock-timestamp' as any)
    mockDoc.mockReturnValue('mock-doc-ref' as any)
  })

  describe('signUp', () => {
    it('creates user and saves to Firestore', async () => {
      mockCreateUser.mockResolvedValue({ user: mockUser } as any)
      mockSetDoc.mockResolvedValue(undefined)

      const result = await signUp('test@example.com', 'password123', 'Test User')

      expect(mockCreateUser).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123')
      expect(mockSetDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        {
          uid: 'test-uid',
          name: 'Test User',
          email: 'test@example.com',
          photoUrl: null,
          role: 'user',
          createdAt: 'mock-timestamp',
          lastSeenAt: 'mock-timestamp'
        }
      )
      expect(result).toBe(mockUser)
    })
  })

  describe('signIn', () => {
    it('signs in user and updates lastSeenAt', async () => {
      mockSignIn.mockResolvedValue({ user: mockUser } as any)
      mockSetDoc.mockResolvedValue(undefined)

      const result = await signIn('test@example.com', 'password123')

      expect(mockSignIn).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123')
      expect(mockSetDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        { lastSeenAt: 'mock-timestamp' },
        { merge: true }
      )
      expect(result).toBe(mockUser)
    })
  })

  describe('signInWithGoogle', () => {
    it('signs in with Google and saves user data', async () => {
      mockSignInWithPopup.mockResolvedValue({ user: mockUser } as any)
      mockSetDoc.mockResolvedValue(undefined)

      const result = await signInWithGoogle()

      expect(mockSignInWithPopup).toHaveBeenCalledWith(expect.anything(), expect.anything())
      expect(mockSetDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        {
          uid: 'test-uid',
          name: 'Test User',
          email: 'test@example.com',
          photoUrl: 'https://example.com/photo.jpg',
          role: 'user',
          createdAt: 'mock-timestamp',
          lastSeenAt: 'mock-timestamp'
        },
        { merge: true }
      )
      expect(result).toBe(mockUser)
    })
  })

  describe('logout', () => {
    it('signs out user', async () => {
      mockSignOut.mockResolvedValue(undefined)

      await logout()

      expect(mockSignOut).toHaveBeenCalledWith(expect.anything())
    })
  })
})