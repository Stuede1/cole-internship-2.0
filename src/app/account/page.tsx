"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import app from "@/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Account() {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading...</div>
          <div className="text-gray-600">Preparing your account</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Account</h1>
          <div className="mb-6">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {user.displayName || 'User'}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Account Status</h3>
              <p className="text-green-600 font-medium">Premium Member</p>
              <p className="text-sm text-gray-600">Unlimited access to all summaries</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Your Reading Stats</h3>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">Books Read: 42</p>
                <p className="text-gray-600">Reading Streak: 15 days</p>
                <p className="text-gray-600">Favorite Genre: Self-Help</p>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
