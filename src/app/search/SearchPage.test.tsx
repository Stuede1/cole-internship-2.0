/**
 * COMPONENT TESTS — SearchPage
 *
 * Category: User interaction + debounced API fetching
 * Strategy: Mock next/navigation, Sidebar, TopNavbar, and global fetch.
 *           Simulate user typing in the search input and verify debounced API
 *           calls, loading states, result rendering, empty states, and navigation.
 *
 * Covers:
 *  - Initial render: search input and prompt text
 *  - Typing triggers debounced fetch after 300ms
 *  - Loading state while fetching
 *  - Successful results render book cards
 *  - Empty results show "No results found" message
 *  - Clearing input resets results
 *  - Navigation to book detail on result click
 *  - Error state on network failure
 */
import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SearchPage from './page'

const mockPush = jest.fn()
const mockRouter = { push: mockPush }

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

jest.mock('@/components/Sidebar', () => () => <div data-testid="sidebar" />)
jest.mock('@/components/TopNavbar', () => () => <div data-testid="topnavbar" />)

const mockSearchResults = [
  {
    id: 'book1',
    title: 'Atomic Habits',
    subTitle: 'Tiny Changes, Remarkable Results',
    author: 'James Clear',
    imageLink: 'https://example.com/atomic.jpg',
    averageRating: 4.8,
    subscriptionRequired: false,
    audioLink: 'https://example.com/audio.mp3',
  },
  {
    id: 'book2',
    title: 'The Atomic Age',
    subTitle: 'A History',
    author: 'John Smith',
    imageLink: 'https://example.com/age.jpg',
    averageRating: 3.9,
    subscriptionRequired: true,
    audioLink: 'https://example.com/audio2.mp3',
  },
]

describe('SearchPage', () => {
  beforeEach(() => {
    mockPush.mockClear()
    jest.useFakeTimers()
    jest.spyOn(console, 'error').mockImplementation(() => {})
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => null,
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('renders search input and initial prompt', () => {
    global.fetch = jest.fn() as jest.Mock
    render(<SearchPage />)
    expect(screen.getByPlaceholderText('Search for books, authors, or topics...')).toBeInTheDocument()
    expect(screen.getByText('Enter a search term to find books')).toBeInTheDocument()
  })

  it('renders Search Books heading', () => {
    global.fetch = jest.fn() as jest.Mock
    render(<SearchPage />)
    expect(screen.getByText('Search Books')).toBeInTheDocument()
  })

  it('fetches results after debounce delay', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockSearchResults,
    }) as jest.Mock

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search for books, authors, or topics...')
    fireEvent.change(input, { target: { value: 'atomic' } })

    // Before debounce, no fetch yet
    expect(global.fetch).not.toHaveBeenCalled()

    // Advance past debounce (300ms)
    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('getBooksByAuthorOrTitle?search=atomic')
      )
    })
  })

  it('displays search results after successful fetch', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockSearchResults,
    }) as jest.Mock

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search for books, authors, or topics...')
    fireEvent.change(input, { target: { value: 'atomic' } })

    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
      expect(screen.getByText('The Atomic Age')).toBeInTheDocument()
    })
  })

  it('shows no results message for empty response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [],
    }) as jest.Mock

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search for books, authors, or topics...')
    fireEvent.change(input, { target: { value: 'nonexistent' } })

    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument()
    })
  })

  it('navigates to book detail on result click', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockSearchResults,
    }) as jest.Mock

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search for books, authors, or topics...')
    fireEvent.change(input, { target: { value: 'atomic' } })

    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Atomic Habits'))
    expect(mockPush).toHaveBeenCalledWith('/book/book1')
  })

  it('shows error message when fetch fails', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as jest.Mock

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search for books, authors, or topics...')
    fireEvent.change(input, { target: { value: 'test' } })

    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch search results')).toBeInTheDocument()
    })
    spy.mockRestore()
  })

  it('shows Premium badge for subscription books', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockSearchResults,
    }) as jest.Mock

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search for books, authors, or topics...')
    fireEvent.change(input, { target: { value: 'atomic' } })

    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(screen.getAllByText('Premium').length).toBeGreaterThan(0)
    })
  })

  it('resets results when input is cleared', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockSearchResults,
    }) as jest.Mock

    render(<SearchPage />)

    const input = screen.getByPlaceholderText('Search for books, authors, or topics...')
    fireEvent.change(input, { target: { value: 'atomic' } })
    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
    })

    // Clear input
    fireEvent.change(input, { target: { value: '' } })
    act(() => { jest.advanceTimersByTime(350) })

    await waitFor(() => {
      expect(screen.getByText('Enter a search term to find books')).toBeInTheDocument()
    })
  })
})
