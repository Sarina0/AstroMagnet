import { FlatList, useToast, Box, Text } from "native-base";
import Avatar from "../global/avatar";
import {createRoom} from "@app/controller/message";
import EmptyView from "@app/frontend/components/EmptyView";
import { useContext } from "react";
import { UserContext } from "@app/context/user";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '@app/frontend/navigation/chat';
import ToastDialog from "../global/toast";
import type {Friend} from "@app/shared/interfaces/user";
import { getFirstName } from '@app/shared/actions/string';

type NavigationProps = NativeStackNavigationProp<ChatStackParamList, "rooms">;

/**
 * display current user's friend list (all matched users)
 * @returns {JSX.Element | null} friend list component
 */
export default function FriendList() {
    const { profile } = useContext(UserContext);
    const navigation = useNavigation<NavigationProps>();
    const toast = useToast();

    const onNavigateChat = async (friend: Friend) => {
        if (!profile) return;
        const roomId = await createRoom(
            profile, friend,
            (error) => {
                toast.show({
                    render: () => <ToastDialog message={error} />
                })
            }
        );
        navigation.push("room", {
          id: roomId,
          name: friend.name!,
          profilePic: friend.profilePicture!
        });
    }

    if (!profile) {
        return null;
    }

    return (
        <>
            { profile.friendList && profile.friendList.length > 0? (
                <FlatList
                padding={2}
                data={profile?.friendList}
                renderItem={({ item }) => (
                  <Box marginRight={3}>
                    <Avatar
                      size="md"
                      src={item.profilePicture}
                      onPress={() => onNavigateChat(item)}
                    />
                    <Text
                        fontSize="sm"
                        textAlign="center"
                        color="white"
                        fontWeight="bold"
                        mt={3}
                    >
                        {getFirstName(item.name)}
                    </Text>
                  </Box>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              /> 
            ): <EmptyView title="You have no matched yet" />}
        </>
    )
}