import './Skeleton.css';

interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card-horizontal' | 'card-vertical';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({ 
  variant = 'rectangular', 
  width, 
  height, 
  className = '' 
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || '100%',
  };

  return (
    <div 
      className={`skeleton skeleton--${variant} ${className}`}
      style={style}
    />
  );
}

export function BookCardHorizontalSkeleton() {
  return (
    <div className="book-card-horizontal skeleton-card">
      <Skeleton variant="rectangular" width="80px" height="100px" />
      <div className="book-card-horizontal__info">
        <Skeleton variant="text" width="70%" height="20px" />
        <Skeleton variant="text" width="50%" height="16px" />
        <Skeleton variant="text" width="40%" height="14px" />
      </div>
    </div>
  );
}

export function BookCardVerticalSkeleton() {
  return (
    <div className="book-card-vertical skeleton-card">
      <Skeleton variant="rectangular" width="100%" height="200px" />
      <Skeleton variant="text" width="80%" height="20px" />
      <Skeleton variant="text" width="60%" height="16px" />
    </div>
  );
}

export function SettingsItemSkeleton() {
  return (
    <div className="settings__item">
      <div className="settings__item-info">
        <Skeleton variant="text" width="30%" height="16px" />
        <Skeleton variant="text" width="50%" height="20px" />
      </div>
      <Skeleton variant="rectangular" width="80px" height="36px" />
    </div>
  );
}
