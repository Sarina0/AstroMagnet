import {useState, useEffect} from "react";
import firestore from "@react-native-firebase/firestore";
import useAuthState from "./useAuthState";
import { User } from "@app/shared/interfaces/user";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * hooks to setup user profile after user has logged in
 * @param {(error: string)=>void | undefined} onError - callback function to handle network error
 * @return {FirebaseAuthTypes.User} user - current logged in user
 * @return status - of authentication: loading-unauthenticated-authenticated
 * @return setupProfile - react setState function to update user profile
 * @return {User|null} userProfile - user profile
 * @return {boolean} profileLoading - loading status of user profile(true-false)
 */
export default function useProfile(
    onError?: (error: string) => void,
) {
    const {user, status} = useAuthState();
    const [userProfile, setUserProfile] = useState<User|null>(null);
    const [profileLoading, setProfileLoading] = useState<boolean>(true);

    useEffect(() => {
        if (status==="loading") return;
        if (user) {
            setProfileLoading(true);
            console.log("[LOG] profile loading");
            const unsubscribe = firestore()
                .collection('users')
                .where("email", "==", user.email)
                .onSnapshot(documentSnapShot => {

                    //check if user profile exists
                    if (documentSnapShot && documentSnapShot.docs.length > 0) {
                        const rawDob = documentSnapShot.docs[0].data().dateAndTimeOfBirth;
                        const dateOfBirth = rawDob ? rawDob.toDate() : null;

                        //if profile exists, set the profile
                        setUserProfile({
                            ...documentSnapShot.docs[0].data(),
                            id: documentSnapShot.docs[0].id,
                            dateAndTimeOfBirth: dateOfBirth
                        } as User);
                        setProfileLoading(false);
                    } else {

                        //if profile does not exist, set the profile to null
                        setUserProfile(null);
                        setProfileLoading(false);
                        console.log("[LOG] user profile does not exist")
                    }
                }, (error)=> {
                    setProfileLoading(false);
                    onError && onError("Error fetching user profile");
                    console.log("[LOG] error fetching user profile:", error);
                })

            //unsubscribe on view unmount
            return unsubscribe;
        } else {
            setProfileLoading(false);
        }
    }, [user]);
    
    return {
        user,
        status,
        userProfile,
        setUserProfile,
        profileLoading
    }
}