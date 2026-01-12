import { FontAwesome } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import i18n from '../localization/AppLocalization';
import { PhGradientButton, PhLinkButton } from '../phTemplates/buttons';
import { PhSafeAreaContainer } from '../phTemplates/containers';
import { colors, measures } from '../phTemplates/PhStyles';
import { PhPageTitle } from '../phTemplates/typography';
import { SwipeCard } from '../projectsComponents';
import * as RootNavigation from '../routeStacks/RootNavigation';
import ChatService from '../services/ChatService';
import HelperService from '../services/HelperService';
import UserService from '../services/UserService';

/**
 * @param  'cards', 'view', 'likes',
 */

export default function MatchScreen(props) {


    const fadeAnimation = new Animated.Value(0)
    const [item, setItem] = useState({ ...props.route.params.item })
    const [match, setMatch] = useState()
    const [reason, setReason] = useState('')
    const userService = new UserService()
    const chatService = new ChatService()
    const helperService = new HelperService()
    const bottomSheetRef = useRef()

    var scrollPaddingBottom = measures.ySpace

    fadeIn()


    useEffect(() => {

        props.navigation.setOptions(
            {
                headerLeft: null,
                headerRight: () => (< PhLinkButton containerStyle={{ paddingTop: 0, paddingBottom: 0 }
                } onPress={() => props.navigation.goBack()} >
                    <FontAwesome name="times-circle" size={30} color={colors.disabled} />
                </PhLinkButton >)
            })
        getProfile()
        getMatch()

    }, [])


    async function getProfile() {
        try {
            const res = await userService.getUser(item.id)
            if (res.status) {
                setItem(res.data)
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }
    async function getMatch() {
        try {
            const res = await chatService.getMatch(props.route.params.matchId)
            if (res.status) {
                setMatch(res.data)
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }


    function fadeIn() {
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 800,
            delay: 400,
            useNativeDriver: true
        }).start();
    };

    function MatchMessage() {
        const styles = {
            container: {
                // borderColor: colors.lightGreen,
                // borderWidth: 5,
                borderRadius: 16,
                padding: 12,
                position: 'absolute',
                alignItems: 'center',
                zIndex: 2,
                opacity: fadeAnimation,
                bottom: measures.ySpace * 2.5
            }
        }
        return (
            <Animated.View style={styles.container}>
                <PhPageTitle style={{ color: colors.secondary }} >{i18n.t('new_gave')}</PhPageTitle>
                <PhPageTitle style={{ color: colors.secondary, fontSize: 60, marginTop: -20 }} >{'Match!'}</PhPageTitle>
            </Animated.View>
        )
    }

    function handleSendMessage() {
        props.navigation.goBack()
        if (match) {
            RootNavigation.navigate('Chat', { screen: 'ChatScreen', params: { item: match } })
        }
    }

    return (

        <PhSafeAreaContainer  >
            <View style={{ paddingHorizontal: measures.xSpace, justifyContent: 'center', alignItems: 'center' }} >
                <MatchMessage />
                <SwipeCard card={item} dontShowTitle style={{ height: '90%' }} profilePressed={() => { }} />
            </View>
            <PhGradientButton onPress={() => handleSendMessage()} >{i18n.t('send_message')}</PhGradientButton>
        </PhSafeAreaContainer>
    )
}

