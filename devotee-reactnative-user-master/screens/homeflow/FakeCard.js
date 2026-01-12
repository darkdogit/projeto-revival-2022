import React from 'react';
import { Animated, Image, View } from 'react-native';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhHeader } from '../../phTemplates/typography';
import { PhRow } from '../../projectsComponents';
import i18n from '../../localization/AppLocalization';

export default function FakeCard(props) {
    const styles = {
        parent: {
            position: 'absolute',
            width: '100%',
            height: measures.CARD_HEIGHT,
            borderRadius: 10,
            zIndex: 4

        },
        topContainer: {
            flex: 1.5,
        },
        leftView: {
            flex: 1,
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: measures.ySpace
        },
        rightView: {
            flex: 1,
            height: '100%',
            // borderRightWidth: 2,
            paddingTop: measures.ySpace,
            justifyContent: 'center',
            alignItems: 'center',
        },
        bottomView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: measures.ySpace,

        },
        icons: {
            width: 45,
            height: 45,
            resizeMode: 'contain'
        }

    }
    return (
        <Animated.View style={ {
            width: '100%',
            height: measures.CARD_HEIGHT,
            borderRadius: 10,
            backgroundColor: 'white'
        } }>
            <Image style={ {
                flex: 1,
                width: '100%',
                height: '100%',
                borderRadius: 10,
            } } source={ require('../../assets/img/cardTutorialPlaceholder.png') } />
            <View style={ styles.parent } >
                <PhRow style={ styles.topContainer } >
                    <View style={ styles.leftView } >
                        <Image style={ styles.icons } source={ require('../../assets/img/left-hand-touch.png') } />
                        <PhHeader style={ { color: colors.white } } >{ i18n.t('prev_picture') }</PhHeader>
                    </View>
                    <View style={ styles.rightView } >
                        <Image style={ styles.icons } source={ require('../../assets/img/right-hand-touch.png') } />
                        <PhHeader style={ { color: colors.white } } >{ i18n.t('next_picture') }</PhHeader>
                    </View>
                </PhRow>
                <View style={ styles.bottomView } >
                    <Image style={ styles.icons } source={ require('../../assets/img/right-hand-touch.png') } />
                    <PhHeader style={ { color: colors.white } } >{ i18n.t('open_profile') }</PhHeader>
                </View>
            </View>
        </Animated.View>
    )

}

