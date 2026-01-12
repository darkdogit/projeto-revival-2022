import React, { useImperativeHandle, useState } from 'react';
import { Animated, Modal, TouchableOpacity } from 'react-native';
import { measures } from '../PhStyles';

const PhModal = React.forwardRef((props, ref) => {
    const [modalVisible, setModalVisible] = useState(false)
    useImperativeHandle(
        ref,
        () => ({
            show() {
                setModalVisible(true)
            },
            hide() {
                setModalVisible(false)
            }
        }),
    )
    const translateAnimation = React.useMemo(() => new Animated.Value(80), []);
    const opacityAnimation = React.useMemo(() => new Animated.Value(0), []);
    const st = {
        overlayContainer: {
            height: '100%',
            width: '100%',
            backgroundColor: '#00000094',
            justifyContent: 'center',
            alignItems: 'center',

        },
        modalViewcontainer: {
            // height: measures.screenHeight * 0.55,
            width: measures.screenWidth * 0.85,
            borderRadius: 10,
            backgroundColor: '#fff',
            padding: measures.xSpace + 10,
            top: translateAnimation,
            opacity: opacityAnimation,


        }

    }
    function animateView() {
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
            })
        ]).start()
    }
    function onDismiss() {
        opacityAnimation.setValue(0)
        translateAnimation.setValue(80)
    }
    return (
        <Modal onDismiss={() => onDismiss()} onShow={() => animateView()} presentationStyle={'overFullScreen'} visible={modalVisible} transparent={true} animationType={'fade'} >
            <TouchableOpacity style={st.overlayContainer} onPress={() => setModalVisible(false)} activeOpacity={1} >
                <Animated.View style={st.modalViewcontainer} >

                    {props.children}

                </Animated.View>
            </TouchableOpacity>
        </Modal>
    )
})
export default PhModal
