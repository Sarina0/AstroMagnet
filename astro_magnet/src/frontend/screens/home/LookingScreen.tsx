import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
    Image,
    Dimensions
} from 'react-native'
import {useEffect, useState, useContext} from "react";
import FastImage from "react-native-fast-image";

import {UserController} from "@app/controller/user";
import {ColorPalette} from "@app/frontend/styles/colorPalette";
import Images from "@app/theme/images";
import {UserContext} from "@app/store/user";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import EmptyView from "@app/frontend/components/EmptyView";
import { User } from '@app/shared/interfaces/user';

const width = Dimensions.get('window').width;

const LookingScreen = () => {
    const [users, setUsers] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [activeUser, setActiveUser] = useState<any>(null);
    const [activeUserIndex, setActiveUserIndex] = useState(0);

    const {profile: currentUser, setProfile} = useContext(UserContext) as {
        profile: User,
        setProfile: (profile: User) => void
    }

    const loadAllUsers = async () => {
        setLoading(true);
        const {users: _users} = await UserController.getAllUsers();
        const allUsers = [];
        for (const user of _users) {
            const userId = user._ref._documentPath._parts[1];
            if (userId !== currentUser.id) {
                const like = currentUser.liked || [];
                const dislike = currentUser.disliked || [];
                const likeIndex = like.indexOf(userId);
                const dislikeIndex = dislike.indexOf(userId);
                if (likeIndex < 0 && dislikeIndex < 0) {
                    allUsers.push({
                        ...user._data,
                        userId
                    });
                }
            }

        }
        if (allUsers.length > 0) {
            setActiveUser(allUsers[0]);

        }
        setUsers(allUsers);
    }

    const onLike = async () => {
        if (users.length > activeUserIndex) {
            setLoading(true);

            const likeUser = users[activeUserIndex].userId;
            users.splice(activeUserIndex, 1);
            setUsers(users);

            setTimeout(() => {
                if (users.length > 0) {
                    setActiveUser(users[activeUserIndex]);
                } else {
                    setActiveUserIndex(0);
                    setActiveUser(null);
                }
            }, 300);

            await UserController.likeUser(currentUser.id, likeUser)
            const likes = currentUser.liked || [];
            likes.push(likeUser);
            setProfile({
                ...currentUser,
                liked: likes
            })
            setLoading(false);
        }
    }

    const onDislike = async () => {
        if (users.length > activeUserIndex) {
            setLoading(true);

            const dislikeUser = users[activeUserIndex].userId;
            users.splice(activeUserIndex, 1);
            setUsers(users);

            setTimeout(() => {
                if (users.length > 0) {
                    setActiveUser(users[activeUserIndex]);
                } else {
                    setActiveUserIndex(0);
                    setActiveUser(null);
                }
            }, 300);

            await UserController.dislikeUser(currentUser.id, dislikeUser)
            const dislikes = currentUser.disliked || [];
            dislikes.push(dislikeUser);
            setProfile({
                ...currentUser,
                disliked: dislikes
            })
            setLoading(false);
        }
    }

    const onNextUser = () => {
        setActiveUser(users[activeUserIndex + 1]);
        setActiveUserIndex(activeUserIndex + 1)
    }

    const onPrevUser = () => {
        setActiveUser(users[activeUserIndex - 1]);
        setActiveUserIndex(activeUserIndex - 1);
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
        const birthYear = new Date(activeUser!.dateAndTimeOfBirth!).getFullYear();
        const curYear= new Date().getFullYear();
        return curYear - birthYear;
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            await loadAllUsers();
            setLoading(false);
        })();
    }, []);

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
                        {activeUserIndex < users.length - 1 ? (
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
        color: 'blue',
        fontSize: 30
    }

})
