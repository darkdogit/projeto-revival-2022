
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, StatusBar, Image } from 'react-native';
import { PhLinkButton, PhButton, PhGradientButton } from '../../phTemplates/buttons';
import { FontAwesome5 } from '@expo/vector-icons';
import { measures, colors } from '../../phTemplates/PhStyles';
import { PhSafeAreaContainer, PhOpacityViewContainer, PhScrollView } from '../../phTemplates/containers';
import { PhCaption, PhHeader, PhPageSubtitle, PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import { PhGradientIcon } from '../../phTemplates/components';
import i18n from '../../localization/AppLocalization';
const pkg = require('../../app.json')
const logo = require('../../assets/img/logo.png')
export default function RegisterWelcomeScreen(props) {
    const bgImg = require('../../assets/img/bg_welcome.png')
    // const logo = require('../../assets/img/logo.png')
    useEffect(() => {
        props.navigation.setOptions({ headerShown: false })
    })


    function handleContinue() {
        props.navigation.navigate('RegisterCompletion')
    }


    function CardContainer({ title, description, icon, selected }) {
        const styles = {
            cardContainer: {
                padding: measures.ySpace,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
            },
            labelsContainer: {
                paddingLeft: 10
            }
        }
        return (
            <View style={styles.cardContainer} >
                <PhGradientIcon family={'FontAwesome5'} name={'check'} size={20} />
                <View style={styles.labelsContainer}>
                    <PhSubtitle>{title}</PhSubtitle>
                    <PhParagraph>{description}</PhParagraph>
                </View>
            </View>
        )
    }
    return (
        <PhSafeAreaContainer>
            <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: measures.xSpace * 2 }} >
                <View style={{ alignItems: 'center' }}>
                    <Image source={logo} style={{ marginBottom: 6, height: 65, resizeMode: 'contain' }} />
                    <PhPageSubtitle>{i18n.t('devotee_welcome')}</PhPageSubtitle>
                    <PhPageTitle >{'Devotee'}</PhPageTitle>
                    <PhParagraph style={{ paddingVertical: measures.ySpace }}>{i18n.t('follow_rules')}</PhParagraph>
                </View>
                <CardContainer title={i18n.t('be_yourself')} description={i18n.t('be_yourself_text')} />
                <CardContainer title={i18n.t('be_safe')} description={i18n.t('be_safe_text')} />
                <CardContainer title={i18n.t('respect_others')} description={i18n.t('respect_others_text')} />
            </View>
            <PhGradientButton onPress={() => handleContinue()} containerStyle={{marginBottom: measures.ySpace * 2, marginVertical: measures.ySpace }} >{i18n.t('continue')}</PhGradientButton>
        </PhSafeAreaContainer>
        // <PhScrollView safeAreaProps={{ mode: 'noBottom' }} scrollViewProps={{ contentContainerStyle: { backgroundColor: 'red' } }} >
        // </PhScrollView >

    )
}
