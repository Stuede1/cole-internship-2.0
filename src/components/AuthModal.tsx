'use client';

import { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { useAuth } from './AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, loginWithGoogle, error, setError } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = isLogin 
      ? await login(email, password)
      : await signup(email, password);
    
    if (result.success) {
      onClose();
    }
    
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    const result = await loginWithGoogle();
    
    if (result.success) {
      onClose();
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose}>
          <AiOutlineClose />
        </button>
        
        <h2 className="auth-modal__title">{isLogin ? 'Log in to Summarist' : 'Sign up for Summarist'}</h2>
        
        <button 
          className="auth-modal__btn auth-modal__btn--guest" 
          onClick={onClose}
        >
          <BsPerson className="auth-modal__btn-icon" />
          Login as a Guest
        </button>
        
        <div className="auth-modal__divider">
          <span className="auth-modal__divider-line"></span>
          <span className="auth-modal__divider-text">or</span>
          <span className="auth-modal__divider-line"></span>
        </div>
        
        <button 
          className="auth-modal__btn auth-modal__btn--google" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <img src="/assets/google.png" alt="Google" className="auth-modal__btn-icon" />
          {isLoading ? 'Signing in...' : 'Login with Google'}
        </button>
        
        <div className="auth-modal__divider">
          <span className="auth-modal__divider-line"></span>
          <span className="auth-modal__divider-text">or</span>
          <span className="auth-modal__divider-line"></span>
        </div>
        
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="auth-modal__input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="auth-modal__input"
          />
        </form>
        
        <button 
          className="auth-modal__btn auth-modal__btn--submit"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Login' : 'Sign Up')}
        </button>
        
        {error && (
          <div className="auth-modal__error">
            {error}
          </div>
        )}
        
        <a href="#" className="auth-modal__link">Forgot your password?</a>
        <a 
          href="#" 
          className="auth-modal__link"
          onClick={(e) => {
            e.preventDefault();
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </a>
      </div>
    </div>
  );
}

export default AuthModal;
