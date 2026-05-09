'use client';

import { useState, useEffect, useRef } from 'react';
import { AiOutlineSearch, AiOutlineMenu } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import UserProfile from '@/components/UserProfile';
import './TopNavbar.css';

interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
}

interface TopNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

function TopNavbar({ onMenuClick, showMenuButton = false }: TopNavbarProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleMenuClick = () => {
    window.dispatchEvent(new CustomEvent('open-sidebar'));
    if (onMenuClick) onMenuClick();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${query}`);
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to search:', err);
    }
  };

  const handleBookClick = (bookId: string) => {
    setShowResults(false);
    setSearchQuery('');
    router.push(`/book/${bookId}`);
  };

  return (
    <nav className="top-navbar">
      <div className="top-navbar__container">
        <button className="top-navbar__menu-button" onClick={handleMenuClick}>
          <AiOutlineMenu />
        </button>
        <div className="top-navbar__right" style={{ marginLeft: 'auto' }}>
          <div className="top-navbar__search" ref={searchRef}>
            <AiOutlineSearch className="top-navbar__search-icon" />
            <input 
              type="text" 
              placeholder="Search" 
              className="top-navbar__search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
            />
            {showResults && (
              <div className="top-navbar__search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((book) => (
                    <div 
                      key={book.id} 
                      className="top-navbar__search-result-item"
                      onClick={() => handleBookClick(book.id)}
                    >
                      <img src={book.imageLink} alt={book.title} className="top-navbar__search-result-image" />
                      <div className="top-navbar__search-result-content">
                        <h4 className="top-navbar__search-result-title">{book.title}</h4>
                        <p className="top-navbar__search-result-author">By {book.author}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="top-navbar__search-no-results">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <UserProfile />
      </div>
    </nav>
  );
}

export default TopNavbar;
