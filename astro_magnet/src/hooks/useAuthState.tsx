import {useState, useEffect} from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

type status = "authenticated" | "unauthenticated" | "loading";

export default function useAuthState() {

    /**authenticated user*/
    const [user, setUser] = useState<FirebaseAuthTypes.User|null>(null);

    /**authentication status loading-unauthenticated-authenticated*/
    const [status, setStatus] = useState<status>("loading");

    // Handle user state changes
    function onAuthStateChanged(user: any) {
      if (user) {
        setUser(user);
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    }

    useEffect(() => {
      //on auth state change will return a function to unsubscribe
      const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
      // unsubscribe on view unmount
      return unsubscribe;
    }, []);

    return {
        user,
        status
    }
}