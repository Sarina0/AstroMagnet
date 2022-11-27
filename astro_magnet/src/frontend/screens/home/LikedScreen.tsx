import {
    StyleSheet, Text, 
    View, Image, 
    FlatList, TextInput
} from 'react-native'
import {useEffect, useState, useContext} from "react";
import FastImage from "react-native-fast-image";
import { ColorPalette } from "@app/theme/colors";
import Images from "@app/theme/images";
import { UserContext } from "@app/store/user";
import UserController from "@app/controller/user";
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
        const {data: _users} = await UserController.getAllUsers();
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
            <View style={styles.searchWrapper} className="bg-secondary">
                <Image style={styles.searchIcon} source={Images.icon_search} />
                <TextInput
                    style={styles.searchText}
                    className="text-onSecondary"
                    placeholder={'Search'}
                    placeholderTextColor={ColorPalette.SOFT_MAGENTA}
                    value={keyword}
                    onChangeText = {onSearchUser}
                />
            </View>
            <Text style={styles.bannerText} className="text-onSecondary">Liked People</Text>
            {filteredUsers && filteredUsers.length > 0 ? (
                <FlatList
                    style={styles.listView}
                    data={filteredUsers}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.userCell} className="bg-tertiary">
                                <FastImage style={styles.avatar} source={item.profilePicture ? {uri: item.profilePicture} : Images.avatar_placeholder} />
                                <Text className="text-lg text-secondary font-bold ml-5">
                                    {item.name || ''}
                                </Text>
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
    },
    searchIcon: {
        width: 20,
        height: 20
    },
    searchText: {
        marginLeft: 15,
        width: '100%',
        fontSize: 20
    },
    bannerText: {
        fontWeight: "bold",
        fontSize: 22,
        marginBottom: 10
    },
    listView: {
        flex: 1,
    },
    userCell: {
        flexDirection: 'row',
        alignItems: 'center',
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
