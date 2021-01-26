import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';

const Upload = () => {
  const [filePath, setFilePath] = useState({});

  const uploadImage = async (response) => {
    const jsonValue = await AsyncStorage.getItem('userToken')
    const parseObj = JSON.parse(jsonValue)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + parseObj.accessToken);
    const formdata = new FormData();
    formdata.append("image", response.base64);
    formdata.append("type", "base64");

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    await fetch("https://api.imgur.com/3/upload", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .then(alert("Your picture has been uploaded"))
      .catch(error => console.log('error', error));

  }

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30,
      saveToPhotos: true,
      includeBase64: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setFilePath(response);
        uploadImage(response);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response);
      uploadImage(response);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.titleText}>
        Upload your image to Imgur
      </Text>
      <View style={styles.container}>
        <Image
          source={{ uri: filePath.uri }}
          style={styles.imageStyle}
        />
        <Image style={styles.img} source={require("../assets/upload.gif")}/>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}>
          <Text style={styles.textStyle}>
            Take a picture
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Choose Stored Image</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 10,
    // backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    // paddingBottom: 20,
    // marginBottom: 10,
    // textAlignVertical: "center",
    color: 'white',
    // textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#2C1E5A',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  img: {
    width: 150,
    height: 150,
  }
});