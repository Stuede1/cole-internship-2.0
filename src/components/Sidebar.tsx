'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsBook, BsBookmark, BsGear, BsQuestionCircle, BsBoxArrowRight, BsHouse } from 'react-icons/bs';
import { useAuth } from './AuthContext';
import LoginPopup from './LoginPopup';
import './Sidebar.css';

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, currentUser } = useAuth();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleOpenSidebar = () => setIsMobileOpen(true);
    const handleCloseSidebar = () => setIsMobileOpen(false);

    window.addEventListener('open-sidebar', handleOpenSidebar as EventListener);
    window.addEventListener('close-sidebar', handleCloseSidebar as EventListener);

    return () => {
      window.removeEventListener('open-sidebar', handleOpenSidebar as EventListener);
      window.removeEventListener('close-sidebar', handleCloseSidebar as EventListener);
    };
  }, []);

  const handleNavClick = (item: any) => {
    if (item.disabled) return;
    router.push(item.path);
    setIsMobileOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginPopupOpen(true);
  };

  const navItems = [
    { path: '/for-you', label: 'For you', icon: <BsHouse /> },
    { path: '/my-library', label: 'Library', icon: <BsBook /> },
    { path: '/highlights', label: 'Highlights', icon: <BsBookmark />, disabled: true },
    { path: '/search', label: 'Search', icon: <AiOutlineSearch /> },
    { path: '/settings', label: 'Settings', icon: <BsGear /> },
    { path: '/help', label: 'Help & Support', icon: <BsQuestionCircle /> },
  ];

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/');
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div className="sidebar__overlay" onClick={() => setIsMobileOpen(false)} />
      )}
      <aside className={`sidebar ${isMobileOpen ? 'sidebar--mobile-open' : ''}`}>
      <div className="sidebar__logo">
        <img src="/assets/logo.png" alt="Summarist" />
      </div>
      
      <div className="sidebar__search">
        <AiOutlineSearch className="sidebar__search-icon" />
        <input type="text" placeholder="Search" className="sidebar__search-input" />
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item)}
            className={`sidebar__nav-item ${pathname === item.path ? 'sidebar__nav-item--active' : ''} ${item.disabled ? 'sidebar__nav-item--disabled' : ''}`}
          >
            {item.icon && <span className="sidebar__nav-icon">{item.icon}</span>}
            <span className="sidebar__nav-label">{item.label}</span>
          </button>
        ))}
        {currentUser ? (
          <button
            className="sidebar__nav-item"
            onClick={handleLogout}
          >
            <span className="sidebar__nav-icon"><BsBoxArrowRight /></span>
            <span className="sidebar__nav-label">Logout</span>
          </button>
        ) : (
          <button
            className="sidebar__nav-item"
            onClick={handleLoginClick}
          >
            <span className="sidebar__nav-icon"><BsBoxArrowRight /></span>
            <span className="sidebar__nav-label">Login</span>
          </button>
        )}
      </nav>
      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} />
    </aside>
    </>
  );
}

export default Sidebar;
