import FriendCard from "../global/friendCard";
import {formatChatTime} from "@app/shared/actions/time";
import type {ChatRoom} from "@app/shared/interfaces/message";

/**
 * Chat Card props type
 */
 type ChatCardProps = {
    currUserId: string;
    room: ChatRoom;
    onNavigateChat: ()=>void;
  }
  
/**
 * card to display all the chat rooms of the current user
 * @prop {string} currUserId - current user id
 * @prop {ChatRoom} room - chat room
 * @prop {()=>void} onNavigateChat - navigate to chat room callback
 * @returns 
 */
export default function ChatCard(props: ChatCardProps ) {
  
    const { 
      
      /** list of user in chat room */
      users, 
      
      /** last message sent in room */
      lastMessage 
    } = props.room;
  
    /** time last message was sent at */
    let timeLastMessageWasSent = "";
    if (lastMessage) {
      timeLastMessageWasSent = formatChatTime(lastMessage.createdAt.toDate());
    }
  
    /** friend's avatar and name */
    const { 
      profilePicture, name 
    } = users.filter((user) => user.id !== props.currUserId)[0];
  
    return (
      <FriendCard
        personName={name}
        profilePicture={profilePicture}
        lastMessageTime={timeLastMessageWasSent}
        lastMessage={lastMessage?.content}
        onPress={props.onNavigateChat}
      />
    );
  }