import {
    StyleSheet, View,
    Text, TouchableOpacity,
    Image, Dimensions
} from 'react-native'
import { useEffect, useState, useContext, useRef } from "react";
import FastImage from '@app/frontend/components/global/image';
import UserController from "@app/controller/user";
import { ColorPalette } from "@app/theme/colors";
import Images from "@app/theme/images";
import {UserContext} from "@app/context/user";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import EmptyView from "@app/frontend/components/EmptyView";
import useLooking from '@app/hooks/useLooking';
import { FireDoc as doc } from '@app/shared/interfaces/firebase';
import { getAge } from '@app/shared/actions/time';
import { ScrollView, useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';
import SafeArea from '@app/frontend/components/global/safeArea';
import PageHeader from '@app/frontend/components/global/header';
// import Card from "@app/frontend/components/looking/card";

const width = Dimensions.get('window').width;

/**
 * TODO:
 * - [x] remove on previous user, add a button too go back to only 1 previous user
 * - [x] add swipe to go to next user
 */

const LookingScreen = () => {
    const toast = useToast();
    const { profile } = useContext(UserContext);
    const count = useRef(0);
    const {users, loading} = useLooking((error)=> {
        toast.show({
            render: () => <ToastDialog message={error} />
        });
    });
    const [isLikeUpdating, setIsUpdating] = useState<boolean>(false);
    const [activeUser, setActiveUser] = useState<doc|null|undefined>(null);

    //load first user when users finished fetching
    useEffect(()=> {
        if (users.length > 0 && loading) {
            setActiveUser(users[0]);
        }
    }, [users, loading])

    /**
     * this code run when user like
     */
     useEffect(()=>{
        if (isLikeUpdating) {
            //on user like or dislike
            //set next user as active user
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
            await UserController.likeUser(profile?.id!, activeUser.id);
        }
    }

    /**
     * on dislike button pressed
     */
    const onDislike = async () => {
        if (activeUser) {
            setIsUpdating(true);
            await UserController.dislikeUser(profile?.id!, activeUser.id);
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

    /**
     * on previous button pressed
     */
    const onPrevUser = () => {
        if (count.current > 0) {
            count.current--;
            setActiveUser(users[count.current]);
        } else {
            setActiveUser(users[users.length-1]);
            count.current = users.length-1;
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
            <ScrollView style={styles.container}>
                {activeUser ? (
                    <View style={styles.userContainer}>
                        <View style={styles.selectorWrapper}>
                            <TouchableOpacity onPress={onPrevUser}>
                                <Image style={styles.arrowImage} source={Images.icon_arrow_left}/>
                            </TouchableOpacity>
                            <Text style={styles.nameText}>{activeUser.name || ''}</Text>
                            <TouchableOpacity onPress={onNextUser}>
                                <Image style={styles.arrowImage} source={Images.icon_arrow_right}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.compatibilityWrapper}>
                            <Text style={styles.compatibilityText}>Compatibility: {getCompatibility(activeUser)}%</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <FastImage style={styles.avatar} source={activeUser.profilePicture ? {uri: activeUser.profilePicture} : Images.avatar_placeholder} />
                            <Text style={styles.ageText}>Age: {getAge(activeUser.dateAndTimeOfBirth.toDate())}</Text>
                        </View>
                        <View style={styles.actionWrapper}>
                            <TouchableOpacity onPress={onLike}>
                                <Image style={styles.actionImage} source={Images.icon_like} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onDislike}>
                                <Image style={styles.actionImage} source={Images.icon_dislike} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : <EmptyView title={'No looking people'} />}
                {loading && <LoadingOverlay />}
            </ScrollView>
        </SafeArea>   
    )
}

export default LookingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
    },
    userContainer: {
        flex: 1
    },
    selectorWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20
    },
    arrowImage: {
        width: 24,
        height: 24
    },
    nameText: {
        color: ColorPalette.SOFT_MAGENTA,
        fontSize: 24
    },
    compatibilityWrapper: {
        alignItems: 'flex-end',
        marginTop: 10,
        marginBottom: 5
    },
    compatibilityText: {
        fontSize: 24,
        color: ColorPalette.SOFT_MAGENTA
    },
    avatar: {
        width: '100%',
        height: width,
        borderRadius: 10
    },
    userInfo: {
        position: 'relative'
    },
    actionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        marginTop: 20
    },
    actionImage: {
        width: 40,
        height: 40
    },
    ageText: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        textAlign: 'center',
        color: "white",
        fontSize: 30,
        backgroundColor: "rgba(0,0,0,0.5)",
    }
})



