import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
    Image, TextInput, FlatList,

} from 'react-native'
import {useEffect, useState, useContext} from "react";
import FastImage from "react-native-fast-image";
import { ColorPalette } from '@app/frontend/styles/colorPalette'
import Images from "@app/theme/images";
import {UserContext} from "@app/store/user";
import {UserController} from "@app/controller/user";
import EmptyView from "@app/frontend/components/EmptyView";
import { User } from '@app/shared/interfaces/user';

const LikedScreen = () => {
    const [users, setUsers] = useState<any>([]);
    const [filteredUsers, setFilteredUsers] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    const {profile: currentUser} = useContext(UserContext) as {
        profile: User
    }

    const loadLikeUsers = async () => {
        setLoading(true);
        const {users: _users} = await UserController.getAllUsers();
        const likeUsers = [];
        for (const user of _users) {
            const userId = user._ref._documentPath._parts[1];
            if (userId !== currentUser.id) {
                const like = currentUser.liked || [];
                const dislike = currentUser.disliked || [];
                const likeIndex = like.indexOf(userId);
                if (likeIndex >= 0) {
                    likeUsers.push({
                        ...user._data,
                        userId
                    });
                }
            }

        }
        setUsers(likeUsers);
        setFilteredUsers(likeUsers);
    }

    const onSearchUser = (text: string) => {
        setKeyword(text);
        if (text) {
            const filtered = users.filter((item: User) => item.name!.indexOf(text) >= 0);
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            await loadLikeUsers();
            setLoading(false);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.searchWrapper}>
                <Image style={styles.searchIcon} source={Images.icon_search} />
                <TextInput
                    style={styles.searchText}
                    placeholder={'Search'}
                    placeholderTextColor={ColorPalette.SOFT_MAGENTA}
                    value={keyword}
                    onChangeText = {onSearchUser}
                />
            </View>
            <Text style={styles.bannerText}>Liked People</Text>
            {filteredUsers && filteredUsers.length > 0 ? (
                <FlatList
                    style={styles.listView}
                    data={filteredUsers}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.userCell}>
                                <FastImage style={styles.avatar} source={item.profilePicture ? {uri: item.profilePicture} : Images.avatar_placeholder} />
                                <Text style={styles.nameText}>{item.name || ''}</Text>
                            </View>
                        );
                    }}
                />
            ) : (
                <EmptyView title={'No liked people.'} />
            )}
        </View>
    )
}

export default LikedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    searchWrapper: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: ColorPalette.DARK_VIOLET_1
    },
    searchIcon: {
        width: 20,
        height: 20
    },
    searchText: {
        marginLeft: 15,
        color: 'white',
        width: '100%',
        fontSize: 20
    },
    bannerText: {
        fontWeight: '500',
        fontSize: 22,
        color: ColorPalette.SOFT_MAGENTA,
        marginBottom: 10
    },
    listView: {
        flex: 1,
    },
    userCell: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ColorPalette.DESATURATED_MAGENTA,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30
    },
    nameText: {
        marginLeft: 15,
        fontSize: 18,
        color: ColorPalette.VIOLET,
        fontWeight: '600'
    }

})
