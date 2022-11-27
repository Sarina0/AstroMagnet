import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatScreen from './src/frontend/screens/chat';
import HomeScreen from './src/frontend/screens/home';
import ProfileScreen from './src/frontend/screens/profile';
import Register from './src/frontend/screens/register';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ColorPalette } from "@app/theme/colors";
import { colorWithOpacity } from './src/shared/actions/colors';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import LoadingOverlay from "./src/frontend/components/LoadingOverlay";
import useUserData from '@app/hooks/useUserData';
import { UserContext } from '@app/store/user';
import theme from '@app/theme/nativebase';
import { NativeBaseProvider } from "native-base";
import Images from '@app/theme/images';
import { ImageBackground, ViewStyle } from 'react-native';

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

export default function App() {
    // Set the menu to visible or not visible
    const [ menuVisible, setMenuVisible ] = useState<boolean>(true)
    const { user: authUser, 
            userProfile: profile, 
            setUserProfile: setProfile, 
            status, profileLoading } = useUserData();

    let screen = <LoadingOverlay/>;

    if (status === "loading" || profileLoading) {
        screen = <LoadingOverlay/>
    }

    if (status === "unauthenticated") {
        screen = <Register/>
    }

    if (status === "authenticated") {
        screen = (
            <UserContext.Provider value={{ profile, authUser, setProfile }}>
                    <SafeAreaProvider>
                        {/* Navigation Container */}
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
                    </SafeAreaProvider>
            </UserContext.Provider>
        )
    }

    return (
        <NativeBaseProvider theme={theme}>
            <ImageBackground
                source={Images.background}
                className="h-screen"
                resizeMode="cover"
            >
                <StatusBar hidden/>
                {screen}
            </ImageBackground>
        </NativeBaseProvider>
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