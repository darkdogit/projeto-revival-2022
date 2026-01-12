import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Animated, TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';
import { PhAction } from '../typography';



const PhButton = (props) => {
    const shakeAnimation = new Animated.Value(0)
    const bgColor = props.bgColor || colors.primary
    const style = {
        indicatorStyle: {
            // paddingVertical: 13
        },
        containerStyle: {
            borderRadius: measures.buttonRadius,
            backgroundColor: props.disabled && !props.loading ? colors.lighterGray : bgColor,
            marginHorizontal: measures.xSpace,
            height: 46,
            justifyContent: 'center',
            ...props.containerStyle
        },
        textStyle: {
            // paddingVertical: Platform.OS == 'ios' ? 11 : 9,
            color: props.disabled && !props.loading ? colors.disabled : colors.white,
            fontFamily: 'Nunito_800ExtraBold',
        },
        textContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center'
        },
        disabled: {
            backgroundColor: colors.disabled
        }
    }

    return (
        <Animated.View style={{ flex: props.flex ? 1 : null, transform: [{ translateX: shakeAnimation }] }}>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (props.disabled) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                        // startShake()
                        props.onPressDisabled ? props.onPressDisabled() : null
                    } else {
                        props.onPress()
                    }
                }}
                style={style.containerStyle}
                disabled={props.loading} >
                <View style={style.textContainer} >
                    {
                        props.loading ? <ActivityIndicator color={colors.white} style={style.indicatorStyle} /> :
                            <>
                                {props.leftIcon}
                                <PhAction style={{ ...style.textStyle, ...props.textStyle }}>
                                    {props.children}
                                </PhAction>
                                {props.rightIcon}
                            </>
                    }
                </View>
            </TouchableOpacity>
        </Animated.View>

    )
}

export default PhButton










