import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';
import { PhCaption, PhLabel } from '../typography';

const PhTextInput = (props) => {
    const [textInput, setTextInput] = useState(null)
    const [secureText, setSecureText] = useState(props.secureTextEntry)

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
            fontSize: 16,
            marginBottom: Platform.OS == 'android' ? -5 : null,
            marginTop: 5,
            color: (props.fieldHasError && props.fieldHasError.show) ? colors.red : colors.primary,
            paddingBottom: measures.ySpace - 5,
            paddingRight: measures.xSpace + 10
        },
        containerStyle: {
            paddingTop: measures.xSpace,
            marginHorizontal: measures.xSpace,
            width: '100%'
        },
        border: {
            borderBottomColor: (props.fieldHasError && props.fieldHasError.show) ? colors.red : colors.lineGray,
            borderBottomWidth: 1,
            marginHorizontal: measures.xSpace,
        },
    }

    function toggleSecureTextEntry() {
        setSecureText(!secureText)
    }

    return (
        <>
            <View style={{ ...style.containerStyle, ...props.containerStyle }} >
                {
                    props.secureTextEntry ?
                        <TouchableOpacity onPress={() => toggleSecureTextEntry()} activeOpacity={0.8} style={{ zIndex: 4, width: 50, height: 40, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: measures.xSpace + 5, bottom: measures.ySpace / 2 }} >
                            <FontAwesome5 name={secureText ? "eye-slash" : "eye"} size={18} color={colors.disabled} />
                        </TouchableOpacity> : null
                }
                {
                    props.labelTitle &&
                    <PhLabel style={style.labelStyle}>
                        {props.labelTitle}
                        {props.required && <Text style={{ color: colors.red }}> *</Text>}
                    </PhLabel>
                }
                <TextInput
                    keyboardAppearance={'dark'}
                    ref={input => setTextInput(input)}
                    placeholderTextColor={colors.placeholder}
                    style={{ ...style.inputStyle, ...props.inputStyle }}
                    {...props}
                    secureTextEntry={secureText}
                    returnKeyType={props.keyboardType == 'numeric' ? 'done' : null}
                    onSubmitEditing={props.onSubmitEditing && onSubmitEditing.bind(this)}
                >
                </TextInput>
            </View>
            {(props.border === undefined || props.border == true) && <View style={{ ...style.border, ...props.borderStyle }}></View>}
            {props.fieldHasError && props.fieldHasError.show &&
                <PhCaption style={{ color: colors.red, marginHorizontal: measures.xSpace, paddingTop: 5 }}>{props.fieldHasError.message}</PhCaption>
            }
        </>

    )
}

export default PhTextInput
