import React from 'react';
import { Animated, Platform, Text } from "react-native";
import { colors } from '../PhStyles';

const PhCaption = (props) => {
   
    const style = {
        fontSize: 10,
        fontFamily: 'Nunito_600SemiBold',
        color: colors.primary,
        marginBottom: Platform.OS == 'android' ? -3 : null,
    }

    return (
        <Animated.Text style={{ ...style, ...props.style }} >
            {props.children}
        </Animated.Text>
    )
}

export default PhCaption






