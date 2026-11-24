"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator, FirebaseStorage } from "firebase/storage";

interface FirebaseClientConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

function readClientConfig(): FirebaseClientConfig {
  if (typeof window !== "undefined") {
    const injected = (window as unknown as { __FIREBASE_WEBAPP_CONFIG__?: FirebaseClientConfig })
      .__FIREBASE_WEBAPP_CONFIG__;
    if (injected?.apiKey && injected?.projectId) return injected;
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

const config = readClientConfig();

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.projectId && config.apiKey.trim().length > 5
);

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: FirebaseStorage | null = null;
let emulatorsConnected = false;

export function getFirebaseServices(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
} | null {
  if (!isFirebaseConfigured) return null;

  if (!cachedApp) {
    cachedApp = getApps().length ? getApp() : initializeApp(config);
    cachedAuth = getAuth(cachedApp);
    cachedDb = getFirestore(cachedApp);
    cachedStorage = getStorage(cachedApp);

    if (
      !emulatorsConnected &&
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" &&
      window.location.hostname === "localhost"
    ) {
      connectAuthEmulator(cachedAuth, "http://127.0.0.1:9099", { disableWarnings: true });
      connectFirestoreEmulator(cachedDb, "127.0.0.1", 8080);
      connectStorageEmulator(cachedStorage, "127.0.0.1", 9199);
      emulatorsConnected = true;
    }
  }

  return {
    app: cachedApp,
    auth: cachedAuth!,
    db: cachedDb!,
    storage: cachedStorage!,
  };
}
