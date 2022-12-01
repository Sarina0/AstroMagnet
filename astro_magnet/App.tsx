import { SafeAreaProvider } from 'react-native-safe-area-context';
import Register from './src/frontend/screens/auth/login';
import { StatusBar } from 'expo-status-bar';
import LoadingOverlay from "./src/frontend/components/LoadingOverlay";
import useProfile from '@app/hooks/useProfile';
import { UserContext } from '@app/context/user';
import theme from '@app/theme/nativebase';
import { NativeBaseProvider } from "native-base";
import Images from '@app/theme/images';
import { ImageBackground } from 'react-native';
import MainNavigationStack from "@app/frontend/navigation/main";
import SetupScreen from '@app/frontend/screens/auth/setup';
import { useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';
import UserController from '@app/controller/user';
import useCurrentLocation from '@app/hooks/useCurrentLocation';

export default function App() {
    const toast = useToast();
    const { user: authUser, 
            userProfile: profile, 
            setUserProfile: setProfile, 
            status: authStatus, profileLoading } = useProfile((error)=> {
                toast.show({
                    render: () => <ToastDialog message={error} />
                });
            });

    const updateGeoLocation = async (location: any) => {
        if (!profile) return;
        const data = {
            lat: location.coords.latitude,
            lng: location.coords?.longitude
        };
        await UserController.updateUser(profile.id!, data, (error)=> {
            toast.show({
                render: () => <ToastDialog message={error} />
            })
        });
    }

    useCurrentLocation(
        updateGeoLocation,
        (error)=> {
            toast.show({
                render: () => <ToastDialog message={error} />
            })
        },
    )

    let screen = <LoadingOverlay/>;

    if (authStatus === "loading" || profileLoading) {
        screen = <LoadingOverlay/>
    } else if (authStatus === "unauthenticated") {
        screen = <Register/>
    } else if (authStatus === "authenticated" && !profile) {
        screen = <SetupScreen/>
    } else {
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

