'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaClock, FaStar } from 'react-icons/fa';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import './search.css';
import '@/components/ForYou.css';

interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  audioLink?: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const loadAudioDurations = async (books: Book[]) => {
    const durations: { [key: string]: number | null } = { ...bookDurations };
    const booksToLoad: Book[] = [];
    
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
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchSearchResults = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`);
      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults(data);
      loadAudioDurations(data);
    } catch (err) {
      setError('Failed to fetch search results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search">
      <Sidebar />
      <TopNavbar showMenuButton={true} />
      <div className="search__content">
        <div className="search__main">
          <h1 className="search__title">Search Books</h1>
          
          <div className="search__input-container">
            <input
              type="text"
              placeholder="Search for books, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search__input"
            />
          </div>

          <div className="search__results">
            {loading ? (
              <p className="search__no-results">Searching...</p>
            ) : error ? (
              <p className="search__no-results">{error}</p>
            ) : searchQuery && searchResults.length === 0 ? (
              <p className="search__no-results">No results found for "{searchQuery}"</p>
            ) : !searchQuery ? (
              <p className="search__no-results">Enter a search term to find books</p>
            ) : (
              <div className="for-you__books-list">
                {searchResults.map((book) => (
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
                        <span className="book-card-horizontal__duration">{formatDuration(bookDurations[book.id])}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
