import {
    StyleSheet, Text, 
    View, Image, 
    FlatList, TextInput
} from 'react-native'
import { useContext, useEffect, useState } from "react";
import { ColorPalette } from "@app/theme/colors";
import Images from "@app/theme/images";
import EmptyView from "@app/frontend/components/EmptyView";
import PageHeader from '@app/frontend/components/global/header';
import LoadingOverlay from '@app/frontend/components/LoadingOverlay';
import SafeArea from '@app/frontend/components/global/safeArea';
import useLiked from '@app/hooks/useLiked';
import {useToast} from "native-base";
import ToastDialog from '@app/frontend/components/global/toast';
import type { User } from "@app/shared/interfaces/user";
import FriendCard from '@app/frontend/components/friendCard';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@app/frontend/navigation/main";
import { createRoom } from "@app/controller/message";
import {UserContext} from "@app/context/user";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "Like">;

const LikedScreen = () => {
    const {profile} = useContext(UserContext)
    const toast = useToast();
    const navigation = useNavigation<NavigationProps>();
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const {likedUsers, loading} = useLiked(
        (error) => {
            toast.show({
                render: () => <ToastDialog message={error} />
            })
        }
    );
    const [keyword, setKeyword] = useState('');

    const onSearchUser = (text: string) => {
        setKeyword(text);
    }

    const onCardClick = async (user: User) =>  {
        if (!profile) return;
        const roomId = await createRoom(profile, user, (error) => {
            toast.show({
                render: () => <ToastDialog message={error} />
            })
        });
        navigation.navigate("Chat", {
            screen: "room",
            params: {
                id: roomId,
                name: user.name!,
                profilePic: user.profilePicture!
            }
        });
    }

    useEffect(()=> {
        if (keyword) {
            const filtered: User[] = likedUsers.filter((user: User) => {
                return user.name?.toLowerCase().includes(keyword.toLowerCase());
            });
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(likedUsers);
        }

        if (likedUsers.length === 0) {
            setFilteredUsers([]);
        }
    }, [likedUsers, keyword]);

    return (
        <SafeArea>
            <PageHeader/>
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
                        keyExtractor={(_item, index) => index.toString()}
                        ListFooterComponent={() => <View style={{ height: 20 }} />}
                        renderItem={({ item }) => {
                            return (
                                <FriendCard
                                    profilePicture={item.profilePicture!}
                                    personName={item.name!}
                                    onPress={() => onCardClick(item)}
                                />
                            );
                        }}
                    />
                ) : (
                    <EmptyView title={'No liked people.'} />
                )}
                {loading && <LoadingOverlay/>}
            </View>
        </SafeArea>
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
    
})
