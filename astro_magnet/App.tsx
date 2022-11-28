import { SafeAreaProvider } from 'react-native-safe-area-context';
import Register from './src/frontend/screens/auth/login';
import { StatusBar } from 'expo-status-bar';
import LoadingOverlay from "./src/frontend/components/LoadingOverlay";
import useUserData from '@app/hooks/useUserData';
import { UserContext } from '@app/store/user';
import theme from '@app/theme/nativebase';
import { NativeBaseProvider } from "native-base";
import Images from '@app/theme/images';
import { ImageBackground } from 'react-native';
import MainNavigationStack from "@app/frontend/navigation/main";
import SetupScreen from '@app/frontend/screens/auth/setup';
import { useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';

export default function App() {
    const toast = useToast();
    const { user: authUser, 
            userProfile: profile, 
            setUserProfile: setProfile, 
            status, profileLoading } = useUserData((error)=> {
                toast.show({
                    render: () => <ToastDialog message={error} />
                });
            });

    let screen = <LoadingOverlay/>;

    if (status === "loading" || profileLoading) {
        screen = <LoadingOverlay/>
    }

    if (status === "unauthenticated") {
        screen = <Register/>
    }

    if (status === "authenticated" && !profile) {
        screen = <SetupScreen/>
    }

    if (status === "authenticated" && profile) {
        screen = (
            <UserContext.Provider value={{ profile, authUser, setProfile }}>
                    <SafeAreaProvider>
                        <MainNavigationStack/>
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

