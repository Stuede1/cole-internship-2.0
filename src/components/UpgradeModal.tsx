'use client';

import { AiOutlineClose } from 'react-icons/ai';
import { BiCrown } from 'react-icons/bi';
import './UpgradeModal.css';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <button className="upgrade-modal__close" onClick={onClose}>
          <AiOutlineClose />
        </button>
        
        <div className="upgrade-modal__icon">
          <BiCrown />
        </div>
        
        <h2 className="upgrade-modal__title">Upgrade to Premium</h2>
        <p className="upgrade-modal__description">
          This book requires a premium subscription. Upgrade to access all premium content.
        </p>
        
        <div className="upgrade-modal__features">
          <div className="upgrade-modal__feature">
            <span className="upgrade-modal__feature-icon">✓</span>
            <span>Access to all premium books</span>
          </div>
          <div className="upgrade-modal__feature">
            <span className="upgrade-modal__feature-icon">✓</span>
            <span>Unlimited listening</span>
          </div>
          <div className="upgrade-modal__feature">
            <span className="upgrade-modal__feature-icon">✓</span>
            <span>Ad-free experience</span>
          </div>
          <div className="upgrade-modal__feature">
            <span className="upgrade-modal__feature-icon">✓</span>
            <span>Offline access</span>
          </div>
        </div>
        
        <button className="upgrade-modal__button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default UpgradeModal;
