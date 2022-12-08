import {useState, useEffect} from 'react';
import {useToast} from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';
import firestore from '@react-native-firebase/firestore';
import type {User} from '@app/shared/interfaces/user';

export default function useUser(id: string) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const toast = useToast();

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('users')
            .doc(id)
            .onSnapshot((doc) => {
                const user = {
                    id: doc.id,
                    ...doc.data()
                }
                setUser(user as User);
                setLoading(false);
            }, (error)=>{
                toast.show({
                    render: () => <ToastDialog message={error.message} />
                })
                setLoading(false);
            });
            return unsubscribe;
    }, [id]);

    return {
        user,
        loading
    }
}