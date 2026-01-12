import { LinearGradient } from 'expo-linear-gradient';
import React, { useImperativeHandle, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '../PhStyles';


interface PhProgressBarProps {
    activeColor?: string,
    inactiveColor?: string,
    startPercentage?: number,
    endPercentage?: number,
    barHeight?: number,
    max: number,
    style?: any,
    rightIcon?: any,
    rightIcon?: any,
    gradientColors?: Array,
}


const PhProgressBar = React.forwardRef((props: PhProgressBarProps, ref) => {
    const startPercentage = `${props.startPercentage || 0}%`
    const endPercentage = `${props.endPercentage || 100}%`
    var width = 0
    var max = props.max
    const progress = useRef(new Animated.Value(0)).current

    const BAR_HEIGHT = props.barHeight ||  5

    useImperativeHandle(
        ref,
        () => ({
            setBarProgress(p) {
                setProgress(p)
            },
        }),
    )



    const styles = {
        emptyBar: {

            backgroundColor: props.inactiveColor || colors.lighterGray,
            // borderRadius: 11,
            // marginTop: 5,
            height: BAR_HEIGHT,
        },
        filledBar: {
            // borderRadius: 11,
            height: BAR_HEIGHT,
            backgroundColor: props.activeColor || colors.primary,
            width: progress.interpolate({
                inputRange: [0, max],
                outputRange: [startPercentage, endPercentage],
                useNativeDriver: false
            }),
        },
        labelsContainerStyle: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },

    }

    function setProgress(p) {
        Animated.timing(progress, {
            toValue: p,
            duration: 500,
            useNativeDriver: false
        }).start();
    }


    return (
        <View style={{ ...props.style }} >
            <View style={styles.labelsContainerStyle} >
                {props.rightIcon}
                {props.leftIcon}
            </View>
            <View style={styles.emptyBar} >
                <Animated.View style={{
                    // borderRadius: 11,
                    height: BAR_HEIGHT,
                    backgroundColor: props.style?.activeColor || colors.primary,
                    width: progress.interpolate({
                        inputRange: [0, max - 1],
                        outputRange: [startPercentage, endPercentage],
                        useNativeDriver: false
                    }),
                }} >
                    <LinearGradient
                        start={[0, 0.5]}
                        end={[1, 0.5]}
                        style={{ width: '100%', height: BAR_HEIGHT }} colors={props.gradientColors ? props.gradientColors : props.activeColor ? [props.activeColor, props.activeColor] : colors.primaryGradient} ></LinearGradient>
                </Animated.View>
            </View>
        </View>
    )
})

export default PhProgressBar