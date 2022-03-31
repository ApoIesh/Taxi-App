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
        fontSize: wp(4.5),
    },
    buttonStyle: {
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        borderRadius:hp(6),
        backgroundColor: bluesky_color,
        width: wp(25),
        height:hp(5),
        marginVertical:hp(1),
        elevation:wp(2.5),

    }
});

export { Button };