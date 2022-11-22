import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Messages from "../../theme/messages";

/**
 * Authentication controller to handle authentication
 */
export abstract class AuthenticationController {

    constructor() {
        throw new Error("Controller cannot be initialized")
    }

    /**
     * Authenticate the user to google
     * @returns returns user info
     */
    static async googleSignIn(): any {
         // Get the users ID token
         try {
            // Await for the user to select the sign in method
            const { idToken } = await GoogleSignin.signIn();

             console.log('idToken =====>', idToken);

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            let userInfo: FirebaseAuthTypes.UserCredential

            try {

                // Get user information
                userInfo = await auth().signInWithCredential(googleCredential);
                console.log('user info =====>', userInfo);
                // Save user to firebase database
                const user = userInfo.user;
                const _user = await firestore()
                  .collection('Users')
                  .where('email', '==', user.email)
                  .get();


                if (_user && _user._docs.length > 0) {
                  const error = Messages.AlreadyExistEmail;
                  return {
                    status: false,
                    error
                  };
                } else {
                  const data = {
                    name: user.displayName,
                    email: user.email,
                    profilePicture: user.photoURL,
                    dateAndTimeOfBirth: '',
                    placeOfBirth: '',
                    interestedType: '',
                    sex: '',
                    like: [],
                    dislike: []
                  }
                  const createdUser = await firestore()
                    .collection('Users')
                    .add(data);

                  const userId = createdUser._documentPath?._parts[1];
                  return {
                    status: true,
                    user: {
                        ...data,
                        userId
                    }
                  };
                }
            } catch (e: any) {
                // If any error occurs display an error
                console.error("Error occured +========>", e);
                return null
            }
        } catch (e: any) {
            // This error will most likely occur if the user
            // does not have an internet connection
            console.error(e.message as { message: string });
             return null
        }
    }

    /**
     * get user info from firebase database
     * @returns returns user info
     */
    static async getUserInfo(email): any {
        const _user = await firestore()
            .collection('Users')
            .where('email', '==', email)
            .get();

        if (_user && _user._docs.length > 0) {
            return {
                status: true,
                user: _user.docs[0]
            };
        } else {
            const error = Messages.AlreadyExistEmail;
            return {
                status: false,
                error
            };
        }
    }

}
