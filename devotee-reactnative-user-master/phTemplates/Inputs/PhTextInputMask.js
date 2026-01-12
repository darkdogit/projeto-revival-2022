import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { colors, measures } from '../PhStyles';
import { PhCaption, PhLabel } from '../typography';

const PhTextInputMask = (props) => {

    const [textInput, setTextInput] = useState(null)
    useEffect(() => {
        if (props.onRef != null) {
            props.onRef(textInput)
        }
    }, [props.onRef])

    function onSubmitEditing() {
        props.onSubmitEditing();
    }
    const style = {
        inputStyle: {
            flex: 1,
            fontSize: 16,
            marginTop: 5,
            color: (props.fieldHasError && props.fieldHasError.show) ? colors.red : colors.primary,
            paddingBottom: measures.ySpace - 5,
            marginBottom: Platform.OS == 'android' ? -5 : null,
        },
        containerStyle: {
            marginHorizontal: measures.xSpace,
            paddingTop: measures.xSpace,
            // width: '100%'
        },
        border: {

            borderBottomColor: (props.fieldHasError && props.fieldHasError.show) ? colors.red : colors.lineGray,
            borderBottomWidth: 1,
            marginHorizontal: measures.xSpace,
        },
        labelStyle: {
            paddingLeft: 0,
            paddingTop: 0,
            color: colors.primary
        }
    }


    return (
        <>
            <View style={style.containerStyle} >
                <PhLabel style={style.labelStyle}>
                    {props.labelTitle}
                    {props.required && <Text style={{ color: colors.red }}> *</Text>}
                </PhLabel>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, { ...props.viewStyle }]} >
                    <TextInputMask
                        keyboardAppearance={'dark'}
                        ref={input => {
                            if (input) {
                                setTextInput(input._inputElement)
                            }
                        }}
                        // type={'credit-card'}
                        placeholderTextColor={colors.placeholder}
                        style={[style.inputStyle, props.customStyle]}
                        {...props}
                        returnKeyType={props.keyboardType == 'numeric' ? 'done' : null}
                        onSubmitEditing={props.onSubmitEditing && onSubmitEditing.bind(this)}
                    >
                    </TextInputMask>
                    {props.loading && <ActivityIndicator style={{ paddingBottom: 15 }} color={colors.lightGray} />}
                </View>

            </View>
            {
                props.border !== false && <View style={style.border}></View>
            }
            {props.fieldHasError && props.fieldHasError.show &&
                <PhCaption style={{ color: colors.red, marginHorizontal: measures.xSpace, paddingTop: 5 }}>{props.fieldHasError.message}</PhCaption>
            }
        </>

    )
}

export default PhTextInputMask
