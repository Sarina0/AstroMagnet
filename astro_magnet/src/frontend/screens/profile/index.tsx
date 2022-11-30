import { useState, useContext } from 'react';
import {UserContext} from '@app/context/user';
import { StyleSheet, View, ScrollView, ViewStyle } from 'react-native'
import PageHeader from '@app/frontend/components/global/header'
import { User } from '@app/shared/interfaces/user'
import { UploadController } from "@app/controller/upload";
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
import { validateUser } from '@app/shared/actions/validation';
import ToastDialog from '@app/frontend/components/global/toast';
import { useToast } from 'native-base';

const ProfileScreen = () => {
    const {
        profile: currentUser,
        authUser
    } = useContext(UserContext);
    const [date, setDate] = useState<Date|null>(
        currentUser?.dateAndTimeOfBirth ?? null
    );
    const [ name, setName ] = useState<string>(
        currentUser?.name ?? ""
    )
    const [ sex, setSex ] = useState<User.SexType|null>(
        currentUser?.sex ?? null
    )
    const [ interest, setInterest ] = useState<User.SexType[]>(
        currentUser?.interestedType ?? []
    )
    const [ birthPlace, setBirthPlace ] = useState<string>(
        currentUser?.placeOfBirth ?? ""
    )
    const [ updatedPic, setUpdatedPic] = useState<string | null | undefined>(
        currentUser?.profilePicture ?? undefined
    );
    const [ loading, setLoading ] = useState(false);
    const toast = useToast();

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
            return currentUser?.profilePicture;
        }
        const url = await UploadController.uploadImage({
            uri: updatedPic,
            name: authUser?.uid,
        })
        .catch((error)=>{
            toast.show({
                render: () => <ToastDialog message={error.message} />
            });
            setLoading(false);
        });
        return url;
    }

    /**
     * update user profile in firestore
     */
    const onSaveProfile = async () => {

        //upload image if updated and get the new image url
        const updatedImgURL = await onUploadImage();

        //guard against image upload failed
        if (typeof updatedImgURL !== "string") {
            return;
        }

        //place all the data into a single object to prepare for update
        const data = {
            dateAndTimeOfBirth: date,
            interestedType: interest,
            name,
            placeOfBirth: birthPlace,
            profilePicture: updatedImgURL,
            sex
        };

        //guard against invalid data
        if (!validateUser(data, (error)=> {
            toast.show({
                render: () => <ToastDialog message={error} />
            });
        })) {
            setLoading(false);
            return;
        }

        //update user profile
        await UserController.updateUser(
            currentUser?.id!, 
            data,
            (error)=>{
                toast.show({
                    render: () => <ToastDialog message={error} />
                });
            }
        );
        setLoading(false);
    }

    return (
        <SafeArea>
            <ScrollView style={{flex: 1}}>
                <View
                    style = { styles.container }
                >
                    <PageHeader />
                    <View
                        style = { styles.form }
                    >
                        <ImagePicker
                            fallback={currentUser?.profilePicture}
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
                            style={[styles.extraStyle, {width: "50%"}]}
                            placeholder="Select your sex"
                        />
                        <Input
                            label = "Birth Place"
                            value = { birthPlace }
                            onChangeText = { (text) => setBirthPlace(text) }
                            placeholder = "Enter your birth place"
                            style={styles.extraStyle}
                        />
                        <MultiSelect
                            label = "Interested In"
                            value = { interest }
                            onValueChange = { 
                                (selected) => setInterest(selected as User.SexType[]) 
                            }
                            items={selectItems}
                            placeholder = "Who are you interested in?"
                            style={styles.extraStyle}
                        />
                        <DatePicker
                            label = "Date of Birth"
                            value = { date }
                            onChange = { (value)=> setDate(value) }
                            style={styles.extraStyle}
                        />
                        <RoundButton
                            style={styles.extraStyle}
                            title="update"
                            onPress={onSaveProfile}
                        />
                        <RoundButton
                            style={styles.extraStyle}
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
    form: {
        padding: 10,
        paddingLeft: 30,
        flexDirection: "column",
    },
    extraStyle: {
        marginTop: 20,
    }
})
