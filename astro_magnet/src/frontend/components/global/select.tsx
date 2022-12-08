import {Select, Text, CheckIcon, ChevronDownIcon} from "native-base";
import {View, ViewStyle} from "react-native";

/**
 * select props type
 * @property {string | undefined} label - label of the select
 * @property {string | undefined} placeholder - placeholder of the select
 * @property {string} value - value of the select
 * @property {(newValue: string) => void} onChangeText - function to call when the value changes
 * @property {boolean} items - all options of the select
 * @property {string | undefined} className - extra tailwind class for select container
 * @property {ViewStyle | undefined} style - extra style for select container
 */
interface Props {
    label?: string;
    placeholder?: string;
    value: string | null | undefined;
    onValueChange: (newValue: string) => void;
    items: {label: string, value: string}[];
    className?: string;
    style?: ViewStyle | ViewStyle[];
}

/**
 * select component
 * @prop {string | undefined} label - label of the select if has
 * @prop {string | undefined} placeholder - placeholder of the select if has
 * @prop {string} value - value of the select
 * @prop {(newValue: string) => void} onValueChange - function to call when the select value changes
 * @prop {boolean | undefined} items - all options of the select
 * @prop {string | undefined} className - extra tailwind class for select container
 * @prop {ViewStyle | undefined} style - extra style for select container
 * @returns {JSX.Element} select component
 */
export default function SelectComponent(props: Props) {
    return(
        <View className={`mt-2 ${props.className}`} style={props.style}>
            <Text
                color="onSecondary"
                mb={2}
                fontSize="md"
                fontWeight="bold"
            >
                {props.label}
            </Text>
            <Select
                bgColor="secondary"
                color="onSecondary"
                placeholderTextColor="indigo.900"
                placeholder={props.placeholder}
                onValueChange={props.onValueChange}
                selectedValue={props.value??undefined}
                defaultValue={props.value??undefined}
                borderRadius={7}
                borderColor="transparent"
                alignItems="center"
                fontSize="md"
                fontWeight="bold"
                dropdownIcon={<ChevronDownIcon size={5} color="indigo.900" mr={2}/>}
                _selectedItem={{
                    bg: "onSecondary",
                    _text: {
                        color: "secondary",
                        fontWeight: "bold"
                    },
                    endIcon: <CheckIcon size={5}/>
                }}
                _item={{
                    bg: "transparent",
                    _text: {
                        fontWeight: "bold"
                    }
                }}
            >
                {props.items.map((item, index) => (
                    <Select.Item 
                        label={item.label} 
                        value={item.value} 
                        key={index}
                        fontSize={20}
                    />
                ))}
            </Select>
        </View>
    )
}