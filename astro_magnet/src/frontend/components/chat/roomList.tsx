import { FlatList, useToast, Spinner, Box } from "native-base";
import ChatCard from "./card";
import ToastDialog from "../global/toast";
import type { Friend } from "@app/shared/interfaces/user";
import EmptyView from "@app/frontend/components/EmptyView";
import { useContext } from "react";
import { UserContext } from "@app/context/user";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatStackParamList } from '@app/frontend/navigation/chat';
import useChatChannels from "@app/hooks/useChatChannels";
import {createRoom} from "@app/controller/message";

type NavigationProps = NativeStackNavigationProp<ChatStackParamList, "rooms">;

/**
 * component to display all the chat rooms of the current user
 * @prop {string} currUserId - current user id
 * @prop {ChatRoom[]} rooms - list of chat rooms of current user
 * @prop {(friend: Friend)=>void} onNavigateChat - navigate to chat room callback
 * @returns {JSX.Element} - chat rooms list component
 */
export default function ChatRooms() {
    const { profile } = useContext(UserContext);
    const navigation = useNavigation<NavigationProps>();
    const toast = useToast();
    const { channels, loading} = useChatChannels(
        (error) => {
          toast.show({
            render: () => <ToastDialog message={error} />
          })
        }
    );

    const onNavigateChat = async (friend: Friend) => {
        if (!profile) return;
        const roomId = await createRoom(profile, friend);
        navigation.push("room", {
          id: roomId,
          name: friend.name!,
          profilePic: friend.profilePicture!
        });
    }
    
    if (!profile) {
        return null;
    }
    
    if (loading) {
        return (
          <Box
            flex={1}
            justifyContent="center"
            alignItems="center"
          >
            <Spinner 
              accessibilityLabel="Loading chat rooms"
              size="lg"
              color="onSecondary"
            />
          </Box>
        )
    }

    return (
        <>
            { channels && channels.length > 0? (
                <FlatList
                data={channels}
                renderItem={({ item }) => 
                  <ChatCard 
                    room={item} 
                    currUserId={profile.id!} 
                    onNavigateChat={
                      ()=>onNavigateChat(
                        item
                          .users
                          .filter((user) => user.id !== profile.id)[0])
                    }
                  />
                }
                keyExtractor={(item) => item.id!}
                p={2} flex={1}
              />
            ): <EmptyView title='No chats yet' />}
        </>
    )
}