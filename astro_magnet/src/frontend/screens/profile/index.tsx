import {useState, useContext, useRef} from 'react';
import {UserContext} from '@app/store/user';
import {
    StyleSheet,
    Text, View,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import PageHeader from '@app/frontend/components/global/header'
import { ColorPalette } from '@app/theme/colors'
import { User } from '@app/shared/interfaces/user'
import {UploadController} from "@app/controller/upload";
import UserController from "@app/controller/user";
import { signOut } from '@app/controller/auth';
import RoundButton from "@app/frontend/components/global/RoundButton";
import LoadingOverlay from "@app/frontend/components/LoadingOverlay";
import SafeArea from '@app/frontend/components/global/safeArea';
import Input from "@app/frontend/components/global/input";
import Select from "@app/frontend/components/global/select";
import MultiSelect from '@app/frontend/components/global/multiSelect';
import ImagePicker from '@app/frontend/components/global/imagePicker';
import DatePicker from '@app/frontend/components/global/datepicker';

const ProfileScreen = () => {
    const {profile: currentUser, setProfile } = useContext(UserContext) as {
        profile: User,
        setProfile: (profile: User) => void
    }
    const [date, setDate] = useState<Date|null>(
        currentUser.dateAndTimeOfBirth ? new Date(currentUser.dateAndTimeOfBirth) : null
    );
    const [ name, setName ] = useState<string>(currentUser.name || '')
    const [ sex, setSex ] = useState<User.SexType|null>(currentUser.sex)
    const [ interest, setInterest ] = useState<User.SexType[]>(currentUser.interestedType)
    const [ birthPlace, setBirthPlace ] = useState<string>(currentUser.placeOfBirth || '')
    const [ updatedPic, setUpdatedPic] = useState<string | null | undefined>(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string|null>(null);

    //list of items for select components
    const selectItems = User.sexes.map(sex=>({
        label: sex,
        value: sex
    }))

    /**
     * upload image to firebase storage
     */
    const onUploadImage = async () => {
        setLoading(true);
        if (!updatedPic) {
            return;
        }
        const url = await UploadController.uploadImage({
            uri: updatedPic}
        ).catch((error)=>{
            setError(error.message);
            setLoading(false);
        });
        return url;
    }

    /**
     * update user profile in firestore
     */
    const onSaveProfile = async () => {
        const updatedURL = await onUploadImage();
        const userProfilePic = typeof updatedURL === 'string' ? 
                updatedURL : currentUser.profilePicture;
        const data = {
            dateAndTimeOfBirth: date,
            interestedType: interest,
            name,
            placeOfBirth: birthPlace,
            profilePicture: userProfilePic,
            sex
        };
        const {
            data: result, 
            status
        } = await UserController.updateUser(
            currentUser.id!, 
            data
        );
        if (status) {
            setProfile({
                ...currentUser,
                ...data
            });
            setLoading(false);
        } else {
            setError(result);
        }
        setLoading(false);
    }

    return (
        <SafeArea>
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
                        <ImagePicker
                            fallback={currentUser.profilePicture}
                            value={updatedPic}
                            onChange={(value)=>setUpdatedPic(value)} 
                            labelStyle={{marginTop: 20}}
                            style={{marginVertical: 10}}
                            mode="avatar"
                        />
                        <Input
                            label = "Name"
                            value = { name }
                            onChangeText = { (text) => setName(text) }
                            placeholder = "Enter your name"
                            style={{marginTop: 20}}
                        />
                        <Select
                            label = "Sex"
                            value= {sex}
                            onValueChange = { 
                                (value) => setSex(value as User.SexType) 
                            }
                            items={selectItems}
                            style={{marginTop: 20, width: "50%"}}
                            placeholder="Select your sex"
                        />
                        <Input
                            label = "Birth Place"
                            value = { birthPlace }
                            onChangeText = { (text) => setBirthPlace(text) }
                            placeholder = "Enter your birth place"
                            style={{marginTop: 20}}
                        />
                        <MultiSelect
                            label = "Interested In"
                            value = { interest }
                            onValueChange = { 
                                (selected) => setInterest(selected as User.SexType[]) 
                            }
                            items={selectItems}
                            placeholder = "Who are you interested in?"
                            style={{marginTop: 20}}
                        />
                        <DatePicker
                            label = "Date of Birth"
                            value = { date }
                            onChange = { (value)=> setDate(value) }
                            style={{marginTop: 20}}
                        />
                        <RoundButton
                            style={styles.saveButton}
                            title="update"
                            onPress={onSaveProfile}
                        />
                        <RoundButton
                            style={[styles.saveButton, {
                                marginTop: 30,
                            }]}
                            title="sign out"
                            onPress={signOut}
                        />
                    </View>
                </View>
            </ScrollView>
            {loading && <LoadingOverlay />}
        </SafeArea>
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
        paddingLeft: 30,
        flexDirection: "column",
    },
    saveButton: {
        marginTop: 20,
    }
})
