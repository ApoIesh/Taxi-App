import React from 'react';
import { Text, Image, View, TouchableWithoutFeedback } from 'react-native';
import styles, { hp, wp, Primary_Purble_color, fontBold } from '../style/styles';

// import { L } from '../../../Config';
const Main_Button = ({
    text,
    marginB,
    marginT,
    btn_width,
    onPress,
    backgroundColor,
    textColor,
    borderWidth,
    elevation
}) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View

                style={{
                    elevation: elevation ? elevation : 0,
                    width: btn_width ? btn_width : wp(90),
                    marginBottom: marginB ? marginB : hp(2),
                    marginTop: marginT ? marginT : 0,
                    backgroundColor: backgroundColor ? backgroundColor : Primary_Purble_color,
                    alignSelf: 'center',
                    borderRadius: wp(8),
                    height: hp(6.8),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: borderWidth ? borderWidth : 0,
                    borderColor: Primary_Purble_color

                }}>
                <Text style={{
                    fontFamily: fontBold,
                    color: textColor ? textColor : '#fff',
                    fontSize: wp(4.4),
                    textTransform: "capitalize",
                    textAlign: 'center'
                }}>{text}</Text>
            </View>
        </TouchableWithoutFeedback>

    );
};
export { Main_Button };