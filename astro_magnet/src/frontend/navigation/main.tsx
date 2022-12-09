import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ChatScreen from '@app/frontend/navigation/chat';
import ProfileScreen from '@app/frontend/screens/profile';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { ColorPalette } from '@app/theme/colors';
import { colorWithOpacity } from '@app/shared/actions/colors';
import { useState } from "react";
import { ViewStyle } from 'react-native';
import LikedScreen from '../screens/home/LikedScreen';
import LookingScreen from '../screens/home/LookingScreen';
import { NavigatorScreenParams } from '@react-navigation/native';
import { ChatStackParamList } from '@app/frontend/navigation/chat';
import { MenuContext } from '@app/context/menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
    Chat: NavigatorScreenParams<ChatStackParamList>
    Profile: undefined;
    Search: undefined;
    Like: undefined;
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
    const [isMenuVisible, setMenuVisible] = useState(true);

    return (
        <MenuContext.Provider value={{isMenuVisible, setMenuVisible}}>
            <SafeAreaProvider>
                <NavigationContainer theme={tabTheme}>
                        <Tab.Navigator
                            initialRouteName="Search"
                            activeColor={ ColorPalette.SOFT_MAGENTA }
                            inactiveColor={ colorWithOpacity(ColorPalette.SOFT_MAGENTA, 95) }
                            barStyle={navStyle(isMenuVisible)}
                            shifting
                        >
                            <Tab.Screen
                                name="Chat"
                                options = {{
                                    tabBarLabel: 'Chat',
                                    tabBarIcon: ({ color }) => (
                                        <MaterialCommunityIcons 
                                            name="chat" 
                                            color={color} 
                                            size={26} 
                                        />
                                    ),
                                }}
                                component={ChatScreen}
                            />
                            <Tab.Screen
                                name="Search"
                                component={LookingScreen}
                                options = {{
                                    tabBarLabel: 'Browse',
                                    tabBarIcon: ({ color }) => (
                                        <MaterialCommunityIcons 
                                            name="cards" 
                                            color={color} 
                                            size={26} 
                                        />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Like"
                                options = {{
                                    tabBarLabel: 'Like',
                                    tabBarIcon: ({ color }) => (
                                        <MaterialCommunityIcons 
                                            name="heart" 
                                            color={color} 
                                            size={26} 
                                        />
                                    ),
                                }}
                                children={
                                    () => <LikedScreen />
                                }
                            />
                            <Tab.Screen
                                name="Profile"
                                component={ProfileScreen}
                                options = {{
                                    tabBarLabel: 'Profile',
                                    tabBarIcon: ({ color }) => (
                                        <MaterialCommunityIcons 
                                            name="account" 
                                            color={color} 
                                            size={26} 
                                        />
                                    ),
                                }}
                            />
                        </Tab.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </MenuContext.Provider>
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