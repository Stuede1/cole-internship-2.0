'use client';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ForYouContent from '@/components/ForYou';
import AppLayout from '@/components/AppLayout';

export default function ForYouPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  return (
    <AppLayout>
      <ForYouContent />
    </AppLayout>
  );
}
