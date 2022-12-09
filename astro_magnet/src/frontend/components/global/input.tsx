import { Input, Text } from "native-base";
import { Pressable, View, ViewStyle } from "react-native";

/**
 * input props type
 * @property {string | undefined} label - label of the input
 * @property {string | undefined} placeholder - placeholder of the input
 * @property {string} value - value of the input
 * @property {(value: string) => void} onChangeText - function to call when the value changes
 * @property {boolean} isRequired - whether the input is required
 * @property {"text" | "password"} type - type of the input
 * @property {string | undefined} className - class name of the input
 * @property {ViewStyle | undefined} style - style of the input
 * @property {boolean | undefined} isDisabled - whether the input is disabled
 */
interface Props {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText?: (text: string) => void;
    isRequired?: boolean;
    type?: "text" | "password"
    className?: string;
    style?: ViewStyle;
    disabled?: boolean;
}

/**
 * input component
 * @prop {string | undefined} label - label of the input if has
 * @prop {string | undefined} placeholder - placeholder of the input if has
 * @prop {string} value - value of the input
 * @prop {(text: string) => void} onChangeText - function to call when the input value changes
 * @prop {boolean | undefined} isRequired - if the input is required or not(default: true)
 * @prop {"text" | "password" | undefined} type - type of the input(default: "text")
 * @prop {string | undefined} className - extra tailwind class for input container
 * @prop {ViewStyle | undefined} style - extra style for input container
 * @prop {boolean | undefined} disabled - if the input is disabled or not(default: false)
 * @returns 
 */
export default function InputComponent(props: Props) {
    return (
        <View className={`mt-2 ${props.className}`} style={props.style}>
            { props.label && <Text 
                color="onSecondary" 
                mb={2} 
                fontSize="md"
                fontWeight="bold"
            >
                {props.label }
            </Text> }
            <Input 
                bgColor="secondary"
                color="onSecondary"
                placeholder={props.placeholder}
                placeholderTextColor="indigo.900"
                onChangeText={props.onChangeText}
                value={props.value}
                isRequired={props.isRequired??true}
                type={props.type??'text'}
                borderRadius={7}
                borderColor="transparent"
                fontSize="md"
                fontWeight="bold"
                isDisabled={props.disabled}
                _disabled={{
                    bgColor: "secondary",
                    color: "onSecondary",
                    opacity: 1
                }}
            />
        </View>
    )
}