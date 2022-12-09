import { Box, Text, Icon } from "native-base";
import { getAstrologicalSign } from "@app/shared/actions/time";
import { getAge } from "@app/shared/actions/time";
import Image from "../global/image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getFirstName } from "@app/shared/actions/string";
import { getAstroIconName } from "@app/shared/actions/icon";
import type { User } from "@app/shared/interfaces/user";
import { getCompatibility } from "@app/shared/actions/compatility";
import { useContext } from "react";
import { UserContext } from "@app/context/user";
import { Dimensions } from "react-native";

/**
 * card component to use inside swipeable card component to display user
 * @prop {User} item - user to display
 * @returns {JSX.Element} card component
 */
export default function Card({ item }: { item: User }) {

    const width = Dimensions.get("window").width;

    //get zodiac sign from user date of birth
    const iconName = getAstroIconName(
        getAstrologicalSign(item.dateAndTimeOfBirth!)
    );

    //get user age from date of birth
    const age = getAge(item.dateAndTimeOfBirth!);

    //get first name from user name
    const firstName = getFirstName(item.name!);

    const { profile } = useContext(UserContext);

    return (
        <Box 
            width="100%"
            height="90%"
            rounded={30}
            overflow="hidden"
            mt={5}
        >
            <Image
                src={item.profilePicture}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            />
            <Box
                padding={2}
                paddingX={4}
                backgroundColor="rgba(0,0,0,0.5)"
                position="absolute"
                bottom={0}
                borderBottomLeftRadius={30}
                borderBottomRightRadius={30}
                overflow={"hidden"}
                flex={1}
                width="100%"
                flexDirection="row"
                alignItems="center"
            >
                <Box
                    flex={1}
                    paddingX={2}
                >
                    <Box
                        flexDirection="row"
                        alignItems="center"
                    >
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color="white"
                            mr={2}
                        >
                            {firstName}.
                        </Text>
                        <Text
                            fontSize="md"
                            color={"white"}
                            mr={2}
                        >
                            {age}
                        </Text>
                        <Icon
                            color="yellow.400"
                            as={MaterialCommunityIcons}
                            name={iconName}
                            size="md"
                        />
                    </Box>
                    <Text
                        fontSize="sm"
                        color="white"
                    >
                        Born: {item.placeOfBirth}
                    </Text>
                </Box>
                <Box 
                    flex={1}
                    flexDirection="column"
                >   
                    <Text
                        fontSize="md"
                        fontWeight="bold"
                        color="white"
                        textAlign="center"
                    >
                        compatibility
                    </Text>
                    <Text
                        fontSize="md"
                        fontWeight="bold"
                        color="white"
                        textAlign="center"
                    >
                        {getCompatibility(profile!, item)}% 
                    </Text>
                </Box>
            </Box>
        </Box>
    )
}