import FriendCard from "../global/friendCard";
import {formatChatTime} from "@app/shared/actions/time";
import type {ChatRoom} from "@app/shared/interfaces/message";
import { User } from "@app/shared/interfaces/user";

/**
 * Chat Card props type
 */
 type ChatCardProps = {
    friend: User;
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
    } = props.friend;
  
    return (
      <FriendCard
        personName={name!}
        profilePicture={profilePicture!}
        lastMessageTime={timeLastMessageWasSent}
        lastMessage={lastMessage?.content}
        onPress={props.onNavigateChat}
      />
    );
  }