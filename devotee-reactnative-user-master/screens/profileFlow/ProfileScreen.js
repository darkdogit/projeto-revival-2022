import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, TouchableOpacity, View, } from 'react-native';
import { useSelector } from 'react-redux';
import { PhButton, PhGradientButton, PhLinkButton } from '../../phTemplates/buttons';
import { PhImage, PhRawListItem } from '../../phTemplates/components';
import { PhSafeAreaContainer, PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhAction, PhHeader, PhLabel, PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import { DevoteePlus } from '../../projectsComponents';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import HelperService from '../../services/HelperService';
import UserService from '../../services/UserService';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BarCodeScanner } from 'expo-barcode-scanner';
import environment from '../../environment';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import i18n from '../../localization/AppLocalization';
const pkg = require('../../app.json')


export default function ProfileScreen(props) {
    const session = useSelector(state => state.sessionReducer)
    const helperService = new HelperService()
    const userService = new UserService()
    const refRBSheet = useRef();
    const qrCodeSheet = useRef();
    var items = [
        {
            id: 'account',
            title: i18n.t('account_info'),
            subtitle: session?.email,
            image: require('../../assets/img/profile_icon.png'),
            onPress: () => props.navigation.navigate('AccountDetail')
        },
        {
            id: 'filter',
            title: i18n.t('filters'),
            subtitle: i18n.t('filters_text'),
            image: require('../../assets/img/filter_icon.png'),
            onPress: () => props.navigation.navigate('Filters')
        },
        {
            id: 'plan',
            title: i18n.t('curren_plan'),
            subtitle: session?.premiumAccount ? i18n.t('premium') : i18n.t('free'),
            image: require('../../assets/img/crown_icon.png'),
            onPress: () => !session?.premiumAccount ? props.navigation.navigate('PlanDetail') : RootNavigation.navigate('Plus')
        },

        {
            id: 'notification',
            title: i18n.t('notifications'),
            subtitle: i18n.t('notifications_text'),
            image: require('../../assets/img/notification_icon.png'),
            onPress: () => props.navigation.navigate('NotificationsSettingsScreen')
        },
        {
            id: 'web',
            title: i18n.t('devotee_web'),
            subtitle: i18n.t('devotee_web_text'),
            image: require('../../assets/img/qrcode_icon.png'),
            onPress: () => handleScan()
        },
        {
            id: 'support',
            title: i18n.t('support'),
            subtitle: i18n.t('support_text'),
            image: require('../../assets/img/support_icon.png'),
            onPress: () => props.navigation.navigate('SupportScreen')
        },

    ]
    
    if (session?.account_type == 'curious' || session?.country === 'BR') {
        const planIndex = items.findIndex(r => r.id == 'plan')
        items.splice(planIndex, 1)
    }
    useEffect(() => {
        props.navigation.setOptions({ headerShown: false })
    }, [])


    function ItemContainer({ item, imageStyle }) {
        const styles = {
            image: {
                resizeMode: 'contain',
                minWidth: 30,
                ...imageStyle

            }
        }
        return useMemo(() => (
            <PhRawListItem divider chevron onPress={ () => item.onPress() }>
                <View style={ { flexDirection: 'row', alignItems: 'center' } } >
                    <View style={ { paddingRight: 12 } }>
                        <PhImage style={ styles.image } source={ item.image } />
                    </View>
                    <View>
                        <PhAction>{ item.title }</PhAction>
                        <PhParagraph>{ item.subtitle }</PhParagraph>
                    </View>
                </View>
            </PhRawListItem>
        ))

    }

    function handlePlus() {
        RootNavigation.navigate('Plus')
    }

    const styles = {
        blurView: {
            width: measures.screenWidth,
            height: 200,
            position: 'absolute',
            right: 0,
            zIndex: 2,


        }
    }

    function sheetAction() {
        refRBSheet.current.close()
        userService.logout()
    }
    function handleSheetCancel() {
        refRBSheet.current.close()
    }


    function PremiumAdd() {
        const styles = {
            container: {
                backgroundColor: colors.primary,
                padding: measures.xSpace,
                margin: measures.xSpace,
                borderRadius: 10
            },
            image: {
                position: 'absolute',
                right: measures.xSpace,
                top: measures.ySpace,
            }
        }

        return (
            !session?.premiumAccount ?
                <TouchableOpacity activeOpacity={ 1 } onPress={ () => RootNavigation.navigate('Plus') } style={ styles.container }>
                    <DevoteePlus light />
                    <PhAction style={ { color: colors.white } } >{ i18n.t('become_plus') }</PhAction>
                    <PhParagraph style={ { color: colors.white } } >{ i18n.t('become_plus_text') }</PhParagraph>
                    <Image style={ styles.image } source={ require('../../assets/img/devotee_plus_icon.png') } ></Image>
                </TouchableOpacity> : null

        )

    }

    function handleLogout() {
        refRBSheet.current.open()
    }


    function scanCodeCompleted(info) {
        console.log('hash', info)
        if (info.data) {
            userService.loginHash(info.data).then(r => console.log('resposta', r)).catch(e => { console.log('erro', e) })
            qrCodeSheet.current.close()
        }
    }

    async function handleScan() {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        if (status == 'granted') {
            qrCodeSheet.current.open()
        }
    }
    return (

        <PhSafeAreaContainer>
            <ScrollView>

                <View style={ { paddingVertical: measures.xSpace, paddingLeft: measures.xSpace, flexDirection: 'row', justifyContent: 'space-between' } } >
                    <PhPageTitle style={ {} }>{ i18n.t('profile') }</PhPageTitle>
                    <PhLinkButton onPress={ () => handleLogout() } textStyle={ { color: colors.secondary } }>{ i18n.t('exit') }</PhLinkButton>
                </View>
                {
                    // DEVOTEE-7 Quando o usuário for curioso, esconder a tela "meu perfil".
                    session?.account_type != 'curious' ?
                        <ItemContainer
                            imageStyle={ { backgroundColor: colors.disabled, width: 46, height: 46, borderRadius: 23, resizeMode: 'cover' } }
                            item={ {
                                id: 'my_profile',
                                title: session?.name,
                                subtitle: i18n.t('my_profile'),
                                onPress: () => props.navigation.navigate('MyProfileStack'),
                                image: { uri: `${environment.baseImgUrl}${session?.profile_picture[0]?.path}` }
                            } } /> : null
                }
                <PremiumAdd />

                {
                    items.map((r, index) => <ItemContainer key={ r.id } item={ r } />)
                }
                <PhLabel style={ { padding: measures.xSpace, color: colors.disabled } } >{ `${i18n.t('version')} ${environment.appVersion}` }</PhLabel>

                <RBSheet
                    animationType={ 'fade' }
                    ref={ refRBSheet }
                    height={ measures.screenHeight * 0.3 }
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
                    <View style={ { flex: 1, alignItems: 'center', padding: measures.xSpace } } >
                        <PhHeader style={ { textAlign: 'center', paddingBottom: 12 } } >{ i18n.t('logout_text') }</PhHeader>
                        <PhParagraph style={ { textAlign: 'center', paddingHorizontal: 12 } } >{ i18n.t('sure_quit') }</PhParagraph>
                        <View style={ { flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingTop: measures.ySpace, paddingHorizontal: 12 } } >
                            <View style={ { flex: 1 } }>
                                <PhButton onPress={ () => handleSheetCancel() } containerStyle={ { backgroundColor: colors.gray } } >{ i18n.t('no') }</PhButton>
                            </View>
                            <View style={ { flex: 1 } }>
                                <PhButton onPress={ () => sheetAction() } containerStyle={ { backgroundColor: colors.red } } >{ i18n.t('exit') }</PhButton>
                            </View>
                        </View>
                    </View>
                </RBSheet>

                <RBSheet
                    animationType={ 'fade' }
                    ref={ qrCodeSheet }
                    closeOnDragDown={ true }
                    height={ measures.screenHeight * 0.80 }
                    customStyles={ {
                        container: {
                            backgroundColor: colors.darkGray,
                            borderTopRightRadius: 18,
                            borderTopLeftRadius: 18,
                        },
                        draggableIcon: {
                            backgroundColor: colors.gray
                        }
                    } }
                >
                    <View style={ { flex: 1, alignItems: 'center', padding: measures.xSpace } } >
                        <PhHeader style={ { color: colors.white, textAlign: 'center', paddingBottom: 12 } } >{ i18n.t('scan_code') }</PhHeader>
                        <PhParagraph style={ { color: colors.white, textAlign: 'center', paddingHorizontal: 12 } } >{ i18n.t('scan_code_instructions') }</PhParagraph>

                        <BarCodeScanner
                            onBarCodeScanned={ scanCodeCompleted }
                            style={ { height: '75%', width: measures.screenWidth, marginTop: measures.ySpace * 2 } }
                        />
                    </View>
                </RBSheet>
            </ScrollView>
        </PhSafeAreaContainer>

    )
}

