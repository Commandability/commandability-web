import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGQiaO_SiB0it8dHI2APTgkXvvtzx90Fs",
  authDomain: "commandability-1d375.firebaseapp.com",
  databaseURL: "https://commandability-1d375.firebaseio.com",
  projectId: "commandability-1d375",
  storageBucket: "commandability-1d375.appspot.com",
  messagingSenderId: "374407940390",
  appId: "1:374407940390:web:b9ef542f5d4a8edeb959e7",
  measurementId: "G-ZWEDLBHN93",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
