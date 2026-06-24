# Cole Internship 2.0 - Summarist App (Next.js + TypeScript)

This is the **Next.js TypeScript migration** of the original Summarist React app, featuring book summaries with Firebase authentication and modern web technologies.

## 🚀 What's New

- ✅ **Next.js 16** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for modern styling
- ✅ **Firebase Authentication** with Google Sign-In
- ✅ **React Firebase Hooks** for state management
- ✅ **Responsive Design** preserved from original
- ✅ **All original functionality** maintained

## 📚 Features

- 📖 **Book Summaries** - Quick insights from best books
- 🎧 **Audio Support** - Listen to summaries
- ⭐ **User Reviews** - Community feedback
- 📊 **Reading Statistics** - Track your progress
- 🔐 **Google Authentication** - Secure login
- 📱 **Mobile Responsive** - Works on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Original CSS
- **Authentication**: Firebase Auth
- **Icons**: React Icons
- **State Management**: React Firebase Hooks

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🔧 Firebase Setup

The app uses Firebase for authentication. The configuration is already included in `src/firebase.ts` with the same credentials from the original project.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main Summarist homepage
│   ├── account/page.tsx   # User account page
│   └── globals.css       # Global styles (Tailwind + Original)
├── firebase.ts           # Firebase configuration
└── components/          # Reusable components
```

## 🎨 Styling

The app combines:
- **Tailwind CSS** for utility-first styling
- **Original Summarist CSS** for brand consistency
- **Responsive design** for mobile compatibility

## 🔄 Migration Notes

This migration preserves all original functionality while upgrading to modern technologies:

- ✅ All original UI components and layouts
- ✅ Firebase authentication flow
- ✅ Reading statistics and user data
- ✅ Responsive breakpoints
- ✅ Color scheme and typography
- ✅ Interactive elements and animations

## 🚀 Deployment

Ready for deployment on Vercel, Netlify, or any platform supporting Next.js:

```bash
npm run build
```

## 📱 Original Features Preserved

- **Rotating Statistics Headings** - Dynamic content updates
- **Customer Reviews** - User testimonials
- **Download Statistics** - App metrics
- **Footer Navigation** - Complete site structure
- **Google Sign-In** - Seamless authentication

## Testing

The project includes a comprehensive test suite built with **Jest** and **React Testing Library**, covering three layers:

| Layer | File | Tests |
|---|---|---|
| Unit | `src/utils/formatDuration.test.ts` | 13 |
| Integration | `src/components/ForYou.test.tsx` | 8 |
| Component | `src/app/search/SearchPage.test.tsx` | 9 |

### Run Tests

```bash
npm test
```

### What's Covered

- **Duration formatting logic** — null handling, zero/pending states, standard mm:ss output, large values (hour+), fractional flooring, zero-padded seconds
- **Async data fetching** — mocked `fetch` calls to Firebase Cloud Functions, loading skeleton states, error handling for network failures, correct book card rendering with title/author/subtitle
- **User interactions** — debounced search input (300ms delay), result display, empty-state messaging, navigation to book detail on card click, Premium badge display, input clearing resets results

---

**Built with ❤️ using Next.js, TypeScript, and Firebase**
