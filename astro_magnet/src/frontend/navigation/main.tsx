import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ChatScreen from '@app/frontend/screens/chat';
import HomeScreen from '@app/frontend/screens/home';
import ProfileScreen from '@app/frontend/screens/profile';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { ColorPalette } from '@app/theme/colors';
import { colorWithOpacity } from '@app/shared/actions/colors';
import { useState } from "react";
import { ViewStyle } from 'react-native';

export type RootStackParamList = {
    Home: undefined;
    Chat: undefined;
    Profile: undefined;
}

const Tab = createMaterialBottomTabNavigator<RootStackParamList>();
const tabTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "transparent"
    }
}

export default function MainNavigation() {

    // Set the menu to visible or not visible
    const [ menuVisible, setMenuVisible ] = useState<boolean>(true)

    return (
        <NavigationContainer theme={tabTheme}>
                <Tab.Navigator
                    initialRouteName="Home"
                    activeColor={ ColorPalette.SOFT_MAGENTA }
                    inactiveColor={ colorWithOpacity(ColorPalette.SOFT_MAGENTA, 95) }
                    barStyle={navStyle(menuVisible)}
                    shifting
                >
                    <Tab.Screen
                        name="Chat"
                        children={() => <ChatScreen menuVisible={menuVisible} setMenuVisible={setMenuVisible} /> }
                        options = {{
                            tabBarLabel: 'Chat',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="chat" color={color} size={26} />
                            ),
                        }}

                    />
                    <Tab.Screen
                        name="Home"
                        component={HomeScreen}
                        options = {{
                            tabBarLabel: 'Home',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="home" color={color} size={26} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Profile"
                        component={ProfileScreen}
                        options = {{
                            tabBarLabel: 'Profile',
                            tabBarIcon: ({ color }) => (
                                <MaterialCommunityIcons name="account" color={color} size={26} />
                            ),
                        }}
                    />
                </Tab.Navigator>
        </NavigationContainer>
    )
}

const navStyle = (isVisible: boolean): ViewStyle => {
    return ({
        display: isVisible ? 'flex' : 'none', 
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: colorWithOpacity(ColorPalette.DARK_VIOLET_2, 80),
        overflow: "hidden"
    })
}