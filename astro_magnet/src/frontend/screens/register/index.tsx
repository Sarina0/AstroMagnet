import { StyleSheet, Image, Button } from 'react-native';
import Background from '../../components/background'
import RegistrationHeader from '../../components/registration/header'
import SignInButton from '@app/frontend/components/global/signInButton';

const Register = () => {

    /**
     * function handle sign in error
     * @param {string} message
     */
    const onFailure = (message: string) => {
        if (message && message.length > 0) {
            // toastRef.current.show(message, TOAST_SHOW_TIME);
        } else {
            // toastRef.current.show(Messages.NetworkError, TOAST_SHOW_TIME);
        }
    }

    return (
        <Background>
            <RegistrationHeader />
            <SignInButton onError={onFailure} />
        </Background>
    )
}

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    }
})
