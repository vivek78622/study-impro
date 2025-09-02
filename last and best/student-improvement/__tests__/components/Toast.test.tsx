import { render, screen, act } from '@testing-library/react'
import Toast from '@/components/Toast'

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders success toast with message', () => {
    render(<Toast message="Success message" type="success" />)
    
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50')
  })

  it('renders error toast with message', () => {
    render(<Toast message="Error message" type="error" />)
    
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50')
  })

  it('auto-hides after duration', () => {
    const onClose = jest.fn()
    render(<Toast message="Test message" type="success" onClose={onClose} duration={3000} />)
    
    expect(screen.getByText('Test message')).toBeInTheDocument()
    
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    
    expect(onClose).toHaveBeenCalled()
  })

  it('does not auto-hide when duration is 0', () => {
    const onClose = jest.fn()
    render(<Toast message="Persistent message" type="info" onClose={onClose} duration={0} />)
    
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    expect(onClose).not.toHaveBeenCalled()
  })
})