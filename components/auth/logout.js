import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { revoke } from 'react-native-app-auth';
import { IMGUR_CLIENT_ID, IMGUR_CLIENT_SECRET, IMGUR_REDIRECT_URI } from '@env';


const Logout = ({ user, refreshUserStateLogout }) => {

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


    const signOut = async () => {
        try {
            await revoke(config, {
                tokenToRevoke: user.accessToken,
                includeBasicAuth: true,
                sendClientId: true,
            });
            await AsyncStorage.removeItem('userToken');
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                signOut();
                refreshUserStateLogout();
            }}>
                <Text style={styles.loginBtnText}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    logoutBtn: {
        backgroundColor: '#2C1E5A',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        height: 55
    },
    loginBtnText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    },
});

export default Logout;