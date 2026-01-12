import React from 'react';
import { Platform, Text } from "react-native";
import { colors } from '../PhStyles';

const PhParagraph = (props) => {

    const style = {
        fontSize: 16,
        color: colors.primary,
        fontFamily: 'Nunito_400Regular',
        // marginBottom: Platform.OS == 'android' ? -5 : null,
    }

    return (
        <Text style={{ ...style, ...props.style }}>
            {props.children}
        </Text>
    )
}

export default PhParagraph






