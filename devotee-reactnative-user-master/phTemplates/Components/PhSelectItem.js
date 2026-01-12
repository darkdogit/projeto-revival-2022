import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';
import PhDivider from './PhDivider';


const PhSelectItem = ({ onPress, selected, children, loading, divider, containerStyle, style }) => {
    const showDivider = divider === undefined || divider == true
    const styles = {
        containerStyle: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: measures.ySpace,
            ...style
            // backgroundColor: 'red',
            // height: 75

        }
    }
    return (
        <>
            <TouchableOpacity activeOpacity={1} style={styles.containerStyle} onPress={() => onPress()} >
                <View style={{ flex: 1, ...containerStyle}}>
                    {children}
                </View>
                <View>
                    {
                        loading ? <ActivityIndicator color={colors.primary} size={'small'} /> :
                            selected ? <FontAwesome5 name={'check'} color={colors.secondary} size={18} /> : null
                    }
                </View>
            </TouchableOpacity>
            {showDivider ? <PhDivider /> : null}
        </>

    )
}
export default PhSelectItem