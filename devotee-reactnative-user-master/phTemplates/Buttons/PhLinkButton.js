import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';
import { PhAction } from '../typography';

const PhLinkButton = (props) => {

    const style = {
        indicatorStyle: {
            paddingBottom: 0,
            paddingTop: 0,
        },
        containerStyle: {
            borderRadius: measures.buttonRadius,
            backgroundColor: 'transparent',
            marginHorizontal: measures.xSpace,
            justifyContent: 'center',
            height: 46,
            borderWidth: props.outline ? 2 : 0,
            borderColor: colors.black

        },
        textStyle: {
            color: colors.primary,
        },
        textContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
        }
    }

    return (

        <TouchableOpacity
            activeOpacity={0.8}
            onPress={props.onPress}
            style={{ ...style.containerStyle, ...props.containerStyle }}
            disabled={props.disabled} >
            <View style={[style.textContainer, props.textContainerStyle]} >
                {
                    props.loading ? <ActivityIndicator color={colors.primary} style={style.indicatorStyle} /> :
                        <>
                            {props.leftIcon}
                            <PhAction style={{ ...style.textStyle, ...props.textStyle, ...(props.disabled && !props.loading && { color: colors.gray }) }} >
                                {props.children}
                            </PhAction>
                            {props.rightIcon}
                        </>
                }

            </View>
        </TouchableOpacity>
    )
}

export default PhLinkButton



