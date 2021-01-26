import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMGUR_CLIENT_ID } from '@env';

const Favorite = ( { user } ) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        getFavorites();
    }, [])

    const getFavorites = async () => {
        try {
            await fetch(`https://api.imgur.com/3/account/${user.tokenAdditionalParameters.account_username}/favorites`, {
                method: 'GET',
                headers: {
                    'Authorization':`Bearer ${user.accessToken}`,
                }
            })
            .then(res => res.json())
            // .then(res => console.log(res.data))
            .then(res => setFavorites(res.data))
        }catch(e) {
            console.log(e)
        }
    }

    // https://api.imgur.com/3/image/oOrXpOY/favorite?client_id=546c25a59c58ad7

    const removeImgFav = async (id) => {
        try {
            await fetch(`https://api.imgur.com/3/image/${id}/favorite?${IMGUR_CLIENT_ID}`, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${user.accessToken}`,
            },
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .then(setFavorites(favorites.filter((img) => img.id !== id)))
        }catch(e) {
            console.log(e)
        }
    }

    return (
        <View>
            { favorites.length == 0 ? (
                    <View>
                        <Text>No Picture in your favorites</Text>
                    </View>
                ):(
                    <SafeAreaView style={{marginTop:20}} >
                        <ScrollView>
                        { favorites.map((img, index) => (

                            <View key={index} style={{marginBottom:20}}>
                                <Image
                                    source={{uri: img.link}}
                                    style={{height:300, width:550}}
                                />
                                <TouchableOpacity style={styles.button} onPress={() => removeImgFav(img.id)} >
                                    <Image source={require("../assets/poubelle.png")}/>
                                </TouchableOpacity>
                            </View>
                        ))
                        }
                        </ScrollView>
                    </SafeAreaView >
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    button:{
        alignItems:"center", 
        justifyContent:"center",
        position: "absolute",
        bottom: 0,
        left: "45%"
    },
})

export default Favorite;