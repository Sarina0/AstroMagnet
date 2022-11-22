import {
    StyleSheet,
    Text, TouchableOpacity,
    View,
} from 'react-native'
import React, {useEffect, useState} from "react";

import Background from '../../components/background'
import PageHeader from '../../components/header'
import SelectScreen from "./SelectScreen";
import LikedScreen from "./LikedScreen";
import LookingScreen from "./LookingScreen";

import { HOME_PAGES } from "../../../config";
import { ColorPalette } from '../../styles/colorPalette'
import RoundButton from "../../components/RoundButton";
import * as Location from "expo-location";
import {state} from "../../../store";
import {UserController} from "../../../controller/user";


const HomeScreen = () => {
    const [activePage, setActivePage] = useState(HOME_PAGES.HOME);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);


    const onRedirectPage = (page) => {
        setActivePage(page);
    }

    const updateGeoLocation = async (location) => {
        const currentUser = state.user.currentUser;
        if (currentUser) {
            const userId = currentUser.userId;
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
        <Background>
            <PageHeader onPress={() => onRedirectPage(HOME_PAGES.HOME)}/>
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
        </Background>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30
    },
})
