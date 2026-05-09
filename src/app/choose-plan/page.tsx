'use client';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import AuthModal from '@/components/AuthModal';
import app from '@/firebase';
import { getCheckoutUrl } from '@/utils/stripePayment';
import './choose-plan.css';

export default function ChoosePlanPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Your Stripe price IDs for premium subscriptions
  const MONTHLY_PRICE_ID = 'price_1TUxyjF1njQGrJJccuCg1brO';
  const YEARLY_PRICE_ID = 'price_1TUyfUF1njQGrJJcVlqMtyA7';

  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    }
  }, [currentUser]);

  const handleUpgradeClick = async (priceId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const checkoutUrl = await getCheckoutUrl(app, priceId);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="choose-plan">
      <Sidebar />
      <TopNavbar />
      <div className="choose-plan__content">
        <div className="choose-plan__container">
          <button className="choose-plan__back-btn" onClick={() => router.back()}>
            ← Back
          </button>
          
          <div className="choose-plan__header">
            <h1 className="choose-plan__title">Choose Your Plan</h1>
            <p className="choose-plan__subtitle">Unlock full access to all premium books and features</p>
          </div>

          <div className="choose-plan__plans">
            <div className="choose-plan__plan-card choose-plan__plan-card--monthly">
              <div className="choose-plan__plan-badge">Popular</div>
              <h2 className="choose-plan__plan-title">Premium</h2>
              <p className="choose-plan__plan-billing">Monthly</p>
              <div className="choose-plan__plan-price">
                <span className="choose-plan__plan-amount">$9.99</span>
                <span className="choose-plan__plan-period">/month</span>
              </div>
              <ul className="choose-plan__plan-features">
                <li>✓ Access to all premium books</li>
                <li>✓ Unlimited listening</li>
                <li>✓ Full book summaries</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <button 
                className="choose-plan__plan-btn"
                onClick={() => handleUpgradeClick(MONTHLY_PRICE_ID)}
              >
                Choose Premium
              </button>
            </div>

            <div className="choose-plan__plan-card choose-plan__plan-card--yearly">
              <div className="choose-plan__plan-badge choose-plan__plan-badge--best">Best Value</div>
              <h2 className="choose-plan__plan-title">Premium+</h2>
              <p className="choose-plan__plan-billing">Yearly</p>
              <div className="choose-plan__plan-price">
                <span className="choose-plan__plan-amount">$99.99</span>
                <span className="choose-plan__plan-period">/year</span>
              </div>
              <p className="choose-plan__plan-savings">Save 17%</p>
              <ul className="choose-plan__plan-features">
                <li>✓ Access to all premium books</li>
                <li>✓ Unlimited listening</li>
                <li>✓ Full book summaries</li>
                <li>✓ Cancel anytime</li>
                <li>✓ 7-day free trial</li>
              </ul>
              <button 
                className="choose-plan__plan-btn"
                onClick={() => handleUpgradeClick(YEARLY_PRICE_ID)}
              >
                Choose Premium+
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
