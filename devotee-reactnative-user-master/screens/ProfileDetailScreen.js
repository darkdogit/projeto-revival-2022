import { FontAwesome, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, DeviceEventEmitter, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';
import { PhButton, PhGradientButton, PhLinkButton } from '../phTemplates/buttons';
import { PhDivider } from '../phTemplates/components';
import { PhTextInput } from '../phTemplates/inputs';
import { colors, measures } from '../phTemplates/PhStyles';
import { PhHeader, PhPageSubtitle, PhPageTitle, PhParagraph } from '../phTemplates/typography';
import { PhRow, SwipeCard } from '../projectsComponents';
import * as RootNavigation from '../routeStacks/RootNavigation';
import HelperService from '../services/HelperService';
import UserService from '../services/UserService';
import i18n from '../localization/AppLocalization';

/**
 * @param  viewType 'cards', 'view', 'likes',
 */

export default function ProfileDetailScreen(props) {

    const session = useSelector(state => state.sessionReducer)
    const [type, setType] = useState(props.route.params?.viewType || 'view')
    const [item, setItem] = useState({ ...props.route.params.item })
    const [reason, setReason] = useState('')
    const [loadingMatch, setLoadingMatch] = useState(false)
    const [submittingReport, setSubmittingReport] = useState(false)
    const userService = new UserService()

    const helperService = new HelperService()
    const bottomSheetRef = useRef()
    const shakeAnimation = new Animated.Value(0)
    var scrollPaddingBottom = measures.ySpace * 2
    // const itsMe = item.id == session?.id
    const itsMe = session?.id == item.id


    // switch (type) {
    //     case 'cards': scrollPaddingBottom = measures.ySpace + 150; break;
    //     case 'likes': scrollPaddingBottom = measures.ySpace + 100; break;
    // }
    const addressDescription = useMemo(() => {
        try {
            if (item?.show_distance && item?.address_description) {
                const ad = item?.address_description.split('-')
                return ad.length > 2 ? ad[1] : item?.address_description
            }
            return ''
        } catch (e) {
            return ''
        }
    });
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => !itsMe ? (
                <PhLinkButton loading={ submittingReport } textStyle={ { color: colors.secondary } } containerStyle={ { paddingTop: 0, paddingBottom: 0 } } onPress={ () => handleReport() } >
                    { i18n.t('report') }
                </PhLinkButton>) : null

        })


        getProfile()

    }, [])


    async function getProfile() {
        try {
            const res = await userService.getUser(item.id)
            if (res.status) {
                console.log(res)
                setItem(res.data)
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }

    function startShake(type) {

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        if (type == 'last') {
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

    function handleLike() {
        if (type == 'likes') {
            userService.like(item.id)
        } else {
            DeviceEventEmitter.emit('swipeUser', 'like')
        }
        RootNavigation.goBack()
    }

    function handleDislike() {
        if (type == 'likes') {
            userService.dislike(item.id)
        } else {
            DeviceEventEmitter.emit('swipeUser', 'dislike')
        }
        RootNavigation.goBack()
    }

    async function handleSuperMatch() {
        try {
            setLoadingMatch(true)
            if (session?.premiumAccount) {
                const r = await userService.superMatch(item.id)
                setType('view')
                console.log('resposta super linke', r)
                DeviceEventEmitter.emit('filtersChanged')
            } else {
                RootNavigation.navigate('Plus')
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoadingMatch(false)
        }
    }

    function handleReport() {
        bottomSheetRef.current.open()
    }

    async function handleSubmitReport() {
        setSubmittingReport(true)
        bottomSheetRef.current.close()
        setTimeout(async () => {
            try {
                const res = await userService.reportUser(item.id, reason)
                if (res.status) {
                    setReason('')
                    helperService.showToast({
                        visibilityTime: 2000,
                        text1: i18n.t('user_reported'),
                        text2: `${i18n.t('user_reported_success')}`,
                    });
                }
            } catch (e) {
                console.log(e)
            } finally {
                setSubmittingReport(false)
            }
        }, 2000);

    }


    const styles = {
        rowStyle: {
            paddingVertical: measures.ySpace,
            paddingRight: measures.xSpace
        }
    }



    return (

        <>
            <ScrollView contentContainerStyle={ { paddingBottom: scrollPaddingBottom } } style={ { backgroundColor: colors.white } }>

                <Animated.View style={ {
                    width: '100%',
                    height: measures.screenHeight * 0.65,
                    transform: [{ translateX: shakeAnimation }]
                } }>

                    <SwipeCard card={ item } dontShowTitle borderRadius={ 0 } buttonsContainerStyle={ { bottom: measures.ySpace } } style={ { height: '100%' } } profilePressed={ () => { } } />

                    <View style={ { position: 'absolute', bottom: measures.ySpace, right: 0, zIndex: 3, width: 135 } } >
                        <PhGradientButton onPress={ () => props.navigation.goBack() } leftIcon={ <FontAwesome5 size={ 20 } color={ colors.white } name={ 'arrow-circle-left' } /> } >{ `  ${i18n.t('back')}` }</PhGradientButton>
                    </View>
                </Animated.View>
                <View style={ { paddingHorizontal: measures.xSpace } } >
                    <PhRow style={ { paddingTop: measures.ySpace, paddingBottom: 12 } }>
                        <PhPageTitle>{ `${item.name}` } { item.show_age ? <PhPageSubtitle>{ helperService.calculateAge(item.birthdate) }</PhPageSubtitle> : null } </PhPageTitle>
                        <FontAwesome5 size={ 28 } color={ item.show_as_gender == 'male' ? colors.primary : colors.secondary } name={ item.show_as_gender == 'male' ? 'mars' : 'venus' } />
                    </PhRow>
                    <PhRow alignStart justifyStart style={ { paddingVertical: measures.ySpace } }>
                        <FontAwesome5 size={ 20 } style={ { minWidth: 25 } } color={ colors.primary } name={ 'user' } />
                        <PhParagraph style={ { paddingLeft: 12 } } >{ `${i18n.t(item.account_type || 'devotee')}` }</PhParagraph>
                    </PhRow>
                    {

                        item.show_distance && item?.address_description ?
                            <>
                                <PhDivider />
                                <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                    <SimpleLineIcons size={ 22 } style={ { marginLeft: -1, minWidth: 25 } } color={ colors.primary } name={ 'location-pin' } />
                                    <PhParagraph style={ { paddingLeft: 12 } } >{ addressDescription }</PhParagraph>
                                </PhRow>
                            </> : null
                    }
                    {
                        item.about ?
                            <>
                                <PhDivider />
                                <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                    <FontAwesome5 size={ 20 } style={ { minWidth: 25 } } color={ colors.primary } name={ 'comment-alt' } />
                                    <PhParagraph style={ { paddingLeft: 12 } } >{ item.about }</PhParagraph>
                                </PhRow>

                            </> : null
                    }
                    <PhDivider />
                    <PhRow alignStart justifyStart style={ styles.rowStyle }>
                        <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'search' } />
                        <PhParagraph style={ { paddingLeft: 12 } } >{ `${i18n.t('interested_in')} ${i18n.t(item.target_gender)}, ${item.relationship_type == 'all' ? i18n.t('all_kinds_of_relatioships') : i18n.t(item.relationship_type)}` }</PhParagraph>
                    </PhRow>
                    <PhDivider />

                    {
                        item.account_type == 'special' ? <View style={ { paddingTop: measures.xSpace, flex: 1 } } >
                            <PhHeader style={ { paddingBottom: measures.xSpace } } >{ i18n.t('disability') }</PhHeader>
                            {
                                item.disability_description ?
                                    <>
                                        <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                            <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'user-injured' } />
                                            <PhParagraph style={ { paddingLeft: 12 } } >{ item.disability_description }</PhParagraph>
                                        </PhRow>
                                        <PhDivider />
                                    </>
                                    : null
                            }
                            {
                                item.my_cids && item.my_cids.length > 0 ?
                                    <>
                                        <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                            <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'hand-holding-medical' } />
                                            <PhParagraph style={ { paddingLeft: 12 } } >{ item.my_cids?.map(r => userService.loc == 'pt-BR' ? r.cid.description : r.cid.description_en).join(', ') }</PhParagraph>
                                        </PhRow>
                                        <PhDivider />
                                    </>
                                    : null
                            }
                            {
                                item.medical_procedures && item.medical_procedures.length > 0 ?
                                    <>
                                        <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                            <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'stethoscope' } />
                                            <PhParagraph style={ { paddingLeft: 12 } } >{ item.medical_procedures?.map(r => userService.loc == 'pt-BR' ? r.medical_procedures.name : r.medical_procedures.name_en).join(', ') }</PhParagraph>
                                        </PhRow>
                                        <PhDivider />
                                    </>
                                    : null
                            }
                            {
                                item.my_hospitals && item.my_hospitals.length > 0 ?
                                    <>
                                        <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                            <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'hospital' } />
                                            <PhParagraph style={ { paddingLeft: 12 } } >{ item.my_hospitals.map(r => r.hospital.name).join(', ') }</PhParagraph>
                                        </PhRow>
                                        <PhDivider />
                                    </>
                                    : null
                            }
                            {
                                item.my_drugs && item.my_drugs.length > 0 ?
                                    <>
                                        <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                            <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'pills' } />
                                            <PhParagraph style={ { paddingLeft: 12 } } >{ item.my_drugs?.map(r => userService.loc == 'pt-BR' ? r.drug.name : r.drug.name_en).join(', ') }</PhParagraph>
                                        </PhRow>
                                        <PhDivider />
                                    </>
                                    : null
                            }
                            {

                                item.my_things && item.my_things.length > 0 ?
                                    <>
                                        <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                            <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'crutch' } />
                                            <PhParagraph style={ { paddingLeft: 12 } } >{ item.my_things?.map(r => userService.loc == 'pt-BR' ? r.thing.name : r.thing.name_en).join(', ') }</PhParagraph>
                                        </PhRow>
                                        <PhDivider />

                                    </>
                                    : null
                            }
                            {
                                item.prejudice ?
                                    <>
                                        <PhRow alignStart justifyStart style={ styles.rowStyle }>
                                            <FontAwesome5 style={ { minWidth: 25 } } size={ 20 } color={ colors.primary } name={ 'frown' } />
                                            <PhParagraph style={ { paddingLeft: 12 } } >{ i18n.t('suffer_prejudice') }</PhParagraph>
                                        </PhRow>
                                        <PhDivider />

                                    </>
                                    : null
                            }
                        </View> : null
                    }

                </View>

                {
                    type != 'view' ?
                        <View style={ { paddingVertical: measures.bottomSpace } } >
                            {
                                session?.account_type !== 'curious' ?
                                    <PhRow>
                                        <PhButton onPress={ () => handleDislike() } textStyle={ { color: colors.primary } } leftIcon={ <FontAwesome5 name={ 'times' } size={ 30 } color={ colors.primary } /> } flex containerStyle={ { backgroundColor: colors.disabled, marginRight: 10, flex: 1 } } >
                                            { `  ${i18n.t('dislike')}` }
                                        </PhButton>
                                        <PhButton onPress={ () => handleLike() } textStyle={ { color: colors.secondary } } leftIcon={ <FontAwesome name={ 'heart' } size={ 25 } color={ colors.secondary } /> } flex containerStyle={ { backgroundColor: colors.secondaryLighter, marginLeft: 10 } } >
                                            { `  ${i18n.t('like')}` }
                                        </PhButton>
                                    </PhRow> : null
                            }

                            <PhButton loading={ loadingMatch } onPress={ () => handleSuperMatch() } textStyle={ { color: colors.orange } } leftIcon={ <FontAwesome name={ 'star' } size={ 28 } color={ colors.orange } /> } containerStyle={ { marginTop: 12, backgroundColor: colors.orangeLighter } } >
                                { i18n.t('send_message') }
                            </PhButton>

                        </View> : null
                }
            </ScrollView>



            < RBSheet
                animationType={ 'fade' }
                ref={ bottomSheetRef }
                height={ measures.screenHeight * 0.35 }
                customStyles={ {
                    container: {
                        borderTopRightRadius: 18,
                        borderTopLeftRadius: 18,
                    },
                    draggableIcon: {
                        backgroundColor: colors.gray
                    }
                }
                }
            >
                <View style={ { flex: 1, paddingVertical: measures.xSpace } } >
                    <View style={ { paddingHorizontal: measures.xSpace } } >
                        <PhHeader style={ { paddingBottom: 12 } } >{ i18n.t('report_this_user') }</PhHeader>
                    </View>
                    <PhTextInput
                        labelTitle={ i18n.t('description_report') }
                        placeholder={ i18n.t('description_report') }
                        value={ reason }
                        autoComplete={ "off" }
                        onChangeText={ (text) => setReason(text) }
                    />
                    <PhButton bgColor={ colors.red } disabled={ !reason } onPress={ () => handleSubmitReport() } containerStyle={ { marginTop: measures.ySpace } } >{ i18n.t('report') }</PhButton>
                </View>
            </RBSheet >

        </>


    )
}

