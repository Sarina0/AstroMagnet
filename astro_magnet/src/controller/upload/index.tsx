import {Platform} from 'react-native'
import storage from '@react-native-firebase/storage';


/**
 * Upload controller to handle upload
 */
export class UploadController {

    constructor() {
        throw new Error("UploadController is a static class");
    }

    /**
     * upload image to firebase storage
     * @returns returns user info
     */
    static async uploadImage(image: {uri: string}): Promise<string> {
        let fileName = '';
        let fileUri = image.uri;

        let randomText = '';
        var characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 20; i++) {
            randomText += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        fileName = randomText + '.jpg';

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
            .getDownloadURL()
            .catch((error) => {
                console.log("[LOG] error:", error)
                throw new Error(error.message)
            })
        return uploadedImage;
    }
}
