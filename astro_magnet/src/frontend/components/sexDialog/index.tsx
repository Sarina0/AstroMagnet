import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { Dispatch, SetStateAction } from 'react'
import { User } from '../../../shared/interfaces/user'
import { ColorPalette } from '../../styles/colorPalette'

interface Props {
    setValue: Dispatch<SetStateAction<User.SexType>>, 
    setDialogPicker: Dispatch<SetStateAction<boolean>>
}
const SexDialog = (props: Props) => {

    // Sex Options
    const sexTypes = User.GetSexTypesArray();


    return (
        <View 
            style={styles.dialog}
            onTouchEnd = { () => { props.setDialogPicker(false) } }
        >
            <View
                style={ styles.container}
            >
                <Text
                    style={ styles.closeButton}
                >
                    X
                </Text>
                {
                    sexTypes.map( sex => (
                        <Text
                            style={ styles.button }
                            key={ sex }
                            onPress = {() => { props.setValue( User.getSexType(sex) ) } }
                        >
                            { sex }
                        </Text>
                    ))
                }
            </View>
        </View>
    )
}

export default SexDialog

const styles = StyleSheet.create({
    dialog: {
        position: "absolute",
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: "#0000008F"
    },
    container: {
        width: 300,
        maxHeight: 500, 
        backgroundColor: ColorPalette.DARK_VIOLET_1,
        left: (Dimensions.get('window').width - 300) / 2,
        top: (Dimensions.get('window').height - 500) / 2,
        flex: 1, 
        alignItems: "center",
        justifyContent: "center", 
        borderRadius: 60
    },
    button: {
        width: 200, 
        backgroundColor: ColorPalette.DESATURATED_MAGENTA, 
        margin: 20, 
        fontSize: 20, 
        textAlign: "center", 
        padding: 10, 
        borderRadius: 10
    },
    closeButton: {
        position: "absolute",
        color: "white",
        fontSize: 40,
        right: 0,
        top: 0, 
        marginHorizontal: 30,
        marginTop: 20,
        padding: 10,
        paddingHorizontal: 20,
        borderColor: "white",
        borderWidth: 2, 
        borderRadius: 90
    }
})