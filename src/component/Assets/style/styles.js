'use strict';
import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';


export const wp = widthPercentageToDP;
export const hp = heightPercentageToDP;


// fonts
export const fontLight = 'DIN NEXT™ ARABIC LIGHT';
export const fontRegular = 'DIN NEXT™ ARABIC REGULAR';
export const fontmedum = 'DIN Next LT W23 Medium';
export const fontBold = 'DIN NEXT™ ARABIC BOLD';


export const black_color = "#000"
export const white_color = "#fff"
export const gray_color = "#8b8989"
export const light_gray_color = "#cccc"
export const bluesky_color = "rgb(54,132,196)"
export const primaryyellow_color = "#ffad0a"
export const Primary_Purble_color = "#482796"
export const Secondary_color = "#b35f9a"
export const Hover_color = "#efebfa"


export const contentColor = '#8b8989'
export const borderColor = '#eaeaff'
export const textInputColor = '#000'
export const vectorIconColor = '#b8b8d2'


const styles = StyleSheet.create({

  //First
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // home
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'flex-end',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  InputChat: {
    width: wp(75),
    // height:hp(6),
    fontSize: wp(5),
    borderBottomWidth: wp(.05),
    borderColor: '#ccc',
    textAlign: 'center',
    color: black_color
  },
  messageCard: {
    borderColor: '#000',
    borderRadius: wp(15),
    width: wp(85),
    flexDirection: 'row',
    backgroundColor: bluesky_color,
    // alignItems: 'center',
    elevation: wp(2)
  },
  messageStyle: {
    color: '#000',
    fontSize: wp(4.5),
    fontFamily: fontRegular,
    width: wp(80),
    padding: wp(4),
  },
  mapStyle: {
    borderColor: '#aaa',
    borderRadius: wp(2),
    width: wp(54),
    flexDirection: 'row',
    backgroundColor: bluesky_color,
    alignItems: 'center',
    elevation: wp(2),
    padding: wp(2)
  },
  viewPayCards: {
    width: wp(25),
    // height: hp(7),
    borderWidth: 1,
    borderRadius: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
    paddingVertical: hp(3),

  },
  imagesPay: {
    width: wp(10), height: hp(5),
    resizeMode: 'contain'
  },
  textPay: {
    fontFamily: fontmedum,
    color: '#000',
    fontSize: wp(3.5)
  },
//modal
centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: wp(2),
    backgroundColor: "white",
    borderRadius: wp(5),
    padding: wp(3),
    // alignItems: "center",
    width: wp(75),
    height: hp(75),
    shadowColor: "#000",
    shadowOffset: {
      width: wp(2),
      height: wp(2)
    },
    shadowOpacity: wp(2),
    shadowRadius: wp(4),
    elevation: wp(5)
  },
  modalText: {
    fontWeight:'bold'
  },
  priceText:{
    fontSize:wp(5),
    color:bluesky_color
  },
  priceText_:{
    fontSize:wp(4),
    color:black_color,
    alignSelf:'flex-end'
  },

});
export default styles;
{/* <MapView
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
</MapView> */}