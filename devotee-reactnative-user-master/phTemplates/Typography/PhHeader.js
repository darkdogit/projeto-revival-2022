import React from 'react';
import { Animated, Platform, Text } from "react-native";
import { colors } from '../PhStyles';

const PhHeader = (props) => {

    const style = {
        fontSize: 20,
        fontFamily: 'Nunito_700Bold',
        color: colors.primary,
        // marginBottom: Platform.OS == 'android' ? -5 : null,
    }
    return (
        <Text style={{ ...style, ...props.style }} >
            {props.children}
        </Text>
    )
}

export default PhHeader






