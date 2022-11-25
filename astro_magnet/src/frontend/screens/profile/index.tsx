import {useState, useContext} from 'react';
import {UserContext} from '@app/store/user';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform, ScrollView
} from 'react-native'
import FastImage from "react-native-fast-image";
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';

import Background from '@app/frontend/components/background';
import PageHeader from '@app/frontend/components/header'
import { ColorPalette } from '@app/frontend/styles/colorPalette'
import  DateTimePicker, { DateTimePickerEvent }  from "@react-native-community/datetimepicker"
import { Friend, User } from '@app/shared/interfaces/user'
import SexDialog from '@app/frontend/components/sexDialog'
import Images from "@app/theme/images";
import { TOAST_SHOW_TIME } from "@app/config";
import {UploadController} from "@app/controller/upload";
import { UserController } from "@app/controller/user";
import RoundButton from "@app/frontend/components/RoundButton";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";

const ProfileScreen = () => {

    const [datePicker, setDatePicker] = useState(false);
    const [timePicker, setTimePicker] = useState(false);
    const [sexDialogPicker, setSexDialogPicker] = useState<boolean>(false)
    const [interestDialogPicker, setInterestDialogPicker] = useState<boolean>(false)
    const {profile: currentUser, setProfile } = useContext(UserContext) as {
        profile: User,
        setProfile: (profile: User) => void
    }
    const [date, setDate] = useState<Date>(currentUser.dateAndTimeOfBirth ? new Date(currentUser.dateAndTimeOfBirth) : new Date());
    const [ name, setName ] = useState<string>(currentUser.name || '')
    const [ sex, setSex ] = useState<User.SexType>(currentUser.sex || "other")
    const [ interest, setInterest ] = useState<User.SexType | User.SexType[]>(currentUser.interestedType || "other")
    const [ birthPlace, setBirthPlace ] = useState<string>(currentUser.placeOfBirth || '')
    const [ profilePicture, setProfilePicture ] = useState<string>(currentUser.profilePicture??"")
    const [ avatar, setAvatar ] = useState<string|null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    function onDateSelected(e: DateTimePickerEvent, value: Date | undefined): void {
        if(value != undefined) {
            setDate(value);
        }
        setTimePicker(false);
        setDatePicker(false);
    };


    const getDateString = (): string => {
        let month = ""
        switch (date.getMonth()) {
            case 0:
                month = "Jan";
                break;
            case 1:
                month = "Feb";
                break;
            case 2:
                month = "Mar";
                break;
            case 3:
                month = "Apr";
                break;
            case 4:
                month = "May";
                break;
            case 5:
                month = "Jun";
                break;
            case 6:
                month = "Jul";
                break;
            case 7:
                month = "Aug";
                break;
            case 8:
                month = "Sep";
                break;
            case 9:
                month = "Oct";
                break;
            case 10:
                month = "Nov";
                break;
            case 11:
                month = "Dec"
                break;
        }

        return `${date.getDate()} ${month} ${date.getFullYear()}`
    }

    ///////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// Image Picker. //////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });
        setLoading(true);
        if (!result.canceled) {
            setProfilePicture(result.uri??"");
            setAvatar(result.uri??"");
            setLoading(false);
        } else {
            setLoading(false);
            alert('You did not select any image.');
        }
    };

    const onSaveProfile = async () => {
        setLoading(true);
        let userAvatar = profilePicture;
        if (avatar) {
            const uploadedUrl = await UploadController.uploadImage(avatar);
            userAvatar = uploadedUrl;
        }
        const userId = currentUser.id;
        const data = {
            dateAndTimeOfBirth: moment(date).toISOString(),
            interestedType: interest,
            name,
            placeOfBirth: birthPlace,
            profilePicture: userAvatar,
            sex
        };
        const {user, status, error} = await UserController.updateUser(userId, data);
        if (status) {
            setProfile(user);
            setLoading(false);
        } else {
            setError(error);
        }
        setLoading(false);
    }

    return (
        <Background>
            <ScrollView style={{flex: 1}}>
                <View
                    style = { styles.container }
                >
                    {/* Header of the page */}
                    <PageHeader />
                    {/* Container */}
                    <View
                        style = { styles.form }
                    >

                        <Text
                            style = { styles.font }
                        >
                            Name
                        </Text>
                        <TextInput
                            style = { styles.textField }
                            value = { name }
                            onChangeText = { it => setName(it) }
                        />
                        <Text
                            style = { styles.font }
                        >
                            Sex
                        </Text>
                        <Text
                            style = { styles.textField }
                            onPress = { () => { setSexDialogPicker(true) } }
                        >
                            { sex }
                        </Text>
                        <Text
                            style = { styles.font }
                        >
                            Date and time of Birth
                        </Text>
                        <Text
                            style = { styles.textField }
                        >
                            <Text
                                onPress={() => {setDatePicker(true)}}
                            >
                                {getDateString()}
                            </Text>
                            <Text>
                                {"\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"}
                            </Text>
                            <Text
                                onPress={() => {setTimePicker(true)}}
                            >
                                {date.getHours()}:{date.getMinutes().toString().length == 1 ? "0" + date.getMinutes() : date.getMinutes()}
                            </Text>

                        </Text>
                        <Text
                            style = { styles.font }
                        >
                            Place of Birth
                        </Text>
                        <TextInput
                            style = { styles.textField }
                            value = { birthPlace }
                            onChangeText = { it => setBirthPlace(it) }
                        />
                        <Text
                            style = { styles.font }
                        >
                            Interest in
                        </Text>
                        <TextInput
                            style = { styles.textField }
                            value = { interest as string }
                            onChangeText = { it => setInterest(it as User.SexType) } 
                        />
                        <Text
                            style = { styles.font }
                        >
                            Upload a picture
                        </Text>
                        <TouchableOpacity onPress={pickImageAsync}>
                            <FastImage
                                style={styles.profilePicture}
                                source={profilePicture ? {uri: profilePicture} : Images.avatar_placeholder}
                            />
                        </TouchableOpacity>
                    </View>
                    <RoundButton
                        style={styles.saveButton}
                        title={'Save'}
                        onPress={onSaveProfile}
                    />

                    {
                        sexDialogPicker ?
                            <SexDialog
                                setValue={ setSex }
                                setDialogPicker={ setSexDialogPicker } /> : null
                    }

                    {datePicker && (
                        <DateTimePicker
                            value={date}
                            mode={'date'}
                            is24Hour={true}
                            onChange={onDateSelected}
                        />
                    )}

                    {timePicker && (
                        <DateTimePicker
                            value={date}
                            mode={'time'}
                            is24Hour={false}
                            onChange={onDateSelected}
                        />
                    )}

                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </Background>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        fontSize: 40,
        color: ColorPalette.SOFT_MAGENTA,
        textAlign: "center"
    },
    form: {
        padding: 10,
        paddingLeft: 30
    },
    font: {
        color: ColorPalette.SOFT_MAGENTA,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textField: {
        backgroundColor: ColorPalette.DARK_VIOLET_1,
        color: ColorPalette.SOFT_MAGENTA,
        padding: 5,
        paddingLeft: 10,
        borderRadius: 10,
        fontSize: 20,
        marginRight: 30,
        marginBottom: 15,
    },
    textFlex: {
        flex: 1,
        flexDirection: "row",
        minHeight: 40,
    },
    profilePicture: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    saveButton: {
        marginHorizontal: 20,
        marginVertical: 10
    }
})
