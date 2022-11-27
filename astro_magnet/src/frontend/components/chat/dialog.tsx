import {Box, Text} from "native-base";
import type { Message } from "@app/shared/interfaces/message";

interface Props extends Message {
    isCurrentUser: boolean
}

export default function Dialog(props: Props) {
    const {  content } = props;

    return (
        <Box
            bgColor={props.isCurrentUser ? "primary" : "secondary"}
            borderLeftRadius={props.isCurrentUser ? 0 : 20}
            borderRightRadius={props.isCurrentUser ? 20 : 0}
            borderTopRightRadius={20}
            borderTopLeftRadius={20}
            borderBottomRightRadius={20}
            borderBottomLeftRadius={20}
            p={4}
            mb={4}
            alignSelf={props.isCurrentUser ? "flex-end" : "flex-start"}
        >
            <Text
                color="onSecondary"
                fontSize={20}
            >
                {content}
            </Text>
        </Box>
    )
}