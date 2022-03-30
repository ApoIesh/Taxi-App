import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getLocation, GOOGLE_MAPS_APIKEY } from '../functions/Functions';
import { Button } from './Assets/common/Button';
import styles, { bluesky_color } from './Assets/style/styles';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 30;
const LONGITUDE = 30;
const LATITUDE_DELTA = 20;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// origin
class Map extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      region: {},
      userLocation: null,
      coordinates: [],
    };
    this.mapView = null;
    this.navigate = this.props.navigation.navigate


  }
  async componentDidMount() {
    this.sign_in()
    this.setUser()
    this.currentPossition()


  }
  async componentDidUpdate() {

  }

  sign_in() {
    auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously',);
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }
        console.error(error);
      });
  }
  setUser() {
    auth().onAuthStateChanged((user) => {
      this._storeData(user)
    });
  }
  _storeData = async (user) => {
    // console.log('sss', user);
    try {
      await AsyncStorage.setItem('UserId', user._user.uid);
    } catch (error) {
      console.log('AsyncStorage actions ', error);
    }
  }

  async currentPossition() {
    const region = await getLocation()
    // console.log('region', region);
    if (region) {
      this.setState({
        userLocation: {
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      })
    }
  }

  onMapPress = (e) => {
    console.log(e.nativeEvent);
    this.setState({
      coordinates: [
        // ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  goToChat() {
    const { userLocation } = this.state
    this.navigate("ChatScreen", userLocation)
  }
  render() {
    // const { userChat } = this.state
    // console.log(userChat);
    return (
      <View style={styles.container}>
        <StatusBar hidden />

        <MapView
          initialRegion={
            this.props.route.params ?
              {
                latitude: this.props.route.params.latitude,
                longitude: this.props.route.params.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
              } :
              {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
          onRegionChange={() => this.currentPossition()}

          rotateEnabled={true}
          pitchEnabled={true}
          provider={PROVIDER_GOOGLE}
          showsIndoorLevelPicker={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          loadingIndicatorColor={bluesky_color}
          showsUserLocation={true}
          style={StyleSheet.absoluteFill}
          ref={c => this.mapView = c}
          onPress={this.onMapPress}
        >

          {this.props.route.params ?
            <Marker
              coordinate={{
                latitude: this.props.route.params.latitude,
                longitude: this.props.route.params.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
              }}
              description={'description test'}
              title={'test'}
            />


            :

            this.state.coordinates.map((coordinate, index) =>
              <Marker
                key={`coordinate_${index}`}
                coordinate={coordinate}
                description={'description test'}
                title={'test'}
              />
            )
          }
          {(this.state.coordinates.length >= 0) && (
            <MapViewDirections
              origin={this.state.userLocation}
              waypoints={(this.state.coordinates.length > 0) ? this.state.coordinates.slice(1, -1) : undefined}
              destination={this.state.coordinates[this.state.coordinates.length - 1]}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={5}
              strokeColor={bluesky_color}
              optimizeWaypoints={true}
              splitWaypoints={true}
              onReady={result => {
                this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width / 20),
                    bottom: (height / 20),
                    left: (width / 20),
                    top: (height / 20),
                  }
                });
              }}
              onError={(errorMessage) => {
                console.log('GOT AN ERROR', errorMessage);
              }}
            />
          )}
        </MapView>
        <View style={styles.buttons}>
          <Button label={'Pay'} onPress={() => this.navigate("Subscribe")} />
          <Button label={'Start'} />
          <Button label={'Chat'} onPress={() => this.goToChat()} />
        </View>
      </View>
    );
  }
}

export default Map;