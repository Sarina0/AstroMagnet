import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface ChatUser {
    id: string;
    name: string;
    profilePicture: string;
    email: string;
}

/**
 * Message type
 * @property {string} id - message id
 * @property {string} chatRoomId - chatroom id
 * @property {boolean} senderUser - id of sender
 * @property {boolean} content - message content
 * @property {Date} timestamp - when message was sent
 * @property {boolean} isRead - if message is read
 */
export interface Message {
    /**
     * Id of the message
     */
    id?: string;

    /**
     * id of the chatroom the message is from.
     */
    chatRoomId: string;

    /**
     * Email of the person who sent the message
     */
    sendBy: ChatUser;

    /**
     * Content of the message being sent
     */
    content: string;

    /**
     * Time at which the message was sent
     */
    timestamp: Date
    
    /**
     * created at
     */
    createdAt: FirebaseFirestoreTypes.Timestamp;

    /**
     * Check if the message has been seen or not
     */
    seen: boolean;
}

/**
 * chat room type
 * @property {string | undefined} id - chatroom id
 * @property {userIds} id of users in chatroom
 * @property {Message} lastMessage of chatroom
 */

//chat room collection have subcollection of messages in firestore
export interface ChatRoom {
    /**
     * Id of the chatroom
     * @type {string | undefined}
     */
    id?: string;

    /**
     * users in the chatroom
     */
    users: [ChatUser, ChatUser];

    /**
     * last message sent in the chatroom
     */
    lastMessage?: Message;
}