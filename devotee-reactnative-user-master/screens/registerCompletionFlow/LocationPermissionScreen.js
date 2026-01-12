
import React, { useState } from 'react';
import { DeviceEventEmitter, Image, Modal, View } from 'react-native';
import { useSelector } from 'react-redux';
import { PhButton, PhGradientButton } from '../../phTemplates/buttons';
import { PhSafeAreaContainer } from '../../phTemplates/containers';
import { colors, measures } from '../../phTemplates/PhStyles';
import { PhPageTitle, PhParagraph } from '../../phTemplates/typography';
import LocationService from '../../services/LocationService';
import PushNotificationService from '../../services/PushNotificationService';
import UserService from '../../services/UserService';
import AddAddressScreen from './AddAddressScreen';
import i18n from '../../localization/AppLocalization';


export default function LocationPermissionScreen(props) {
	const inf = useSelector(state => state.infoReducer?.registerInfo)
	const [isSubmitting, setSubmitting] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const userService = new UserService()
	const pushNotificationService = new PushNotificationService()
	const locationService = new LocationService()


	async function setManualAddress(values) {
		try {
			// se for manual, quando voltar com o resultado, ja vai pra funcao de finalizar direto
			setModalVisible(false)
			setSubmitting(true)
			userService.setRegisterInfo({ ...inf, lat: values.lat, lng: values.lng, address_description: values.description, automatic_location: false })
			finishRegistration(values)
		} catch (error) {
			console.log('LocationPermissionScreen.setManualAddress', error)	
		}
	}

	async function handleActivate() {
		// se for automatica, pega a location com o endereço em extenso, e vai pra funcao de finalizar
		setSubmitting(true)
		try {
			const perm = await locationService.getPermission()
			if (perm == 'granted') {
				const l = await userService.getLocation()
				const values = { ...l, automatic_location: true }
				userService.setRegisterInfo({ ...inf, ...values })
				finishRegistration(values)
			} else {
				setSubmitting(false)
			}
		} catch (e) {
			setSubmitting(false)
			console.log(e)
		} finally {
		}
	}

	finishRegistration = async (values) => {
		// ve se tem permissao de notificacao. Se nao tiver, ja chama a tela de permissao. Se tiver, pega o token e  chama a de sucesso passando o obj de session atualizado
		try {
			const perm = await pushNotificationService.getPermission(false, false)
			if (perm != 'granted') {
				props.navigation.navigate('NotificationPermission')
			} else {
				const token = await pushNotificationService.registerForPushNotificationsAsync()
				const params = { ...inf, ...values, notification_token: token }
				const res = await userService.completeRegistration(params)
				if (res) {
					props.navigation.navigate('RegisterSuccess')
				}
			}
		} catch (e) {
			DeviceEventEmitter.emit('alertMessage', { title: i18n.t('error'), message: `${i18n.t('register_error')}\n ${e?.message || ''}` })
			console.log(e)
		} finally {
			setSubmitting(false)
		}
	}

	function handleAddManually() {
		setModalVisible(true)
	}

	return (
		<PhSafeAreaContainer mode={'noTop'}>
			<View style={{ flex: 1, backgroundColor: colors.white, justifyContent: 'space-between', }}>
				<View style={{ flex: 1 }} ></View>
				<View style={{ flex: 2, alignItems: 'center' }} >
					<Image style={{ height: 120, width: 120 }} source={require('../../assets/img/location_icon.png')} />
					<PhPageTitle style={{ textAlign: 'center' }} >{i18n.t('activate_location')}</PhPageTitle>
					<PhParagraph style={{ paddingTop: 10, textAlign: 'center' }} >{i18n.t('location_message')}</PhParagraph>
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
