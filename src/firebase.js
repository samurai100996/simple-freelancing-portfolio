import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYSBVUblB5kaD6hTDImeqpW288cjf1WZs",
  authDomain: "portfolio-website-283e9.firebaseapp.com",
  projectId: "portfolio-website-283e9",
  storageBucket: "portfolio-website-283e9.firebasestorage.app",
  messagingSenderId: "395954137305",
  appId: "1:395954137305:web:4e4cefd9680398dc52b6c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage
export const storage = getStorage(app);