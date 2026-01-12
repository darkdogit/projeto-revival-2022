import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Modal, View } from 'react-native';
import { PhButton, PhGradientButton } from '../../phTemplates/buttons';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import { SessionService } from '../../services/SessionService';
import UserService from '../../services/UserService';
import AddAddressScreen from '../registerCompletionFlow/AddAddressScreen';
import i18n from '../../localization/AppLocalization';
import app from './../../app.json'
import { startActivityAsync } from 'expo-intent-launcher';


export default function LocationFixScreen(props) {
	const [isSubmitting, setSubmitting] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const userService = new UserService()
	const sessionService = new SessionService()
	useEffect(() => {
		props.navigation.setOptions({
			headerLeft: null
		})
	}, [])


	function setManualAddress(values) {
		setModalVisible(false)
		setTimeout(() => {
			handleSave({ lat: values.lat, lng: values.lng, address_description: values.description, automatic_location: false })
		}, 200);
	}

	async function handleSave(location) {
		try {
			const l = {
				...props.route.params.login,
				...location
			}
			sessionService.saveSession(l)
			userService.update(location).then()
		} catch (e) {
			console.log(e)
		} finally {

		}
	}
	function handleAddManually() {
		setModalVisible(true)
	}
	async function handleActivate() {
		setSubmitting(true)
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			setSubmitting(false)
			Alert.alert(
				i18n.t('allow_location'),
				i18n.t('location_disabled_alert'),
				[
					{
						text: i18n.t('cancel'),
						onPress: () => console.log('Cancel Pressed'),
						style: 'cancel',
					},
					{
						text: i18n.t('go_to_settings'),
						onPress: () => {
							if (Platform.OS == 'ios') {
								Linking.openURL('app-settings:')
							} else {
								startActivityAsync(action, { data: 'package:' + app.expo.android.package })
							}
						}
					}
				],
				{ cancelable: true },
			)
		} else {
			try {
				const l = await userService.getLocation()
				handleSave({ ...l, automatic_location: true })
			} catch (e) {
				console.log(e)
			} finally {
				setSubmitting(false)
			}
		}
	}


	return (
		<PhSafeAreaContainer>
			<View style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'space-between', }}>
				<View style={{ flex: 1 }} ></View>
				<View style={{ flex: 2, alignItems: 'center' }} >
					<PhPageTitle style={{ textAlign: 'center' }} >{`${i18n.t('devotee_welcome')} ${i18n.t('devotee')}`}</PhPageTitle>
					<PhParagraph style={{ paddingTop: 10, textAlign: 'center' }} >{i18n.t('welcome_fix_message')}</PhParagraph>
				</View>
				<View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: measures.bottomSpace }} >
					<PhButton onPress={() => handleAddManually()} containerStyle={{ backgroundColor: colors.white, borderColor: colors.disabled, borderWidth: 2 }} textStyle={{ color: colors.primary }} >{i18n.t('add_manually')}</PhButton>
					<PhGradientButton loading={isSubmitting} onPress={() => handleActivate()} containerStyle={{ marginTop: 12 }} >{i18n.t('activate_location2')}</PhGradientButton>
				</View>
			</View>
			<Modal onRequestClose={() => setModalVisible(false)} animationType={'slide'} visible={modalVisible} >
				<AddAddressScreen addressChosen={setManualAddress} onCanceled={() => setModalVisible(false)} />
			</Modal>
		</PhSafeAreaContainer>
	)
}
