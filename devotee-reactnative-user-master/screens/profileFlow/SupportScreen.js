import React, { useEffect } from 'react';
import { Image, Linking, View } from 'react-native';
import environment from '../../environment';
import { PhLinkButton } from '../../phTemplates/buttons';
import { PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import i18n from '../../localization/AppLocalization';



export default function SupportScreen(props) {
    function handleMail() {
        Linking.openURL(`mailto:${environment.supportEmail}`)
    }

    useEffect(() => {
        props.navigation.setOptions({ headerShown: true })
    }, [])


    return (
        <PhScrollView screenTitle={''}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: measures.xSpace * 2 }} >
                <Image style={{ resizeMode: 'contain' }} source={require('../../assets/img/support_icon_large.png')} ></Image>
                <PhPageTitle style={{ margin: measures.bottomSpace / 2 }} >{i18n.t('support')}</PhPageTitle>
                <PhParagraph style={{ textAlign: 'center' }} >{i18n.t('support_text2')}</PhParagraph>
                <PhLinkButton onPress={() => handleMail()} textStyle={{ color: colors.secondary }} >{environment.supportEmail}</PhLinkButton>
            </View>
        </PhScrollView>
    )
}

