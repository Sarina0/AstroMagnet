import { createContext } from "react";
import type { User } from "../shared/interfaces/user";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * user context type
 */
export type UserContextType = {

    /**
     * current user profile
     */
    profile: User | null;

    /**
     * set current user profile callback
     */
    setProfile: (user: User | null) => void;

    /**
     * current user firebase auth
     */
    authUser: FirebaseAuthTypes.User | null;
}

/**
 * user context
 * @property {User | null} profile - user
 * @property {FirebaseAuthTypes.User | null} authUser - firebase user
 */
export const UserContext = createContext<UserContextType>({

    /**
     * current user profile
     * @type {User | null}
     */
    profile: null,

    /**
     * set current user profile callback
     * @type {(user: User | null) => void}
     */
    setProfile: () => {},

    /**
     * current user firebase auth
     * @type {FirebaseAuthTypes.User | null}
     */
    authUser: null
});