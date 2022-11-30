import { createContext } from "react";
import type { User } from "../shared/interfaces/user";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * user context type
 */
export type UserContextType = {
    profile: User | null;
    setProfile: (user: User | null) => void;
    authUser: FirebaseAuthTypes.User | null;
}

/**
 * user context
 * @property {User | null} user - user
 * @property {FirebaseAuthTypes.User | null} firebaseUser - firebase user
 */
export const UserContext = createContext<UserContextType>({
    profile: null,
    setProfile: () => {},
    authUser: null
});