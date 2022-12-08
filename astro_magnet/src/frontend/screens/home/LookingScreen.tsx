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

/**
 * screen for looking for new friends
 * @returns {JSX.Element} looking screen
 */
const LookingScreen = () => {
    const toast = useToast();
    const { profile } = useContext(UserContext);
    const {users, loading} = useLooking((error)=> {
        toast.show({
            render: () => <ToastDialog message={error} />
        });
    });
    const [isMatchedFound, setIsMatchedFound] = useState<boolean>(false);

    /**
     * on like button pressed
     */
    const onLike = async (user: User) => {
        await UserController.likeUser(
            profile?.id!,
            user.id!,
            ()=>{
                setIsMatchedFound(true);
            },
            (message: string) => {
                toast.show({
                    render: () => <ToastDialog message={message} />
                });
            }
        );
    }

    /**
     * on dislike button pressed
     */
    const onDislike = async (user: User) => {
        await UserController.dislikeUser(
            profile?.id!,
            user.id!,
            (message: string) => {
                toast.show({
                    render: () => <ToastDialog message={message} />
                });
            }
        );
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
                                            onDislike(user);
                                        } else if (swipedDirection === 'right') {
                                            onLike(user);
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


