import React from 'react';
import { Text, Icon, Box } from "native-base";
import {MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * empty view component props type
 * @property {string} title - title of the empty view
 */
interface Props {
    title: string;
}

/**
 * component to show when there is no data
 * @prop {string} title - title of the empty view
 * @returns {JSX.Element} empty view component
 */
const EmptyView = (props: Props) => {
    const { title } = props;

    return (
        <Box
            flex={1}
            justifyContent="center"
            alignItems="center"
        >
            <Icon
                as={MaterialCommunityIcons}
                name="emoticon-sad-outline"
                color="onSecondary"
                size="3xl"
                alignSelf="center"
            />
            { title &&
                <Text 
                    color="onSecondary" 
                    fontSize="lg"
                    textAlign="center"
                >
                    {title}
                </Text>
            }
        </Box>
    );
}

export default EmptyView;
