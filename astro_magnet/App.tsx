import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    ImageBackground,
} from 'react-native';
import "expo-dev-client"

import ChatScreen from './src/frontend/screens/chat';
import HomeScreen from './src/frontend/screens/home';
import ProfileScreen from './src/frontend/screens/profile';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ColorPalette } from './src/frontend/styles/colorPalette';
import { colorWithOpacity } from './src/shared/actions/colors';
import Register from './src/frontend/screens/register';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import {GOOGLE_SIGNIN_IOS_CLIENT_ID, GOOGLE_SIGNIN_WEB_CLIENT_ID} from "./src/config";
import {AuthenticationController} from "./src/controller/authentication";
import {state} from "./src/store";
import LoadingOverlay from "./src/frontend/components/LoadingOverlay";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
    // Set the menu to visible or not visible
    const [ menuVisible, setMenuVisible ] = useState<boolean>(true)
    const [ user, setUser ] = useState<FirebaseAuthTypes.User | null>(null)
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    /**
     * Configure the GoogleSignInWebClient
     */
    GoogleSignin.configure({
        scopes: [],
        offlineAccess: true,
        hostedDomain: '', // specifies a hosted domain restriction
        loginHint: '',
        forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
        accountName: '', // [Android] specifies an account name on the device that should be used
        iosClientId: GOOGLE_SIGNIN_IOS_CLIENT_ID,
        webClientId: GOOGLE_SIGNIN_WEB_CLIENT_ID
    })

    /**
     * Helper function to check wether the user
     * is currently sign in or not
     */
    const onAuthStateChanged = async (user: any) => {
        setUser(user);
        if (user) {
            setLoading(true);
            const {status, user: _user, error} = await AuthenticationController.getUserInfo(user.email);
            if (status) {
                state.user.currentUser = {
                    ..._user._data,
                    userId: _user.id
                };
            } else {
                setError(error);
            }
            setLoading(false);
        }
    }

    /**
     * Check if the user is signed in or not
     */
    useEffect(()=> {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, []);


    return (
        <>
            {/* Hide the status bar */}
            <StatusBar hidden />
            {/* If the user is not signed in, than they need to register first */}
            { !user ?
                <Register />

            :
            <ImageBackground
                    source={require('./assets/background.png')}
                    style={{
                        zIndex: 0,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}>
                {/* Navigation Container */}
                <NavigationContainer>
                    <Tab.Navigator
                        initialRouteName="Home Screen"
                        activeColor={ ColorPalette.SOFT_MAGENTA }
                        inactiveColor={ colorWithOpacity(ColorPalette.SOFT_MAGENTA, 95) }
                        barStyle={{
                            display: menuVisible ? "flex" : "none",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            backgroundColor: colorWithOpacity(ColorPalette.DARK_VIOLET_2, 80)
                        }}
                        shifting
                    >
                        <Tab.Screen
                            name="Chat Screen"
                            // initialParams={setMenuVisible}
                            // component={ChatScreen}
                            children={() => <ChatScreen menuVisible={menuVisible} setMenuVisible={setMenuVisible} /> }
                            options = {{
                                tabBarLabel: 'Chat',
                                tabBarIcon: ({ color }) => (
                                    <MaterialCommunityIcons name="chat" color={color} size={26} />
                                ),
                            }}

                        />
                        <Tab.Screen
                            name="Home Screen"
                            component={HomeScreen}
                            options = {{
                                tabBarLabel: 'Home',
                                tabBarIcon: ({ color }) => (
                                    <MaterialCommunityIcons name="home" color={color} size={26} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="ThirdPage"
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
                </ImageBackground>
            }
            {loading && <LoadingOverlay />}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
