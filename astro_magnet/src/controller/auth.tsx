import GoogleSignIn from "@app/config/auth";
import { statusCodes } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

/**
 * function to sign in with google
 * @returns {Promise<firebase.auth.UserCredential>} user credential
 */
export async function signInWithGoogle(onError: (message: string) => void) {
    try {
        const { idToken } = await GoogleSignIn.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      } catch(error:any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            onError("User cancelled the login flow");
        } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            onError("Operation is in progress already");
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            onError("Play services not available or outdated");
        } else {
            // some other error happened
            onError(error.message);
        }
    }
}

/**
 * function for sign out
 * @returns {Promise<void>}
 */
export async function signOut(): Promise<void> {
    try {
        await GoogleSignIn.revokeAccess();
        await GoogleSignIn.signOut();
        return auth().signOut();
    } catch (error:any) {
        console.error(error);
    }
}