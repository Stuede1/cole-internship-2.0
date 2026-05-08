'use client';

import { useAuth } from '@/components/AuthContext';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import AuthModal from '@/components/AuthModal';
import UpgradeModal from '@/components/UpgradeModal';
import './settings.css';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const currentSubscription = (currentUser as any)?.subscription || 'basic';
  
  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };
  
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    }
  }, [currentUser]);
  
  if (!currentUser) {
    return (
      <div className="settings">
        <Sidebar />
        <div className="settings__content">
          <TopNavbar />
          <div className="settings__main">
            <h1 className="settings__title">Settings</h1>
            <div className="settings__guest-notice">
              <p>Please sign in to access your settings</p>
              <button className="settings__login-btn" onClick={() => setShowAuthModal(true)}>
                Sign In
              </button>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }
  
  return (
    <div className="settings">
      <Sidebar />
      <div className="settings__content">
        <TopNavbar />
        <div className="settings__main">
          <h1 className="settings__title">Settings</h1>
          
          <div className="settings__section">
            <h2 className="settings__section-title">Account Settings</h2>
            <div className="settings__item">
              <div className="settings__item-info">
                <p className="settings__item-label">Email Address</p>
                <p className="settings__item-value">{currentUser?.email || 'Not available'}</p>
              </div>
              <button className="settings__item-action">Change</button>
            </div>
            <div className="settings__item">
              <div className="settings__item-info">
                <p className="settings__item-label">Display Name</p>
                <p className="settings__item-value">{currentUser?.displayName || 'Not set'}</p>
              </div>
              <button className="settings__item-action">Change</button>
            </div>
          </div>
          
          <div className="settings__section">
            <h2 className="settings__section-title">Subscription</h2>
            <div className="settings__subscription-card">
              <div className="settings__subscription-info">
                <div className="settings__subscription-icon">👑</div>
                <div className="settings__subscription-details">
                  <h3 className="settings__subscription-plan">
                    {currentSubscription === 'premium' ? 'Premium Plan' : 'Basic Plan'}
                  </h3>
                  <p className="settings__subscription-status">
                    {currentSubscription === 'premium' 
                      ? 'You have full access to all premium features' 
                      : 'Upgrade to premium for full access to all books'}
                  </p>
                </div>
              </div>
              {currentSubscription === 'basic' && (
                <button className="settings__upgrade-btn" onClick={handleUpgradeClick}>
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
          
          <div className="settings__section">
            <h2 className="settings__section-title">Preferences</h2>
            <div className="settings__item">
              <div className="settings__item-info">
                <p className="settings__item-label">Theme</p>
                <p className="settings__item-value">Light</p>
              </div>
              <button className="settings__item-action">Change</button>
            </div>
            <div className="settings__item">
              <div className="settings__item-info">
                <p className="settings__item-label">Language</p>
                <p className="settings__item-value">English</p>
              </div>
              <button className="settings__item-action">Change</button>
            </div>
          </div>
        </div>
      </div>
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
