import {Box, KeyboardAvoidingView, Text } from "native-base";
import {useContext, useEffect, useState, useRef} from "react";
import { MenuContext } from "@app/context/menu";
import { FlatList, Platform, Keyboard, View, Dimensions} from "react-native";
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
import {AutoScrollFlatList} from "react-native-autoscroll-flatlist";

export default function Room(props: {route: {params: {id: string}}}) {
    const { setMenuVisible } = useContext(MenuContext);
    const [isKeyboardShow, setIsKeyboardShow] = useState<boolean>(false);
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

    useEffect(()=>{
        const keyboardDidShow = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            () => {
                setIsKeyboardShow(true);
            }
        );

        const keyboardDidHide = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                setIsKeyboardShow(false);
            }
        );

        return () => {
            keyboardDidShow.remove();
            keyboardDidHide.remove();
        }
    })

    useEffect(() => {
        listRef.current && listRef.current.scrollToEnd({animated: false});
        console.log("trigger");
    }, [
        messages,
        loading
    ]);

    const { height } = Dimensions.get("window");

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
            <AutoScrollFlatList
                data={messages}
                renderItem={({item}) => 
                    <Dialog
                        {...item}
                    />
                }
                threshold={20}
                ListHeaderComponent={() => 
                    <Text color="onSecondary" fontSize="md" textAlign="center" my={2}>
                        start conversation
                    </Text>
                }
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                    paddingBottom: isKeyboardShow ? 0 : 10,
                }}
            />
            <KeyboardAvoidingView
                behavior="padding"
            >
                <Input 
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                    onSend={onSendMessage}
                />
                <View
                    style={{
                        height: isKeyboardShow ? height * 0.15 : 5,
                    }}
                />
            </KeyboardAvoidingView>   
        </SafeArea>
    )
}

