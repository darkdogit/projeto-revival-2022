import { FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { createRef, useState } from 'react';
import { Animated, Dimensions, TouchableOpacity, View, ViewProps } from 'react-native';
import PagerView from 'react-native-pager-view';
import environment from './environment';
import { PhGradientIcon, PhImage } from './phTemplates/components';
import { colors, measures, noSpace } from "./phTemplates/PhStyles";
import { PhLabel, PhPageSubtitle, PhPageTitle, PhParagraph } from "./phTemplates/typography";
import HelperService from './services/HelperService';
import i18n from './localization/AppLocalization';

export const DevoteePlus = (props) => {

    return (
        <View style={ { flexDirection: 'row', alignItems: 'center' } } >
            <PhPageTitle style={ { color: props.light ? colors.white : colors.primary, fontSize: 36, fontFamily: 'Nunito_900Black' } } >{ 'Devotee ' }</PhPageTitle>
            <PhGradientIcon family={ 'FontAwesome5' } style={ { marginTop: 6 } } name={ 'plus' } size={ 20 } />
        </View>
    )
}
export const NotificationBadge = (props) => {
    const height = props.style?.height || 18
    const radius = height / 2
    const styles = {
        container: {
            height: height,
            width: height,
            borderRadius: radius,
            borderColor: colors.white,
            borderWidth: 2.5,
            ...props.style
        }
    }
    return (
        <LinearGradient colors={ colors.primaryGradient } style={ styles.container } />
    )
}


export const PictureContainer = ({ index, onPress, image }) => {

    const WIDTH = measures.screenWidth / 3 - 35
    // const HEIGHT = measures.screenHeight * 0.22
    const HEIGHT = WIDTH * 1.55
    const RADIUS = 10
    const styles = {
        container: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            margin: 5,
            borderRadius: RADIUS,
            borderColor: colors.disabled,
            borderWidth: image ? 0 : 2,
            backgroundColor: colors.lighterGray,
            height: HEIGHT,
            minWidth: WIDTH
        },
        picture: {
            width: '100%',
            height: '100%',
            borderRadius: RADIUS,
            position: 'absolute',
            top: 0,
            left: 0

        },
        gambiarraView: {
            backgroundColor: colors.white,
            width: 25, height: 25,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 8,
            right: 8,
            position: 'absolute',
            paddingLeft: 2,
            paddingTop: 2
        },
        gambiarraView2: {
            backgroundColor: colors.white,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 8,
            right: 8,
            position: 'absolute'
        }
    }

    if (image) {
        // console.log(image)
    }
    return (
        <TouchableOpacity onPress={ () => onPress() } activeOpacity={ 1 } style={ styles.container }>
            {/* {image ? <Image style={styles.picture} source={{ uri: 'https://picsum.photos/400/600' }} ></Image> : null} */ }
            { image ? <PhImage style={ styles.picture } source={ { uri: (image.path || image.uri) } } ></PhImage> : null }
            {
                image ?
                    <View style={ styles.gambiarraView } >
                        <PhGradientIcon family={ 'FontAwesome5' } name={ 'pencil-alt' } size={ 14 } />
                    </View>
                    : <View style={ styles.gambiarraView2 } >
                        <PhGradientIcon family={ 'FontAwesome5' } name={ 'plus-circle' } size={ 25 } />
                    </View>
            }
        </TouchableOpacity>
    )


}





