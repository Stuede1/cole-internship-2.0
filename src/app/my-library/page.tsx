'use client';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaClock, FaStar } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import { BookCardVerticalSkeleton } from '@/components/Skeleton';
import './library.css';
import '@/components/ForYou.css';

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  subtitle: string;
  averageRating: number;
  subscriptionRequired?: boolean;
  type: 'saved' | 'finished';
  dateAdded?: string;
  progress?: number;
  audioLink?: string;
}

export default function MyLibraryPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<LibraryBook[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState<{ [key: string]: boolean }>({});
  const [bookDurations, setBookDurations] = useState<{ [key: string]: number | null }>({});
  
  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    if (!seconds) return 'Loading...';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Load cached durations from localStorage
  useEffect(() => {
    const cached = localStorage.getItem('bookDurations');
    if (cached) {
      setBookDurations(JSON.parse(cached));
    }
  }, []);

  const loadAudioDurations = async (books: LibraryBook[]) => {
    const durations: { [key: string]: number | null } = { ...bookDurations };
    const booksToLoad: LibraryBook[] = [];
    
    for (const book of books) {
      if (durations[book.id] === undefined && book.audioLink) {
        booksToLoad.push(book);
      }
    }
    
    for (const book of booksToLoad) {
      try {
        const audio = new Audio(book.audioLink);
        audio.load();
        
        const timeout = setTimeout(() => {
          if (durations[book.id] === undefined) {
            durations[book.id] = null;
            setBookDurations({ ...durations });
            localStorage.setItem('bookDurations', JSON.stringify(durations));
          }
        }, 10000);
        
        await new Promise<void>((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            clearTimeout(timeout);
            durations[book.id] = audio.duration;
            setBookDurations({ ...durations });
            localStorage.setItem('bookDurations', JSON.stringify(durations));
            resolve();
          });
          audio.addEventListener('error', () => {
            clearTimeout(timeout);
            durations[book.id] = null;
            setBookDurations({ ...durations });
            localStorage.setItem('bookDurations', JSON.stringify(durations));
            resolve();
          });
        });
      } catch (error) {
        durations[book.id] = null;
        setBookDurations({ ...durations });
        localStorage.setItem('bookDurations', JSON.stringify(durations));
      }
    }
  };
  
  useEffect(() => {
    // Load user's actual library data from localStorage
    const loadLibraryData = async () => {
      try {
        // Get saved books from localStorage for logged-in users
        const savedBooksData = localStorage.getItem(`savedBooks_${currentUser?.uid}`);
        const finishedBooksData = localStorage.getItem(`finishedBooks_${currentUser?.uid}`);
        
        const savedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];
        const finishedBooks = finishedBooksData ? JSON.parse(finishedBooksData) : [];
        
        // Fetch full book details for each saved book
        const savedBooksWithDetails = await Promise.all(
          savedBooks.map(async (book: any) => {
            try {
              const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${book.id}`);
              const bookDetails = await response.json();
              return { ...book, ...bookDetails };
            } catch (error) {
              console.error('Error fetching book details:', error);
              return book;
            }
          })
        );
        
        // Load audio durations for saved books
        loadAudioDurations(savedBooksWithDetails);
        
        // Fetch full book details for each finished book
        const finishedBooksWithDetails = await Promise.all(
          finishedBooks.map(async (book: any) => {
            try {
              const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${book.id}`);
              const bookDetails = await response.json();
              return { ...book, ...bookDetails };
            } catch (error) {
              console.error('Error fetching book details:', error);
              return book;
            }
          })
        );
        
        // Load audio durations for finished books
        loadAudioDurations(finishedBooksWithDetails);
        
        setSavedBooks(savedBooksWithDetails);
        setFinishedBooks(finishedBooksWithDetails);
      } catch (error) {
        console.error('Error loading library data:', error);
        setSavedBooks([]);
        setFinishedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadLibraryData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="library">
        <Sidebar />
        <TopNavbar />
        <div className="library__content">
          <div className="library__header">
            <h1 className="library__title">My Library</h1>
            <p className="library__subtitle">Your saved and finished books</p>
          </div>

          {/* Saved Books Section */}
          <div className="library__section">
            <h2 className="library__section-title">Saved Books</h2>
            <div className="for-you__recommended-list">
              {[...Array(5)].map((_, i) => (
                <BookCardVerticalSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Finished Books Section */}
          <div className="library__section">
            <h2 className="library__section-title">Finished Books</h2>
            <div className="for-you__recommended-list">
              {[...Array(5)].map((_, i) => (
                <BookCardVerticalSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library">
      <Sidebar />
      <TopNavbar />
      <div className="library__content">
        <div className="library__header">
          <h1 className="library__title">My Library</h1>
          <p className="library__subtitle">Your saved and finished books</p>
        </div>

        {/* Saved Books Section */}
        <div className="library__section">
          <h2 className="library__section-title">Saved Books</h2>
          {savedBooks.length === 0 ? (
            <div className="library__empty">
              <div className="library__empty-icon">📚</div>
              <h3>No saved books yet</h3>
              <p>Books you save will appear here</p>
            </div>
          ) : (
            <div className="for-you__recommended-list">
              {savedBooks.map((book) => (
                <div key={book.id} className="book-card-vertical" onClick={() => router.push(`/book/${book.id}`)}>
                  <img src={book.imageLink} alt={book.title} className="book-card-vertical__image" />
                  {book.subscriptionRequired && (
                    <div className="book-card-vertical__premium-badge">
                      Premium
                    </div>
                  )}
                  <div className="book-card-vertical__content">
                    <h3 className="book-card-vertical__title">{book.title}</h3>
                    <p className="book-card-vertical__author">By {book.author}</p>
                    <p className="book-card-vertical__description">
                      {book.subtitle}
                    </p>
                    <div className="book-card-vertical__meta">
                      <div className="book-card-vertical__time-rating">
                        <span className="book-card-vertical__time">
                          <FaClock className="book-card-vertical__icon" />
                          {formatDuration(bookDurations[book.id])}
                        </span>
                        <div className="book-card-vertical__rating">
                          <FaStar className="book-card-vertical__icon" />
                          <span className="book-card-vertical__average-rating">{book.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Finished Books Section */}
        <div className="library__section">
          <h2 className="library__section-title">Finished Books</h2>
          {finishedBooks.length === 0 ? (
            <div className="library__empty">
              <div className="library__empty-icon">✅</div>
              <h3>No finished books yet</h3>
              <p>Books you finish will appear here</p>
            </div>
          ) : (
            <div className="for-you__recommended-list">
              {finishedBooks.map((book) => (
                <div key={book.id} className="book-card-vertical" onClick={() => router.push(`/book/${book.id}`)}>
                  <img src={book.imageLink} alt={book.title} className="book-card-vertical__image" />
                  {book.subscriptionRequired && (
                    <div className="book-card-vertical__premium-badge">
                      Premium
                    </div>
                  )}
                  <div className="book-card-vertical__content">
                    <h3 className="book-card-vertical__title">{book.title}</h3>
                    <p className="book-card-vertical__author">By {book.author}</p>
                    <p className="book-card-vertical__description">
                      {book.subtitle}
                    </p>
                    <div className="book-card-vertical__meta">
                      <div className="book-card-vertical__time-rating">
                        <span className="book-card-vertical__time">
                          <FaClock className="book-card-vertical__icon" />
                          {formatDuration(bookDurations[book.id])}
                        </span>
                        <div className="book-card-vertical__rating">
                          <FaStar className="book-card-vertical__icon" />
                          <span className="book-card-vertical__average-rating">{book.averageRating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="book-card-vertical__badge">
                    Finished
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
