'use client';

import { useAuth } from '@/components/AuthContext';
import { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import AuthModal from '@/components/AuthModal';
import { SettingsItemSkeleton } from '@/components/Skeleton';
import app from '@/firebase';
import { getPortalUrl } from '@/utils/stripePayment';
import { getPremiumStatus } from '@/utils/getPremiumStatus';
import './settings.css';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingPremium, setIsLoadingPremium] = useState(true);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [isUpdatingDisplayName, setIsUpdatingDisplayName] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    }
  }, [currentUser]);

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
      }
    };
    
    checkPremiumStatus();
  }, [currentUser]);
  
  const handleUpgradeClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    router.push('/choose-plan');
  };

  const handleManageSubscription = async () => {
    try {
      const portalUrl = await getPortalUrl(app);
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Error opening portal:', error);
    }
  };

  const handleEditDisplayName = () => {
    setNewDisplayName(currentUser?.displayName || '');
    setIsEditingDisplayName(true);
  };

  const handleSaveDisplayName = async () => {
    if (!currentUser) return;
    
    setIsUpdatingDisplayName(true);
    try {
      const auth = getAuth(app);
      if (!auth.currentUser) return;
      
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName
      });
      
      // Force a page reload to ensure the updated profile is reflected
      window.location.reload();
    } catch (error) {
      console.error('Error updating display name:', error);
      setIsUpdatingDisplayName(false);
    }
  };

  const handleCancelDisplayName = () => {
    setIsEditingDisplayName(false);
    setNewDisplayName('');
  };
  
  if (!currentUser) {
    return (
      <div className="settings">
        <Sidebar />
        <div className="settings__content">
          <TopNavbar showMenuButton={true} />
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
                {isEditingDisplayName ? (
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="settings__input"
                    disabled={isUpdatingDisplayName}
                  />
                ) : (
                  <p className="settings__item-value">{currentUser?.displayName || 'Not set'}</p>
                )}
              </div>
              {isEditingDisplayName ? (
                <div className="settings__item-actions">
                  <button 
                    className="settings__item-action settings__item-action--save"
                    onClick={handleSaveDisplayName}
                    disabled={isUpdatingDisplayName}
                  >
                    {isUpdatingDisplayName ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    className="settings__item-action settings__item-action--cancel"
                    onClick={handleCancelDisplayName}
                    disabled={isUpdatingDisplayName}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button className="settings__item-action" onClick={handleEditDisplayName}>Change</button>
              )}
            </div>
          </div>
          
          <div className="settings__section">
            <h2 className="settings__section-title">Subscription</h2>
            {isLoadingPremium ? (
              <SettingsItemSkeleton />
            ) : (
              <div className="settings__subscription-card">
                <div className="settings__subscription-info">
                  <div className="settings__subscription-icon">👑</div>
                  <div className="settings__subscription-details">
                    <h3 className="settings__subscription-plan">
                      {isPremium ? 'Premium Plan' : 'Basic Plan'}
                    </h3>
                    <p className="settings__subscription-status">
                      {isPremium 
                        ? 'You have full access to all premium features' 
                        : 'Upgrade to premium for full access to all books'}
                    </p>
                  </div>
                </div>
                {!isPremium && (
                  <button className="settings__upgrade-btn" onClick={handleUpgradeClick}>
                    Upgrade to Premium
                  </button>
                )}
                {isPremium && (
                  <button className="settings__upgrade-btn" onClick={handleManageSubscription}>
                    Manage Subscription
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="settings__section">
            <h2 className="settings__section-title">Preferences</h2>
            <div className="settings__item">
              <div className="settings__item-info">
                <p className="settings__item-label">Theme</p>
                <p className="settings__item-value">Light</p>
              </div>
              <button className="settings__item-action settings__item-action--not-implemented">Change</button>
            </div>
            <div className="settings__item">
              <div className="settings__item-info">
                <p className="settings__item-label">Language</p>
                <p className="settings__item-value">English</p>
              </div>
              <button className="settings__item-action settings__item-action--not-implemented">Change</button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
