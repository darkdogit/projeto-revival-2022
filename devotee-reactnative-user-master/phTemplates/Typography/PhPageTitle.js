import React from 'react';
import { Text } from "react-native";
import { colors } from '../PhStyles';
const PhPageTitle = (props) => {

    const style = {
        fontSize: 32,
        fontFamily: 'Nunito_800ExtraBold',
        color: colors.primary,
        // marginBottom: Platform.OS == 'android' ? -5 : null,
    }

    return (
        <Text style={{ ...style, ...props.style }} >
            {props.children}
        </Text>
    )
}

export default PhPageTitle