'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaBackward, FaPlay, FaPause, FaForward } from 'react-icons/fa';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useLibraryManager } from './LibraryManager';
import './Player.css';

interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  audioLink: string;
  bookDescription: string;
  summary: string;
}

function Player() {
  const params = useParams();
  const router = useRouter();
  const { finishBook } = useLibraryManager();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${params.id}`);
        const data = await response.json();
        console.log('Book details:', data);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load book details');
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBook();
    }
  }, [params.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const handleTimeUpdate = () => {
      const newTime = audio.currentTime;
      setCurrentTime(newTime);
      console.log('Current time:', newTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setIsFinished(true);
      // Mark book as finished when audio completes
      if (book) {
        finishBook(book);
        console.log('Book finished:', book.title);
      }
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [book]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + seconds, duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      setProgress(parseFloat(e.target.value));
    }
  };

  const updateProgress = () => {
    if (audioRef.current && isPlaying) {
      const newTime = audioRef.current.currentTime;
      const newProgress = (newTime / duration) * 100;
      setCurrentTime(newTime);
      setProgress(newProgress);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  // Start/stop progress animation based on play state
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="player">
        <Sidebar />
        <TopNavbar />
        <div className="player__content">
          <div className="player__loading">Loading book details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player">
        <Sidebar />
        <TopNavbar />
        <div className="player__content">
          <div className="player__error">{error}</div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="player">
        <Sidebar />
        <TopNavbar />
        <div className="player__content">
          <div className="player__error">Book not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <Sidebar />
      <TopNavbar />
      <div className="player__content">
        <div className="player__container">
          <button className="player__back-btn" onClick={() => router.back()}>
            ← Back
          </button>
          
          <h1 className="player__main-title">{book.title}</h1>
          
          <div className="player__summary">
            <h2 className="player__summary-title">Summary</h2>
            <p className="player__summary-text" style={{ whiteSpace: 'pre-line' }}>
              {book.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="player__audio-footer">
        <div className="player__book-info">
          <img src={book.imageLink} alt={book.title} className="player__book-cover" />
          <div className="player__book-details">
            <p className="player__book-title">{book.title}</p>
            <p className="player__book-author">{book.author}</p>
          </div>
        </div>
        
        <audio
          ref={audioRef}
          src={book.audioLink}
          onLoadedMetadata={() => {
            console.log('Audio loaded, duration:', audioRef.current?.duration);
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onPlay={() => console.log('Audio playing')}
          onPause={() => console.log('Audio paused')}
          onError={(e) => console.log('Audio error:', e)}
        />
        
        <div className="player__controls-wrapper">
          <div className="player__controls">
            <button className="player__control-btn" onClick={() => handleSkip(-10)}>
              <FaBackward />
            </button>
            <button className="player__control-btn player__play-btn" onClick={togglePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="player__control-btn" onClick={() => handleSkip(10)}>
              <FaForward />
            </button>
          </div>
          {isFinished && (
            <div className="player__finished-indicator">
              ✓ Finished
            </div>
          )}
        </div>

        <div className="player__progress-section">
          <input
            type="range"
            className="player__progress-bar"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
          />
          <div className="player__time-display">
            <span className="player__current-time">{formatTime(currentTime)}</span>
            <span className="player__total-time">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
