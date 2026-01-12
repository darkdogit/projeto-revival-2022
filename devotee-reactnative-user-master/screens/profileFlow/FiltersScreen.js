import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Constants from 'expo-constants';
import React, { useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter, Platform, View } from 'react-native';
import { useSelector } from 'react-redux';
import i18n from '../../localization/AppLocalization';
import { PhLinkButton } from '../../phTemplates/buttons';
import { PhDivider, PhRawListItem } from '../../phTemplates/components';
import { PhLoadingContainer, PhScrollView } from '../../phTemplates/containers';
import { PhSelectInput } from '../../phTemplates/inputs';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhAction, PhLabel, PhParagraph } from '../../phTemplates/typography';
import * as RootNavigation from '../../routeStacks/RootNavigation';
import HelperService from '../../services/HelperService';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';

export default function FiltersScreen(props) {
    const SEARCH_LIST_RESPONSE_ID = 'PH_SEARCH_LIST_RESPONSE_FILTERS'
    const SEARCH_LIST_PAGINATION_RESPONSE_ID = 'PH_SEARCH_LIST_RESPONSE_FILTERS_PAGINATION'
    const pushService = new PushNotificationService()
    const helperService = new HelperService()
    const userService = new UserService()
    const [isSubmitting, setSubmitting] = useState(false)
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [location, setLocation] = useState({})
    const [loading, setLoading] = useState(false)
    const session = useSelector(state => state.sessionReducer)
    const [values, setValues] = useState()
    const styles = {
        marker: Platform.OS == 'android' ?
            { width: 25, height: 25, marginTop: 2, backgroundColor: colors.white, borderColor: colors.lightGray, borderWidth: 1 } : null
    }

    useEffect(() => {
        if (!values) {
            console.log('values esta null')
            getInitialValues()
        }
        return () => {
        }
    }, [values])


    useEffect(() => {
        const addressListener = DeviceEventEmitter.addListener('filter_address_changed', (v) => {
            setValues(values => {
                return {
                    ...values,
                    'location': v
                }
            })
        })

        const relationshipListener = DeviceEventEmitter.addListener('relationship_filter_changed', (value) => {
            setValues(values => {
                return {
                    ...values,
                    'relationship_type': value.id
                }
            })
        })

        const searchListListener = DeviceEventEmitter.addListener(SEARCH_LIST_RESPONSE_ID, ({ type, item }) => {
            switch (type) {
                case 'gender_filter':
                    setValues(values => {
                        return {
                            ...values,
                            'target_gender': item.id,
                            target_gender_text: i18n.t(item.id)
                        }
                    })
                    break
                case 'user_type':
                    setValues(values => {
                        return {
                            ...values,
                            'target_account_type': item.id
                        }
                    })
                    break
                default:
                    setValues(values => {
                        return {
                            ...values,
                            [type]: { ...item }
                        }
                    })
            }
        })
        const searchPaginationListListener = DeviceEventEmitter.addListener(SEARCH_LIST_PAGINATION_RESPONSE_ID, ({ type, item }) => {
            switch (type) {
                case 'cid':
                case 'medical_procedures':
                case 'medicament':
                case 'hospital':
                case 'things_i_use':
                    var val = {}
                    val[`${type}_values`] = item
                    val[`${type}`] = item.map(r => r.id)
                    val[`${type}_text`] = item.map(r => r.name).join(', ')
                    setValues(values => {
                        return {
                            ...values,
                            ...val
                        }
                    })
                    break
                default: return
            }
        })
        return () => {
            addressListener.remove()
            relationshipListener.remove()
            searchListListener.remove()
            searchPaginationListListener.remove()
        }
    }, [])

    getInitialValues = async () => {
        const filters = {
            target_account_type: session?.target_account_type || 'all',
            target_gender: session?.target_gender,
            target_gender_text: i18n.t(session?.target_gender),
            account_type: session?.account_type,
            max_distance: session?.max_distance,
            age_min: session?.age_min || 18,
            age_max: session?.age_max || 50,
            location: {
                lat: session?.lat,
                lng: session?.lng,
                address_description: session?.address_description || '',
                automatic_location: session?.automatic_location
            },
            relationship_type: session?.relationship_type || 'all',
        }
        try {

            const f = await userService.getFilters()
            const data = f.data
            let newFilters = {
                cid: [],
                cid_values: [],
                cid_text: '',

                medical_procedures: [],
                medical_procedures_values: [],
                medical_procedures_text: '',

                medicament: [],
                medicament_values: [],
                medicament_text: '',

                hospital: [],
                hospital_values: [],
                hospital_text: '',

                things_i_use: [],
                things_i_use_values: [],
                things_i_use_text: '',

            }
            data.map(r => {
                let name
                let id
                if (r.type == 'cid') {
                    const name = userService.loc == 'pt-BR' ? r.cid.description : r.cid.description_en
                    const id = r.filter_id
                    newFilters.cid.push(id)
                    newFilters.cid_values.push({ id, name })
                    newFilters.cid_text = newFilters.cid_text ? `${newFilters.cid_text}, ${name}` : name
                }
                if (r.type == 'medical_procedures') {
                    const name = userService.loc == 'pt-BR' ? r.medical_procedures.name : r.medical_procedures.name_en
                    const id = r.filter_id
                    newFilters.medical_procedures.push(id)
                    newFilters.medical_procedures_values.push({ id, name })
                    newFilters.medical_procedures_text = newFilters.medical_procedures_text ? `${newFilters.medical_procedures_text}, ${name}` : name
                }
                if (r.type == 'drugs') {
                    const name = userService.loc == 'pt-BR' ? r.drugs.name : r.drugs.name_en
                    const id = r.filter_id
                    newFilters.medicament.push(id)
                    newFilters.medicament_values.push({ id, name })
                    newFilters.medicament_text = newFilters.medicament_text ? `${newFilters.medicament_text}, ${name}` : name
                }
                if (r.type == 'hospitals') {
                    const name = r.hospitals.name
                    const id = r.filter_id
                    newFilters.hospital.push(id)
                    newFilters.hospital_values.push({ id, name })
                    newFilters.hospital_text = newFilters.hospital_text ? `${newFilters.hospital_text}, ${name}` : name
                }
                if (r.type == 'things_i_use') {
                    const name = userService.loc == 'pt-BR' ? r.things_i_use.name : r.things_i_use.name_en
                    const id = r.filter_id
                    newFilters.things_i_use.push(id)
                    newFilters.things_i_use_values.push({ id, name })
                    newFilters.things_i_use_text = newFilters.things_i_use_text ? `${newFilters.things_i_use_text}, ${name}` : name
                }
            })
            setValues({ ...filters, ...newFilters })
        } catch (e) {
            console.log(e)
            setValues(filters)
        } finally {
        }
    }

    async function handleSave() {
        try {
            setSubmitting(true)
            const userProfileParams = {
                age_max: values.age_max,
                age_min: values.age_min,
                relationship_type: values.relationship_type,
                max_distance: values.max_distance,
                target_gender: values.target_gender,
                target_account_type: values.target_account_type,
                ...values.location,

            }
            const filterParams = {
                cid: values.cid || [],
                medical_procedures: values.medical_procedures || [],
                hospitals: values.hospital || [],
                drugs: values.medicament || [],
                things_i_use: values.things_i_use || [],
            }

            const r = await userService.update(userProfileParams)
            const filterRes = await userService.saveFilters(filterParams)

            if (r.status) {
                const u = await userService.syncUserWithApi()
                helperService.showToast({
                    text1: i18n.t('filters_saved'),
                    text2: i18n.t('info_saved'),
                })
                DeviceEventEmitter.emit('filtersChanged')
                // profilePressed()
            }
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
    }
    function profilePressed() {
        RootNavigation.navigate('ProfileDetailStack', { screen: 'ProfileDetailScreen', params: { item: session } })
    }



    function DistanceContainer(props) {
        const [distance, setDistance] = useState(props.value)

        return useMemo(() => (

            <View style={ { paddingTop: measures.ySpace } }>
                <View style={ { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, paddingHorizontal: measures.xSpace } } >
                    <PhParagraph>{ i18n.t('max_distance') }</PhParagraph>
                    <PhAction>{ `${distance} km` }</PhAction>
                </View>
                <View style={ { alignItems: 'center', paddingBottom: 10 } } >
                    <MultiSlider
                        sliderLength={ measures.screenWidth - (measures.xSpace * 2) }
                        onValuesChange={ (v) => setDistance(parseInt(v)) }
                        onValuesChangeFinish={ (v) => props.valueChanged(v) }
                        trackStyle={ { backgroundColor: colors.gray } }
                        selectedStyle={ { height: 4, backgroundColor: colors.secondary } }
                        markerStyle={ styles.marker }
                        values={ [props.value] }
                        min={ 5 }
                        max={ 15000 }
                    />
                </View>
                <PhDivider style={ { marginHorizontal: measures.xSpace } } />
            </View>

        ))
    }

    function AgeContainer(props) {
        const [minAge, setMinAge] = useState(props.values[0])
        const [maxAge, setMaxAge] = useState(props.values[1])
        return useMemo(() => (

            <View style={ { paddingTop: measures.ySpace } }>
                <View style={ { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 12, paddingHorizontal: measures.xSpace } } >
                    <PhParagraph>{ i18n.t('age_range') }</PhParagraph>
                    <PhAction>{ `${minAge} - ${maxAge}` }</PhAction>
                </View>
                <View style={ { alignItems: 'center', paddingBottom: 10 } } >
                    <MultiSlider
                        sliderLength={ measures.screenWidth - (measures.xSpace * 2) }
                        onValuesChange={ (v) => {
                            setMinAge(parseInt(v[0]))
                            setMaxAge(parseInt(v[1]))
                        } }
                        trackStyle={ { backgroundColor: colors.gray } }
                        selectedStyle={ { height: 4, backgroundColor: colors.secondary } }
                        values={ props.values }
                        markerStyle={ styles.marker }
                        enabledTwo={ true }
                        minMarkerOverlapDistance={ 40 }
                        onValuesChangeFinish={ (v) => props.valueChanged(v) }
                        min={ 18 }
                        max={ 100 }
                    />
                </View>
                <PhDivider style={ { marginHorizontal: measures.xSpace } } />
            </View>

        ))
    }



    function handleLocationPressed() {
        if (!loadingLocation) {
            props.navigation.navigate('LocationFilter', { location: values.location })
        }
    }


    function goToSearch(options) {
        RootNavigation.navigate('SelectListStack', { screen: 'SelectListScreen', params: { options, SEARCH_LIST_RESPONSE_ID } })
    }
    function goToSearchPagination(options) {
        RootNavigation.navigate('SelectListStack', { screen: 'SelectListPaginationScreen', params: { options, SEARCH_LIST_RESPONSE_ID: SEARCH_LIST_PAGINATION_RESPONSE_ID } })
    }

    function goToRelationFilters(preSelectedItem) {
        console.log(preSelectedItem)
        RootNavigation.navigate('FiltersRelationshipStack', { screen: 'RelationshipFilters', params: { preSelectedItem: preSelectedItem } })
    }


    return (
        <PhScrollView { ...props } screenTitle={ '' }
            safeAreaProps={ { mode: 'onlyHorizontal' } }
            setHeaderOptions={ {
                headerTitle: () => <PhAction>{ i18n.t('filters') }</PhAction>,
                headerRight: () => <PhLinkButton loading={ isSubmitting } onPress={ () => handleSave() } textStyle={ { color: colors.secondary } } >{ i18n.t('save') }</PhLinkButton>,
                headerStyle: {
                    backgroundColor: colors.white,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                    height: Constants.statusBarHeight + 65,
                },
            } }
            scrollViewProps={ { contentContainerStyle: { paddingBottom: measures.bottomSpace } } }  >
            {
                !values ? <PhLoadingContainer /> :

                    <View style={ { flex: 1 } }>
                        {
                            values.account_type != 'curious' ?
                                <View>
                                    <PhRawListItem loading={ loadingLocation } chevron divider onPress={ () => handleLocationPressed() } >
                                        <PhLabel>{ i18n.t('location') }</PhLabel>
                                        <PhAction>{ i18n.t(values.location.automatic_location ? 'current_location' : 'custom_location') }</PhAction>
                                        <PhParagraph>{ values.location.address_description }</PhParagraph>
                                    </PhRawListItem>

                                    <DistanceContainer value={ values.max_distance } valueChanged={ (d) => { setValues({ ...values, max_distance: d[0] }) } } />
                                </View>
                                : null
                        }
                        <PhSelectInput
                            labelTitle={ i18n.t('interested_in') }
                            value={ values.target_gender_text }
                            onPress={ () => goToSearch({
                                title: i18n.t('select_gender'),
                                type: 'gender_filter',
                                preSelectedItems: [values.target_gender]
                            }) }
                        />
                        <PhSelectInput
                            labelTitle={ i18n.t('searching_type') }
                            value={ i18n.t(values.target_account_type) }
                            onPress={ () => goToSearch({
                                title: i18n.t('searching_type'),
                                type: 'user_type',
                                showDescription: true,
                                hasSearch: false,
                                preSelectedItems: [values.target_account_type]
                            }) }
                        />

                        <AgeContainer values={ [values.age_min, values.age_max] } valueChanged={ (d) => {
                            setValues({
                                ...values,
                                age_min: d[0],
                                age_max: d[1],
                            })
                        } } />

                        <PhSelectInput
                            labelTitle={ i18n.t('relationship_type_label') }
                            value={ i18n.t(values.relationship_type) }
                            onPress={ () => goToRelationFilters(values.relationship_type) }
                            placeholder={ i18n.t('select') }
                        />

                        <>
                            <PhSelectInput
                                value={ values.cid_text }
                                onPress={ () => goToSearchPagination({
                                    title: i18n.t('select_cid'),
                                    type: 'cid',
                                    allowMultiple: true,
                                    allowEmptySelection: true,
                                    preSelectedItems: values.cid_values
                                }) }
                                labelTitle={ i18n.t('cid_label') }
                                placeholder={ i18n.t('cid_placeholder') }
                            />

                            <PhSelectInput
                                value={ values.medical_procedures_text }
                                onPress={ () => goToSearchPagination({
                                    title: i18n.t('select_medical_procedures'),
                                    type: 'medical_procedures',
                                    allowMultiple: true,
                                    allowEmptySelection: true,
                                    preSelectedItems: values.medical_procedures_values
                                }) }
                                labelTitle={ i18n.t('medical_procedures_label') }
                                placeholder={ i18n.t('medical_procedures_placeholder') }
                            />
                            <PhSelectInput
                                value={ values.medicament_text }
                                onPress={ () => goToSearchPagination({
                                    title: i18n.t('select_medications'),
                                    type: 'medicament',
                                    allowMultiple: true,
                                    allowEmptySelection: true,
                                    preSelectedItems: values.medicament_values
                                }) }
                                labelTitle={ i18n.t('medications_label') }
                                placeholder={ i18n.t('medications_placeholder') }
                            />
                            <PhSelectInput
                                value={ values.hospital_text }
                                onPress={ () => goToSearchPagination({
                                    title: i18n.t('select_hospitals'),
                                    type: 'hospital',
                                    allowMultiple: true,
                                    showDescription: true,
                                    allowEmptySelection: true,
                                    preSelectedItems: values.hospital_values
                                }) }
                                labelTitle={ i18n.t('hospitals_label') }
                                placeholder={ i18n.t('hospitals_placeholder') }
                            />
                            <PhSelectInput
                                value={ values.things_i_use_text }
                                onPress={ () =>
                                    goToSearchPagination({
                                        title: i18n.t("things_i_use_label"),
                                        type: "things_i_use",
                                        allowMultiple: true,
                                        allowEmptySelection: true,
                                        preSelectedItems: values.things_i_use_values,
                                    })
                                }
                                labelTitle={ i18n.t("things_i_use_label") }
                                placeholder={ i18n.t(
                                    "things_i_use_placeholder"
                                ) }
                            />
                        </>
                    </View>
            }
        </PhScrollView>
    )
}

