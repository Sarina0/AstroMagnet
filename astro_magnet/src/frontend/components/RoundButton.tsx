import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import { ReactNode } from 'react'

interface Props {
    title: string;
    onPress: () => void;
    style: Object,
}

/**
 * Set the background image of the application
 */
const RoundButton = (props: Props) => {
    const { title, onPress, style } = props;

    return (
        <TouchableOpacity
            style={[styles.buttonContainer, props.style]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

export default RoundButton

const styles = StyleSheet.create({
    buttonContainer: {
        height: 48,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9A48D0',
    },
    buttonText: {
        fontSize: 16,
        color: 'white'
    }
})
