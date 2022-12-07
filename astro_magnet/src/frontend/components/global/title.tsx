import {Text} from "native-base";

interface Props extends React.ComponentPropsWithRef<typeof Text> {
    title: string;
}

/**
 * Title component to display title
 * this component also support native-base Text props
 * @prop {string} title - title of the component
 * @returns {JSX.Element} returns the title component
 */
export default function TitleComponent(props: Props) {
    return (
        <Text
        fontSize={25}
        fontWeight="bold"
        color="onSecondary"
        ml={2} mt={5}
        {...props}
        >
            {props.title}
        </Text>
    )
}