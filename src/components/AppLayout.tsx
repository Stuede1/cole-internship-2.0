'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__main">
        <TopNavbar />
        <div className="app-layout__content">
          {children}
        </div>
      </div>
    </div>
  );
}
