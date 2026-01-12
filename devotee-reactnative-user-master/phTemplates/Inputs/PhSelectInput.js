import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';
import { PhCaption, PhLabel } from '../typography';

const PhSelectInput = (props) => {
    // console.log('value', props.value)
    const style = {
        inputStyle: {
            fontSize: 16,
            marginBottom: Platform.OS == 'android' ? -5 : null,
            marginTop: 2,
            color: colors.primary,
            paddingBottom: measures.ySpace - 5,
            paddingRight: measures.xSpace
        },
        containerStyle: {
            marginHorizontal: measures.xSpace,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: measures.xSpace
        },
        labelsContainer: {
            flex: 1
        },
        border: {
            borderBottomColor: (props.fieldHasError && props.fieldHasError.show) ? colors.red : colors.lineGray,
            borderBottomWidth: 1,
            marginHorizontal: measures.xSpace,
            // marginBottom: measures.ySpace,
        }
    }
    return (
        <>
            <TouchableOpacity activeOpacity={1} onPress={() => props.onPress()} style={{ ...style.containerStyle, ...props.containerStyle }} >
                <View style={style.labelsContainer} >
                    <PhLabel style={{ paddingLeft: 0, paddingTop: 0, ...props.labelStyle }}>
                        {props.labelTitle}
                        {props.required && <Text style={{ color: colors.red }}> *</Text>}
                    </PhLabel>
                    <Text
                        placeholderTextColor={colors.placeholder}
                        style={style.inputStyle}
                        editable={false}
                        {...props} >
                        {!props.value && <Text style={{ color: colors.placeholder }} >{props.placeholder}</Text>}
                        {props.value && <Text>{props.value}</Text>}
                    </Text>
                </View>
                <FontAwesome5 name="chevron-right" color={colors.lightGray} size={props.iconSize || 15} />
            </TouchableOpacity>

            {
                props.border !== false && <View style={style.border}></View>
            }
            {props.fieldHasError && props.fieldHasError.show &&
                <PhCaption style={{ color: colors.red, marginHorizontal: measures.xSpace, paddingTop: 5 }}>{props.fieldHasError.message}</PhCaption>}
        </>

    )
}

export default PhSelectInput
