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
    messageId: string;

    /**
     * id of the chatroom the message is from.
     */
    chatRoomId: string;

    /**
     * Email of the person who sent the message
     */
    senderUser: {
        id: string;
        email: string;
    }

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

export interface ChatRoom {
    /**
     * Id of the chatroom
     * @type {string}
     */
    chatRoomId: string;

    /**
     * Id of the user who created the chatroom
     * @type {string}
     */
    creatorUser: {
        id: string;
        name: string;
    }

    /**
     * Id of the user who is being messaged
     * @type {string}
     */
    receiverUser: {
        id: string;
        name: string;
    }

    /**
     * Id of the last message sent
     * @type {string}
     */
    lastMessageId: string;

    /**
     * Time at which the last message was sent
     * @type {Date}
     */
    lastMessageTimestamp: Date;

    /**
     * Id of the user who sent the last message
     * @type {string}
     */
    lastMessageSenderUser: {
        id: string;
        name: string;
    }
}