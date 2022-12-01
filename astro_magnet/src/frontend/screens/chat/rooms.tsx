import { useContext } from 'react'
import PageHeader from '@app/frontend/components/global/header';
import SafeArea from "@app/frontend/components/global/safeArea";
import { useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';
import useChatChannels from "@app/hooks/useChatChannels";
import LoadingView from "@app/frontend/components/LoadingOverlay";
import FriendCard from "@app/frontend/components/friendCard";
import { ChatRoom } from '@app/shared/interfaces/message';
import {formatChatTime} from "@app/shared/actions/time";
import { FlatList, Text } from "native-base";
import { UserContext } from "@app/context/user";
import EmptyView from '@app/frontend/components/EmptyView';
import { ChatStackParamList } from '../../navigation/chat';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

/**
 * ChatScreen props type
 * @property {boolean} menuVisible - menu visibility
 * @property {Dispatch<SetStateAction<boolean>>} setMenuVisible - menu visibility toggler
 */
type NavigationProps = NativeStackNavigationProp<ChatStackParamList, "room">;

/**
 * Chat Card props type
 */
type ChatCardProps = {
  currUserId: string;
  room: ChatRoom;
}

const ChatCard = (props: ChatCardProps ) => {
  const { users, lastMessage } = props.room;
  let createdAt = "";
  if (lastMessage) {
    createdAt = formatChatTime(lastMessage.createdAt.toDate());
  }
  const { profilePicture, name } = users.filter((user) => user.id !== props.currUserId)[0];
  const navigation = useNavigation<NavigationProps>();
  return (
    <FriendCard
      personName={name}
      profilePicture={profilePicture}
      lastMessageTime={createdAt}
      lastMessage={lastMessage?.content}
      onPress={() => {
        navigation.push("room", {
          id: props.room.id!,
          name: name,
          profilePic: profilePicture
        });
      }}
    />
  );
}

export default function ChatScreen() {
  const toast = useToast();
  const { profile } = useContext(UserContext);

  const { channels, loading} = useChatChannels(
    (error) => {
      toast.show({
        render: () => <ToastDialog message={error} />
      })
    });

  return (
    <SafeArea>
        { loading && <LoadingView /> }
        <PageHeader />
        <Text
          fontSize={25}
          fontWeight="bold"
          color="onSecondary"
          ml={2}
          mt={5}
        >
          Messages
        </Text>
        { channels.length < 1 && 
          <EmptyView title='No chats yet' />}
        { channels.length > 0 &&
          <FlatList
            data={channels}
            renderItem={({ item }) => 
              <ChatCard 
                room={item} 
                currUserId={profile?.id!} 
              />
            }
            keyExtractor={(item) => item.id!}
            p={2}
            flex={1}
          />}
    </SafeArea>    
 );
}