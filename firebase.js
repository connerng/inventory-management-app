// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV9iSzXiOdOVV9PrB4Il5-IK-I_6lclKo",
  authDomain: "inventory-management-314ab.firebaseapp.com",
  projectId: "inventory-management-314ab",
  storageBucket: "inventory-management-314ab.appspot.com",
  messagingSenderId: "237456309744",
  appId: "1:237456309744:web:f6c7998362ad168e43f135",
  measurementId: "G-FHH40MN4C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}