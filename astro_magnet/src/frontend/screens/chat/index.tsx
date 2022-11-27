import { Button, StyleSheet, Text } from 'react-native'
import { Dispatch, SetStateAction } from 'react'
import { ColorPalette } from '@app/theme/colors';
import PageHeader from '@app/frontend/components/global/header';
import SafeArea from "@app/frontend/components/global/safeArea";
import Dialog from '@app/frontend/components/chat/dialog';
import ChatInput from "@app/frontend/components/chat/chatInput";
import {useState} from "react";

/**
 * ChatScreen props type
 * @property {boolean} menuVisible - menu visibility
 * @property {Dispatch<SetStateAction<boolean>>} setMenuVisible - menu visibility toggler
 */
interface Props {
  /**
   * Change the state of the menu being displayed or not
   */
  setMenuVisible: Dispatch<SetStateAction<boolean>>;

  /**
   * boolean to display wether the menu should be visible or not
   */
  menuVisible: boolean

}

const ChatScreen = (props: Props) => {
  const { setMenuVisible, menuVisible } = props;
  const [newMessage, setNewMessage] = useState<string>("");

  return (
    <SafeArea>
        <PageHeader />
        <Text style={ styles.title }>Chat Screen</Text>
        <ChatInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message"
            onSend={() => {}}
        />
        <Button title="Hide menu" onPress={() => {setMenuVisible(!menuVisible)} }/>
    </SafeArea>    
 )
}

export default ChatScreen

const styles = StyleSheet.create({
    title: {
        // flex: 1,
        display: 'flex',
        fontSize: 40,
        color: ColorPalette.SOFT_MAGENTA,
        textAlign: "center"
    },
})