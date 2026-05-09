'use client';

import { useAuth } from './AuthContext';

interface Book {
  id: string;
  title: string;
  subTitle: string;
  author: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  bookDescription?: string;
  bookDuration?: string;
  type?: string;
  keyIdeas?: string;
  tags?: string[];
  totalRating?: number;
  authorDescription?: string;
}

export const useLibraryManager = () => {
  const { currentUser } = useAuth();

  // Save book to library
  const saveBook = (book: Book) => {
    if (!currentUser) return false;
    
    try {
      const savedBooksKey = `savedBooks_${currentUser.uid}`;
      const savedBooksData = localStorage.getItem(savedBooksKey);
      const savedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];
      
      // Check if book is already saved
      if (!savedBooks.find((b: Book) => b.id === book.id)) {
        const updatedBooks = [...savedBooks, { ...book, type: 'saved', dateAdded: new Date().toISOString() }];
        localStorage.setItem(savedBooksKey, JSON.stringify(updatedBooks));
        return true;
      }
      
      return false; // Already saved
    } catch (error) {
      console.error('Error saving book:', error);
      return false;
    }
  };

  // Remove book from saved books
  const removeSavedBook = (bookId: string) => {
    if (!currentUser) return false;
    
    try {
      const savedBooksKey = `savedBooks_${currentUser.uid}`;
      const savedBooksData = localStorage.getItem(savedBooksKey);
      const savedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];
      
      const updatedBooks = savedBooks.filter((b: Book) => b.id !== bookId);
      localStorage.setItem(savedBooksKey, JSON.stringify(updatedBooks));
      return true;
    } catch (error) {
      console.error('Error removing saved book:', error);
      return false;
    }
  };

  // Mark book as finished
  const finishBook = (book: Book) => {
    if (!currentUser) return false;
    
    try {
      // Add to finished books (book stays in saved books)
      const finishedBooksKey = `finishedBooks_${currentUser.uid}`;
      const finishedBooksData = localStorage.getItem(finishedBooksKey);
      const finishedBooks = finishedBooksData ? JSON.parse(finishedBooksData) : [];
      
      // Check if book is already finished
      if (!finishedBooks.find((b: Book) => b.id === book.id)) {
        const updatedBooks = [...finishedBooks, { ...book, type: 'finished', dateAdded: new Date().toISOString() }];
        localStorage.setItem(finishedBooksKey, JSON.stringify(updatedBooks));
        return true;
      }
      
      return false; // Already finished
    } catch (error) {
      console.error('Error finishing book:', error);
      return false;
    }
  };

  // Check if book is saved
  const isBookSaved = (bookId: string): boolean => {
    if (!currentUser) return false;
    
    try {
      const savedBooksKey = `savedBooks_${currentUser.uid}`;
      const savedBooksData = localStorage.getItem(savedBooksKey);
      const savedBooks = savedBooksData ? JSON.parse(savedBooksData) : [];
      
      return savedBooks.some((b: Book) => b.id === bookId);
    } catch (error) {
      console.error('Error checking saved book:', error);
      return false;
    }
  };

  // Check if book is finished
  const isBookFinished = (bookId: string): boolean => {
    if (!currentUser) return false;
    
    try {
      const finishedBooksKey = `finishedBooks_${currentUser.uid}`;
      const finishedBooksData = localStorage.getItem(finishedBooksKey);
      const finishedBooks = finishedBooksData ? JSON.parse(finishedBooksData) : [];
      
      return finishedBooks.some((b: Book) => b.id === bookId);
    } catch (error) {
      console.error('Error checking finished book:', error);
      return false;
    }
  };

  return {
    saveBook,
    removeSavedBook,
    finishBook,
    isBookSaved,
    isBookFinished
  };
};
