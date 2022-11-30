import { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { UserContext } from "@app/context/user"   

/**
 * hook to get current location
 * @param onReceivedLocation callback function to handle location
 * @param onError callback function to handle error
 * @returns {Location.LocationData | null} location - current location
 */
export default function useCurrentLocation(
    onReceivedLocation?: (location: Location.LocationObject) => void,
    onError?: (error: string) => void
) {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const { profile } = useContext(UserContext);

    useEffect(() => {
        if (!profile) return;
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    throw new Error('Permission denied');
                }
                let location = await Location.getCurrentPositionAsync({});
                onReceivedLocation && onReceivedLocation(location);
                setLocation(location);
            } catch (error: any) {
                if (error.message === 'Permission denied') {
                    onError && onError("Please allow location acess so we can find you a match. Your data is safe with us!");
                    return;
                }
                onError && onError("Error gettting current location");
                console.log("[LOG] get location error", error);
            }
        })();
    }, [profile]);
    return location;
}