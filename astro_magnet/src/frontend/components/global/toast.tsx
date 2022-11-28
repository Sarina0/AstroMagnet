import {Box, Text } from "native-base";

interface Props {
    message: string;
}

/**
 * toast dialog component to use with native-base toast
 * @returns 
 */
export default function ToastDialog(props: Props) {
    return (
        <Box 
            bg="red.500" px={2} 
            rounded="md" shadow={2}
            py={3} mb={30}
        >
            <Text 
                color="lightText" 
                fontWeight="bold"
                fontSize={20}
            >
                {props.message}
            </Text>
        </Box>
    )
}