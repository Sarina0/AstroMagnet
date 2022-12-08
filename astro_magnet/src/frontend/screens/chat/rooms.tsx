import PageHeader from '@app/frontend/components/global/header';
import SafeArea from "@app/frontend/components/global/safeArea";
import { Box } from 'native-base';
import Title from "@app/frontend/components/global/title";
import RoomList from "@app/frontend/components/chat/roomList";
import FriendList from "@app/frontend/components/chat/friendList";

/**
 * screen to display list of user's chat rooms and friends
 * @returns {JSX.Element} chat rooms screen
 */
export default function ChatScreen() {
  return (
    <SafeArea>
        <PageHeader />
        <Box>
          <Title title="Matched" mb={5}/>
          <FriendList/>
        </Box>
        <Box flex={1}>
          <Title title="Messages" mt={1}/>
          <RoomList/>
        </Box>
    </SafeArea>    
 );
}