import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDF7AsebakfjMrL_1jAeQ2avKk_SWB_rP4",
  authDomain: "spotify-e0ba6.firebaseapp.com",
  projectId: "spotify-e0ba6",
  storageBucket: "spotify-e0ba6.appspot.com",
  messagingSenderId: "356168421908",
  appId: "1:356168421908:web:35cbacd03679fa7dc28d01",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app,"gs://spotify-e0ba6.appspot.com/");
export default storage;
