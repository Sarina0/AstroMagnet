import firestore from '@react-native-firebase/firestore';
import {useEffect, useState, useContext } from 'react';
import { UserContext } from '@app/context/user';
import type {User} from '@app/shared/interfaces/user';
import { useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';

export default function useFriends() {
    const { profile } = useContext(UserContext);
    const [friends, setFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toast = useToast();

    useEffect(() => {
        if (!profile) return;
        const userFriendIds = profile.friendList.map((friend) => friend.id);
        const unsubscribe = firestore()
            .collection('users')
            .where(firestore.FieldPath.documentId(), 'in', userFriendIds)
            .onSnapshot((snapshot) => {
                const friends = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as User));
                setFriends(friends);
                setLoading(false);
            }, (error) => {
                toast.show({
                    render: () => <ToastDialog message={error.message} />
                })
                setLoading(false);
            });
            return unsubscribe;
    }, [profile?.friendList]);

    return {
        friends,
        loading
    }
}