export const PicturesViewPager = ({ it, pagerViewStyle, reachedEnd, borderRadius }) => {
    const [item, setItem] = useState({ ...it })
    const [currentIndex, setCurrentIndex] = useState(0)
    var pagerRef = createRef()
    const BORDER_RADIUS = borderRadius === undefined ? 10 : borderRadius
    const styles = {
        pagerView: {
            flex: 1,
            width: '100%',
            height: '100%',
            borderRadius: BORDER_RADIUS,
            ...pagerViewStyle,
            backgroundColor: colors.lightGray
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: BORDER_RADIUS,
            backgroundColor: colors.lightGray
        },
        buttonsOverlay: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 3,
            // backgroundColor: `${colors.black}10`,
            borderRadius: BORDER_RADIUS,


        },
        indicator: {
            flex: 1,
            marginHorizontal: 3,
            borderRadius: 4,
            height: 4
        },
        indicatorContainer: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            height: 50,
            position: 'absolute',
            top: 0,
            zIndex: 2,
            paddingTop: 0,
            paddingHorizontal: 12,
            borderRadius: BORDER_RADIUS,

            // backgroundColor: 'red'


        }
    }



    function goNext() {
        if (currentIndex < (item.profile_picture.length - 1)) {
            const c = currentIndex + 1
            setCurrentIndex(c)
            pagerRef.setPageWithoutAnimation(c)
        } else {
            reachedEnd('last')
        }


    }

    function goPrev() {
        console.log('prev', currentIndex)
        if (currentIndex > 0) {
            const c = currentIndex - 1
            setCurrentIndex(c)
            pagerRef.setPageWithoutAnimation(c)
        } else {
            reachedEnd('first')
        }
    }


    return (
        <>
            < PagerView style={ styles.pagerView } initialPage={ 0 } scrollEnabled={ false } ref={ (r) => pagerRef = r } >
                {
                    item.profile_picture.map((r, index) => {
                        return (
                            <View style={ { alignItems: 'center', flex: 1 } } key={ `${index}` } >
                                <LinearGradient colors={ ['#00000040', 'transparent'] } locations={ [0.3, 1] } style={ styles.indicatorContainer } >

                                    {
                                        item.profile_picture.length > 1 ? item.profile_picture.map((x, i) => {
                                            return (
                                                <View key={ `${i}` } style={ { ...styles.indicator, backgroundColor: currentIndex == i ? colors.white : `${colors.black}6b` } } />
                                            )
                                        }) : null
                                    }
                                </LinearGradient>
                                <PhImage source={ { uri: `${environment.baseImgUrl}${r.path}` } } style={ styles.image } />
                            </View>
                        )
                    })
                }
            </PagerView >
            <LinearGradient colors={ ['transparent', '#000000'] } locations={ [0.5, 1] } style={ styles.buttonsOverlay } >
                <View style={ { flex: 2.5, flexDirection: 'row' } } >
                    <TouchableOpacity onPress={ () => goPrev() } activeOpacity={ 1 } style={ { flex: 1 } } />
                    <TouchableOpacity onPress={ () => goNext() } activeOpacity={ 1 } style={ { flex: 1 } } />
                </View>
            </LinearGradient>
        </>
    )
}



export const Badge = ({ type, title, style }) => {
    const t = title || i18n.t(type)

    const styles = {
        typeBadge: {
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 5,
            maxWidth: 70,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            ...style
        }
    }
    if (type != 'devotee' && type != 'special' && !title) return null
    return (
        type == 'special' ?
            <LinearGradient
                locations={ [0, 0.7] }
                start={ [0, 1] }
                end={ [1, 0] }
                colors={ colors.primaryGradient }
                style={ styles.typeBadge } >
                <PhLabel style={ { color: colors.white } } >{ t }</PhLabel>
            </LinearGradient> :

            <View style={ styles.typeBadge } >
                <PhLabel style={ { color: colors.white } } >{ t }</PhLabel>
            </View>
    )
}


