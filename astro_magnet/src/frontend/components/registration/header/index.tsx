import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const RegistrationHeader = () => {
    return (
        <View
            style = { styles.container }
        >
            <Image
                    source={require("../../../../../assets/logo.png")}
                />
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