import React, { useImperativeHandle, useState } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, measures } from '../PhStyles';

const PhBottomSheet = React.forwardRef((props, ref) => {
    const [modalVisible, setModalVisible] = useState(false)

    useImperativeHandle(
        ref,
        () => ({
            show() {
                setModalVisible(true)
                animateView()
            },
            hide() {
                onDismiss()
                setTimeout(() => {
                    setModalVisible(false)
                }, 300);
            }
        }),
    )
    const translateAnimation = React.useMemo(() => new Animated.Value(80), []);
    const opacityAnimation = React.useMemo(() => new Animated.Value(0), []);
    const st = {
        container: {
            ...StyleSheet.absoluteFill,
            opacity: opacityAnimation,
            zIndex: modalVisible ? 1 : -9999
        },
        overlayContainer: {
            height: '100%',
            width: '100%',
            backgroundColor: '#00000094',
            justifyContent: 'flex-end',
            alignItems: 'center'
        },
        modalViewcontainer: {
            height: 200,
            width: measures.screenWidth,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: colors.white,
            paddingVertical: measures.ySpace,
            top: translateAnimation,
            zIndex: 5,
            opacity: opacityAnimation
        }

    }

    function animateView(show = true) {
        if (show) {
            Animated.parallel([
                Animated.timing(translateAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(opacityAnimation, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),

            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(translateAnimation, {
                    toValue: 80,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(opacityAnimation, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                })

            ]).start()
        }
    }
    function onDismiss() {
        animateView(false)
        // opacityAnimation.setValue(0)
        // translateAnimation.setValue(80)
        if (props.onCancelled) {
            props.onCancelled()
        }
    }
    return (
        <Modal onDismiss={() => onDismiss()} onShow={() => animateView()} visible={modalVisible} animationType={'fade'} transparent={true}>
            {/* <Animated.View style={st.container}> */}
            <TouchableOpacity style={st.overlayContainer} presentationStyle={'overFullScreen'} activeOpacity={1} >
                <Animated.View style={st.modalViewcontainer}>
                    {props.children}
                </Animated.View>
            </TouchableOpacity>
            {/* </Animated.View> */}
        </Modal>
    )
})

export default PhBottomSheet
