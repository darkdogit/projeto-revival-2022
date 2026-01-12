
import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Keyboard, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { PhButton } from '../../phTemplates/buttons';
import { PhProgressBar } from '../../phTemplates/components';
import { PhModal, PhSafeAreaContainer } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader, PhParagraph } from '../../phTemplates/typography';
import { PhRow } from '../../projectsComponents';
import LocationService from '../../services/LocationService';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';
import LocationPermissionScreen from './LocationPermissionScreen';
import NotificationPermissionScreen from './NotificationPermissionScreen';
import RegisterBirthdateScreen from './RegisterBirthdateScreen';
import RegisterDisabilityScreen from './RegisterDisabilityScreen';
import RegisterGenderScreen from './RegisterGenderScreen';
import RegisterInterestScreen from './RegisterInterestScreen';
import RegisterNameScreen from './RegisterNameScreen';
import RegisterOrientationScreen from './RegisterOrientationScreen';
import RegisterPicturesScreen from './RegisterPicturesScreen';
import RegisterTypeScreen from './RegisterTypeScreen';
import i18n from '../../localization/AppLocalization';


const pkg = require('../../app.json')
const logo = require('../../assets/img/logo.png')
export default function RegisterOnboardingScreen(props) {
    // maximo de step = 9 pra especiais, 8 para o resto
    const inf = useSelector(state => state.infoReducer?.registerInfo)
    const [maxIndex, setMaxIndex] = useState(7)
    const userService = new UserService()
    const pushNotificationService = new PushNotificationService()
    const locationService = new LocationService()
    const [currentIndex, setCurrentIndex] = useState(0)
    var formValues = {}
    const scrollRef = useRef()
    const progressBarRef = useRef()
    const modalRef = useRef()


    useEffect(() => {
        // userService.clearRegisterInfo()
        // props.navigation.setOptions({ headerShown: false })
        // BackHandler.addEventListener("hardwareBackPress", () => true);

    }, [])

    const styles = {
        header: {
            paddingBottom: 8,
            paddingTop: measures.statusBarHeight + 12,
            paddingHorizontal: measures.xSpace,
            backgroundColor: colors.white,
        }
    }

    function goNext(values) {
        Keyboard.dismiss()
        formValues = { ...formValues, ...values }
        userService.setRegisterInfo(formValues)
        var m = maxIndex
        if (inf?.account_type && inf?.account_type == 'special') {
            m = maxIndex + 1
        } else if (inf?.account_type && inf?.account_type == 'curious') {
            m = maxIndex - 2
        }
        if (currentIndex < m - 1) {
            const c = currentIndex + 1
            scrollRef.current.scrollTo({ x: c * measures.screenWidth, y: 0, animated: true })
            setCurrentIndex(c)
            progressBarRef.current.setBarProgress(c)
        }
    }

    function goPrev() {
        Keyboard.dismiss()

        if (currentIndex > 0) {
            const c = currentIndex - 1
            scrollRef.current.scrollTo({ x: c * measures.screenWidth, y: 0, animated: true })
            setCurrentIndex(c)
            progressBarRef.current.setBarProgress(c)
        } else {
            // props.navigation.goBack()
        }
    }
    function handleQuit() {
        Keyboard.dismiss()
        modalRef.current.show()
    }

    function logout() {
        modalRef.current.hide()
        userService.logout()
    }

    async function goToLocationScreen(values) { }
    async function goToNotificationScreen(values) { }

    function QuitModalContent() {
        return (
            <View style={ { paddingTop: measures.ySpace } }>
                <PhHeader style={ { textAlign: 'center', paddingBottom: measures.ySpace } } >{ i18n.t('sure_quit') }</PhHeader>
                <PhParagraph style={ { textAlign: 'center' } } >{ i18n.t('quit_text') }</PhParagraph>
                <View style={ { paddingTop: measures.ySpace, flexDirection: 'row', alignItems: 'center' } } >
                    <View style={ { flex: 1 } }>
                        <PhButton onPress={ () => modalRef.current.hide() } containerStyle={ { backgroundColor: colors.gray } } >{ i18n.t('continue') }</PhButton>
                    </View>
                    <View style={ { flex: 1 } }>
                        <PhButton onPress={ () => logout() } containerStyle={ { backgroundColor: colors.red } } >{ i18n.t('exit') }</PhButton>
                    </View>
                </View>
            </View>
        )
    }




    return (
        <PhSafeAreaContainer mode={ 'noTop' } >
            <PhRow justifyBetween noFlex alignStart style={ styles.header } >
                {
                    // currentIndex > 0 && ((inf?.account_type == 'special' && currentIndex < 8) || (inf?.account_type != 'special' && currentIndex < 7) || ((inf?.account_type != 'curious' && currentIndex < 6))) ?
                    currentIndex > 0 ?
                        <TouchableOpacity activeOpacity={ 1 } onPress={ () => goPrev() } >
                            <FontAwesome name="chevron-circle-left" size={ 30 } color={ colors.disabled } />
                        </TouchableOpacity> : <View></View>
                }
                {
                    currentIndex == 0 ?
                        <TouchableOpacity activeOpacity={ 1 } onPress={ () => handleQuit() } >
                            <FontAwesome name="times-circle" size={ 30 } color={ colors.disabled } />
                        </TouchableOpacity> : null
                }
            </PhRow>
            <PhProgressBar
                ref={ progressBarRef } max={ inf?.account_type && inf?.account_type == 'special' ? maxIndex + 1 : maxIndex } startPercentage={ 25 } endPercentage={ 90 } />
            <Animated.ScrollView
                ref={ scrollRef }
                scrollEnabled={ false }
                showsHorizontalScrollIndicator={ false }
                style={ { flex: 1, width: measures.screenWidth } }
                pagingEnabled={ true }
                horizontal
            >
                <View style={ { width: measures.screenWidth, } } >
                    <RegisterTypeScreen handleNext={ (values) => goNext(values) } />
                </View>
                <View style={ { width: measures.screenWidth, } } >
                    <RegisterNameScreen handleNext={ (values) => goNext(values) } />
                </View>
                <View style={ { width: measures.screenWidth, } } >
                    <RegisterBirthdateScreen handleNext={ (values) => goNext(values) } />
                </View>
                <View style={ { width: measures.screenWidth, } } >
                    <RegisterGenderScreen handleNext={ (values) => goNext(values) } />
                </View>
                <View style={ { width: measures.screenWidth, } } >
                    <RegisterOrientationScreen handleNext={ (values) => goNext(values) } />
                </View>
                <View style={ { width: measures.screenWidth, } } >
                    <RegisterInterestScreen handleNext={ (values) => goNext(values) } />
                </View>
                {
                    inf?.account_type && inf?.account_type == 'special' ?
                        <View style={ { width: measures.screenWidth, } } >
                            <RegisterDisabilityScreen handleNext={ (values) => goNext(values) } />
                        </View> : null
                }
                {
                    inf?.account_type != 'curious' ?
                        <View style={ { width: measures.screenWidth, } } >
                            <RegisterPicturesScreen handleNext={ (values) => { registrationFinished(values) } } />
                        </View> : null
                }
                {/* {
                    inf?.account_type != 'curious' ?
                        <View style={{ width: measures.screenWidth, }} >
                            <LocationPermissionScreen handleNext={(values) => { goNext(values) }} />
                        </View> : null
                }
                <View style={{ width: measures.screenWidth, }} >
                    <NotificationPermissionScreen handleNext={(values) => registrationFinished()} />
                </View> */}
            </Animated.ScrollView>
            <PhModal ref={ modalRef }>
                <QuitModalContent />
            </PhModal>
        </PhSafeAreaContainer >
    )
}