export const SwipeCard = ({ card, profilePressed, style, buttonsContainerStyle, dontShowTitle, borderRadius }) => {

    const BASE_BOTTOM_SPACE = measures.ySpace * 2
    const shakeAnimation = new Animated.Value(0)
    const helperService = new HelperService()


    const CARD_HEIGHT = Dimensions.get('screen').height - measures.cardHeightFix - measures.statusBarHeight

    // console.log(`STATUSBARMANAGER ${Platform.OS}`, measures.statusBarHeight)

    const styles = {
        buttonsContainer: {
            position: 'absolute',
            zIndex: 3,
            width: '100%',
            bottom: BASE_BOTTOM_SPACE + (measures.ySpace * 2),
            paddingHorizontal: measures.ySpace,
            ...buttonsContainerStyle
        },
        whiteLabel: {
            color: colors.white,
        },

    }




    function startShake(type) {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        if (type == 'first') {

            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: -10, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 0, duration: 80, useNativeDriver: true })
            ]).start();
        } else {
            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: 10, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: -0, duration: 80, useNativeDriver: true })
            ]).start();
        }
    }





    // <Badge special={'special'} />
    return (
        <Animated.View style={ {
            width: '100%',
            // height: measures.screenHeight * 0.80 - 10,
            height: CARD_HEIGHT,
            borderRadius: 10, transform: [{ translateX: shakeAnimation }],
            ...style
        } }>

            <PicturesViewPager it={ card } reachedEnd={ startShake } borderRadius={ borderRadius } />
            {
                dontShowTitle ? null :
                    <TouchableOpacity onPress={ () => profilePressed() } activeOpacity={ 1 } style={ styles.buttonsContainer }>
                        <View style={ { flexDirection: 'row', alignItems: 'flex-end', width: '100%', paddingBottom: 20 } } >
                            <View style={ { paddingRight: 0, flex: 1 } }>
                                <Badge type={ card.account_type } />
                                <PhPageTitle style={ { ...styles.whiteLabel } } >{ card.name ? card.name.split(' ')[0] : '' } { card.show_age ? <PhPageSubtitle style={ styles.whiteLabel } >{ helperService.calculateAge(card.birthdate) }</PhPageSubtitle> : null } </PhPageTitle>
                                {
                                    card.show_distance && card.distance ? <View style={ { flexDirection: 'row', alignItems: 'center', paddingTop: 12, paddingBottom: 8 } } >
                                        <SimpleLineIcons name={ 'location-pin' } size={ 16 } color={ colors.white } />
                                        <PhParagraph style={ { ...noSpace, ...styles.whiteLabel } } >{ ` ${helperService.calculateDistance(card.distance || 0)} ${i18n.t('from_you')}` }</PhParagraph>
                                    </View> : null
                                }
                                {
                                    card.about ? <PhParagraph style={ { ...styles.whiteLabel, paddingRight: 12 } } >{ `${helperService.limitString(card.about, 100)}` }</PhParagraph> : null
                                }
                            </View>

                            <FontAwesome5 style={ { paddingBottom: 12 } } name={ 'info-circle' } color={ colors.white } size={ 25 } />
                        </View>
                    </TouchableOpacity>
            }
        </Animated.View>
    )
}




export function RepairStatusContainer(props) {

    const repairService = new RepairService()
    const rps = repairService.repairStatuses(props.item.status)

    return (
        <View style={ { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' } } >
            <FontAwesome5 solid dual color={ rps.color } name={ rps.icon } size={ props.iconSize || 12 } />
            <PhParagraph style={ { paddingLeft: 5, color: rps.color } } >{ `${rps.text}${props.showPercentage || (props.showPercentage === undefined || props.showPercentage === true) ? ` - ${parseInt(props.item.preparationPorcent)}%` : ''}` }</PhParagraph>
        </View>
    )
}


export function LinearButtonContainer({ buttonProps }) {
    return (<LinearGradient style={ { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: measures.ySpace, paddingTop: measures.ySpace * 2 } }
        locations={ [0, 0.3] }
        colors={ ["#ffffff00", colors.white] }>
        <PhButton loading={ buttonProps.loading } disabled={ buttonProps.disabled } containerStyle={ { ...buttonProps.style } } onPress={ () => buttonProps.onPress() } >{ buttonProps.title }</PhButton>
    </LinearGradient>)
}



// interface PhRowProps {
//     noFlex?: boolean,
//     style?: any,
//     justifyStart?: boolean,
//     justifyEnd?: boolean,
//     justifyAround?: boolean,
//     alignStart?: boolean,
//     alignEnd?: boolean,

// }

export const PhRow = (props) => {
    const flex = props.noFlex ? null : props.style?.flex || 1
    var justify = 'space-between'
    var align = 'center'
    if (props.justifyStart) {
        justify = 'flex-start'
    }
    if (props.justifyEnd) {
        justify = 'flex-end'
    }
    if (props.justifyAround) {
        justify = 'space-around'
    }


    if (props.alignStart) {
        align = 'flex-start'
    }
    if (props.alignEnd) {
        align = 'flex-end'
    }

    const styles = {
        flexDirection: 'row',
        justifyContent: justify,
        alignItems: align,
        ...props.style,
        flex: flex
    }
    return (
        <View style={ styles } >
            { props.children }
        </View>
    )
}



