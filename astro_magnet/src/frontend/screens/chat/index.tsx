import { Button, StyleSheet, Text } from 'react-native'
import { Dispatch, SetStateAction } from 'react'
import Background from '../../components/background';
import { ColorPalette } from '../../styles/colorPalette';
import PageHeader from '../../components/header';


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

    return (
        <Background>
            <PageHeader />
            <Text style={ styles.title }>Chat Screen</Text>
            <Button title="Hide menu" onPress={() => {setMenuVisible(!menuVisible)} }/>
        </Background>
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