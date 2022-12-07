import {
    StyleSheet, View,
    Text, Dimensions
} from 'react-native'
import { useEffect, useState, useContext, useRef } from "react";
import UserController from "@app/controller/user";
import { ColorPalette } from "@app/theme/colors";
import {UserContext} from "@app/context/user";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import EmptyView from "@app/frontend/components/EmptyView";
import useLooking from '@app/hooks/useLooking';
import { FireDoc as doc } from '@app/shared/interfaces/firebase';
import { useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';
import SafeArea from '@app/frontend/components/global/safeArea';
import PageHeader from '@app/frontend/components/global/header';
import Card from "@app/frontend/components/looking/swipeable";
import ModalDialog from '@app/frontend/components/global/modal';
import type {User} from "@app/shared/interfaces/user";

const LookingScreen = () => {
    const toast = useToast();
    const { profile } = useContext(UserContext);
    const {users, loading} = useLooking((error)=> {
        toast.show({
            render: () => <ToastDialog message={error} />
        });
    });
    const count = useRef(users.length - 1);
    const [isLikeUpdating, setIsUpdating] = useState<boolean>(false);
    const [activeUser, setActiveUser] = useState<doc|null|undefined>(null);
    const [isMatchedFound, setIsMatchedFound] = useState<boolean>(false);

    //load first user when users finished fetching
    useEffect(()=> {
        if (!loading) {
            setActiveUser(users[users.length - 1]);
            count.current = users.length - 1;
        }
    }, [loading])

    /**
     * this code run when user like
     */
     useEffect(()=>{
        if (isLikeUpdating) {
            // on user like or dislike
            // set next user as active user
            onNextUser();
            setActiveUser(users[count.current]);
            setIsUpdating(false);
        }
    }, [isLikeUpdating]);

    useEffect(()=> {
        if (users.length === 0) {

            //if there is no user left, we will set activeUser to null
            //we do this manually since setState is async, the users array may not be updated yet after like or dislike
            setActiveUser(null);
            count.current = 0;
        } else if (users.length === 1 && !activeUser)  {
            
            //if activeUsers is null and theres new user, set activeUser to the new user
            setActiveUser(users[0]);
        } 
    }, [users, activeUser]);

    /**
     * on like button pressed
     */
    const onLike = async () => {
        if (activeUser) {
            setIsUpdating(true);
            await UserController.likeUser(
                profile?.id!, 
                activeUser.id,
                ()=> {
                    setIsMatchedFound(true);
                },
                (message: string) => {
                    toast.show({
                        render: () => <ToastDialog message={message} />
                    });
                }
            );
        }
    }

    /**
     * on dislike button pressed
     */
    const onDislike = async () => {
        if (activeUser) {
            setIsUpdating(true);
            await UserController.dislikeUser(
                profile?.id!, 
                activeUser.id,
                (message: string) => {
                    toast.show({
                        render: () => <ToastDialog message={message} />
                    });
                } 
            );
        }
    }

    /**
     * on next button pressed
     */
    const onNextUser = () => {
        if (count.current < users.length-1) {
            count.current++;
            setActiveUser(users[count.current]);
        } else {
            setActiveUser(users[0]);
            count.current = 0;
        }
    }

    const toRad = (Value:any) => {
        return (Value * Math.PI) / 180;
    };

    const getCompatibility = (user:doc) => {
        if (profile && user) {
            let lat1 = profile.lat;
            let lng1 = profile.lng;
            let lat2 = user.lat;
            let lng2 = user.lng;

            let R = 6371; // km
            let dLat = toRad(lat2 - lat1!);
            let dLon = toRad(lng2 - lng1!);
            lat1 = toRad(lat1);
            lat2 = toRad(lat2);

            let a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let d = Math.floor(R * c);
            return Math.floor(100 - (d * 100) / 20000);
        }
        return 0;
    }

    return (
        <SafeArea>
            <PageHeader/>
            <View className="flex-1 px-2">
                <ModalDialog
                    isOpen={isMatchedFound}
                    onClose={()=> setIsMatchedFound(false)}
                    message="You have found a match!"
                />
                <View className="flex-1">
                    {users.length > 0 && 
                        users.map((userDoc, index) => {
                            const user = {
                                ...userDoc,
                                dateAndTimeOfBirth: userDoc.dateAndTimeOfBirth.toDate()
                            } as User;
                            return (
                                <Card
                                    key={index}
                                    item={user}
                                    swipedDirection={(swipedDirection: string)=> {
                                        if (swipedDirection === 'left') {
                                            onDislike();
                                        } else if (swipedDirection === 'right') {
                                            onLike();
                                        }
                                    }}
                                />
                            )
                        }
                    )}
                    {users.length === 0 && <EmptyView title="No looking people" />}
                </View>  
            </View>
        </SafeArea>   
    )
}

export default LookingScreen;
//fetch and listen to users changes


