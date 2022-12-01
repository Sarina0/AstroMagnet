import {useEffect} from "react";
import {Keyboard, Platform} from "react-native";

/**
 * hook to detect keyboard show and hide
 * @param onKeyboardShow callback function when keyboard is shown
 * @param onKeyboardHide callback function when keyboard is hidden
 */
export default function useKeyboard(
    onKeyboardChange: (isKeyboardVisible: boolean) => void
) {
    useEffect(()=>{
        const keyboardDidShow = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            () => {
                onKeyboardChange(true);
            }
        );

        const keyboardDidHide = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                onKeyboardChange(false);
            }
        );

        return () => {
            keyboardDidShow.remove();
            keyboardDidHide.remove();
        }
    })
}
