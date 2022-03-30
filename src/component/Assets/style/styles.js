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
  buttons:{
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
  messageCard:{
    borderColor: '#000',
    borderRadius: wp(15),
    width: wp(85),
    flexDirection: 'row',
    backgroundColor: bluesky_color,
    // alignItems: 'center',
    elevation: wp(2)
},
  messageStyle:{
    color: '#000',
    fontSize: wp(4.5),
    fontFamily: fontRegular,
    width: wp(80),
    padding: wp(4),
},
  mapStyle:{
    borderColor: '#aaa',
    borderRadius: wp(2),
    width: wp(54),
    flexDirection: 'row',
    backgroundColor: bluesky_color,
    alignItems: 'center',
    elevation: wp(2),
    padding: wp(2)
}


});
export default styles;
