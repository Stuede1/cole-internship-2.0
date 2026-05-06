'use client';

import { AiOutlineSearch } from 'react-icons/ai';
import UserProfile from '@/components/UserProfile';
import './TopNavbar.css';

function TopNavbar() {
  return (
    <nav className="top-navbar">
      <div className="top-navbar__container">
        <div className="top-navbar__right">
          <div className="top-navbar__search">
            <AiOutlineSearch className="top-navbar__search-icon" />
            <input type="text" placeholder="Search" className="top-navbar__search-input" />
          </div>
        </div>
        <UserProfile />
      </div>
    </nav>
  );
}

export default TopNavbar;
