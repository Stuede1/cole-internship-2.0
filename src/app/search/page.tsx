'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import './search.css';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="search">
      <Sidebar />
      <TopNavbar />
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
            <p className="search__no-results">
              {searchQuery ? `No results found for "${searchQuery}"` : 'Enter a search term to find books'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
