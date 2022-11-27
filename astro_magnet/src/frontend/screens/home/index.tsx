import {useEffect, useState, useContext} from "react";
import PageHeader from '@app/frontend/components/global/header'
import SelectScreen from "./SelectScreen";
import LikedScreen from "./LikedScreen";
import LookingScreen from "./LookingScreen";
import { HOME_PAGES } from "@app/config";
import * as Location from "expo-location";
import {UserContext} from "@app/store/user";
import UserController from "@app/controller/user";
import SafeArea from "@app/frontend/components/global/safeArea";

const HomeScreen = () => {
    const [activePage, setActivePage] = useState(HOME_PAGES.HOME);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const {profile: currentUser} = useContext(UserContext);

    const onRedirectPage = (page: any) => {
        setActivePage(page);
    }

    const updateGeoLocation = async (location: any) => {
        if (currentUser) {
            const userId = currentUser.id!;
            const data = {
                lat: location.coords.latitude,
                lng: location.coords?.longitude
            };
            await UserController.updateUser(userId, data);
        }
    }

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log('location =====>', location);
            // updateGeoLocation(location);
        })();
    }, []);


    return (
        <SafeArea>
            <PageHeader onPress={onRedirectPage.bind(null, HOME_PAGES.HOME)}/>
            {activePage === HOME_PAGES.HOME ? (
                <SelectScreen
                    onLikedPeople={() => onRedirectPage(HOME_PAGES.LIKED)}
                    onStartLooking={() => onRedirectPage(HOME_PAGES.LOOKING)}
                />
            ) : null}
            {activePage === HOME_PAGES.LIKED ? (
                <LikedScreen />
            ) : null}
            {activePage === HOME_PAGES.LOOKING ? (
                <LookingScreen />
            ) : null}
        </SafeArea>
    )
}

export default HomeScreen;
