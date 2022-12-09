import {useCallback, useState, useContext} from "react";
import firestore from "@react-native-firebase/firestore";
import { FireDoc } from "@app/shared/interfaces/firebase";
import { UserContext } from "@app/context/user";
import { useFocusEffect } from "@react-navigation/native";

/**
 * use users hooks, fetch all user from firestore
 * users will not include current logged in user
 * users will not include users that current logged-in user already liked or disliked
 * @param {(error: string)=>void | undefined} onError - callback function to handle network error
 * @returns {users: FirebaseFirestoreTypes.DocumentData[], loading: boolean} - a list of users and loading state
 */
export default function useLooking(
    onError?: (error: string) => void,
) {
    const [users, setUsers] = useState<FireDoc[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { profile } = useContext(UserContext);

    useFocusEffect(
        useCallback(() => {
            if (!profile) return;
            const unsubscribe = firestore()
                .collection("users")
                .where(firestore.FieldPath.documentId(), "!=", profile.id)
                .onSnapshot((querySnapshot) => {
                    const list: FireDoc[] = [];
                    querySnapshot.forEach((doc) => {
                        if (
                            !profile?.liked.includes(doc.id) && 
                            !profile?.disliked.includes(doc.id) &&
                            !profile?.friendList.map(
                                (friend) => friend.id
                            ).includes(doc.id) &&
                            profile.interestedType.includes(doc.data().sex) &&
                            doc.data().interestedType.includes(profile.sex) &&
                            !doc.data().disliked.includes(profile.id)
                            ) {
                            list.push({
                                id: doc.id,
                                ...doc.data(),
                            });
                        }
                        list.sort((a, b) => {
                            if (b) {
                                return a?.createdAt.toDate() - b.createdAt.toDate();
                            }
                            return 0;
                        });
                    });
                    setUsers(list);
                    setLoading(false);
                }, (error) => {
                    onError && onError("Error fetching users");
                    console.log("[LOG] error fetching users:", error);
                });
            return unsubscribe;
        }, [
            profile?.id,
            profile?.liked,
            profile?.disliked,
            profile?.interestedType,
            profile?.messagingFriendList,
        ])
    );

    return {

        /** result after look */
        users,

        /** loading state of fetching result */
        loading
    }
}