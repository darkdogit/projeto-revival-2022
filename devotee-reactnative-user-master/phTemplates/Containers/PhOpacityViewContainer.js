import React from 'react';
import { View } from 'react-native';

const PhOpacityViewContainer = (props) => {

    return (
        <View style={{ flex: 1, backgroundColor: '#00000070', ...props.style }} >
            {props.children}
        </View>
    )

}
export default PhOpacityViewContainer
