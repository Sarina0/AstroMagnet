import {
    StyleSheet,
    Text, View,
} from 'react-native'
import { ColorPalette } from '@app/theme/colors'
import RoundButton from "@app/frontend/components/global/RoundButton";

const SelectScreen = (props: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.banner}>
                <Text style={styles.bannerText}>
                    Find Compatible Companions
                </Text>
            </View>
            <Text style={styles.descriptionText}>
                Start looking for compatible people around you
            </Text>
            <View style={styles.footer}>
                <RoundButton
                    style={styles.footerButton}
                    title={'Liked People List'}
                    onPress={props.onLikedPeople}
                />
                <RoundButton
                    style={[styles.footerButton, {marginTop: 15}]}
                    title={'Start Looking'}
                    onPress={props.onStartLooking}
                />
            </View>
        </View>
    )
}

export default SelectScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30
    },
    banner: {
        backgroundColor: ColorPalette.VIOLET,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginVertical: 20
    },
    bannerText: {
        fontWeight: '600',
        fontSize: 30,
        color: ColorPalette.SOFT_MAGENTA,
        textAlign: "center"
    },
    descriptionText: {
        fontSize: 18,
        color: 'white'
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        width: '100%'
    },
    footerButton: {
        width: '100%'
    }
})
