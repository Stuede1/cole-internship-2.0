'use client';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaClock, FaStar } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
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
}

export default function MyLibraryPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<LibraryBook[]>([]);
  const [finishedBooks, setFinishedBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState<{ [key: string]: boolean }>({});
  
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
          savedBooks.map(async (book) => {
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
        
        // Fetch full book details for each finished book
        const finishedBooksWithDetails = await Promise.all(
          finishedBooks.map(async (book) => {
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

  // No loading check needed - everyone can access

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
                          15:32
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
                          15:32
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
