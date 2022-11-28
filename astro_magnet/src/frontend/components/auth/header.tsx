import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Images from '@app/theme/images';

/**
 * header of register screen
 * @returns {JSX.Element} registration header component
 */
const RegistrationHeader = () => {
    return (
        <View
        style = { styles.container }
        >
            <Image source={Images.logo} />
            <Text style = { styles.title }>
                AstroMagnet
            </Text>
        </View>
    )
}

export default RegistrationHeader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        maxHeight: "80%"
    },
    title: {
        fontSize: 50,
        fontWeight: "bold",
        color: "white"
    }
})