import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Image, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { PhGradientButton } from '../../phTemplates/buttons';
import { PhEmptyStateContainer, PhOpacityViewContainer, PhScrollView } from '../../phTemplates/containers';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph, PhSubtitle } from '../../phTemplates/typography';
import HelperService from '../../services/HelperService';
import UserService from '../../services/UserService';
import environment from '../../environment';
import { PhImage } from '../../phTemplates/components';
import PhRow from '../../phTemplates/Containers/PhRow';
import PhLinkButton from '../../phTemplates/Buttons/PhLinkButton';
import i18n from '../../localization/AppLocalization';

export default function LikesFiltersScreen(props) {
    const session = useSelector(state => state.sessionReducer)
    const helperService = new HelperService()
    const userService = new UserService()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [items, setItems] = useState([])
    const [filters, setFilters] = useState({ gender: 'all' })


    useEffect(() => {
        // getItems()
        const listener = DeviceEventEmitter.addListener('LIKES_FILTERS_CHANGED', (newFilters) => {
            // console.log('filtros', { ...filters, ...newFilters })
            setFilters({ ...filters, ...newFilters })
        })
        return () => {
            listener.remove()
        };
    }, [])


    useEffect(() => {
        if (filters) {
            getItems()
        }
    }, [filters])


    /**
     * @description pega os matches da pessoa
     */
    async function getItems() {
        console.log(filters)
        try {
            setLoading(true)
            const res = await userService.getLikes()
            if (res.status) {
                let data = res.data
                if (filters.gender && filters.gender != 'all') {
                    data = data.filter(r => r.user.show_as_gender == filters.gender)
                }

                setItems(data)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    /**
    * @description container do da imagem do like. ja verifica se é conta premium e coloca o blur caso nao seja
    */
    function PicContainer({ item }) {
        const WIDTH = measures.screenWidth / 2 - 25
        const HEIGHT = 215
        const RADIUS = 10
        const styles = {
            container: {
                fledx: 1,
                // backgroundColor: colors.lightGray,
                width: WIDTH,
                height: HEIGHT,
                borderRadius: RADIUS,
                margin: 5,

            },
            picture: {
                width: '100%',
                height: '100%',
                borderRadius: RADIUS,
                backgroundColor: colors.disabled
            },
            opacityContainer: {
                width: WIDTH,
                height: HEIGHT,
                borderRadius: RADIUS,
                position: 'absolute',
                backgroundColor: colors.blackOpaque,
                zIndex: 2,
                justifyContent: 'flex-end',
                padding: measures.xSpace / 2
            }
        }

        /**
         * @description só ve o like se é conta premium
         */
        function handlePressed() {
            if (session?.premiumAccount) {
                RootNavigation.navigate('ProfileDetailStack', { screen: 'ProfileDetailScreen', params: { viewType: 'likes', item: item.user } })
            }
        }

        /**
         * 15/12/22 - por causa do soft delete de conta, caso algum user desse like e deletasse a conta, o relationship vinha null, causando o crash
         */
        return item.user ? (
            <TouchableOpacity onPress={ () => handlePressed() } activeOpacity={ 1 } style={ styles.container } >
                { session?.premiumAccount ?
                    <View style={ styles.opacityContainer }>
                        <PhSubtitle style={ { color: colors.white } } >{ `${item.user.name} ${item.user.show_age ? helperService.calculateAge(item.user.birthdate) : ''}` }</PhSubtitle>
                        <PhSubtitle style={ { color: colors.secondary } } >{ helperService.getTimeDifference(item.created_at) }</PhSubtitle>
                    </View> : null
                }
                <PhImage blurRadius={ session?.premiumAccount ? 0 : 25 } style={ styles.picture } source={ { uri: `${environment.baseImgUrl}${item.user.profile_picture[0]?.path}` } } ></PhImage>
            </TouchableOpacity>
        ) : null
    }

    /**
     * @description funcao do pull to refresh. Recarrega a lista
     */
    function refresh() {
        setRefreshing(true)
        getItems()
    }

    /**
     * @description vai pra tela de assinar/detalhe do plano
     */
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

    /**
     * @description vai pra tela de filtros
     */
    function handleFiltersPressed() {
        props.navigation.navigate('LikesFilters', { filters })
    }



    return (
        <>
            <PhScrollView onRefresh={ () => refresh() } refreshing={ refreshing } loading={ loading } { ...props } screenTitle={ '' } setHeaderOptions={ { headerShown: false } } >
                <View style={ { padding: measures.xSpace } } >
                    <PhRow>
                        <PhPageTitle style={ { paddingBottom: 12 } }>{ i18n.t('likes') }</PhPageTitle>
                        <PhLinkButton onPress={ handleFiltersPressed } textStyle={ { color: colors.secondary } } >{ i18n.t('filters') }</PhLinkButton>
                    </PhRow>
                    {
                        session?.premiumAccount ? <PhParagraph>{ i18n.t('likes_message2') }</PhParagraph>
                            : <PhParagraph>{ i18n.t('likes_message') }</PhParagraph>
                    }
                </View>

                <View style={ { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 } } >
                    {
                        items.map((r, index) => <PicContainer key={ index } item={ r } />)
                    }
                </View>
                {
                    items.length == 0 ?
                        <PhEmptyStateContainer>
                            <Image source={ require('../../assets/img/home_icon_big.png') } />
                            <PhSubtitle style={ { paddingTop: 12, textAlign: 'center' } } >{ i18n.t('no_likes') }</PhSubtitle>
                            <PhParagraph style={ { textAlign: 'center' } } >{ i18n.t('no_likes_text') }</PhParagraph>
                        </PhEmptyStateContainer> : null
                }
            </PhScrollView>
            {
                !session?.premiumAccount ?
                    <View style={ { position: 'absolute', width: '100%', bottom: measures.bottomSpace } } >
                        <PhGradientButton containerStyle={ { activeOpacity: 1 } } onPress={ () => handlePlus() } >{ i18n.t('see_likes') }</PhGradientButton>
                    </View> : null
            }
        </>

    )
}

