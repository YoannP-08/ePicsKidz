import React, { useState } from 'react';
import {  View, Text, StyleSheet, LogBox, Button, Image, ImageBackground, TouchableOpacity, Touchable } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import SearchImg from './components/Search';
import UserPicture from "./components/UserPicture";
import Favorite from "./components/Favorite";
import Upload from './components/upload.js';

// ignore specific yellowbox warnings
LogBox.ignoreLogs([
  'Require cycle: node_modules'
])

const App = () => {
  const [user, setUser] = useState(null);
  const Stack = createStackNavigator();

  const refreshUserStateLogin = (res) => {
    setUser(res);
  };

  const refreshUserStateLogout = () => {
    setUser(null);
  };
  function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1}}>
        <ImageBackground source={require('./assets/homepage.jpg')}  style={styles.imageHome} >
        {user != null ? (
        <View style={{flexDirection: 'row',justifyContent:'space-between'}}>
          <View style={{marginRight:50}}>
            <TouchableOpacity  style={styles.touchableBTN} onPress={() => navigation.navigate('Search New Pictures')}>
                {/* <Image source={{uri:IconSearch}}/> */}
                <Image source={require("./assets/searchIcon.png")}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableBTN} onPress={() => navigation.navigate('Upload')}>
              <Image source={require("./assets/camera.png")}/>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.touchableBTN} onPress={() => navigation.navigate('Favorites')} >
              <Image source={require("./assets/favorites.png")}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchableBTN} onPress={() => navigation.navigate('My Pictures')} >
              <Image source={require("./assets/pictures.png")}/>
            </TouchableOpacity>
          </View>
        </View>
        ):(
          <View style={styles.containerHome}>
            <ImageBackground source={require('./assets/homepage.jpg')}  style={styles.imageHome}>
              <Text style={styles.textHome}>Welcome to ePicsKidz Please login to access the App</Text>
            </ImageBackground>
          </View>
        )}
        </ImageBackground>
      </View>
    );
  }

  function LogoTitle() {
    return (
      <View style={styles.header}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.tinyLogo}
        />
        <Text style={styles.appName}>ePicsKidz</Text>
      </View>
    );
  }

  return (
      <NavigationContainer>
        <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle:{backgroundColor: '#2C1E5A'},
          headerTintColor: 'white',
        }}
        >
          {user == null ? (
            <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              headerStyle:{backgroundColor: '#2C1E5A'},
              headerTintColor: 'white',
              headerTitleStyle: {fontWeight: 'bold'},
              headerTitle: props => <LogoTitle {...props}/>,
              headerRight: () => (
                <Login refreshUserStateLogin={refreshUserStateLogin}/>
              ),
            }}
            />
          ) : (
            <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
              headerStyle:{backgroundColor: '#2C1E5A'},
              headerTintColor: 'white',
              headerTitleStyle: {fontWeight: 'bold'},
              headerTitle: props => <LogoTitle {...props}/>,
              headerRight: () => (
                <Logout refreshUserStateLogout={refreshUserStateLogout}/>
              ),
            }}
            />
          )}
              <Stack.Screen name="Upload">
                {props => <Upload {...props} />}
              </Stack.Screen> 
              <Stack.Screen name="My Pictures">
                {props => <UserPicture/>}
              </Stack.Screen> 
              <Stack.Screen name="Favorites">
                {props => <Favorite user={user}/>}
              </Stack.Screen>
              <Stack.Screen name="Search New Pictures">
                {props => <SearchImg user={user}/>}
              </Stack.Screen> 
          </Stack.Navigator> 
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  appName: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 5
  },
  containerHome:{
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
  },
  imageHome:{
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    // opacity: 0.9,

  },
  textHome: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: "#000000a0"
  },
  tinyLogo: {
    width: 25,
    height: 25,
    marginTop: 3
  },
  touchableBTN:{
    height: 140, 
    width:160, 
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor:"#2C1E5A",
    alignItems:"center", 
    justifyContent:"center",
    marginBottom:50,
    borderRadius:40

  },
});

export default App;
    