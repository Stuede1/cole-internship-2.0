'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaClock, FaStar, FaMicrophone, FaLightbulb } from 'react-icons/fa';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import AuthModal from './AuthModal';
import { useAuth } from './AuthContext';
import { useLibraryManager } from './LibraryManager';
import app from '@/firebase';
import { getPremiumStatus } from '@/utils/getPremiumStatus';
import './BookDetail.css';

interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  audioLink?: string;
  bookDuration?: string;
  keyIdeas?: string;
  type?: string;
  totalRating?: number;
  bookDescription?: string;
  authorDescription?: string;
  tags?: string[];
}

function BookDetail() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { saveBook, removeSavedBook, isBookSaved } = useLibraryManager();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  
  
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`);
        const data = await response.json();
        console.log('Book details:', data);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load book details');
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  useEffect(() => {
    if (book && currentUser) {
      setIsSaved(isBookSaved(book.id));
    }
  }, [book, currentUser, isBookSaved]);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (currentUser) {
        try {
          const premiumStatus = await getPremiumStatus(app);
          setIsPremium(premiumStatus);
        } catch (error) {
          console.error('Error checking premium status:', error);
          setIsPremium(false);
        } finally {
          setIsLoadingPremium(false);
        }
      } else {
        setIsLoadingPremium(false);
      }
    };
    
    checkPremiumStatus();
  }, [currentUser]);

  useEffect(() => {
    if (book?.audioLink) {
      const audio = new Audio(book.audioLink);
      audio.load();
      
      const timeout = setTimeout(() => {
        if (audioDuration === null) {
          setAudioDuration(null);
        }
      }, 10000);
      
      audio.addEventListener('loadedmetadata', () => {
        clearTimeout(timeout);
        setAudioDuration(audio.duration);
      });
      audio.addEventListener('error', () => {
        clearTimeout(timeout);
        console.error('Error loading audio metadata');
        setAudioDuration(null);
      });
      return () => {
        clearTimeout(timeout);
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('error', () => {});
      };
    }
  }, [book]);

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    if (!seconds) return 'Loading...';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReadOrListen = () => {
    if (!book) return;
    
    // If book is not premium, allow access without login
    if (!book.subscriptionRequired) {
      router.push(`/player/${params.id}`);
      return;
    }

    // If book is premium, require login
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    // Check if user has active Stripe subscription
    if (book.subscriptionRequired && !isPremium) {
      // Redirect to choose-plan page for basic users
      router.push('/choose-plan');
      return;
    }

    // If user is subscribed, allow access
    router.push(`/player/${params.id}`);
  };

  const handleAddToLibrary = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!book) return;

    if (isSaved) {
      // Remove book from library
      const success = removeSavedBook(book.id);
      if (success) {
        setIsSaved(false);
        console.log('Book removed from library:', book.title);
      }
    } else {
      // Save book to library
      const success = saveBook(book);
      if (success) {
        setIsSaved(true);
        console.log('Book saved to library:', book.title);
      }
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="book-detail">
        <Sidebar />
        <TopNavbar />
        <div className="book-detail__content">
          <div className="book-detail__loading">Loading book details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-detail">
        <Sidebar />
        <TopNavbar />
        <div className="book-detail__content">
          <div className="book-detail__error">{error}</div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail">
        <Sidebar />
        <TopNavbar />
        <div className="book-detail__content">
          <div className="book-detail__error">Book not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail">
      <Sidebar />
      <TopNavbar />
      <div className="book-detail__content">
        <div className="book-detail__container">
          <div className="book-detail__info-section">
            <h1 className="book-detail__title">{book.title}</h1>
            <p className="book-detail__author">By {book.author}</p>
            <p className="book-detail__subtitle">{book.subTitle}</p>
            
            <div className="book-detail__meta-grid">
              <div className="book-detail__meta-item">
                <span className="book-detail__meta-value">
                  <FaStar className="book-detail__icon" />
                  {book.averageRating} <span className="book-detail__total-rating">({book.totalRating || 0} Ratings)</span>
                </span>
              </div>
              <div className="book-detail__meta-item">
                <span className="book-detail__meta-label">Duration</span>
                <span className="book-detail__meta-value">{formatDuration(audioDuration)}</span>
              </div>
              <div className="book-detail__meta-item">
                <span className="book-detail__meta-value">
                  <FaMicrophone className="book-detail__icon" />
                  {book.type || 'Audio'}
                </span>
              </div>
              <div className="book-detail__meta-item">
                <span className="book-detail__meta-value">
                  <FaLightbulb className="book-detail__icon" />
                  {parseInt(book.keyIdeas || '0') || 0} Key Ideas
                </span>
              </div>
            </div>

            <div className="book-detail__actions">
              <button className="book-detail__read-button" onClick={handleReadOrListen}>Read</button>
              <button className="book-detail__listen-button" onClick={handleReadOrListen}>Listen</button>
              <button className="book-detail__library-button" onClick={handleAddToLibrary}>
                {isSaved ? 'Remove from Library' : 'Add title to My Library'}
              </button>
            </div>

            <div className="book-detail__description">
              <h3>What's it about?</h3>
              <div className="book-detail__tags">
                {book.tags && book.tags.map((tag, index) => (
                  <span key={index} className="book-detail__tag">{tag}</span>
                ))}
              </div>
              {book.subscriptionRequired && !currentUser ? (
                <div className="book-detail__guest-message">
                  <p>Please sign in to view the full description</p>
                </div>
              ) : book.subscriptionRequired && !isPremium ? (
                <div className="book-detail__guest-message">
                  <p>Upgrade to Premium to view the full description</p>
                  <button 
                    className="book-detail__upgrade-link"
                    onClick={() => router.push('/choose-plan')}
                  >
                    Choose a Plan
                  </button>
                </div>
              ) : (
                <p>{book.bookDescription || 'No description available.'}</p>
              )}
            </div>

            <div className="book-detail__author-section">
              <h3>About the author</h3>
              <p>{book.authorDescription || 'Author information not available.'}</p>
            </div>
          </div>
          <div className="book-detail__image-section">
            <img src={book.imageLink} alt={book.title} className="book-detail__image" />
            {book.subscriptionRequired && (
              <div className="book-detail__premium-badge">
                Premium
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} />
    </div>
  );
}

export default BookDetail;
