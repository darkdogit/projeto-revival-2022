import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../PhStyles';

const PhLoadingContainer = (props) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', ...props.containerStyle }} >
            <ActivityIndicator color={colors.lightGray} />
        </View>
    )
}
export default PhLoadingContainer
