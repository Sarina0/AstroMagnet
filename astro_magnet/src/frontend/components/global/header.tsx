import React from 'react'
import {Box, Text, Image} from "native-base";
import {Dimensions} from "react-native";

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
    const width=Dimensions.get('window').width;
    const fontSize = width > 400 ? 25 : width > 300 ? 20 : 15;
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
                    fontSize={fontSize}
                    textAlign="center"
                >
                    AstroMagnet
                </Text>
            </Box>
            <Box flex={0.5}></Box>
        </Box>
    )
}

export default PageHeader
