import { StyleSheet, Text, View, Image } from 'react-native'
import { ColorPalette } from '@app/theme/colors';

interface Props {
    /**
     * Url of the profile picture
     */
    profilePicture: string;

    /**
     * Name of Person
     */
    personName: string;

    /**
     * Last message received
     */
    lastMessageTime?: string;

}

/**
 * Friend card used to display the information about the friend
 * @todo Add onClick navigation
 * @returns JSX element
 */
const FriendCard = (props: Props) => {
    const { profilePicture, personName, lastMessageTime = "" } = props;

    return (
        <View style={ styles.container }>
            <Image 
                style={ styles.image }
                source={{
                    uri: profilePicture
                }}/>
            <View style={ styles.textContainer }>
                <Text className="text-lg text-secondary">
                    { personName }
                </Text>
                {
                    lastMessageTime !== "" &&
                    <Text style={ styles.message}>
                        { lastMessageTime }
                    </Text>
                }
            </View>
        </View>
    )
}

export default FriendCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', 
        width: 373,
        maxHeight: 83,
        backgroundColor: ColorPalette.DESATURATED_MAGENTA,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 11
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 15
    },
    textContainer: {
        paddingLeft: 10,
        flex: 1,
        justifyContent: 'space-between'
    },
    titleName: {
        fontSize: 20,
        fontWeight: "bold",
        color: ColorPalette.DARK_VIOLET_2
    },
    message: {
        fontSize: 15,
        color: ColorPalette.DARK_VIOLET_2,
        marginTop: 10
    }
})