import { StyleSheet } from 'react-native'
import React from 'react'
import { ColorPalette } from '@app/theme/colors';
import {Box, Text, Image} from "native-base";

/**
 * props type for PageHeader component
 * @property {()=>void} onPress - callback function when logo is pressed
 */
interface Props {
    onPress?: () => void;
}

/**
 * screen header component for main screens
 * @prop {()=>void} onPress - callback function when logo is pressed
 * @returns 
 */
const PageHeader = (props: Props) => {
    return (
        <Box
            flexDirection="row"
            alignItems="center"
            paddingX={2}
            width="100%"
        >
            <Box
                flex={1}
            >
                <Image
                    width={70}
                    height={70}
                    source = { require("../../../../assets/logo.png")}
                    alt="logo"
                    resizeMode="contain"
                />
            </Box>
            <Box
                flex={2}
            >
                <Text
                    fontWeight="bold"
                    color="tertiary"
                    fontSize="3xl"
                >
                    AstroMagnet
                </Text>
            </Box>
            <Box flex={0.5}></Box>
        </Box>
    )
}

export default PageHeader
