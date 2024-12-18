// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  signOut 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

// User Registration
export const registerUser = async (userData) => {
  const { email, password, displayName, photoURL } = userData;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: displayName,
      photoURL: photoURL || 'default-avatar-url'
    });

    // Use db instead of firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: displayName,
      email: email,
      photoURL: photoURL || 'default-avatar-url',
      createdAt: new Date()
    });

    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Email Login
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Google Login
export const loginWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Use db instead of firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
