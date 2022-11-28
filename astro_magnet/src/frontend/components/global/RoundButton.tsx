import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import type { ViewStyle } from 'react-native';

interface Props {
    title: string;
    onPress: () => void;
    style: ViewStyle | ViewStyle[]
}

/**
 * Button component
 * @prop {string} title - of the button
 * @prop {()=>void} onPress - callback function when button is pressed
 * @prop {ViewStyle | ViewStyle[]} style - extra style for button
 */
const RoundButton = (props: Props) => {
    const { title, onPress, style } = props;

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, style]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
};

export default RoundButton;

const styles = StyleSheet.create({
    buttonContainer: {
        height: 48,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9A48D0',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: 'white'
    }
});