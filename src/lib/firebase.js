// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx4C_kjwwFL8L-iNlvdyyHYC83kmkRnLA",
  authDomain: "lct-scoreboard.firebaseapp.com",
  projectId: "lct-scoreboard",
  storageBucket: "lct-scoreboard.firebasestorage.app",
  messagingSenderId: "456036250029",
  appId: "1:456036250029:web:30d2e35ba1f902b4b0b124",
  measurementId: "G-FMHRNQ36NQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
