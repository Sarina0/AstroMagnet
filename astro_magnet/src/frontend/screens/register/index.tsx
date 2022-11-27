import { StyleSheet } from 'react-native';
import RegistrationHeader from '@app/frontend/components/register/header'
import SignInButton from '@app/frontend/components/register/signInButton';
import SafeArea from '@app/frontend/components/global/safeArea';

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
        <SafeArea>
            <RegistrationHeader />
            <SignInButton onError={onFailure} />
        </SafeArea>
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
