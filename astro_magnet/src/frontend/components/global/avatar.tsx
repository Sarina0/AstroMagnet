import Image from "@app/frontend/components/global/image";
import {Pressable, useToast} from "native-base";
import ToastDialog from "@app/frontend/components/global/toast";

interface Props {
    src: string;
    size: "sm" | "md" | "lg";
    onPress?: () => void;
}

function getSize(size: string) {
    switch (size) {
        case "sm":
            return 45;
        case "md":
            return 65;
        case "lg":
            return 100;
        default:
            return 30;
    }
}

export default function Avatar(props: Props) {
    const {src, size} = props;
    const toast = useToast();
    return (
        <Pressable
            size={getSize(size)}
            rounded="full"
            overflow="hidden"
            alignSelf="center"
            onPress={props.onPress}
        >
            <Image
                src={src}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                onError={()=>{
                    toast.show({
                        render: () => <ToastDialog message={"failed to load image"} />
                    })
                }}
                resizeMode="cover"
            />
        </Pressable>
    )
}