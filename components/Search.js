import React, { useState } from 'react';
import { Image, FlatList, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IMGUR_CLIENT_ID } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchImg = ({user}) => {
    const [input, setInput] = useState('');
    const [searchPics, setSearchPics] = useState([]);

    const updateSearch = (inputValue) => {
        setInput(inputValue);
    };

    const getSearchPics = async () => {
        try {
            await fetch(`https://api.imgur.com/3/gallery/search/?q_all=${input}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
                }
            }).then(res => res.json())
            .then(res => { 
                for (let i = 0; i < res.data.length; i++ ) {
                    if (res.data[i].hasOwnProperty('images')) {
                        if (!res.data[i].images[0].link.includes('mp4')) {
                            setSearchPics(searchPics => [...searchPics, res.data[i]])
                        }
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const addToMyImg = async (link) => {
        const jsonValue = await AsyncStorage.getItem('userToken')
        const parseObj = JSON.parse(jsonValue)
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + parseObj.accessToken);
        const formdata = new FormData();
        formdata.append("image", link);
        formdata.append("type", "URL");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

    await fetch("https://api.imgur.com/3/image", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .then(alert("Your picture has been added to your images"))
        .catch(error => console.log('error', error));
    }

    const addToMyFav = async (img) =>{
        console.log(img.images[0].id)
        await fetch(`https://api.imgur.com/3/image/${img.images[0].id}/favorite`,{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${user.accessToken}`
            }
        }).then(res => res.text())
        .then(result => console.log(result))
        .then(alert('Picture has been added to your favorites!'))
        .catch(error => console.log('error', error))
        // .then(res => res.json())
        // .then(res => console.log(res))
    }

    const renderImage = (img) => {
        return (
            <View style={styles.renderSearchImg}>
                <Text style={styles.textSearchImg}>{img.title}</Text>
                <Image source={{ uri: img.images[0].link }} style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTopLeftRadius: 0, borderTopRightRadius: 0, height:200, width:200 }} />
                <View style={styles.buttonsImg}>
                    <TouchableOpacity style={styles.buttonPic} onPress={() => addToMyImg(img.images[0].link)} >
                        <Image source={require('../assets/pictures.png')} style={{ height:40, width:40}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonFav} onPress={() => addToMyFav(img)} >
                        <Image resizeMode='cover' source={require('../assets/favorites.png')} style={{ height:40, width:40}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View>
            <View style={styles.container}>
                <TextInput
                    color='white'
                    style={styles.searchBar}
                    placeholder='Images, #tags...'
                    placeholderTextColor="#fff" 
                    onChangeText={updateSearch}
                    value={input}
                    onSubmitEditing={getSearchPics}
                />
                <Image
                    style={styles.tinyLogo}
                    source={require('../assets/search.png')}
                />                
            </View>

            <View>
                <SafeAreaView>
                    <FlatList
                        numColumns={2}
                        data={searchPics}
                        initialNumToRender={4}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => renderImage(item)}
                    />
                </SafeAreaView>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    buttonFav: {
        alignItems:"center", 
        bottom: 0,
        right: 15,
        justifyContent:"center",
        // position: "absolute",
    },
    buttonPic: {
        alignItems:"center", 
        bottom: 0,
        left: 15,
        justifyContent:"center",
        // position: "absolute",
    },
    buttonsImg:{
        // bottom: 40,
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: "relative",

    },
    container: {
        backgroundColor: '#2C1E5A',
        borderRadius: 10,
        // flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin:10,
    },
    renderSearchImg: {
        margin: 3,
    },
    searchBar:{
        borderRadius: 10,
        fontSize: 20,
        paddingLeft: 10,
    },
    textSearchImg: {
        backgroundColor: '#2C1E5A',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        color: 'white',
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5,
        flex: 1,
        flexGrow: 1,
        width: 200,
    },
    tinyLogo: {
        height: 25,
        margin: 10,
        width: 25,
    },
});


export default SearchImg;