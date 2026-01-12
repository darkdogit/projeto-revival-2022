import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { View, Modal, DeviceEventEmitter } from 'react-native';
import { useSelector } from 'react-redux';
import { PhLinkButton } from '../../phTemplates/buttons';
import { PhRawListItem, PhSelectItem } from '../../phTemplates/components';
import { PhScrollView } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhAction, PhHeader, PhLabel, PhParagraph } from '../../phTemplates/typography';
import HelperService from '../../services/HelperService';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';
import AddAddressScreen from '../registerCompletionFlow/AddAddressScreen';
import i18n from '../../localization/AppLocalization';



export default function LocationFilterScreen(props) {
    const userService = new UserService()
    const [isSubmitting, setSubmitting] = useState(false)
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [location, setLocation] = useState({ ...props.route.params.location })

    function handleAddManually() {
        setModalVisible(true)
    }

    function setManualAddress(values) {
        setModalVisible(false)
        setLocation({ lat: values.lat, lng: values.lng, address_description: values.description, automatic_location: false })
    }

    async function getCurrentLocation() {
        if (location.automatic_location == 1) return
        try {
            setLoadingLocation(true)
            const l = await userService.getLocation()
            setLocation({ ...l, automatic_location: 1 })
        } catch (e) {
            console.log(e)
        } finally {
            setLoadingLocation(false)
        }
    }

    function handleDone() {
        props.navigation.goBack()
        DeviceEventEmitter.emit('filter_address_changed', location)
    }

    return (
        <PhScrollView { ...props } screenTitle={ '' }
            safeAreaProps={ { mode: 'noTop' } }
            setHeaderOptions={ {
                headerRight: () => <PhLinkButton onPress={ () => handleDone() } textStyle={ { color: colors.secondary } } >{ i18n.t('done') }</PhLinkButton>,
                headerStyle: {
                    backgroundColor: colors.white,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                    height: Constants.statusBarHeight + 65,
                },
            } }
            scrollViewProps={ { contentContainerStyle: { paddingBottom: measures.bottomSpace } } }  >
            <PhHeader style={ { paddingBottom: 12, paddingHorizontal: measures.xSpace } } >{ i18n.t('location') }</PhHeader>
            <PhSelectItem loading={ loadingLocation } selected={ location.automatic_location } onPress={ () => getCurrentLocation() } >
                <PhParagraph>{ i18n.t('current_location') }</PhParagraph>
                {
                    location.automatic_location ? <PhLabel style={ { color: colors.gray } } >{ location.address_description }</PhLabel> : null
                }
            </PhSelectItem>
            <PhSelectItem selected={ !location.automatic_location } onPress={ () => handleAddManually() } >
                <PhParagraph>{ i18n.t('custom_location') }</PhParagraph>
                {
                    !location.automatic_location ? <PhLabel style={ { color: colors.gray } } >{ location.address_description }</PhLabel> : null
                }
            </PhSelectItem>
            <Modal onRequestClose={ () => setModalVisible(false) } animationType={ 'slide' } visible={ modalVisible } >
                <AddAddressScreen addressChosen={ setManualAddress } onCanceled={ () => setModalVisible(false) } />
            </Modal>
        </PhScrollView>
    )
}

