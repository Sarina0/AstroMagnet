import { Pressable, Text, Image, Box } from "native-base";
import { signInWithGoogle } from "@app/controller/auth";
import Images from "@app/theme/images";

interface Props {
    onError: (message: string) => void;
}

export default function SignInButton(props: Props) {
    return (
        <Box 
            flex={1}
            justifyContent="flex-end"
            alignItems="center"
            pb={10}
        >
            <Pressable
                onPress={signInWithGoogle.bind(null, props.onError)}
                justifyContent="center"
                alignItems="center"
                backgroundColor="secondaryOpaque"
                flexDirection="row"
                paddingX={5}
                paddingY={2}
                rounded="md"
            >
                <Box>
                    <Image
                        source={Images.google_icon}
                        width={10}
                        height={10}
                        mr={2}
                        alt="google icon"
                        resizeMode="contain"
                    />
                </Box>
                <Text
                    color="white"
                    fontSize="md"
                    fontWeight="bold"
                >
                    get start with Google
                </Text>
            </Pressable>
        </Box>
    );
}