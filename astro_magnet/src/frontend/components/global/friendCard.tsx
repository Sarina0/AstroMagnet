import {Box, Text, Pressable} from "native-base";
import Avatar from "@app/frontend/components/global/avatar";

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
            paddingY={2} paddingX={3} 
            flex={1} my={2}
            flexDirection="row" alignItems="center"
        >
            <Avatar
                src={profilePicture}
                size="sm"
            />
            <Box width="full">
                <Text 
                    fontSize={15}
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
