import { Text, useToast, Box, Fab, ArrowDownIcon } from "native-base";
import {useContext, useEffect, useState, useRef } from "react";
import { MenuContext } from "@app/context/menu";
import { SafeAreaView } from "react-native";
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
    const [page, setPage] = useState(1);
    const { messages, loading } = useMessage(
        props.route.params.id,
        page,
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

    //hooks to detect message loaded the first time
    const [firstLoad, setFirstLoad] = useState(true);
    useEffect(() => {
        if (firstLoad && !loading) {
            setFirstLoad(false);
        }
    }, [firstLoad, loading]);


    //keep track of keyboard height
    const [isKeyboardShow, setIsKeyboardShow] = useState<boolean>(false);
    const keyboardHeight = useKeyboardHeight();

    //keep track of keyboard show/hide
    useKeyboard((isKeyboardShow) => {
        setIsKeyboardShow(isKeyboardShow);
    })

    function onMessageTopScroll() {
        if (!firstLoad && !loading) {
            setPage(page + 1);
        }
    }


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
        <SafeAreaView className="flex-1">
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
                contentContainerStyle={{
                    flexDirection: "column-reverse",
                    paddingTop: 10,
                }}
                threshold={20}
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
                onScroll={(e)=>{
                    //check if top is reached
                    if (e.nativeEvent.contentOffset.y == 0) {
                        onMessageTopScroll();
                    }
                }}
                showNewItemAlert={false}
            />
            <Input 
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                onSend={onSendMessage}
                style={{
                    marginBottom: isKeyboardShow? keyboardHeight + 0.5 : 5,
                    paddingHorizontal: isKeyboardShow? 0 : 10,
                    borderRadius: isKeyboardShow? 0 : 10,
                    width: "100%",
                }}
            />
        </SafeAreaView>
    )
}

