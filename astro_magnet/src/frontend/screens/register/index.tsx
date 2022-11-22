import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin'
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Image, View, Text } from 'react-native'

import { AuthenticationController } from '../../../controller/authentication'
import Background from '../../components/background'
import RegistrationHeader from '../../components/registration/header'
import Messages from "../../../theme/messages";
import {TOAST_SHOW_TIME} from "../../../config";
import {state} from "../../../store";

const Register = () => {
    const toastRef = useRef();
    const onGoogleButtonPress = async () => {
        const result = await AuthenticationController.googleSignIn();
        console.log('authentication user ========>', result);
        // if (status) {
        //     state.user.currentUser = user;
        // } else {
        //     onFailure(error);
        // }
    }

    const onFailure = (message) => {
        if (message && message.length > 0) {
            // toastRef.current.show(message, TOAST_SHOW_TIME);
        } else {
            // toastRef.current.show(Messages.NetworkError, TOAST_SHOW_TIME);
        }
    }

    return (
        <Background>
            <RegistrationHeader />
            <GoogleSigninButton
                style = {{width: 300, height: 65, alignSelf: "center"}}
                onPress = { onGoogleButtonPress }
            />
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
