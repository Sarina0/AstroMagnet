import {Text, Box, Pressable} from "native-base";
import { ViewStyle } from "react-native";
import DatePicker from "react-native-date-picker";
import {ReactNode, useState} from "react";
import moment from "moment";

interface Props {
    label?: string,
    value: Date | null | undefined,
    onChange: (value: Date) => void,
    style?: ViewStyle
}

/**
 * text to display time that is selected
 * @prop {string} time - time to display
 * @prop {() => void} openPicker - function to open the accompanying date/time picker
 * @returns {ReactNode} - time text component
 */
const TimeText = (props: {
    time: string, 
    openPicker?: ()=>void
}) => {
    return (
        <Text
            color="onSecondary"
            fontSize="md"
            fontWeight="bold"
            onPress={props.openPicker}
        >
            {props.time}
        </Text>
    )
}

/**
 * placeholder text for when no datetime is selected
 * @prop {string} text - placholder text to display
 * @prop {() => void} openPicker - function to open the accompanying date/time picker
 * @returns {ReactNode} - placholder text component
 */
const PlaceholderText = (props: {
    text: string
    openPicker: ()=>void
}) => {
    return (
        <Text
            color="indigo.900"
            fontSize="md"
            fontWeight="bold"
            onPress={props.openPicker}
        >
            {props.text}
        </Text>
    )
}

/**
 * Date and time picker component
 * @prop {string | undefined} label - label of the date/time picker
 * @prop {Date | null | undefined} value - value of the date/time picker
 * @prop {(value: Date) => void} onChange - function to call when the value changes
 * @prop {ViewStyle | undefined} style - extra style for the date/time picker container
 * @returns {ReactNode} - date/time picker component
 */
export default function DatePickerComponent(props: Props) {

    //open and close state of pickers
    const [{
        showDatePicker,
        showTimePicker,
    }, toggleShow] = useState({
        showDatePicker: false,
        showTimePicker: false,
    });

    /**
     * get list of Text components that display selected day, month, year
     * @returns {ReactNode[]} list of Text components
     */
    function getDMYTexts(): ReactNode {
        const texts = moment(props.value)
        .format("DD/MMM/YYYY")
        .split("/")
        .map((text, index) => {
            return (
                <TimeText
                    key={index}
                    time={text}
                    openPicker={toggleDatePicker}
                />
            )
        })

        return texts;
    }
    
    /**
     * toggle date picker
     */
    function toggleDatePicker(): void {

        //close time picker and toggle date picker
        toggleShow({
            showDatePicker: !showDatePicker,
            showTimePicker: false,
        });
    }

    /**
     * toggle time picker
     */
    function toggleTimePicker(): void {

        //close date picker and toggle time picker
        toggleShow({
            showDatePicker: false,
            showTimePicker: !showTimePicker,
        });
    }

    /**
     * confirm selected date
     * @param {Date} newDate new selected date
     */
    function comfirmDateTime(newDate: Date): void {

        //close pickers
        toggleShow({
            showDatePicker: false,
            showTimePicker: false,
        });

        //set new date
        props.onChange(newDate);
    }

    return (
        <Box
            my={2}
            style={props.style}
        >
            { props.label && 
                <Text
                    fontSize="md"
                    color="onSecondary"
                    fontWeight="bold"
                    mb={2}
                >
                    {props.label}
                </Text>
            }
            <Box
                className={
                    `rounded-lg bg-secondary flex-row
                    p-2 items-center justify-between`
                }
            >
                <Box
                    flex={1}
                    flexDirection="row"
                    justifyContent="space-between"
                    paddingX={5}
                    alignItems="center"
                >
                    { props.value? getDMYTexts() :
                        <PlaceholderText 
                            text="Select Date" 
                            openPicker={toggleDatePicker}
                        />
                    }
                </Box>
                <Box 
                    flex={0.75}
                    flexDirection="row"
                    justifyContent="flex-end"
                    pr={5}
                >
                    { props.value?
                        <TimeText
                            time={moment(props.value).format("HH:mm")}
                            openPicker={toggleTimePicker}
                        />:
                        <PlaceholderText 
                            text="Select Time"
                            openPicker={toggleTimePicker}
                        />
                    }
                </Box>        
            </Box>
            <DatePicker
                modal
                date={props.value ?? new Date()}
                open={showDatePicker}
                onConfirm={comfirmDateTime}
                onCancel={toggleDatePicker}
                mode="date"
            />
            <DatePicker
                modal
                date={props.value ?? new Date()}
                open={showTimePicker}
                onConfirm={comfirmDateTime}
                onCancel={toggleTimePicker}
                mode="time"
                is24hourSource="locale"
            />
        </Box>
    );
};

