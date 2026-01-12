import React, { useEffect, useRef, useState } from 'react';
import { Image, View, Modal, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { PhButton, PhGradientButton, PhLinkButton } from '../../phTemplates/buttons';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import { PhModal, PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader, PhPageSubtitle, PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import { DevoteePlus } from '../../projectsComponents';
import { PhDivider, PhGradientIcon } from '../../phTemplates/components';
import UserService from '../../services/UserService';
import RBSheet from 'react-native-raw-bottom-sheet';
import { PhTextInput } from '../../phTemplates/inputs';
import HelperService from '../../services/HelperService';
import i18n from '../../localization/AppLocalization';



export default function PlanDetailScreen(props) {
    const session = useSelector(state => state.sessionReducer)
    const [modalVisible, setModalVisible] = useState(false)
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const userService = new UserService()
    const helperService = new HelperService()
    const bottomSheetRef = useRef()
    useEffect(() => {
        
        // props.navigation.setOptions({
        //     headerRight: () => (
        //         <PhLinkButton textStyle={{ color: colors.secondary }} containerStyle={{ paddingTop: 0, paddingBottom: 0 }} onPress={() => handleCancelPressed()} >
        //             {i18n.t('cancel_plan')}
        //         </PhLinkButton>)

        // })
    }, [])

    function handleCancelPressed() {
        // bottomSheetRef.current.open()
    }

    async function handleCancelPlan() {
        Keyboard.dismiss()
        setLoading(true)
        setTimeout(async () => {
            try {
                const res = await userService.cancelSubscription(reason)
                console.log(res)
                if (res.status) {
                    setReason('')
                    // const up = await userService.update({ plan_type: 'free' })
                    userService.updateSession({ premiumAccount: false })
                    helperService.showToast({
                        text1: i18n.t('success'),
                        text2: i18n.t('plan_canceled'),
                    })
                    props.navigation.goBack()
                }
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
                bottomSheetRef.current.close()
            }
        }, 1200);
    }

    function FeatureList({ title }) {
        return (
            <View style={{ flexDirection: 'row' }} >
                <PhGradientIcon family={'FontAwesome5'} name={'check'} size={18} ></PhGradientIcon>
                <PhSubtitle style={{ paddingLeft: 4 }} >{title}</PhSubtitle>
            </View>
        )
    }


    return (
        <>
            <PhScrollView screenTitle={''}>
                <View style={{ paddingHorizontal: measures.xSpace }} >
                    <DevoteePlus />
                    <PhParagraph style={{ paddingTop: 12 }} >{i18n.t('plus_text2')}</PhParagraph>
                    <PhDivider style={{ marginVertical: measures.ySpace }} />
                    <FeatureList title={i18n.t('no_adds')} />
                    <PhDivider style={{ marginVertical: measures.ySpace }} />
                    <FeatureList title={i18n.t('disable_chat')} />
                    <PhDivider style={{ marginVertical: measures.ySpace }} />
                    <FeatureList title={i18n.t('like_access')} />
                    <PhDivider style={{ marginVertical: measures.ySpace }} />
                    <FeatureList title={i18n.t('edit_options')} />
                    <PhDivider style={{ marginVertical: measures.ySpace }} />
                </View>
            </PhScrollView>

            <RBSheet
                animationType={'fade'}
                ref={bottomSheetRef}
                height={measures.screenHeight * 0.40 + 50}
                customStyles={{
                    container: {
                        borderTopRightRadius: 18,
                        borderTopLeftRadius: 18,
                    },
                    draggableIcon: {
                        backgroundColor: colors.gray
                    }
                }}
            >

                <View style={{ flex: 1, paddingVertical: measures.xSpace }} >
                    <View style={{ paddingHorizontal: measures.xSpace }} >
                        <PhHeader style={{ paddingBottom: 12 }} >{i18n.t('sure_cancel_subscription')}</PhHeader>
                        <PhParagraph >{i18n.t('sure_cancel_subscription_text')}</PhParagraph>
                    </View>
                    <PhTextInput
                        labelTitle={i18n.t('reason')}
                        placeholder={i18n.t('cancellation_reason_description')}
                        value={reason}
                        autoComplete={"off"}
                        onChangeText={(text) =>
                            setReason(text)
                        }
                    />
                    <PhButton onPress={() => handleCancelPlan()} loading={loading} containerStyle={{ marginTop: measures.ySpace, backgroundColor: colors.red }} >{i18n.t('cancel_subscription')}</PhButton>
                </View>
            </RBSheet>
        </>

    )
}

