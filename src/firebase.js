import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyDBlGjfCAu3ArjAKKXEgV6boFnEJJG0aeQ",
  authDomain: "placement-buddy-3fdbf.firebaseapp.com",
  projectId: "placement-buddy-3fdbf",
  storageBucket: "placement-buddy-3fdbf.appspot.com", 
  messagingSenderId: "704480351291",
  appId: "1:704480351291:web:0c4f2a04bb3a59292af81e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 
export const googleProvider = new GoogleAuthProvider();
