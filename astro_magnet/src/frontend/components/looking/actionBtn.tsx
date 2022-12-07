import { Icon, Box } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, Animated, ViewStyle } from "react-native";

interface Props {
    variant: "like" | "dislike";
    style: Animated.WithAnimatedValue<ViewStyle>;
}

export default function ActionButton(props: Props) {
    const screenHeight = Dimensions.get("screen").height;
    return (
        <Animated.View
            style={[{
                width: 70,
                height: 70,
                position: "absolute",
                top: screenHeight / 2 - 200,
                right: props.variant === "like" ? 2.25 : undefined,
                left: props.variant === "dislike" ? 2.25 : undefined,
                zIndex: 100,
            },props.style]}
        >
            <Box
                backgroundColor={
                    props.variant === "like" ? "secondary" : "onSecondary"
                }
                width={75}
                height={75}
                borderRadius="full"
                justifyContent="center"
                alignItems="center"
                zIndex={100}
                shadow={9}
            >
                <Icon 
                    as={MaterialCommunityIcons} 
                    name={
                        props.variant === "like" ? "thumb-up" : "thumb-down"
                    }
                    color={props.variant === "like" ? "onSecondary" : "secondary"}
                    size="lg"
                />
            </Box>
        </Animated.View>
    )
}