//others
import UserController from "@app/controller/user";
import { UploadController } from "@app/controller/upload";
import { useState, useEffect } from "react";
//components
import Input from "@app/frontend/components/global/input";
import RoundButton from "@app/frontend/components/global/RoundButton";
import SafeArea from "@app/frontend/components/global/safeArea";
import ImagePicker from "@app/frontend/components/global/imagePicker";
import DatePicker from "@app/frontend/components/global/datepicker";
import Select from "@app/frontend/components/global/select";
import MultiSelect from "@app/frontend/components/global/multiSelect";
import PageHeader from "@app/frontend/components/global/header";
import ToastDialog from "@app/frontend/components/global/toast";
import useAuthState from "@app/hooks/useAuthState";
import { User } from "@app/shared/interfaces/user";
import { Box, ScrollView, useToast } from "native-base";
import { ViewStyle } from "react-native";
import firestore from "@react-native-firebase/firestore";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import { validateUser } from "@app/shared/actions/validation";

function getInitialData(): Partial<User> {
    return {
        name: "",
        sex: null,
        interestedType: [],
        placeOfBirth: "",
        profilePicture: "",
        dateAndTimeOfBirth: null,
    }
}

export default function SetupScreen() {
    const { user, status } = useAuthState();
    const [formData, setData] = useState<Partial<User>>(
        getInitialData()
    );
    const [updatedImage, setUpdatedImage] = useState<string | undefined>(undefined);
    const [isSettingUp, setIsSettingUp] = useState<boolean>(false);
    const toast = useToast();

    //all the options/items for select components
    const selectOptions = User.sexes.map((sex)=>({
        label: sex,
        value: sex,
    }));
    
    useEffect(()=> {

        //guard against state is loading or user is not logged in
        if (status === "loading" || 
            status==="unauthenticated"
        ) return;

        //load form data after finished loading
        setData({
            ...formData,
            name: user?.displayName ?? "",
            profilePicture: user?.photoURL ?? "",
        })
    }, [status])

    /**
     * update input value of name, placeOfBirth
     * @param {string} value
     * @param {string} name - key of the data to be updated in formData
     */
    function handleInputChange(value: string, name: string) {
        setData({
            ...formData,
            [name]: value,
        });
    }

    /**
     * update input value of user sex
     * @param value - new value of user sex
     */
    function handleSelectChange(value: string) {
        const sexValue = value as User.SexType;
        setData({
            ...formData,
            sex: sexValue,
        });
    }

    /**
     * update input value of user interested
     * @param value - new value of user interestedType
     */
    function handleMultiSelectChange(value: string[]) {
        const interestedValue = value as User.SexType[];
        setData({
            ...formData,
            interestedType: interestedValue,
        });
    }

    /**
     * update value for user date of birth
     * @param value - new value of user dateOfBirth
     */
    function handleDateChange(value: Date) {
        setData({
            ...formData,
            dateAndTimeOfBirth: value,
        });
    }

    /**
     * update value for user profile picture
     * @param value update value for user profile picture
     */
    function handleImageChange(value: string) {
        setUpdatedImage(value);
    }

    /**
     * upload use profile picture to firebase storage
     * if no image is selected, return the current profile picture as profile pic
     * @returns {void|string} uri of the updated image on firebase storage
     */
    async function uploadImage() {
        setIsSettingUp(true);
        if (!updatedImage) {
            return formData.profilePicture;
        }
        const url = await UploadController
            .uploadImage({uri: updatedImage})
            .catch((_error) => {
                toast.show({
                    render: () => (
                        <ToastDialog 
                            message="Error uploading your profile image" 
                        />
                    )
                });
                setIsSettingUp(false);
            }).finally(()=> {
                setIsSettingUp(false);
            })

        return url;
    }

    /**
     * setup user profile(create new user document in firestore)
     */
    async function setupUser() {
        const imgURL = await uploadImage();

        //guard against invalid data
        if (!validateUser({
            ...formData,
            email: user?.email ?? "",
            profilePicture: imgURL ?? "",
        }, (error: string) => {
            toast.show({
                render: () => (
                    <ToastDialog message={error} />
                )
            })
        })) {
            setIsSettingUp(false);
            return;
        } 

        //guard against upload image failed
        if (typeof imgURL === "string") {
            await UserController.createUser({
                dateAndTimeOfBirth: formData.dateAndTimeOfBirth!,
                profilePicture: imgURL,
                placeOfBirth: formData.placeOfBirth,
                email: user?.email!,
                name: formData.name,
                sex: formData.sex!,
                friendList: [],
                interestedType: formData.interestedType!,
                messagingFriendList: [],
                liked: [],
                disliked: [],
                lat: 0,
                lng: 0,        
                createdAt: firestore.Timestamp.now()
            }, (_error)=> {
                toast.show({
                    render: () => (
                        <ToastDialog 
                            message="Error setting up your profile" 
                        />
                    )
                });
            }).finally(()=> {
                setIsSettingUp(false);
            })
        }
    }

    return (
        <SafeArea>
            <ScrollView
                flex={1}
            >
                <PageHeader/>
                <Box
                    padding={5}
                >
                    <Input
                        label="Name"
                        placeholder="Enter your name"
                        value={formData.name!}
                        onChangeText={(value) => handleInputChange(value, "name")}
                        style={extraStyle}
                    />
                    <Select
                        label="Sex"
                        placeholder="Select your gender"
                        value={formData.sex}
                        onValueChange={(value) => handleSelectChange(value)}
                        items={selectOptions}
                        style={extraStyle}
                    />
                    <DatePicker
                        label="Date and time of birth"
                        value={formData.dateAndTimeOfBirth}
                        onChange={(value) => handleDateChange(value)}
                        style={extraStyle}
                    />
                    <Input
                        label="Place of birth"
                        placeholder="Enter your place of birth"
                        value={formData.placeOfBirth!}
                        onChangeText={(value) => handleInputChange(value, "placeOfBirth")}
                        style={extraStyle}
                    />
                    <MultiSelect
                        label="Interested in"
                        placeholder="Select your interested type"
                        value={formData.interestedType!}
                        onValueChange={(value) => handleMultiSelectChange(value)}
                        items={selectOptions}
                        style={extraStyle}
                    />
                    <ImagePicker
                        label="Profile picture"
                        value={updatedImage}
                        fallback={formData.profilePicture}
                        onChange={(value) => handleImageChange(value??"")}
                        mode="image"
                        style={extraStyle}
                    />
                    <RoundButton
                        title="Submit"
                        onPress={setupUser}
                        style={extraStyle}
                    />
                </Box>
            </ScrollView>
            {isSettingUp && <LoadingOverlay/>}
        </SafeArea>
    )
}

const extraStyle: ViewStyle = {
    marginTop: 20
}

