import RegistrationHeader from '@app/frontend/components/auth/header'
import SignInButton from '@app/frontend/components/auth/signInButton';
import SafeArea from '@app/frontend/components/global/safeArea';
import { useToast } from 'native-base';
import ToastDialog from '@app/frontend/components/global/toast';

const Register = () => {
    const toast = useToast();

    /**
     * function handle sign in error
     * @param {string} message
     */
    const onFailure = (message: string) => {
        toast.show({
            render: () => (
                <ToastDialog message={message} />
            )
        })
    }

    return (
        <SafeArea>
            <RegistrationHeader />
            <SignInButton onError={onFailure} />
        </SafeArea>
    )
}

export default Register;
