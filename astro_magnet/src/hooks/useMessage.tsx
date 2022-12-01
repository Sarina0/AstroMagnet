import { useState, useEffect, useContext } from "react";
import { UserContext } from "@app/context/user";
import type { Message } from "@app/shared/interfaces/message";
import firestore from "@react-native-firebase/firestore";
import { FireDoc } from "@app/shared/interfaces/firebase";

/**
 * hook to fetch all messages of a channel
 * @param chatRoomId - chat room id
 * @param onError - callback function to handle network error
 * @return {Message[]} - a list of messages
 * @return {boolean} - fetch loading state
 */
export default function useMessage(
    chatRoomId: string,
    onError?:(error:string)=>void
) {
    const {profile} = useContext(UserContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {

        //guard against unauthenticated user
        if (!profile) {
            setLoading(false); 
            return 
        }

        //guard against unauthorized access to chatroom(user not in chatroom)
        const userMessageList = profile.messagingFriendList;
        const isUserInChatRoom = userMessageList.find((user) => user.chatRoomId === chatRoomId);
        if (!isUserInChatRoom) {
            setLoading(false); 
            return 
        }

        //get messages from firestore
        const chatRoomRef = firestore().collection("chatRooms").doc(chatRoomId);
        const messagesRef = chatRoomRef.collection("messages").orderBy("createdAt", "asc");
        const unsubscribe = messagesRef
            .onSnapshot((snapshot) => {
                const list: FireDoc[] = [];
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setMessages(list as Message[]);
                setLoading(false);
            }, (error) => {
                setLoading(false);
                console.log("[ERROR] error fetching messages:", error);
                onError && onError("Error fetching messages");
            });
        return unsubscribe;
    }, [chatRoomId, profile]);

    return {
        /** current chat room messages */
        messages,

        /** fetch loading state */
        loading
    }
}



