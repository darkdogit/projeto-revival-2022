import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { PhButton, PhGradientButton } from '../phTemplates/buttons'
import { PhParagraph, PhPageTitle } from '../phTemplates/typography';
import { FontAwesome } from '@expo/vector-icons';
import * as RootNavigation from '../routeStacks/RootNavigation';
import { colors, measures } from '../phTemplates/PhStyles';
import { PhScrollView } from '../phTemplates/containers';

export default function SuccessScreen(props) {
    const [isSubmitting, setSubmitting] = useState(false)
    const { title, text, buttonLabel } = props.route.params

    function handleContinue() {
        // setSubmitting(true)
        RootNavigation.goBack()
    }

    return (
        <PhScrollView screenTitle={''} {...props}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: measures.xSpace }} >
                <FontAwesome name={'check-circle'} color={colors.green} size={70} />
                <PhPageTitle style={{ marginHorizontal: 20, marginTop: 20, textAlign: 'center' }}>{title}</PhPageTitle>
                <PhParagraph style={{ textAlign: 'center', marginTop: 10 }} >{text}</PhParagraph>
                <PhGradientButton onPress={() => handleContinue()} containerStyle={{width: 120, marginTop: measures.ySpace }} >{buttonLabel}</PhGradientButton>
            </View>
        </PhScrollView>
    )
}
