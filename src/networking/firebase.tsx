import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { createContext, useEffect, useState } from 'react';

export async function initializeFirebase(): Promise<FirebaseApp | undefined> {
  try {
    if (!getApps().length) {
      return initializeApp({
        
        apiKey: "AIzaSyDI1n7DuLJ5wvqylZbiuKKa2C-TWa11Z_w",
        authDomain: "trauma-dev-shaked.firebaseapp.com",
        projectId: "trauma-dev-shaked",
        storageBucket: "trauma-dev-shaked.appspot.com",
        messagingSenderId: "117244978448",
        appId: "1:117244978448:web:faeb7edc04b6f88fa37195",
        measurementId: "G-9FMC8L07B9"
        // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        // appId: process.env.REACT_APP_FIREBASE_APP_ID,
        // measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
      });
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

export const FirebaseProvider = ({ children }) => {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeFirebase().then(() => setLoading(false));
  }, [])


  return (
    <FirebaseContext.Provider value={loading ? undefined : getApps()?.[0]}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const FirebaseContext = createContext<FirebaseApp | undefined>(undefined);
