import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import auth from '@react-native-firebase/auth';
import {Platform} from 'react-native'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Messages from "../../theme/messages";

/**
 * Upload controller to handle upload
 */
export abstract class UploadController {

    constructor() {
        throw new Error("Controller cannot be initialized")
    }

    /**
     * upload image to firebase storage
     * @returns returns user info
     */
    static async uploadImage(image): any {
        let fileName = '';
        let fileUri = image.uri;

        let randomText = '';
        var characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 20; i++) {
            randomText += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        fileName = image.fileName ? image.fileName : randomText + '.jpg';

        if (Platform.OS === 'ios') {
            if (fileUri.indexOf('file://') === 0) {
                fileUri = fileUri.replace('file://', '');
            }
        } else {
            if (fileUri.indexOf('://') < 0) {
                fileUri = 'file://' + fileUri;
            }
        }

        console.log('upload file ======>', fileName, fileUri);

        const eventReference = storage().ref(fileName);
        await eventReference.putFile(fileUri);
        const uploadedImage = await storage()
            .ref('/' + fileName)
            .getDownloadURL();

        return uploadedImage;
    }
}
