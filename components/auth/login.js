import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authorize } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IMGUR_CLIENT_ID, IMGUR_CLIENT_SECRET, IMGUR_REDIRECT_URI } from '@env';

const Login = ( { refreshUserStateLogin } ) => {
    const [dataLocalStorage, setDataLocalStorage] = useState(null);
    
    const config = {
        issuer: 'https://api.imgur.com/',
        clientId: IMGUR_CLIENT_ID,
        clientSecret: IMGUR_CLIENT_SECRET,
        redirectUrl: IMGUR_REDIRECT_URI,
        serviceConfiguration: {
            authorizationEndpoint: 'https://api.imgur.com/oauth2/authorize',
            tokenEndpoint: 'https://api.imgur.com/oauth2/token',
            revocationEndpoint: 'https://api.imgur.com/oauth2/revoke'
        }
    };

    useEffect(() => {
        getLocalStorageData();
    }, [])
    
    const getLocalStorageData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('userToken');
            jsonValue != null ? setDataLocalStorage(JSON.parse(jsonValue)) : setDataLocalStorage(null);
        } catch(error) {
            console.log(error);
        }
    };

    const signIn = async () => {
        try {
            const result = await authorize(config);
            const jsonValue = JSON.stringify({
                'accessToken': result.accessToken,
                'tokenAdditionalParameters': result.tokenAdditionalParameters
            });
            await AsyncStorage.setItem('userToken', jsonValue);
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => {
                signIn();
                refreshUserStateLogin(dataLocalStorage);
            }}>
                <Text style={styles.loginBtnText}>
                    Login
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    loginBtn: {
        backgroundColor: '#2C1E5A',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        height:55
    },
    loginBtnText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default Login;