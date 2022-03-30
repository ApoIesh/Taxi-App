import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { bluesky_color, hp, primaryyellow_color, wp } from '../style/styles';

const Button = ({ onPress, label }) => {
    const { buttonStyle, textStyle } = styles;
    return (
        <TouchableOpacity
            onPress={onPress}
            style={buttonStyle}
        >
            <Text style={textStyle}  >{label} </Text>
        </TouchableOpacity>
    );
};



const styles = StyleSheet.create({
    textStyle: {
        color: '#ffffff',
        fontSize: wp(5),
    },
    buttonStyle: {
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        borderRadius:hp(6),
        backgroundColor: bluesky_color,
        width: wp(25),
        height:hp(7),
        marginVertical:hp(.5),
        elevation:wp(0.9),
        marginTop:wp(7)

    }
});






export { Button };