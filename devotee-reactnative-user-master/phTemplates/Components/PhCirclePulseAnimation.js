import React, { useRef, useState, useEffect } from 'react';
import { Text, Animated, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
// import { measures } from '../PhDimensionsHelper';
// import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
// import { PhColors } from '../PhColors';

interface PhCirclePulseAnimationProps {
    color?: string,
    minSize?: number,
    size?: number,
    circleWidth?: number,
    maxScale?: number,
}

const PhCirclePulseAnimation = (props) => {

    const minW = props.minSize || 5
    const size = props.size || 50
    const circleWidth = new Animated.Value(minW)

    useEffect(() => {
        animate()
    })

    function animate() {

        Animated.timing(circleWidth, {
            toValue: 100,
            duration: 1200,
            useNativeDriver: true,
            // delay: 300
        }).start(event => {
            if (event.finished) {
                circleWidth.setValue(minW)
                animate();
            }
        });

    }
    return (
        <Animated.View style={{
            borderRadius: size / 2,
            width: size,
            height: size,

            opacity: circleWidth.interpolate({
                inputRange: [0, 100],
                outputRange: [1, 0],
                extrapolate: 'clamp'
            }),
            transform: [
                {
                    scale: circleWidth.interpolate({
                        inputRange: [0, 100],
                        outputRange: [0.1, 1],
                        extrapolate: 'clamp'
                    })
                },
            ],
            // height: circleWidth, 
            backgroundColor: props.color || 'black',
            ...props.style
        }} ></Animated.View>
    )
}

export default React.memo(PhCirclePulseAnimation)
