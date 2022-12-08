import { FlatList, useToast, Box, Text, Spinner } from "native-base";
import Avatar from "../global/avatar";
import {createRoom} from "@app/controller/message";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@app/context/user";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '@app/frontend/navigation/chat';
import ToastDialog from "../global/toast";
import type { User } from "@app/shared/interfaces/user";
import { getFirstName } from '@app/shared/actions/string';
import useFriends from "@app/hooks/useFriends";
import type { ChatRoom } from "@app/shared/interfaces/message";

type NavigationProps = NativeStackNavigationProp<ChatStackParamList, "rooms">;

/**
 * display current user's friend list (all matched users)
 * @returns {JSX.Element | null} friend list component
 */
export default function FriendList() {
    const { profile } = useContext(UserContext);
    const navigation = useNavigation<NavigationProps>();
    const toast = useToast();
    const { friends, loading } = useFriends();

    const onNavigateChat = async (friend: User) => {
        if (!profile) return;
        const room = await createRoom(
            profile, { id: friend.id! },
            (error) => {
                toast.show({
                    render: () => <ToastDialog message={error} />
                })
            }
        );
        if (!room) return;
        navigation.push("room", {
          channel: room as ChatRoom,
          name: friend?.name!,
        });
    }

    if (!profile) {
        return null;
    }

    if (loading) { 
        return (
            <Box
                justifyContent="center"
                alignItems="center"
            >
                <Spinner
                    accessibilityLabel="Loading your friend list"
                    color="onSecondary"
                    width={200}
                    height={200}
                />
            </Box>
        )
    }

    return (
        <>
            { profile.friendList && profile.friendList.length > 0? (
                <FlatList
                padding={2}
                data={friends}
                renderItem={({ item }) => (
                  <Box marginRight={3}>
                    <Avatar
                      size="md"
                      src={item.profilePicture!}
                      onPress={() => onNavigateChat(item)}
                    />
                    <Text
                        fontSize="sm"
                        textAlign="center"
                        color="white"
                        fontWeight="bold"
                        mt={3}
                    >
                        {getFirstName(item.name!)}
                    </Text>
                  </Box>
                )}
                keyExtractor={(item) => item.id!}
                horizontal
                showsHorizontalScrollIndicator={false}
              /> 
            ): 
            <Text
                color="onSecondary"
                fontSize="lg"
                textAlign="center"
            >
                You have no matched yet
            </Text> 
            }
        </>
    )
}