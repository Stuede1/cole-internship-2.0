/**
 * INTEGRATION TESTS — ForYou Component
 *
 * Category: Async data fetching + component rendering
 * Strategy: Mock global fetch at the module level to simulate API success,
 *           loading states, and network failures. Mock Firebase auth context,
 *           Sidebar, and TopNavbar to isolate ForYou logic. Verify the component
 *           transitions through loading → data/error states and renders book cards.
 *
 * Covers:
 *  - Loading skeleton rendered while awaiting API
 *  - Successful render of "selected" book cards with title, author, subtitle
 *  - Successful render of "recommended" books section
 *  - Error state when network request fails
 *  - Navigation to book detail on card click
 *  - Premium badge display for subscription-required books
 */
import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ForYouContent from './ForYou'

const mockPush = jest.fn()
const mockRouter = { push: mockPush }

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

jest.mock('./Sidebar', () => () => <div data-testid="sidebar" />)
jest.mock('./TopNavbar', () => () => <div data-testid="topnavbar" />)
jest.mock('./Skeleton', () => {
  const MockSkeleton = () => <div data-testid="skeleton" />
  const MockBookCardHorizontalSkeleton = () => <div data-testid="skeleton-horizontal" />
  const MockBookCardVerticalSkeleton = () => <div data-testid="skeleton-vertical" />
  MockSkeleton.displayName = 'Skeleton'
  return {
    __esModule: true,
    default: MockSkeleton,
    BookCardHorizontalSkeleton: MockBookCardHorizontalSkeleton,
    BookCardVerticalSkeleton: MockBookCardVerticalSkeleton,
  }
})

const selectedBooks = [
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
    title: 'Deep Work',
    subTitle: 'Rules for Focused Success',
    author: 'Cal Newport',
    imageLink: 'https://example.com/deep.jpg',
    averageRating: 4.5,
    subscriptionRequired: true,
    audioLink: 'https://example.com/audio2.mp3',
  },
]

const recommendedBooks = [
  {
    id: 'book3',
    title: 'The Power of Now',
    subTitle: 'A Guide to Spiritual Enlightenment',
    author: 'Eckhart Tolle',
    imageLink: 'https://example.com/power.jpg',
    averageRating: 4.6,
    subscriptionRequired: false,
    audioLink: 'https://example.com/audio3.mp3',
  },
]

const suggestedBooks = [
  {
    id: 'book4',
    title: 'Think and Grow Rich',
    subTitle: 'The Landmark Bestseller',
    author: 'Napoleon Hill',
    imageLink: 'https://example.com/think.jpg',
    averageRating: 4.3,
    subscriptionRequired: false,
    audioLink: 'https://example.com/audio4.mp3',
  },
]

function mockFetchByUrl(url: string) {
  if (url.includes('status=selected')) return Promise.resolve({ json: async () => selectedBooks })
  if (url.includes('status=recommended')) return Promise.resolve({ json: async () => recommendedBooks })
  if (url.includes('status=suggested')) return Promise.resolve({ json: async () => suggestedBooks })
  return Promise.resolve({ json: async () => [] })
}

describe('ForYou Component', () => {
  beforeEach(() => {
    mockPush.mockClear()
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
    jest.restoreAllMocks()
  })

  it('shows loading skeletons initially', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock
    render(<ForYouContent />)
    expect(screen.getAllByTestId('skeleton-horizontal').length).toBeGreaterThan(0)
  })

  it('renders book cards after successful fetch', async () => {
    global.fetch = jest.fn((url: string) => mockFetchByUrl(url)) as jest.Mock

    render(<ForYouContent />)

    await waitFor(() => {
      expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
      expect(screen.getByText('Deep Work')).toBeInTheDocument()
    })
  })

  it('displays author names', async () => {
    global.fetch = jest.fn((url: string) => mockFetchByUrl(url)) as jest.Mock

    render(<ForYouContent />)

    await waitFor(() => {
      expect(screen.getByText('By James Clear')).toBeInTheDocument()
      expect(screen.getByText('By Cal Newport')).toBeInTheDocument()
    })
  })

  it('displays book subtitles', async () => {
    global.fetch = jest.fn((url: string) => mockFetchByUrl(url)) as jest.Mock

    render(<ForYouContent />)

    await waitFor(() => {
      expect(screen.getByText('Tiny Changes, Remarkable Results')).toBeInTheDocument()
    })
  })

  it('shows Premium badge for subscription-required books', async () => {
    global.fetch = jest.fn((url: string) => mockFetchByUrl(url)) as jest.Mock

    render(<ForYouContent />)

    await waitFor(() => {
      expect(screen.getAllByText('Premium').length).toBeGreaterThan(0)
    })
  })

  it('navigates to book detail page on card click', async () => {
    global.fetch = jest.fn((url: string) => mockFetchByUrl(url)) as jest.Mock

    render(<ForYouContent />)

    await waitFor(() => {
      expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Atomic Habits'))
    expect(mockPush).toHaveBeenCalledWith('/book/book1')
  })

  it('shows error message when fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as jest.Mock

    render(<ForYouContent />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load books')).toBeInTheDocument()
    })
  })

  it('renders section headings', async () => {
    global.fetch = jest.fn((url: string) => mockFetchByUrl(url)) as jest.Mock

    render(<ForYouContent />)

    await waitFor(() => {
      expect(screen.getByText('For You')).toBeInTheDocument()
      expect(screen.getByText('Recommended for you')).toBeInTheDocument()
      expect(screen.getByText('Suggested for you')).toBeInTheDocument()
    })
  })
})
