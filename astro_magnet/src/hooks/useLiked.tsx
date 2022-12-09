import { useState, useCallback, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { FireDoc } from "@app/shared/interfaces/firebase";
import { UserContext } from "@app/context/user";
import {User} from "@app/shared/interfaces/user";
import { useFocusEffect } from "@react-navigation/native";

/**
 * - This hooks load all users that current logged-in user liked.
 * - Return an object with a list of likedUsers and loading state
 * @param {(error: string)=>void | undefined} onError - callback function to handle network error
 * @return {User[]} likedUsers - a list of users that current logged-in user liked
 * @return {boolean} loading - fetch loading state
 */
export default function useLiked(
    onError?:(error:string)=>void
) {
    const { profile } = useContext(UserContext);
    const [likedUsers, setLiked] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useFocusEffect(
        useCallback(()=> {
            if (!profile) { 
                setLoading(false);
                return 
            }
            if (profile?.liked.length === 0) {
                setLiked([]);
                setLoading(false);
                return;
            }
            const unsubscribe = firestore()
                .collection("users")
                .where(firestore.FieldPath.documentId(), "in", profile.liked)
                .onSnapshot((querySnapshot) => {
                    const list: FireDoc[] = [];
                    querySnapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });
                    setLiked(list as User[]);
                    setLoading(false);
                }
                , (error) => {
                    setLoading(false);
                    onError && onError("Error fetching liked users");
                    console.log("[LOG] error fetching liked users:", error);
            });
            return unsubscribe;
        }, [profile])
    );

    return {
        likedUsers,
        loading
    }
}