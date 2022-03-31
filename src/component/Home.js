import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text, StatusBar, Modal, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getLocation, GOOGLE_MAPS_APIKEY } from '../functions/Functions';
import { Button } from './Assets/common/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles, { fontmedum, wp, hp, borderColor, Secondary_color, bluesky_color, contentColor } from './Assets/style/styles';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MFInitiatePayment, MFCurrencyISO, MFPaymentRequest, MFLanguage, MFProduct, MFCustomerAddress, MFExecutePaymentRequest, MFMobileCountryCodeISO, MFPaymentype, MFCardInfo } from 'myfatoorah-reactnative';
import { rendererror } from '../config';
import { navigate } from '../NavigationActions';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 30;
const LONGITUDE = 30;
const LATITUDE_DELTA = 20;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Map extends Component {
  constructor(props) {
    super(props);
    // console.log(auth()._user._user.uid);
    this.state = {
      userId: auth()._user._user.uid,
      region: {},
      userLocation: null,
      coordinates: [],
      modalVisible: false, agree: false,
      selected_paymethod: null, paymentMethods: [], invoiceValue: '2000',
      email: 'mohammed.hassan26895@gmail.com', payment_index: null,
    };
    this.mapView = null;
    this.navigate = this.props.navigation.navigate
    this.initiatePayments()
  }
  goToPay() {
    // this.navigate("MFWebView")
    const {
      selected_paymethod, paymentMethods, agree, invoiceValue, payment_index, email,userId,
    } = this.state
    const value = invoiceValue
    const data = { invoiceValue, selected_paymethod, email,userId }
    if (!agree) {
      rendererror(`${'agreeText'} ${'policyTerms'}`)
      return
    } if (!paymentMethods[payment_index] && !selected_paymethod && value > 0) {
      rendererror('choosePayment')
    }
    else {
      if (value == 0) {
        rendererror('you have take trip')
      } else if (selected_paymethod > 0) {
        navigate('Payments', { data, paymentMethods, invoiceValue: value, selectedIndex: payment_index, })
        // this.executeDirectPayment()
        // this.navigate("MFWebView")
      } else if (selected_paymethod == -1) {
        rendererror('choosePayment')
      }
    }
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
        // console.log('User signed in anonymously',);
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          // console.log('Enable anonymous in your firebase console.');
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
  initiatePayments() {
    let initiateRequest = new MFInitiatePayment(50, MFCurrencyISO.KUWAIT_KWD)
    MFPaymentRequest.sharedInstance.initiatePayment(initiateRequest, MFLanguage.ENGLISH, (response: Response) => {
      if (response.getError()) {
        alert('error: ' + response.getError().error);
      }
      else {
        let paymentMethods = response.getPaymentMethods();
        this.setState({
          paymentMethods: [...paymentMethods, {
            PaymentMethodId: -1, PaymentMethodAr: 'bankTransfer', PaymentMethodEn: 'bankTransfer'
          }]
        })
      }
    });
  }
  executeResquestJson() {
    const {
      selected_paymethod, paymentMethods, email, invoiceValue, payment_index,
    } = this.state
    let request = new MFExecutePaymentRequest(parseFloat(invoiceValue), paymentMethods[payment_index].PaymentMethodId);
    request.customerEmail = email ? email : userRegister.email // must be email
    request.customerMobile = '0512345678';
    request.customerCivilId = "";
    let address = new MFCustomerAddress("ddd", "sss", "sss", "sss", "sss");
    request.customerAddress = address;
    request.customerReference = "";
    request.language = "en";
    request.mobileCountryCode = MFMobileCountryCodeISO.KUWAIT;
    request.displayCurrencyIso = MFCurrencyISO.KUWAIT_KWD;
    // var productList = []
    // var product = new MFProduct("ABC", 1.887, 1)
    // productList.push(product)
    // request.invoiceItems = productList
    return request;
  }
  getCardInfo() {
    let cardExpiryMonth = '05'
    let cardExpiryYear = '21'
    let cardSecureCode = '100'
    let paymentType = MFPaymentype.CARD
    // let paymentType = MFPaymentype.TOKEN
    let saveToken = false
    let card = new MFCardInfo('5123450000000008', cardExpiryMonth, cardExpiryYear, cardSecureCode, paymentType, saveToken)
    card.bypass = true
    return card
  }
  executeDirectPayment() {
    let request = this.executeResquestJson();
    let cardInfo = this.getCardInfo()
    MFPaymentRequest.sharedInstance.executeDirectPayment(this.props.navigation, request, cardInfo, MFLanguage.ENGLISH, (response: Response) => {

      if (response.getError()) {
        alert('error: ' + response.getError().error)
      }
      else {
        // alert(response.getBodyString())
        var paymentStatusResponse = response.getBodyJson().getPaymentStatusResponse;
        var invoiceId = paymentStatusResponse.InvoiceId
        alert('success with Invoice Id: ' + invoiceId + ', Invoice status: ' + paymentStatusResponse.InvoiceStatus);
      }
    });
  }

  render() {
    const { paymentMethods, invoiceValue, agree, email, modalVisible } = this.state
    // console.log(agree);
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
            : this.state.coordinates.map((coordinate, index) =>
              <Marker
                key={`coordinate_${index}`}
                coordinate={coordinate}
                description={'description test'}
                title={'test'}
              />
            )}
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
              }} />)}
        </MapView>
        <Modal animationType="fade"
          transparent={true}
          hardwareAccelerated={false}
          visible={this.state.modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <AntDesign
                style={{ alignSelf: 'flex-end' }}
                name='close'
                color={'#000'}
                size={wp(5)}
                onPress={() => this.setModalVisible(!modalVisible)}
              />
              <Text style={styles.modalText}>Choose payment method</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.priceText}>{invoiceValue}  </Text>
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
              <View style={styles.viewStyleSingUp}>
                <Text style={{ color: contentColor }} >user email</Text>
                <TextInput
                  value={email}
                  onChangeText={(email) => this.setState({ email })}
                  keyboardType='default'
                />
              </View>
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
                <Button label={'Payment'}
                  onPress={this.goToPay.bind(this)} />
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