import firestore from "@react-native-firebase/firestore";
import type { Message, ChatUser } from "@app/shared/interfaces/message";
import { User } from "@app/shared/interfaces/user";

export async function sendMessage(
    message: Message,
    onError?: (error: string) => void
    ) {
    const { chatRoomId } = message;
    const chatRoomRef = firestore().collection("chatRooms").doc(chatRoomId);
    const messageRef = chatRoomRef.collection("messages").doc();
    const batch = firestore().batch();
    batch.set(messageRef, message);
    batch.update(chatRoomRef, {
        lastMessage: message
    });
    await batch
        .commit()
        .catch((error)=>{
            console.log("[ERROR] error sending message",error);
            onError && onError("Error sending your message, please try again later");
        });
}

export async function createRoom(
    currentUsers: User,
    friends: User,
    onError?: (error: string) => void
    ) {
    const chatUser1 = {
        id: currentUsers.id,
        name: currentUsers.name,
        profilePicture: currentUsers.profilePicture,
        email: currentUsers.email,
    }
    const chatUser2 = {
        id: friends.id,
        name: friends.name,
        profilePicture: friends.profilePicture,
        email: friends.email,
    }

    //generate chatroom id
    const chatRoomRef = firestore().collection("chatRooms").doc();
    const chatRoomId = chatRoomRef.id;

    //create firestore batch to update multiple documents
    const batch = firestore().batch();

    const newWelComeMessage = {
        chatRoomId,
        sendBy: chatUser1,
        content: "Welcome to the chatroom",
        timestamp: new Date(),
        createdAt: firestore.Timestamp.now(),
        seen: false,
    }

    //create new chat room
    batch.set(chatRoomRef, {
        users: [chatUser1, chatUser2],
        lastMessage: newWelComeMessage
    });

    //add new message to chatroom
    const messageRef = chatRoomRef.collection("messages").doc();
    batch.set(messageRef, newWelComeMessage);

    //add new chat room to current user chatrooms
    batch.update(firestore().collection("users").doc(currentUsers.id), {
        liked: firestore.FieldValue.arrayRemove(friends.id),
        messagingFriendList: firestore.FieldValue.arrayUnion({
            email: friends.email,
            name: friends.name,
            profilePicture: friends.profilePicture,
            id: friends.id,
            chatRoomId: chatRoomId,
        })
    });

    //add new chat room to friend user chatrooms
    batch.update(firestore().collection("users").doc(friends.id), {
        liked: firestore.FieldValue.arrayRemove(currentUsers.id),
        messagingFriendList: firestore.FieldValue.arrayUnion({
            email: currentUsers.email,
            name: currentUsers.name,
            profilePicture: currentUsers.profilePicture,
            id: currentUsers.id,
            chatRoomId: chatRoomId,
        })
    });
    await batch.commit()
        .catch((error)=>{
            console.log("[ERROR] error creating chatroom",error);
            onError && onError("Error creating chatroom, please try again later");
        });
    return chatRoomId;
}