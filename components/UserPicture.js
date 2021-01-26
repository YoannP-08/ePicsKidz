import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Image, ScrollView, SafeAreaView, Text, Button, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPicture = () => {
    const [pictures, setPictures] = useState([])

    useEffect(() =>{
        fetchPicture();
    },[])

    fetchPicture = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('userToken');
        parseObj = JSON.parse(jsonValue);
        fetch("https://api.imgur.com/3/account/me/images", {
            headers: {
                'Authorization': `Bearer ${parseObj.accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(res => res.json())
        .then(res => setPictures(res.data))
        } catch(e) {
            console.log(e)
        }
    }

    const deleteImg = async (id) => {
        try {
            const jsonValue = await AsyncStorage.getItem('userToken');
            parseObj = JSON.parse(jsonValue);
            fetch(`https://api.imgur.com/3/image/${id}`, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${parseObj.accessToken}`,
            },
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .then(setPictures(pictures.filter((picture) => picture.id !== id)))
        }catch(e) {
            console.log(e)
        }
    }
    
    return(
        <SafeAreaView style={{marginTop:20}} >
            <ScrollView>
                {
                    pictures.map((picture,index) => (

                        <View   key={index}  style={{marginBottom:20}}>
                            <Image
                            source={{uri:picture.link}}
                            style={{height:300, width:550}}
                            />
                            <TouchableOpacity style={styles.button} onPress={() => deleteImg(picture.id)} >
                                <Image source={require("../assets/poubelle.png")}/>
                            </TouchableOpacity>
                        </View>

                    ))
                }
            </ScrollView>
        </SafeAreaView >
    )

}
export default UserPicture;

const styles = StyleSheet.create({

    button:{
        alignItems:"center", 
        justifyContent:"center",
        position: "absolute",
        bottom: 0,
        left: "45%"
    },
});