import { Pressable, Text, View, Image } from "react-native";
import { signInWithGoogle } from "@app/controller/auth";
import Images from "@app/theme/images";

interface Props {
    onError: (message: string) => void;
}

export default function SignInButton(props: Props) {
    return (
        <View className="flex-1 justify-end p-14 flex-col items-center">
            <Pressable
                className="flex-row items-center justify-between bg-purple-600/30 p-3"
                onPress={signInWithGoogle.bind(null, props.onError)}
            >
                <View className="flex items-center">
                    <Image
                        source={Images.google_icon}
                        className="w-8 h-8"
                        resizeMode="contain"
                    />
                </View>
                <Text className="text-white font-bold text-lg">
                    Get started with Google
                </Text>
            </Pressable>
        </View>
    );
}