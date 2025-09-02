import { createTask, updateTask, deleteTask, subscribeToTasks } from '@/services/tasks'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore'
import { Task } from '@/models'

// Mock Firebase functions
jest.mock('firebase/firestore')
jest.mock('../../firebase', () => ({
  db: {},
}))

const mockCollection = collection as jest.MockedFunction<typeof collection>
const mockQuery = query as jest.MockedFunction<typeof query>
const mockWhere = where as jest.MockedFunction<typeof where>
const mockOrderBy = orderBy as jest.MockedFunction<typeof orderBy>
const mockOnSnapshot = onSnapshot as jest.MockedFunction<typeof onSnapshot>
const mockAddDoc = addDoc as jest.MockedFunction<typeof addDoc>
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>
const mockDeleteDoc = deleteDoc as jest.MockedFunction<typeof deleteDoc>
const mockDoc = doc as jest.MockedFunction<typeof doc>
const mockServerTimestamp = serverTimestamp as jest.MockedFunction<typeof serverTimestamp>

describe('Tasks Service', () => {
  const mockTask: Omit<Task, 'id' | 'userId' | 'createdAt'> = {
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 'medium',
    category: 'study',
    status: 'todo',
    progress: 0
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockServerTimestamp.mockReturnValue('mock-timestamp' as any)
    mockDoc.mockReturnValue('mock-doc-ref' as any)
    mockCollection.mockReturnValue('mock-collection' as any)
    mockQuery.mockReturnValue('mock-query' as any)
    mockWhere.mockReturnValue('mock-where' as any)
    mockOrderBy.mockReturnValue('mock-orderby' as any)
  })

  describe('createTask', () => {
    it('creates a new task with user ID and timestamp', async () => {
      const mockDocRef = { id: 'new-task-id' }
      mockAddDoc.mockResolvedValue(mockDocRef as any)

      const result = await createTask('user-123', mockTask)

      expect(mockAddDoc).toHaveBeenCalledWith('mock-collection', {
        ...mockTask,
        userId: 'user-123',
        createdAt: 'mock-timestamp'
      })
      expect(result).toBe(mockDocRef)
    })
  })

  describe('updateTask', () => {
    it('updates task with provided data', async () => {
      mockUpdateDoc.mockResolvedValue(undefined)

      const updates = { status: 'done' as const, progress: 100 }
      await updateTask('task-123', updates)

      expect(mockUpdateDoc).toHaveBeenCalledWith('mock-doc-ref', updates)
    })
  })

  describe('deleteTask', () => {
    it('deletes the specified task', async () => {
      mockDeleteDoc.mockResolvedValue(undefined)

      await deleteTask('task-123')

      expect(mockDeleteDoc).toHaveBeenCalledWith('mock-doc-ref')
    })
  })

  describe('subscribeToTasks', () => {
    it('sets up real-time subscription for user tasks', () => {
      const mockCallback = jest.fn()
      const mockUnsubscribe = jest.fn()
      mockOnSnapshot.mockReturnValue(mockUnsubscribe)

      const unsubscribe = subscribeToTasks('user-123', mockCallback)

      expect(mockQuery).toHaveBeenCalledWith(
        'mock-collection',
        'mock-where',
        'mock-orderby'
      )
      expect(mockWhere).toHaveBeenCalledWith('userId', '==', 'user-123')
      expect(mockOrderBy).toHaveBeenCalledWith('dueDate', 'asc')
      expect(mockOnSnapshot).toHaveBeenCalledWith('mock-query', expect.any(Function))
      expect(unsubscribe).toBe(mockUnsubscribe)
    })

    it('processes snapshot data correctly', () => {
      const mockCallback = jest.fn()
      const mockSnapshot = {
        docs: [
          { id: 'task-1', data: () => ({ title: 'Task 1' }) },
          { id: 'task-2', data: () => ({ title: 'Task 2' }) }
        ]
      }

      mockOnSnapshot.mockImplementation((query, callback) => {
        callback(mockSnapshot)
        return jest.fn()
      })

      subscribeToTasks('user-123', mockCallback)

      expect(mockCallback).toHaveBeenCalledWith([
        { id: 'task-1', title: 'Task 1' },
        { id: 'task-2', title: 'Task 2' }
      ])
    })
  })
})