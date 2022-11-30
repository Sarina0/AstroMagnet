// import {useEffect, useState, useContext} from "react";
// import PageHeader from '@app/frontend/components/global/header'
// import SelectScreen from "./SelectScreen";
// import LikedScreen from "./LikedScreen";
// import LookingScreen from "./LookingScreen";
// import { HOME_PAGES } from "@app/config";
// import * as Location from "expo-location";
// import {UserContext} from "@app/store/user";
// import UserController from "@app/controller/user";
// import SafeArea from "@app/frontend/components/global/safeArea";
// import { useToast } from "native-base";
// import ToastDialog from "@app/frontend/components/global/toast";

// const HomeScreen = () => {
//     const toast = useToast();
//     const [activePage, setActivePage] = useState(HOME_PAGES.HOME);
//     const {profile: currentUser} = useContext(UserContext);

//     const onRedirectPage = (page: any) => {
//         setActivePage(page);
//     }

//     const updateGeoLocation = async (location: any) => {
//         if (currentUser) {
//             const userId = currentUser.id!;
//             const data = {
//                 lat: location.coords.latitude,
//                 lng: location.coords?.longitude
//             };
//             await UserController.updateUser(userId, data, (error)=> {
//                 toast.show({
//                     render: () => <ToastDialog message={error} />
//                 })
//             });
//         }
//     }

//     useEffect(() => {
//         (async () => {
//             try {
//                 let { status } = await Location.requestForegroundPermissionsAsync();
//                 if (status !== 'granted') {
//                     throw new Error('Permission denied');
//                 }

//                 let location = await Location.getCurrentPositionAsync({});
//                 updateGeoLocation(location);
//             } catch (error: any) {
//                 console.log("[LOG] get location error", error);
//                 if (error.message === 'Permission denied') {
//                     toast.show({
//                         render: () => <ToastDialog 
//                             message="Please allow location acess so we can find you a match. Your data is safe with us!"
//                         />
//                     }) 
//                     return;
//                 }
//                 toast.show({
//                     render: () => <ToastDialog message="Error gettting current location"/>
//                 });
//             }
//         })();
//     }, []);

//     return (
//         <SafeArea>
//             <PageHeader onPress={onRedirectPage.bind(null, HOME_PAGES.HOME)}/>
//             {activePage === HOME_PAGES.HOME && (
//                 <SelectScreen
//                     onLikedPeople={() => onRedirectPage(HOME_PAGES.LIKED)}
//                     onStartLooking={() => onRedirectPage(HOME_PAGES.LOOKING)}
//                 />
//             )}
//             {activePage === HOME_PAGES.LIKED && (
//                 <LikedScreen />
//             )}
//             {activePage === HOME_PAGES.LOOKING && (
//                 <LookingScreen />
//             )}
//         </SafeArea>
//     )
// }

// export default HomeScreen;
