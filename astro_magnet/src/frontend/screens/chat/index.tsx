import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { Dispatch, SetStateAction } from "react";
import { ColorPalette } from "@app/theme/colors";
import Room from "./room";
import Rooms from "./rooms";
import { Box, Avatar, Text } from "native-base";

export type ChatStackParamList = {
    rooms: undefined;
    room: {
        id: string;
        name: string;
        profilePic: string;
    }
}

const Stack = createNativeStackNavigator<ChatStackParamList>();

interface Props {
    setMenuVisible: Dispatch<SetStateAction<boolean>>;
};

// const ChatRoomHeader = (props: {
//     name: string,
//     profilePic: string
// }) => {
//     return (  
//         <Box 
//             flexDirection="row"
//             alignItems="center"
//             height={100}
//             backgroundColor={"secondary"}
//         >
//             <Avatar
//                 size="sm"
//                 source={{
//                     uri: props.profilePic
//                 }}
//             />
//             <Text
//                 fontSize={20}
//                 color="onSecondary"
//                 fontWeight="bold"
//                 ml={10}
//             >
//                 {props.name}
//             </Text>
//         </Box>   
//     );
// }

export default function ChatNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                animation: "none",
                headerStyle:{
                    backgroundColor: ColorPalette.DARK_VIOLET_2,

                },
                headerTintColor: ColorPalette.SOFT_MAGENTA,
                headerTitleStyle: {
                    fontWeight: "bold",
                },
                
            }}
            initialRouteName="rooms"
        >
            <Stack.Screen
                name="rooms"
                component={Rooms}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="room"
                children={
                    (props) => <Room {...props} />
                }
                options={({ route }) => ({
                    title: route.params.name,
                })}
            />
        </Stack.Navigator>
    )
}