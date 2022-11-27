import {useEffect, useState} from "react";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

type doc = FirebaseFirestoreTypes.DocumentData;

/**
 * use users hooks, fetch all user from firestore
 * @param {(doc: FirebaseFirestoreTypes.DocumentData)=>boolean} filterUser - a function to filter user if needed
 * @returns {users: FirebaseFirestoreTypes.DocumentData[], loading: boolean} - a list of users and loading state
 */
export default function useUsers(
    onFilter?: (doc: doc) => boolean
) {
    const [users, setUsers] = useState<doc[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const unsubscribe = firestore()
            .collection("users")
            .onSnapshot((querySnapshot) => {
                const docs: doc[] = [];
                querySnapshot.forEach((documentSnapshot) => {
                    if (onFilter) {
                        if (onFilter(documentSnapshot)) {
                            docs.push({
                                ...documentSnapshot.data(),
                                id: documentSnapshot.id,
                            });
                        }
                    } else {
                        docs.push({
                            ...documentSnapshot.data(),
                            id: documentSnapshot.id,
                        });
                    }
                });
    
                //sort by createdAt
                docs.sort((a, b) => {
                    if (b.createdAt && a.createdAt) {
                        return a.createdAt.toMillis() - b.createdAt.toMillis();
                    } else {
                        return 0;
                    }
                })
                setUsers(docs);
                setLoading(false);
            });
        return unsubscribe;
    }, []);
    return {
        users,
        loading
    }
}