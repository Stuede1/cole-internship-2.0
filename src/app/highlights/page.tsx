'use client';

import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import './highlights.css';

export default function HighlightsPage() {
  return (
    <div className="highlights">
      <Sidebar />
      <TopNavbar />
      <div className="highlights__content">
        <div className="highlights__main">
          <h1 className="highlights__title">Highlights</h1>
          <div className="highlights__empty">
            <p>No highlights yet. Start reading books to create highlights!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
