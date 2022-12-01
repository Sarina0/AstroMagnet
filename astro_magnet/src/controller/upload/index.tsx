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
    static async uploadImage(image: {
        uri: string
        name?: string
    }): Promise<string> {

        //get image name
        let fileName = image.name;

        //get image uri
        let fileUri = image.uri;

        //if image name is not provided
        if (!fileName) {

            //generate random image name
            let randomText = '';
            var characters =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < 20; i++) {
                randomText += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            fileName = randomText + '.jpg';
        }
        

        if (Platform.OS === 'ios') {
            if (fileUri.indexOf('file://') === 0) {
                fileUri = fileUri.replace('file://', '');
            }
        } else {
            if (fileUri.indexOf('://') < 0) {
                fileUri = 'file://' + fileUri;
            }
        }

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

