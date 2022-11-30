import { Text, useToast, Box, Fab, ArrowDownIcon} from "native-base";
import {useContext, useEffect, useState, useRef } from "react";
import { MenuContext } from "@app/context/menu";
import SafeArea from "@app/frontend/components/global/safeArea";
import useMessage from "@app/hooks/useMessage";
import ToastDialog from '@app/frontend/components/global/toast';
import Input from "@app/frontend/components/chat/chatInput";
import Dialog from "@app/frontend/components/chat/dialog";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import { sendMessage } from "@app/controller/message";
import type { Message } from "@app/shared/interfaces/message";
import { UserContext } from "@app/context/user";
import firestore from "@react-native-firebase/firestore";
import {AutoScrollFlatList} from "react-native-autoscroll-flatlist";
import useKeyboardHeight from "@app/hooks/useKeyboardHeight";
import useKeyboard from "@app/hooks/useKeyboard";
import { ColorPalette } from "@app/theme/colors";

export default function Room(props: {route: {params: {id: string}}}) {
    const toast = useToast();
    const listRef = useRef<AutoScrollFlatList<Message>>(null);
    const { messages, loading } = useMessage(
        props.route.params.id,
        (error) => {
            toast.show({
                render: () => <ToastDialog message={error} />,
            });
        } 
    );
    const [message, setMessage] = useState("");
    const { profile } = useContext(UserContext);

    const { setMenuVisible } = useContext(MenuContext);
    useEffect(()=>{

        //set navigation bar to be invisible when enter room
        setMenuVisible(false);

        //set navigation bar to be visible when leave room
        return (
            () => {
                setMenuVisible(true);
            }
        )
    }, []);

    //keep track of keyboard height
    const [isKeyboardShow, setIsKeyboardShow] = useState<boolean>(false);
    const keyboardHeight = useKeyboardHeight();

    //keep track of keyboard show/hide
    useKeyboard((isKeyboardShow) => {
        setIsKeyboardShow(isKeyboardShow);
    })

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
                ref={listRef}
                initialNumToRender={10}
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
                    paddingBottom: isKeyboardShow ? 0 : 10,
                }}
                newItemAlertMessage={(newItem) => `New message: +${newItem}`}
                newItemAlertContainerStyle={{
                    backgroundColor: ColorPalette.DARK_VIOLET_2,
                }}
                newItemAlertTextStyle={{
                    color: ColorPalette.SOFT_MAGENTA,
                }}
                indicatorComponent={
                    <Fab
                        position="absolute"
                        bottom={100}
                        right={30}
                        size="md"
                        icon={<ArrowDownIcon size="sm" color="onSecondary" />}
                        backgroundColor="secondary"
                        onPress={()=>listRef.current?.scrollToEnd()}
                    />
                }
                onMagicTap={() => listRef.current?.scrollToEnd()}
            />
            <Input 
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                onSend={onSendMessage}
            />
            <Box
                style={{
                    height: isKeyboardShow ? keyboardHeight + 1: 5,
                }}
            />
        </SafeArea>
    )
}

