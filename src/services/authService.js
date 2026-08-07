import {
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import auth from "../firebase/auth";
import db from "../firebase/firestore";

export async function login(email, password) {

  await setPersistence(auth, browserLocalPersistence);

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  const userDoc = await getDoc(
    doc(db, "users", user.uid)
  );

  if (!userDoc.exists()) {
    throw new Error("User data not found.");
  }

  return {
    firebaseUser: user,
    profile: userDoc.data(),
  };
}

export async function logout() {
  await signOut(auth);
}