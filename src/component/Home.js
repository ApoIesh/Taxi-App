import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, StatusBar, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getLocation, GOOGLE_MAPS_APIKEY } from '../functions/Functions';
import { Button } from './Assets/common/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles, { fontmedum, wp, hp, borderColor, Secondary_color, bluesky_color } from './Assets/style/styles';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MFInitiatePayment, MFCurrencyISO, MFPaymentRequest, MFLanguage, MFProduct, MFCustomerAddress } from 'myfatoorah-reactnative';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 30;
const LONGITUDE = 30;
const LATITUDE_DELTA = 20;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Map extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      region: {},
      userLocation: null,
      coordinates: [],
      modalVisible: true, agree: false,
      selected_paymethod: null, paymentMethods: [], prise: '50'
    };
    this.mapView = null;
    this.navigate = this.props.navigation.navigate
  }
  async componentDidMount() {
    this.sign_in()
    this.setUser()
    this.currentPossition()
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
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }


 
  render_ = ({ item, index, Item }) => {
    const { selected_paymethod } = this.state
    // console.log(item);
    Item = ({ CurrencyIso, ImageUrl, PaymentMethodId, IsDirectPayment, IsEmbeddedSupported, PaymentCurrencyIso,
      PaymentMethodAr, PaymentMethodCode, PaymentMethodEn, ServiceCharge, TotalAmount, }) => {
      return (
        <TouchableOpacity
          activeOpacity={.9}
          onPress={() => {
            this.setState({ selected_paymethod: item.PaymentMethodId, payment_index: index })
          }}
        >
          <View style={{ ...styles.viewPayCards, borderColor: item.PaymentMethodId === selected_paymethod ? bluesky_color : borderColor }}>
            <Image
              style={styles.imagesPay}
              source={PaymentMethodId != -1 ? { uri: ImageUrl } : require('../component/Assets/images/firebasee.png')} />
            <Text style={styles.textPay}>{PaymentMethodCode}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <Item
        CurrencyIso={item.CurrencyIso}
        ImageUrl={item.ImageUrl}
        IsDirectPayment={item.IsDirectPayment}
        IsEmbeddedSupported={item.IsEmbeddedSupported}
        PaymentCurrencyIso={item.PaymentCurrencyIso}
        PaymentMethodCode={item.PaymentMethodCode}
        PaymentMethodEn={item.PaymentMethodEn}
        PaymentMethodId={item.PaymentMethodId}
        ServiceCharge={item.ServiceCharge}
        TotalAmount={item.TotalAmount}
        PaymentMethodAr={item.PaymentMethodAr}
      />
    )
  };


  render() {
    const { paymentMethods, prise, agree } = this.state
    return (
      <View style={styles.container}>
        <StatusBar hidden />


        <Modal animationType="fade"
          transparent={true}
          hardwareAccelerated={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }} >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Choose payment method</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.priceText}>{prise}  </Text>
                <Text style={styles.priceText_}>Trip costs</Text>

              </View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                key={'###'}
                style={{
                  alignSelf: 'center',
                  marginTop: hp(2), marginBottom: hp(2)
                }}
                ItemSeparatorComponent={() =>
                  <View style={{
                    width: wp(2),

                  }} />}
                data={paymentMethods}
                renderItem={this.render_}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                onPress={() => this.setState({ agree: !agree })}
                activeOpacity={.9}
                style={{ flexDirection: 'row', margin: hp(3), }}>
                <View
                  style={{
                    backgroundColor: agree ? bluesky_color : '#ddd',
                    width: wp(5),
                    height: wp(5),
                    borderRadius: wp(5 / 2),
                  }}>
                  {agree ? <AntDesign
                    name='check'
                    color={'#fff'}
                    size={wp(5)}
                  />
                    : null}
                </View>

                <Text style={{
                  ...styles.textInput, marginStart: wp(2)
                }}>Agree to the terms and conditions</Text>

              </TouchableOpacity>
              <View style={{ alignItems: 'center' }}>
                <Button label={'Payment'} />
              </View>
            </View>
          </View>


        </Modal>


        <View style={styles.buttons}>
          <Button label={'Pay'} onPress={() => this.setModalVisible()} />
          <Button label={'Start'} />
          <Button label={'Chat'} onPress={() => this.goToChat()} />
        </View>
      </View>
    );
  }
}

export default Map;