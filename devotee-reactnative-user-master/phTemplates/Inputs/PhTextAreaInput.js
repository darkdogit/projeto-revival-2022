import React, { useEffect, useState } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import { colors, measures } from '../PhStyles';
import { PhCaption, PhLabel } from '../typography';

const PhTextAreaInput = (props) => {
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
            fontSize: 16,
            marginBottom: Platform.OS == 'android' ? -5 : null,
            marginTop: 5,
            color: (props.fieldHasError && props.fieldHasError.show) ? colors.red : colors.primary,
            paddingBottom: measures.ySpace - 5
        },
        containerStyle: {
            paddingTop: 12,
            marginLeft: measures.xSpace,
            marginRight: measures.xSpace
        },
        border: {
            borderBottomColor: (props.fieldHasError && props.fieldHasError.show) ? colors.red : colors.lineGray,
            borderBottomWidth: 1,
            marginHorizontal: measures.xSpace
        }
    }

    return (
        <>
            <View style={{ ...style.containerStyle, ...props.containerStyle }} >
                <PhLabel style={{ paddingLeft: 0, paddingTop: 0 }} >
                    {props.labelTitle}
                    {props.required && <Text style={{ color: colors.red }}> *</Text>}
                </PhLabel>

                <TextInput
                    keyboardAppearance={'dark'}
                    ref={input => setTextInput(input)}
                    placeholderTextColor={colors.placeholder}
                    // numberOfLines={8}
                    multiline={true}
                    style={style.inputStyle}
                    {...props}
                    onSubmitEditing={props.onSubmitEditing && onSubmitEditing.bind(this)}
                >
                </TextInput>
            </View>
            {(props.border === undefined || props.border == true) && <View style={style.border}></View>}
            {props.fieldHasError && props.fieldHasError.show &&
                <PhCaption style={{ color: colors.red, marginHorizontal: measures.xSpace, paddingTop: 5 }}>{props.fieldHasError.message}</PhCaption>}
        </>

    )
}

export default PhTextAreaInput
