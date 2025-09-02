// Firebase Auth Mocks
export const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
}

export const mockAuth = {
  currentUser: mockUser,
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}

// Firestore Mocks
export const mockDoc = jest.fn()
export const mockCollection = jest.fn()
export const mockQuery = jest.fn()
export const mockWhere = jest.fn()
export const mockOrderBy = jest.fn()
export const mockOnSnapshot = jest.fn()
export const mockAddDoc = jest.fn()
export const mockUpdateDoc = jest.fn()
export const mockDeleteDoc = jest.fn()
export const mockSetDoc = jest.fn()
export const mockServerTimestamp = jest.fn(() => new Date())

export const mockFirestore = {
  doc: mockDoc,
  collection: mockCollection,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  onSnapshot: mockOnSnapshot,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  setDoc: mockSetDoc,
  serverTimestamp: mockServerTimestamp,
}

// Mock Firebase modules
jest.mock('firebase/auth', () => ({
  getAuth: () => mockAuth,
  signInWithEmailAndPassword: mockAuth.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockAuth.createUserWithEmailAndPassword,
  signInWithPopup: mockAuth.signInWithPopup,
  signOut: mockAuth.signOut,
  onAuthStateChanged: mockAuth.onAuthStateChanged,
  GoogleAuthProvider: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: () => mockFirestore,
  doc: mockDoc,
  collection: mockCollection,
  query: mockQuery,
  where: mockWhere,
  orderBy: mockOrderBy,
  onSnapshot: mockOnSnapshot,
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  setDoc: mockSetDoc,
  serverTimestamp: mockServerTimestamp,
}))