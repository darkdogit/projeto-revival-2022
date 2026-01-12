
import { I18n } from 'i18n-js';
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import environment from '../../environment';
import { PhButton, PhGradientButton, PhLinkButton } from '../../phTemplates/buttons';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhCaption, PhHeader, PhPageTitle } from '../../phTemplates/typography';
import { PhRow } from '../../projectsComponents';
import UserService from '../../services/UserService';
import i18n from './../../localization/AppLocalization';

const pkg = require('../../app.json')
let deepLinkEvent
export default function WelcomeScreen(props) {
    const userService = new UserService()
    const bgImg = require('../../assets/img/bg_welcome.png')
    // const logo = require('../../assets/img/logo.png')

    useEffect(() => {
        props.navigation.setOptions({ headerShown: false })

    }, [])

    async function handleCreateAccount() {
        props.navigation.navigate('Register')
    }
    function handleHasAccount() {
        props.navigation.navigate('Login')
    }

    return (
        <PhSafeAreaContainer mode={'onlyHorizontal'} statusBarStyle={{ barStyle: 'light-content', backgroundColor: colors.primary }} >
            <View style={{ flex: 1, backgroundColor: colors.primary, justifyContent: 'space-between', paddingTop: measures.ySpace }} >
                <View style={{ marginHorizontal: measures.xSpace, paddingTop: 12 }}>
                    {/* <Image source={logo}></Image> */}
                    <PhRow noFlex style={{ marginTop: measures.ySpace }} >
                        <PhPageTitle adjustSize style={{ color: colors.white }} >
                            {`Devotee`}
                        </PhPageTitle>
                        <PhLinkButton containerStyle={{ marginHorizontal: 0 }} onPress={() => handleHasAccount()} textStyle={{ color: colors.secondary }} >{i18n.t('login')}</PhLinkButton>
                    </PhRow>
                    <PhCaption style={{ marginTop: -8, color: colors.white, opacity: 0.3 }} >{environment.appVersion}</PhCaption>
                    <View style={{ marginTop: measures.ySpace, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                    </View>
                    <PhHeader style={{ color: colors.white }} >{i18n.t('welcome_slogan')}</PhHeader>
                </View>
                <View style={{ marginTop: measures.bottomSpace / 2, flex: 1, alignItems: 'center' }} >
                    <Image style={{ width: '100%', height: measures.screenHeight * 0.55, resizeMode: 'stretch' }} source={bgImg}></Image>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: measures.bottomSpace }} >
                    <PhGradientButton onPress={() => handleCreateAccount()} containerStyle={{ marginBottom: 6 }} >{i18n.t('start_register')}</PhGradientButton>
                    <PhButton containerStyle={{ marginTop: 10, backgroundColor: `${colors.secondary}25` }} onPress={() => handleHasAccount()} textStyle={{ color: colors.secondary }} >{i18n.t('has_account')}</PhButton>
                </View>
            </View>

        </PhSafeAreaContainer>

    )
}
