'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function Navigation() {
  const router = useRouter();
  const { currentUser } = useAuth();

  return (
    <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-bold text-sm mb-2">Quick Navigation</h3>
      <div className="space-y-1">
        <button 
          onClick={() => router.push('/')}
          className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          Home
        </button>
        <button 
          onClick={() => router.push('/for-you')}
          className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          For You
        </button>
        <button 
          onClick={() => router.push('/my-library')}
          className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          My Library
        </button>
        <button 
          onClick={() => router.push('/account')}
          className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          Account
        </button>
        <button 
          onClick={() => router.push('/search')}
          className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          Search
        </button>
        <button 
          onClick={() => router.push('/settings')}
          className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          Settings
        </button>
        <button 
          onClick={() => router.push('/help')}
          className="block w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          Help
        </button>
      </div>
      <div className="mt-2 pt-2 border-t text-xs">
        {currentUser ? `Logged in: ${currentUser.email}` : 'Not logged in'}
      </div>
    </div>
  );
}
