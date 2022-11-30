import {Box, Text, Pressable} from "native-base";
import Image from "@app/frontend/components/global/image";

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

    /**
     * last message
     */
    lastMessage?: string;

    /**
     * onPress
     */
    onPress?: () => void;
}

/**
 * Friend card used to display the information about the friend
 * @todo Add onClick navigation
 * @returns JSX element
 */
const FriendCard = (props: Props) => {
    const { profilePicture, personName, lastMessageTime = "" } = props;

    return (
        <Pressable 
            onPress={props.onPress} 
            bgColor="tertiary" borderRadius="lg"
            p={3} flex={1}
            flexDirection="row" alignItems="center"
            my={2}
        >
            <Image 
                src={ profilePicture }
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                }}
            />
            <Box width="full">
                <Text 
                    fontSize={20}
                    color="secondary"
                    fontWeight="bold"
                    ml={5}
                >
                    { personName }
                </Text>
                <Box
                    flexDirection="row"
                    ml={5}
                    mt={2}
                    width="full"
                    alignItems="center"
                >
                    {
                        props.lastMessage && (
                            <Text
                                fontSize="sm"
                                color="indigo.900"
                                ellipsizeMode='tail'
                                flex={0.35}
                                numberOfLines={1}
                                isTruncated
                            >
                                { props.lastMessage }...
                            </Text>
                        )
                    }
                    {
                        lastMessageTime &&
                        <Text
                            fontSize="sm"
                            color="indigo.900"
                            flex={0.65}
                        >
                            { lastMessageTime }
                        </Text>
                    }
                </Box>
            </Box>
        </Pressable>
    )
}

export default FriendCard;
