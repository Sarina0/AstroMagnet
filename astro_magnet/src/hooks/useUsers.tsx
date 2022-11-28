import {useEffect, useState, useContext} from "react";
import firestore from "@react-native-firebase/firestore";
import { FireDoc } from "@app/shared/interfaces/firebase";
import { UserContext } from "@app/store/user";
/**
 * use users hooks, fetch all user from firestore
 * users will not include current logged in user
 * users will not include users that current logged-in user already liked or disliked
 * @param {(error: string)=>void | undefined} onError - callback function to handle network error
 * @returns {users: FirebaseFirestoreTypes.DocumentData[], loading: boolean} - a list of users and loading state
 */
export default function useUsers(
    onError?: (error: string) => void,
) {
    const [users, setUsers] = useState<FireDoc[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { profile } = useContext(UserContext);
    useEffect(() => {
        if (!profile) return;
        const unsubscribe = firestore()
            .collection("users")
            .where(firestore.FieldPath.documentId(), "!=", profile.id)
            .onSnapshot((querySnapshot) => {
                const list: FireDoc[] = [];
                querySnapshot.forEach((doc) => {
                    if (!profile?.liked.includes(doc.id) && !profile?.disliked.includes(doc.id)) {
                        list.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    }
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
    ]);
    return {
        users,
        loading
    }
}