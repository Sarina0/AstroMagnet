import React from 'react';
import { StyleSheet, View, Dimensions, Image, Text } from 'react-native';
import Images from "../../theme/images";


interface Props {
    title: string;
}

const EmptyView = (props: Props) => {
    const { title } = props;

    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image style={styles.sadIcon} source={Images.icon_sad}/>
                <Text style={styles.textLabel}>{title || ''}</Text>
            </View>
        </View>
    );
}

export default EmptyView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    sadIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 10,
        opacity: 0.7
    },

    textLabel: {
        fontSize: 20,
        color: 'white',
        opacity: 0.7
    },
    placeImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});
