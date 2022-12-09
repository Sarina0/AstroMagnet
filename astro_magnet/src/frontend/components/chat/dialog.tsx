import {Box, Text} from "native-base";
import type { Message } from "@app/shared/interfaces/message";
import { useContext } from "react";
import { UserContext } from "@app/context/user";
import { formatChatTime } from "@app/shared/actions/time";
import Avatar from "../global/avatar";
import type { User } from "@app/shared/interfaces/user";

interface Props {
    message: Message,
    chatUsers: User[]
}

/**
 * Chat box component
 * @props {Message} pass in the message as props
 * @returns {JSX.Element} returns the chat box component
 */
export default function Dialog(props: Props) {
    const { profile } = useContext(UserContext);
    if (!profile) {
        return null;
    }
    const { content, sendBy, createdAt } = props.message;
    const isCurrentUser = sendBy.id === profile.id;
    const sendByUser = props.chatUsers.find((user) => user.id === sendBy.id);
    return (
        <Box
            flexDirection={isCurrentUser ? "row-reverse" : "row"}
            alignItems={"center"}
        >
            <Box 
                mr={isCurrentUser ? 2 : 3}
                ml={isCurrentUser ? 3 : 2}
            >
                <Avatar
                    src={sendByUser?.profilePicture!}
                    size="sm"
                />
            </Box>
            <Box
                bgColor={isCurrentUser ? "primary" : "secondary"}
                borderBottomRightRadius={isCurrentUser ? 0 : 10}
                borderBottomLeftRadius={isCurrentUser ? 10 : 0}
                borderTopRightRadius={10}
                borderTopLeftRadius={10}
                paddingX={3}
                paddingY={1}
                mb={7}
                flexDirection="column"
                alignSelf={isCurrentUser ? "flex-end" : "flex-start"}
                maxWidth="60%"
            >
                <Text color="white" fontSize="sm">
                    {formatChatTime(createdAt.toDate())}
                </Text>
                <Text
                    color="onSecondary"
                    fontSize="md"
                >
                    {content}
                </Text>
            </Box>
        </Box>
    )
}