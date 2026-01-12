import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Image, Linking, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { useSelector } from 'react-redux';
import environment from '../../environment';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhGradientButton, PhLinkButton } from '../../phTemplates/buttons';
import { PhEmptyStateContainer, PhLoadingContainer, PhSafeAreaContainer } from '../../phTemplates/containers';
import { PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import { SwipeCard } from '../../projectsComponents';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import HelperService from '../../services/HelperService';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';
import { store } from '../../stores/store';
import AdCard from './AdCard';
import FakeCard from './FakeCard';
import i18n from '../../localization/AppLocalization';


let admodIntervalCount = 0 // contador pra mostrar o admob
const ADMOB_INTERVAL = 30 // mostra um admob a cada 30 cards e intercala com o do cms
const CUSTOM_AD_INTERVAL = ADMOB_INTERVAL * 2 // de qts em qts cards vai aparecer o anuncio custom do cms ( tem que ser o admob * 2 pq vai intercalar um anuncio do cms com um do admob )

const interstitialAdmob = InterstitialAd.createForAdRequest(environment.INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
});

export default function HomeScreen(props) {
    const session = useSelector(state => state.sessionReducer)
    const BASE_BOTTOM_SPACE = measures.ySpace * 2
    const helperService = new HelperService()
    const pushService = new PushNotificationService()
    const userService = new UserService()
    const swipeRef = new useRef()
    let ads = []
    let remainingAds = []
    const [cardIndex, setCardIndex] = useState(0)
    const [loading, setLoading] = useState(0)
    const [cards, setCards] = useState([])

    useEffect(() => {
        const unsubscribe = interstitialAdmob.addAdEventListener(AdEventType.LOADED, (e) => {
            console.log('carregou o admob', e)
            interstitialAdmob.show()
        });
        return unsubscribe;
    }, []);

    useEffect(() => {

        props.navigation.setOptions({ headerShown: false })
        const filterEmitter = DeviceEventEmitter.addListener('filtersChanged', () => {
            getCards()
        })
        const swipeUserEmitter = DeviceEventEmitter.addListener('swipeUser', (swipeType) => {
            try {
                setTimeout(() => {
                    if (swipeType == 'like') {
                        swipeRef.current.swipeRight()
                    }
                    if (swipeType == 'dislike') {
                        swipeRef.current.swipeLeft()
                    }
                }, 500);
            } catch (e) {
                console.log(e)
            }
        })
        if (session) {
            userService.getAds().then(r => {
                let a = r.data.filter(a => a.active)
                a.map(ad => {
                    ads.push(ad)
                    // ads.push({
                    //     isAdmob: true
                    // })
                })
                getCards()
            })
        }


        return () => {
            filterEmitter.remove()
            swipeUserEmitter.remove()
        }

    }, []);


    useFocusEffect(useCallback(() => {
        userService.syncUserWithApi().catch(e => console.log(e))
    }, []))

    useEffect(() => {
        userService.registerActivity().catch(e => console.log(e))
    }, [])



    async function getCards(resetDislikesFirst = false) {
        try {
            setLoading(true)
            if (resetDislikesFirst) {
                await userService.resetDislikes()
            }
            const res = await userService.getCards()
            if (res.status) {
                // console.log('API RESPONSE', res)
                var cards = res.data //.filter(r => r.account_type != 'curious')
                console.log('CARDS',res)
                const userInfo = store.getState().infoReducer

                if (cards.length) {
                    if (cards.length > CUSTOM_AD_INTERVAL) {
                        // a cada 30 cards, guarda as posicões num array pra adicionar depois
                        // faz o reverse no array pq se vc adicionar um item no inicio por exemplo, vai bagunçar os indices do array posteriores.
                        // começando do fim, os anteriores nao sao afetados, 
                        let indexes = cards.map((s, index) => {
                            if (index > 0 && index % CUSTOM_AD_INTERVAL == 0) {
                                return index
                            }
                        }).filter(r => r).reverse()

                        // se a as divisoes nao derem 30 exatos, adiciona um indice com a posicao final só pra nao ficar sem nada
                        if (indexes.length % CUSTOM_AD_INTERVAL > 0) {
                            indexes.unshift(cards.length)
                        }

                        // aqui faz o for nas posicoes do fim pro começo
                        indexes.map(ind => {
                            const adObject = getAdObject()
                            if (adObject) {
                                cards.splice(ind, 0, { ...adObject, isAd: true })
                            }
                        })

                    } else {
                        // se qtd de cards for < 30 add no fim. mesma logica ali de cima ( dava pra melhorar a logica mas to com preguiça)
                        const adObject = getAdObject()
                        if (adObject) {
                            cards.splice(cards.length, 0, { ...adObject, isAd: true })
                        }
                    }
                    if (!userInfo.swipedFake) {
                        cards.unshift({ fake: true })
                    }
                }

                setCards(cards)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    function getAdObject() {

        try {
            if (!remainingAds.length) {
                // acabou os anuncios, seta os restantes pra lista original q veio do get
                remainingAds = [...ads]
            }
            const ad = remainingAds[0]
            remainingAds.splice(0, 1)
            return ad
        } catch (e) {
            console.log('retornou null')
            return null
        }

    }

    function profilePressed(item) {
        RootNavigation.navigate('ProfileDetailStack', { screen: 'ProfileDetailScreen', params: { item: item, viewType: 'cards' } })
    }


    function swipedLeft(index) {
        const card = cards[index]
        if (card.fake) {
            userService.setFakeCardSwiped()
            return
        }
        if (card.isAd) {
            admodIntervalCount = 0
            return
        }
        if (session?.account_type != 'curious') {
            userService.dislike(card.id)
        }
        admodIntervalCount++

        if (admodIntervalCount === ADMOB_INTERVAL) {
            console.log('mostrou')
            interstitialAdmob.load()
        }
    }
    function swipedRight(index) {
        // like
        const card = cards[index]
        if (card.fake) {
            userService.setFakeCardSwiped()
            return
        }
        if (card.isAd && !card.isAdmob) {
            Linking.openURL(card.link).catch()
            admodIntervalCount = 0
            return
        }
        if (session?.account_type != 'curious') {
            userService.like(card.id)
        }
        admodIntervalCount++

        if (admodIntervalCount === ADMOB_INTERVAL) {
            console.log('mostrou')
            interstitialAdmob.load()
        }
    }

    function swipedAll() {
        setLoading(true)
        setTimeout(() => {
            getCards()
        }, 1000);
    }

    const styles = {
        labelStyle: {
            width: 180,
            fontSize: 60,
            borderWidth: 5,
            textAlign: 'center',
            borderRadius: 8,
            marginTop: measures.ySpace * 2,
            position: 'absolute'
        },
        likeLabelStyle: {
            color: colors.lightGreen,
            marginLeft: measures.xSpace,
            borderColor: colors.lightGreen,
            transform: [{
                rotate: '-15deg'
            }]
        },
        superLabelStyle: {
            // width: 180,
            fontSize: 40,
            borderWidth: 5,
            textAlign: 'center',
            borderRadius: 8,
            top: '30%',
            marginTop: measures.ySpace,
            marginHorizontal: measures.ySpace * 2,
            color: colors.lightBlue,
            borderColor: colors.lightBlue,
        },
        dislikeLabelStyle: {
            color: colors.secondary,
            marginRight: measures.xSpace,
            borderColor: colors.secondary,
            right: 0,
            transform: [{
                rotate: '15deg'
            }]
        }
    }

    const EmptyState = () => {
        return (
            <PhEmptyStateContainer>
                <Image source={ require('../../assets/img/home_icon_big.png') } />
                <PhSubtitle style={ { paddingTop: 12, textAlign: 'center' } } >{ i18n.t('no_profile') }</PhSubtitle>
                <PhParagraph style={ { textAlign: 'center' } } >{ i18n.t('no_profile_text') }</PhParagraph>
                <PhGradientButton onPress={ () => getCards(true) } loading={ loading } containerStyle={ { width: 130, marginTop: 15 } }  >{ i18n.t('restart') }</PhGradientButton>
            </PhEmptyStateContainer>
        )
    }

    return (
        <PhSafeAreaContainer>
            {
                loading ? <PhLoadingContainer /> :


                    cards.length > 0 ? <>
                        <Swiper
                            ref={ swipeRef }
                            cards={ cards }
                            cardIndex={ cardIndex }
                            disableBottomSwipe
                            disableTopSwipe={ !session?.premiumAccount }
                            stackSize={ 10 }
                            onSwipedAll={ swipedAll }
                            onSwipedLeft={ swipedLeft }
                            onSwipedRight={ swipedRight }
                            // onSwipedTop={swipedUp}
                            stackSeparation={ 0 }
                            animateOverlayLabelsOpacity={ true }

                            overlayLabels={ {
                                left: {
                                    element: <PhPageTitle style={ { ...styles.labelStyle, ...styles.dislikeLabelStyle } }>{ 'NOPE' }</PhPageTitle>,
                                },
                                right: {
                                    element: <PhPageTitle style={ { ...styles.labelStyle, ...styles.likeLabelStyle } } >{ 'LIKE' }</PhPageTitle>,
                                },
                                top: {
                                    element: <PhPageTitle style={ { ...styles.superLabelStyle } } >{ 'SUPER MATCH' }</PhPageTitle>,
                                },
                            } }
                            backgroundColor={ 'transparent' }
                            renderCard={ (card) => {
                                return (
                                    card?.fake === true ? <FakeCard />
                                        : card?.isAd == true ? <AdCard ad={ card } />
                                            : <SwipeCard card={ card } profilePressed={ () => profilePressed(card) } />
                                )
                            } }
                        />
                        {
                            session?.account_type != 'curious' ? <View style={ { flex: 1, marginHorizontal: measures.xSpace, position: 'absolute', bottom: measures.bottomSpace, flexDirection: 'row', paddingHorizontal: 10 } } >
                                <PhLinkButton onPress={ () => swipeRef.current.swipeLeft() } leftIcon={ <FontAwesome5 name={ 'times' } size={ 25 } color={ colors.white } /> } containerStyle={ { marginHorizontal: 10, flex: 1, borderWidth: 2, borderColor: colors.white } } textStyle={ { color: colors.white, marginLeft: 10 } } >
                                    { i18n.t('dislike') }
                                </PhLinkButton>
                                <PhLinkButton onPress={ () => swipeRef.current.swipeRight() } leftIcon={ <FontAwesome name={ 'heart' } size={ 22 } color={ colors.white } /> } containerStyle={ { marginHorizontal: 10, flex: 1, borderWidth: 2, borderColor: colors.white } } textStyle={ { color: colors.white, marginLeft: 10 } } >
                                    { i18n.t('like') }
                                </PhLinkButton>
                            </View> : null
                        }
                    </> : <EmptyState />
            }
        </PhSafeAreaContainer>
    )
}

