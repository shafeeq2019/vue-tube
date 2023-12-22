import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

const getUserStatus = function () {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
        onAuthStateChanged(auth, function (user) {
            if (user) {
                resolve(user);
            } else {
                resolve();
            }
        });
    });
};

export { getUserStatus };