import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import auth from "../firebase/auth";
import db from "../firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {

        console.log("Auth State Changed:", firebaseUser);

        if (firebaseUser) {

          console.log("User restored:", firebaseUser.email);

          try {
            const userDoc = await getDoc(
              doc(db, "users", firebaseUser.uid)
            );

            if (userDoc.exists()) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...userDoc.data(),
              });
            } else {
              setUser(null);
            }

          } catch (error) {
            console.error("Error loading user:", error);
            setUser(null);
          }

        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;