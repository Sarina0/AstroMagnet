import {Text, Actionsheet, ChevronDownIcon, useDisclose, Box} from "native-base";
import {View, ViewStyle, Pressable} from "react-native";

/**
 * multi select props type
 * @property {string | undefined} label - label of the multi select
 * @property {string | undefined} placeholder - placeholder of the multi select
 * @property {string[]} value - value of the multi select
 * @property {(newValue: string[]) => void} onValueChange - function to call when the value changes
 * @property {{label: string, value: string}[]} items - items of the multi select
 * @property {string | undefined} className - class name of the
 * @property {ViewStyle | undefined} style - style of the multi select
 */
interface Props {
    label?: string;
    placeholder?: string;
    value: string[];
    onValueChange: (newValue: string[]) => void;
    items: {label: string, value: string}[];
    style?: ViewStyle;
}

/**
 * select component that supports selecting multiple items
 * @prop {string | undefined} label - label of the select if has
 * @prop {string | undefined} placeholder - placeholder of the select if has
 * @prop {string[]} value - value of the select
 * @prop {(newValue: string[]) => void} onValueChange - function to call when the select value changes
 * @prop {{label: string, value: string}[]} items - all items of the select
 * @prop {ViewStyle | undefined} style - extra style for select container
 * @returns {JSX.Element} multi select component
 */
export default function MultiSelectComponent(props: Props) {
    const {isOpen, onOpen, onClose} = useDisclose();
    return(
        <View className="mt-2" style={props.style}>
            <Text
                color="onSecondary"
                mb={2}
                fontSize="md"
                fontWeight="bold"
            >
                {props.label}
            </Text>
            <Pressable
            onPress={onOpen}
            >
                <Box
                    bgColor="secondary"
                    borderRadius={7}
                    borderColor="transparent"
                    alignItems="center"
                    flexDirection="row"
                    justifyContent="space-between"
                    p={2}
                >
                    <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={props.value.length>0?"onSecondary":"indigo.900"}
                    >
                        {props.value.length==0?props.placeholder:props.value.join(", ")}
                    </Text>
                    <ChevronDownIcon size={5} color="indigo.900"/>
                </Box>
            </Pressable>
            <Actionsheet
                isOpen={isOpen}
                onClose={onClose}
            >
                <Actionsheet.Content>
                    {props.items.map((item, index) => (
                        <Actionsheet.Item 
                            key={index}
                            bg={props.value.includes(item.value)?"onSecondary":"transparent"}
                            _text={{
                                color: props.value.includes(item.value)?"secondary":"onSecondary",
                            }}
                            onPress={() => {
                                if(props.value.includes(item.value)) {
                                    props.onValueChange(props.value.filter(value => value!=item.value));
                                } else {
                                    props.onValueChange([...props.value, item.value]);
                                }
                            }}
                        >  
                            <Text>{item.label}</Text>
                        </Actionsheet.Item>
                    ))}
                </Actionsheet.Content>
            </Actionsheet>
        </View>
    )
}
