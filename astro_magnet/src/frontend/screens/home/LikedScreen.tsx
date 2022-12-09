import {
    StyleSheet,
    View, Image, 
    FlatList, TextInput
} from 'react-native'
import { useEffect, useState } from "react";
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
import FriendCard from '@app/frontend/components/global/friendCard';
import Title from "@app/frontend/components/global/title";

/**
 * screen to display all users that user liked
 * @returns {JSX.Element} liked screen
 */
const LikedScreen = () => {
    const toast = useToast();
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
                <Title title="Liked People" />
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
