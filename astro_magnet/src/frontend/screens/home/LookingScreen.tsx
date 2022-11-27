import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
    Image,
    Dimensions
} from 'react-native'
import {useEffect, useState, useContext} from "react";
import FastImage from "react-native-fast-image";
import UserController from "@app/controller/user";
import {ColorPalette} from "@app/theme/colors";
import Images from "@app/theme/images";
import {UserContext} from "@app/store/user";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import EmptyView from "@app/frontend/components/EmptyView";
import { User } from '@app/shared/interfaces/user';
import useUsers from '@app/hooks/useUsers';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const width = Dimensions.get('window').width;
type doc = FirebaseFirestoreTypes.DocumentData;

const LookingScreen = () => {
    const {profile: currentUser, setProfile} = useContext(UserContext) as {
        profile: User,
        setProfile: (profile: User) => void
    }
    const filterUser = (user: doc) => {
        const userId = user._ref._documentPath._parts[1];
        if (userId !== currentUser.id) {
            const like = currentUser.liked;
            const dislike = currentUser.disliked;
            const isLiked = like.includes(userId);
            const isDisliked = dislike.includes(userId);
            return !isLiked && !isDisliked;
        }
        return false;
    }

    const {users, loading} = useUsers(filterUser);
    const [activeUser, setActiveUser] = useState<doc|null>(null);
    const [activeUserIndex, setActiveUserIndex] = useState(
       users.length> 0? users.indexOf(activeUser!): 0
    );

    const onLike = async () => {
        await UserController.likeUser(currentUser.id!, activeUser!.userId);
    }

    const onDislike = async () => {
        await UserController.dislikeUser(currentUser.id!, activeUser!.userId);
    }

    const onNextUser = () => {
        if (users.indexOf(activeUser!) + 1 > users.length - 1) {
            setActiveUser(users[0]);
            setActiveUserIndex(0);
        } else {
            setActiveUser(users[users.indexOf(activeUser!) + 1]);
            setActiveUserIndex(users.indexOf(activeUser!) + 1);
        }
    }

    const onPrevUser = () => {
        if (users.indexOf(activeUser!) -1 < 0) {
            return;
         }
        setActiveUser(users[activeUserIndex - 1]);
        setActiveUserIndex(users.indexOf(activeUser!) - 1);
    }

    const toRad = (Value:any) => {
        return (Value * Math.PI) / 180;
    };

    const getCompatibility = (user:any) => {
        if (currentUser && user) {
            let lat1 = currentUser.lat;
            let lng1 = currentUser.lng;
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

    const getAge = () => {
        const birthYear = new Date(activeUser!.dateAndTimeOfBirth!.toDate()).getFullYear();
        const curYear= new Date().getFullYear();
        return curYear - birthYear;
    }

    useEffect(()=> {
        if (users.length > 0 && loading) {
            setActiveUser(users[0]);
        }
    }, [users, loading])

    return (
        <View style={styles.container}>
            {activeUser ? (
                <View style={styles.userContainer}>
                    <View style={styles.selectorWrapper}>
                        {activeUserIndex > 0 ? (
                        <TouchableOpacity onPress={onPrevUser}>
                            <Image style={styles.arrowImage} source={Images.icon_arrow_left}/>
                        </TouchableOpacity>
                        ) : <Image style={styles.arrowImage} source={Images.icon_arrow_right} />}
                        <Text style={styles.nameText}>{activeUser.name || ''}</Text>
                        {activeUserIndex < users.length - 1 || activeUserIndex == 0 ? (
                            <TouchableOpacity onPress={onNextUser}>
                                <Image style={styles.arrowImage} source={Images.icon_arrow_right}/>
                            </TouchableOpacity>
                        ) : <Image style={styles.arrowImage}  source={Images.icon_arrow_left}/>}
                    </View>
                    <View style={styles.compatibilityWrapper}>
                        <Text style={styles.compatibilityText}>Compatibility: {getCompatibility(activeUser)}%</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <FastImage style={styles.avatar} source={activeUser.profilePicture ? {uri: activeUser.profilePicture} : Images.avatar_placeholder} />
                        <Text style={styles.ageText}>Age: {getAge()}</Text>
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
        </View>
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
