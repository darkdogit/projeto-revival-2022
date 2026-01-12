// import InAppPurchaseService from '../../services/InAppPurchaseService';
// import * as InAppPurchases from 'expo-in-app-purchases';

import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { DeviceEventEmitter, Modal, Platform, TouchableOpacity, View } from 'react-native';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhDivider, PhGradientIcon } from '../../phTemplates/components';
import { PhBottomGradientContainer, PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageSubtitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import { DevoteePlus } from '../../projectsComponents';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import { useSubscription } from '../../hooks/useSubscription';
import i18n from '../../localization/AppLocalization';
import UserService from '../../services/UserService';

const userService = new UserService()

export default function PlusScreen(props) {
    const { loading, handleContinueIAP } = useSubscription()
    const [modalVisible, setModalVisible] = useState(false)

    // const inAppService = new InAppPurchaseService()
    // useEffect(() => {
    //     setSubmitting(true)

    //     inAppService.setupPurchase((purchase) => {
    //         userService.savePlan(purchase).catch(e => console.log('ERRO AO SALVAR PLANO', e)).finally(r => {
    //             userService.syncUserWithApi()
    //             handleSuccess()
    //         })
    //     }, (err) => {
    //         if (err.code != 'canceled') {
    //             handleError(i18n.t('payment_error'))
    //         } else {
    //             setSubmitting(false)
    //         }
    //     })
    //     setSubmitting(false)
    //     return () => {
    //         console.log('disconnecting from in app purchase...')
    //         InAppPurchases.disconnectAsync().then().catch(e => { })
    //     }
    // }, [])

    function FeatureList({ title }) {
        return (
            <View style={ { flexDirection: 'row' } } >
                <PhGradientIcon family={ 'FontAwesome5' } name={ 'check' } size={ 18 } ></PhGradientIcon>
                <PhSubtitle style={ { paddingLeft: 4 } } >{ title }</PhSubtitle>
            </View>
        )
    }

    function handleContinue() {
        setModalVisible(false)
        props.navigation.goBack()
    }

    async function handleSuccess() {
        await userService.update({ plan_type: 'premium' })
        userService.updateSession({ premiumAccount: true })
        setModalVisible(true)
    }

    async function handleError() {
        setTimeout(() => {
            DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: i18n.t('payment_error') })
        }, 1000);
    }

    async function handleSubmit() {
        await handleContinueIAP(handleSuccess, handleError)
        // try {
        //     const productInfo = await InAppPurchases.getProductsAsync([environment.PLUS_PRODUCT_ID])
        //     const purchase = await InAppPurchases.purchaseItemAsync(environment.PLUS_PRODUCT_ID, {
        //         accountIdentifiers: {
        //             obfuscatedAccountId: '',
        //             obfuscatedProfileId: ''
        //         }
        //     })
        // } catch (e) {
        //     console.log('PlusScreen.handleSubmit', e)
        // }
    }

    return (
        <>
            <PhScrollView screenTitle={ '' } scrollViewProps={ { contentContainerStyle: { paddingBottom: measures.bottomSpace + 140 } } } safeAreaProps={ { mode: 'noTop' } } >
                <View style={ { paddingHorizontal: measures.xSpace } } >
                    <DevoteePlus />
                    <PhParagraph style={ { paddingTop: 12 } } >{ i18n.t('plus_text') }</PhParagraph>
                    <PhDivider style={ { marginVertical: measures.ySpace } } />
                    <FeatureList title={ i18n.t('no_adds') } />
                    <PhDivider style={ { marginVertical: measures.ySpace } } />
                    <FeatureList title={ i18n.t('super_like') } />
                    <PhDivider style={ { marginVertical: measures.ySpace } } />
                    <FeatureList title={ i18n.t('like_access') } />
                    <PhDivider style={ { marginVertical: measures.ySpace } } />
                    <FeatureList title={ i18n.t('edit_options') } />
                    <PhDivider style={ { marginVertical: measures.ySpace } } />
                    <PhParagraph style={ { paddingTop: measures.ySpace } } >{ i18n.t('plus_payment') }</PhParagraph>
                </View>
                <View style={ { flexDirection: 'row', flexWrap: 'wrap', paddingLeft: measures.xSpace } }>
                    <PhParagraph style={ { paddingTop: measures.ySpace + 10, lineHeight: null } } >
                        { i18n.t('plus_payment_agreement') }
                    </PhParagraph>
                    <TouchableOpacity activeOpacity={ 1 } style={ {} } onPress={ () => RootNavigation.navigate('WebViewPlus', { type: 'terms' }) }  >
                        <PhSubtitle>{ `${i18n.t('terms_of_use')} ` }</PhSubtitle>
                    </TouchableOpacity>
                    <PhParagraph style={ { lineHeight: null } } >
                        { i18n.t('and') }
                    </PhParagraph>
                    <TouchableOpacity activeOpacity={ 1 } style={ {} } onPress={ () => RootNavigation.navigate('WebViewPlus', { type: 'privacy' }) } >
                        <PhSubtitle >{ ` ${i18n.t('privacy_policy')} ` }</PhSubtitle>
                    </TouchableOpacity>
                </View>

            </PhScrollView>
            <PhBottomGradientContainer>
                <PhGradientButton loading={ loading } leftIcon={ Platform.OS == 'ios' ? <FontAwesome name={ 'apple' } color={ colors.white } size={ 15 } /> : <FontAwesome name={ 'google' } color={ colors.white } size={ 15 } /> } onPress={ () => handleSubmit() } containerStyle={ { marginBottom: measures.bottomSpace } } >{ `  ${i18n.t('subscribe_plus')}` }</PhGradientButton>
            </PhBottomGradientContainer>
            <Modal visible={ modalVisible } animationType={ 'slide' }>

                <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: measures.xSpace, paddingBottom: measures.bottomSpace } } >
                    <View style={ { flex: 1, justifyContent: 'center', alignItems: 'center', } } >
                        <FontAwesome name={ 'check-circle' } color={ colors.success } size={ 90 } />
                        <PhPageSubtitle style={ { marginHorizontal: 20, marginTop: 20, textAlign: 'center' } }>{ i18n.t('subscription_success_title') }</PhPageSubtitle>
                        <DevoteePlus />
                        <PhParagraph style={ { paddingTop: measures.ySpace, textAlign: 'center', paddingHorizontal: measures.xSpace } }>{ i18n.t('subscription_success_text') }</PhParagraph>
                    </View>
                    <PhGradientButton onPress={ () => handleContinue() } containerStyle={ { width: measures.screenWidth - (measures.ySpace * 2), marginTop: measures.ySpace } } >{ i18n.t('done') }</PhGradientButton>
                </View>

            </Modal>
        </>

    )
}

