import React from 'react';
import { Platform, Text } from "react-native";
import { colors } from '../PhStyles';

const PhSubtitle = (props) => {
    const style = {
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        color: colors.primary,
        // marginBottom: Platform.OS == 'android' ? -5 : null
    }
    return (
        <Text {...props} style={{ ...style, ...props.style }}>
            {props.children}
        </Text>
    )
}

export default PhSubtitle






