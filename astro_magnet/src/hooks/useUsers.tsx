import {useEffect, useState} from 'react';
import {useToast} from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';
import firestore from '@react-native-firebase/firestore';
import type { User } from '@app/shared/interfaces/user';

export default function useUsers(ids: string[]) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const toast = useToast();

    useEffect(() => {
        if (ids.length === 0 || !ids) {
            setLoading(false);
            return;
        }
        const unsubscribe = firestore()
            .collection('users')
            .where(firestore.FieldPath.documentId(), 'in', ids)
            .onSnapshot((snapshot) => {
                const users = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                } as User));
                setUsers(users);
                setLoading(false);
            }, (error)=>{
                toast.show({
                    render: () => <ToastDialog message={error.message} />
                })
                setLoading(false);
            });
            return unsubscribe;
    },[
        ids
    ]);

    return {
        users,
        loading
    }
}