import {Box, KeyboardAvoidingView, Text } from "native-base";
import {useContext, useEffect, useState, useRef} from "react";
import { MenuContext } from "@app/context/menu";
import { FlatList, Platform } from "react-native";
import SafeArea from "@app/frontend/components/global/safeArea";
import useMessage from "@app/hooks/useMessage";
import { useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';
import Input from "@app/frontend/components/chat/chatInput";
import Dialog from "@app/frontend/components/chat/dialog";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import { sendMessage } from "@app/controller/message";
import type { Message } from "@app/shared/interfaces/message";
import { UserContext } from "@app/context/user";
import firestore from "@react-native-firebase/firestore";

export default function Room(props: {route: {params: {id: string}}}) {
    const { setMenuVisible } = useContext(MenuContext);
    const toast = useToast();
    const { messages, loading } = useMessage(
        props.route.params.id,
        (error) => {
            toast.show({
                render: () => <ToastDialog message={error} />,
            });
        } 
    );
    const [message, setMessage] = useState("");
    const listRef = useRef<FlatList>(null);
    const { profile } = useContext(UserContext);

    useEffect(()=>{
        setMenuVisible(false);
        return (
            () => {
                setMenuVisible(true);
            }
        )
    }, []);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollToEnd({animated: false});
        }
    }, [messages]);

    async function onSendMessage() {
        if (!profile) return;
        if (message.length > 0) {
            const newMessage: Message = {
                chatRoomId: props.route.params.id,
                sendBy: {
                    id: profile.id!,
                    name: profile.name!,
                    profilePicture: profile.profilePicture!,
                    email: profile.email!,
                },
                content: message,
                timestamp: new Date(),
                createdAt: firestore.Timestamp.now(),
                seen: false
            }
            await sendMessage(newMessage, (error) => {
                toast.show({
                    render: () => <ToastDialog message={error} />,
                });
            });
            setMessage("");
        } 
        return;
    }

    return (
        <SafeArea>
            {loading && <LoadingOverlay/>}
            <KeyboardAvoidingView 
                flex={1}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
                padding={0}
            >
                <Box flex={1}>
                    <Text
                        fontSize="sm"
                        color="onSecondary"
                        textAlign="center"
                        my={3}
                    >
                        Start conversation
                    </Text>
                    <FlatList
                        ref={listRef}
                        data={messages}
                        renderItem={({item}) => 
                            <Dialog
                                {...item}
                            />
                        }
                        keyExtractor={(item) => item.id}
                        style={{flex: 1, paddingHorizontal: 10}}
                    />
                    <Box
                        paddingX={3}
                    >
                        <Input 
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message"
                            onSend={onSendMessage}
                        />
                    </Box>   
                </Box>
            </KeyboardAvoidingView>
        </SafeArea>
    )
}

