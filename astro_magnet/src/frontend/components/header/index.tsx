import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ColorPalette } from '../../styles/colorPalette'

const PageHeader = (props) => {
    return (
        <TouchableOpacity
            style = { styles.container }
            onPress={props.onPress}
        >
            <Image
                style = { styles.logo }
                source = { require("../../../../assets/logo.png")}
            />
            <Text
                style = { styles.title }
            >
                AstroMagnet
            </Text>
        </TouchableOpacity>
    )
}

export default PageHeader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        maxHeight: 70,
        alignItems: "center",
        paddingLeft: 30,
    },
    logo: {
        paddingLeft: 30,
        width: 80,
        height: 80
    },
    title: {
        paddingLeft: 20,
        fontSize: 35,
        fontWeight: "bold",
        color: ColorPalette.DESATURATED_MAGENTA
    }
})
