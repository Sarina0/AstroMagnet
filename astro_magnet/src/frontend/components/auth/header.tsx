import { Text, Box, Image } from 'native-base';
import React from 'react'
import Images from '@app/theme/images';

/**
 * header of register screen
 * @returns {JSX.Element} registration header component
 */
const RegistrationHeader = () => {
    return (
        <Box
            flexDirection="column"
        >
            <Image 
                width={150}
                height={150}
                source={Images.logo} 
                alt="logo"
                alignSelf="center"
            />
            <Text
                fontWeight="bold"
                color="white"
                textAlign="center"
                fontSize="4xl"
            >
                AstroMagnet
            </Text>
        </Box>
    )
}

export default RegistrationHeader
