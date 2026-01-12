import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Animated, TouchableOpacity, View } from 'react-native';
import { colors, measures } from '../PhStyles';
import { PhAction } from '../typography';


const PhGradientButton = (props) => {
    const shakeAnimation = new Animated.Value(0)
    const style = {
        indicatorStyle: {
            // paddingVertical: 13
        },
        containerStyle: {
            borderRadius: measures.buttonRadius,
            backgroundColor: props.disabled && !props.loading ? colors.lighterGray : 'transparent',
            marginHorizontal: measures.xSpace,
            height: 46,
            justifyContent: 'center'
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
            backgroundColor: colors.gray
        }
    }

    return (
        <Animated.View style={{ transform: [{ translateX: shakeAnimation }], ...props.style }}>

            <TouchableOpacity
                activeOpacity={props.containerStyle?.activeOpacity || 0.8}
                onPress={() => {
                    if (props.disabled) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                        // startShake()
                        props.onPressDisabled ? props.onPressDisabled() : null
                    } else {
                        props.onPress()
                    }
                }}
                style={{ ...style.containerStyle, ...props.containerStyle }}>
                {
                    !props.disabled ? <LinearGradient
                        locations={[0, 0.7]}
                        start={[0, 1]}
                        end={[1, 0]} colors={colors.primaryGradient} style={{ position: 'absolute', borderRadius: measures.buttonRadius, width: '100%', height: '100%' }} >

                    </LinearGradient> : null
                }
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

export default PhGradientButton





