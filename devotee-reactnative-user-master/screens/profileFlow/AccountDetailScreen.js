import React, { useEffect, useRef, useState } from 'react';
import { Image, View, Modal, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { PhButton, PhGradientButton, PhLinkButton } from '../../phTemplates/buttons';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import { PhModal, PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhAction, PhHeader, PhLabel, PhPageSubtitle, PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import { DevoteePlus } from '../../projectsComponents';
import { PhDivider, PhGradientIcon, PhRawListItem } from '../../phTemplates/components';
import UserService from '../../services/UserService';
import RBSheet from 'react-native-raw-bottom-sheet';
import { PhSelectInput, PhTextInput } from '../../phTemplates/inputs';
import moment from 'moment';
import i18n from '../../localization/AppLocalization';

export default function AccountDetailScreen(props) {
    const session = useSelector(state => state.sessionReducer)
    const [reason, setReason] = useState('')
    const [loading, setLoading] = useState(false)
    const userService = new UserService()
    let bottomSheetRef = useRef()
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <PhLinkButton textStyle={ { color: colors.secondary } } containerStyle={ { paddingTop: 0, paddingBottom: 0 } } onPress={ () => handleDeletePressed() } >
                    { i18n.t('delete_account') }
                </PhLinkButton>)

        })
    }, [])



    function handleDeletePressed() {
        bottomSheetRef.current?.open()
    }

    async function handleDeleteAccount() {
        Keyboard.dismiss()
        setLoading(true)
        // setTimeout(async () => {
        try {
            const res = await userService.deleteAccount(reason)
            if (res.status) {
                props.navigation.goBack()
                userService.logout()
            }
        } catch (e) {
            console.log(e)
            setLoading(false)
        } finally {
            // bottomSheetRef.current.close()
        }
        // }, 1200);
    }

    function FeatureList({ title }) {
        return (
            <View style={ { flexDirection: 'row' } } >
                <PhGradientIcon family={ 'FontAwesome5' } name={ 'check' } size={ 18 } ></PhGradientIcon>
                <PhSubtitle style={ { paddingLeft: 4 } } >{ title }</PhSubtitle>
            </View>
        )
    }

    function handleUpdatePassword() {
        props.navigation.navigate('PasswordUpdateScreen')
    }


    return (
        <>
            <PhScrollView screenTitle={ '' }>

                <PhHeader style={ { paddingHorizontal: measures.xSpace } } >{ i18n.t('account_info') }</PhHeader>
                <PhRawListItem divider>
                    <PhLabel>{ i18n.t('name') }</PhLabel>
                    <PhParagraph>{ session?.name }</PhParagraph>
                </PhRawListItem>
                <PhRawListItem divider>
                    <PhLabel>{ i18n.t('email') }</PhLabel>
                    <PhParagraph>{ session?.email }</PhParagraph>
                </PhRawListItem>
                <PhRawListItem divider>
                    <PhLabel>{ i18n.t('birthdate') }</PhLabel>
                    <PhParagraph>{ moment(session?.birthdate).format('DD/MM/YYYY') }</PhParagraph>
                </PhRawListItem>
                <PhRawListItem divider chevron onPress={ () => handleUpdatePassword() } >
                    <PhAction style={ { color: colors.secondary } } >{ i18n.t('update_password') }</PhAction>
                </PhRawListItem>

            </PhScrollView>

            <RBSheet
                animationType={ 'fade' }
                ref={ bottomSheetRef }
                height={ measures.screenHeight * 0.50 }
                customStyles={ {
                    container: {
                        borderTopRightRadius: 18,
                        borderTopLeftRadius: 18,
                    },
                    draggableIcon: {
                        backgroundColor: colors.gray
                    }
                } }
            >
                <View style={ { flex: 1, paddingVertical: measures.xSpace } } >
                    <View style={ { paddingHorizontal: measures.xSpace } } >
                        <PhHeader style={ { paddingBottom: 12 } } >{ i18n.t('sure_delete_account') }</PhHeader>
                        <PhParagraph >{ i18n.t('sure_delete_account_text') }</PhParagraph>
                    </View>
                    <PhTextInput
                        labelTitle={ i18n.t('reason') }
                        placeholder={ i18n.t('reason_placeholder') }
                        value={ reason }
                        autoComplete={ "off" }
                        onChangeText={ (text) => setReason(text) }
                    />
                    <PhButton onPress={ () => handleDeleteAccount() } loading={ loading } containerStyle={ { marginTop: measures.ySpace, backgroundColor: colors.red } } >{ i18n.t('delete_account') }</PhButton>
                </View>
            </RBSheet>
        </>

    )
}

