// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7k05tMR7OHrEVjTXwc5vLGIFZzjoBNNI",
  authDomain: "shop-cart-a2bcc.firebaseapp.com",
  databaseURL: "https://shop-cart-a2bcc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shop-cart-a2bcc",
  storageBucket: "shop-cart-a2bcc.appspot.com",
  messagingSenderId: "1015020595817",
  appId: "1:1015020595817:web:04168877146d2d46f950f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export {
  app
}