import firestore from "@react-native-firebase/firestore";
import type { Message } from "@app/shared/interfaces/message";
import { User, Friend } from "@app/shared/interfaces/user";

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

/**
 * check if chat room already exists
 * @param currentUserId - the current user id
 * @param otherUserId - the other user id
 * @returns 
 */
export async function checkIfChatRoomExist(
    currentUser: User,
    otherUserId: string,
) {
    const messageList = currentUser.messagingFriendList;
    const isChatRoomExist = messageList.find((friend) => friend.id === otherUserId);
    if (isChatRoomExist) {
        return isChatRoomExist.chatRoomId;
    }
    return null;
}

export async function createRoom(
    currentUsers: User,
    friend: Friend,
    onError?: (error: string) => void
    ) {
    const chatRoomIdIfExist = await checkIfChatRoomExist(
        currentUsers,
        friend.id!
    );

    //guard against already existing chat room
    if (chatRoomIdIfExist) {
        const chatRoom = await firestore()
            .collection("chatRooms")
            .doc(chatRoomIdIfExist)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    }
                }
                return null;
            }).catch((error)=>{
                console.log("[ERROR] error getting chatroom",error);
                onError && onError("Error getting chatroom, please try again later");
            })
        //return the chat room id
        return chatRoom;
    }

    //create chat user from current user
    const currentChatUser = {
        id: currentUsers.id
    }

    //generate chatroom id
    const chatRoomRef = firestore().collection("chatRooms").doc();
    const chatRoomId = chatRoomRef.id;

    //create firestore batch to update multiple documents
    const batch = firestore().batch();

    //initial message for new chat room
    const newWelComeMessage = {
        chatRoomId,
        sendBy: currentChatUser,
        content: "Welcome to the chatroom",
        timestamp: new Date(),
        createdAt: firestore.Timestamp.now(),
        seen: false,
    }

    //create new chat room
    batch.set(chatRoomRef, {
        users: [currentChatUser, friend],
        lastMessage: newWelComeMessage
    });

    //add new message to chatroom
    const messageRef = chatRoomRef.collection("messages").doc();
    batch.set(messageRef, newWelComeMessage);

    //add new chat room to current user chatrooms
    batch.update(firestore().collection("users").doc(currentUsers.id), {
        messagingFriendList: firestore.FieldValue.arrayUnion({
            ...friend,
            chatRoomId: chatRoomId,
        })
    });

    //add new chat room to friend user chatrooms
    batch.update(firestore().collection("users").doc(friend.id), {
        messagingFriendList: firestore.FieldValue.arrayUnion({
            ...currentChatUser,
            chatRoomId: chatRoomId,
        })
    });

    //execute batch
    await batch.commit()
        .catch((error)=>{
            console.log("[ERROR] error creating chatroom",error);
            onError && onError("Error creating chatroom, please try again later");
        });
    //return the newly created chat room
    return await chatRoomRef.get().then((doc)=>{
        if (doc.exists) {
            return {
                id: doc.id,
                ...doc.data(),
            }
        }
        return null;
    }).catch((error)=>{
        console.log("[ERROR] error getting chatroom",error);
        onError && onError("Error getting chatroom, please try again later");
    })
}