'use client';

import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import './help.css';

export default function HelpPage() {
  return (
    <div className="help">
      <Sidebar />
      <TopNavbar />
      <div className="help__content">
        <div className="help__main">
          <h1 className="help__title">Help & Support</h1>
          
          <div className="help__content-wrapper">
            <div className="help__section">
              <h2 className="help__section-title">Frequently Asked Questions</h2>
              <div className="help__faq">
                <div className="help__faq-item">
                  <h3 className="help__faq-question">How do I listen to books?</h3>
                  <p className="help__faq-answer">Click on any book and use the audio player to listen to summaries.</p>
                </div>
                <div className="help__faq-item">
                  <h3 className="help__faq-question">What is included in the premium plan?</h3>
                  <p className="help__faq-answer">Premium gives you access to all books, including exclusive content.</p>
                </div>
                <div className="help__faq-item">
                  <h3 className="help__faq-question">Can I download books for offline listening?</h3>
                  <p className="help__faq-answer">Yes, premium members can download books for offline access.</p>
                </div>
              </div>
            </div>
            
            <div className="help__section">
              <h2 className="help__section-title">Contact Support</h2>
              <p className="help__support-text">Need more help? Reach out to our support team.</p>
              <button className="help__contact-btn">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
