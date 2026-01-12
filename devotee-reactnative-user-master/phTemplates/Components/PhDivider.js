import React from 'react';
import { View } from 'react-native';
import { colors } from '../PhStyles';

const PhDivider = (props) => {
    return <View style={{ height: 1, backgroundColor: colors.lineGray, ...props.style }} ></View>
}
export default PhDivider
