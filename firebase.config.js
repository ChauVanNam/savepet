// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCggz1y_cTkdZvRlrkZophXZE2wJlmt3so",
  authDomain: "animal-helper-256c3.firebaseapp.com",
  projectId: "animal-helper-256c3",
  storageBucket: "animal-helper-256c3.appspot.com",
  messagingSenderId: "651306220072",
  appId: "1:651306220072:web:f72822ab03ee64f519931d"
};
// firebase deploy --only hosting:animal-helper-256c3
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)