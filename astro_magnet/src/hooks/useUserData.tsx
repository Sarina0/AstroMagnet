import {useState, useEffect} from "react";
import firestore from "@react-native-firebase/firestore";
import useAuthState from "./useAuthState";
import { User } from "@app/shared/interfaces/user";

export default function useUserData() {
    const {user, status} = useAuthState();
    const [userProfile, setUserProfile] = useState<User|null>(null);
    const [profileLoading, setProfileLoading] = useState<boolean>(false);

    useEffect(() => {
        if (status==="loading") return;
        if (user) {
            setProfileLoading(true);
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

                        //if profile does not exist
                        //create an user profile placeholder
                        const data: User = {
                            email: user.email!,
                            name: user.displayName?? "Anonymous",
                            sex: null,
                            profilePicture: user.photoURL?? "",
                            friendList: [],
                            dateAndTimeOfBirth: null,
                            placeOfBirth: "",
                            interestedType: [],
                            messagingFriendList: [],
                            liked: [],
                            disliked: [],
                            lat: 0,
                            lng: 0,
                            createdAt: firestore.Timestamp.now(),
                        }

                        //create new profile using the placeholder and add it to the database
                        firestore()
                            .collection('users')
                            .add(data)
                            .then(() => {

                                //set the profile after it is created
                                setUserProfile({
                                    ...data,
                                    id: documentSnapShot.docs[0].id, 
                                });
                            }).catch((error) => {
                                console.log(error);
                            }).finally(() => {
                                setProfileLoading(false);
                            })
                    }
                })

            //unsubscribe on view unmount
            return unsubscribe;
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