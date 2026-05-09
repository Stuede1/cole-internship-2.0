'use client';

import { useState, useEffect } from 'react';
import { FaClock, FaStar, FaCrown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Skeleton, { BookCardHorizontalSkeleton, BookCardVerticalSkeleton } from './Skeleton';
import './ForYou.css';

interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
}

function ForYouContent() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingSuggested, setLoadingSuggested] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendedError, setRecommendedError] = useState<string | null>(null);
  const [suggestedError, setSuggestedError] = useState<string | null>(null);

  const getRandomTime = () => {
    const minutes = Math.floor(Math.random() * 3) + 3; // Random between 3-5
    const seconds = Math.floor(Math.random() * 60); // Random seconds 0-59
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected');
        const data = await response.json();
        console.log('Selected books:', data);
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load books');
        setLoading(false);
      }
    };

    const fetchRecommendedBooks = async () => {
      try {
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended');
        const data = await response.json();
        console.log('Recommended books:', data);
        setRecommendedBooks(data);
        setLoadingRecommended(false);
      } catch (err) {
        setRecommendedError('Failed to load recommended books');
        setLoadingRecommended(false);
      }
    };

    const fetchSuggestedBooks = async () => {
      try {
        const response = await fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested');
        const data = await response.json();
        console.log('Suggested books:', data);
        setSuggestedBooks(data);
        setLoadingSuggested(false);
      } catch (err) {
        setSuggestedError('Failed to load suggested books');
        setLoadingSuggested(false);
      }
    };

    fetchBooks();
    fetchRecommendedBooks();
    fetchSuggestedBooks();
  }, []);

  if (loading) {
    return (
      <div className="for-you__content">
        <div className="row">
          <h2 className="for-you__title">For You</h2>
          <p className="for-you__subtitle">We think you like these</p>
          <div className="for-you__books-list">
            {[...Array(5)].map((_, i) => (
              <BookCardHorizontalSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="for-you__content">
        <div className="for-you__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="for-you__content">
      <div className="row">
        <h2 className="for-you__title">For You</h2>
        <p className="for-you__subtitle">We think you like these</p>
        <div className="for-you__books-list">
          {books.map((book) => (
            <div key={book.id} className="book-card-horizontal" onClick={() => router.push(`/book/${book.id}`)}>
              <img src={book.imageLink} alt={book.title} className="book-card-horizontal__image" />
              {book.subscriptionRequired && (
                <div className="book-card-horizontal__premium-badge">
                  Premium
                </div>
              )}
              <div className="book-card-horizontal__content">
                <h3 className="book-card-horizontal__title">{book.title}</h3>
                <p className="book-card-horizontal__subtitle">{book.subTitle}</p>
                <p className="book-card-horizontal__author">By {book.author}</p>
                <div className="book-card-horizontal__audio-info">
                  <button className="book-card-horizontal__play-button">
                    <span className="book-card-horizontal__play-icon">▶</span>
                  </button>
                  <span className="book-card-horizontal__duration">15:32</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <h2 className="for-you__title">Recommended for you</h2>
        <p className="for-you__subtitle">We think you like these</p>
        <div className="for-you__recommended-list">
          {loadingRecommended ? (
            [...Array(5)].map((_, i) => (
              <BookCardVerticalSkeleton key={i} />
            ))
          ) : recommendedError ? (
            <div className="for-you__error">{recommendedError}</div>
          ) : (
            recommendedBooks.slice(0, 5).map((book) => (
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
                    {book.subTitle}
                  </p>
                  <div className="book-card-vertical__meta">
                    <div className="book-card-vertical__time-rating">
                      <span className="book-card-vertical__time">
                        <FaClock className="book-card-vertical__icon" />
                        {getRandomTime()}
                      </span>
                      <div className="book-card-vertical__rating">
                        <FaStar className="book-card-vertical__icon" />
                        <span className="book-card-vertical__average-rating">{book.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="row">
        <h2 className="for-you__title">Suggested for you</h2>
        <p className="for-you__subtitle">Browse these books</p>
        <div className="for-you__suggested-list">
          {loadingSuggested ? (
            [...Array(5)].map((_, i) => (
              <BookCardVerticalSkeleton key={i} />
            ))
          ) : suggestedError ? (
            <div className="for-you__error">{suggestedError}</div>
          ) : suggestedBooks.length === 0 ? (
            <div className="for-you__loading">No suggested books available</div>
          ) : (
            suggestedBooks.slice(0, 5).map((book) => (
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
                    {book.subTitle}
                  </p>
                  <div className="book-card-vertical__meta">
                    <div className="book-card-vertical__time-rating">
                      <span className="book-card-vertical__time">
                        <FaClock className="book-card-vertical__icon" />
                        {getRandomTime()}
                      </span>
                      <div className="book-card-vertical__rating">
                        <FaStar className="book-card-vertical__icon" />
                        <span className="book-card-vertical__average-rating">{book.averageRating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ForYouContent;
