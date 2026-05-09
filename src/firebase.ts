import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFqJpnuvsulWZoOK8QM_CoUmKCx_aaEDA",
  authDomain: "cole-internship2.firebaseapp.com",
  projectId: "cole-internship2",
  storageBucket: "cole-internship2.firebasestorage.app",
  messagingSenderId: "327676346050",
  appId: "1:327676346050:web:a27e45e97c72acf72a855b",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const db = getFirestore(app);

export async function createUserDocument(user: any) {
  if (!user) return;

  const { doc, setDoc } = await import("firebase/firestore");
  const userRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    createdAt: new Date(),
    lastLogin: new Date(),
  };

  await setDoc(userRef, userData);
}

export { auth, googleProvider, db };
export default app;
