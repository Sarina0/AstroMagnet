export interface Message {
    /**
     * Id of the message
     */
    messageId: string;

    /**
     * id of the chatroom the message is from.
     */
    chatRoomId: string;

    /**
     * Email of the person who sent the message
     */
    senderUser: string;

    /**
     * Content of the message being sent
     */
    content: string;

    /**
     * Time at which the message was sent
     */
    timestamp: Date;

    /**
     * Check if the message has been seen or not
     */
    seen: boolean;
}